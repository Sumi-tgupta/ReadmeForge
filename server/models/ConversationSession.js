import { getDb } from '../db/connection.js';
import { v4 as uuidv4 } from 'uuid';

export const ConversationSessionModel = {
  /**
   * Fetch current conversation session for a specific user and builder type
   */
  getSession: async (userId, builderType = 'profile') => {
    const supabase = getDb();
    const { data, error } = await supabase
      .from('conversation_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('builder_type', builderType)
      .maybeSingle();

    if (error) {
      console.error('[ConversationSessionModel] getSession error:', error.message);
      return null;
    }
    return data;
  },

  /**
   * Save conversational progress data (upsert)
   */
  saveSession: async (userId, { builderType, currentQuestionId, historyPath, messages, formData }) => {
    const supabase = getDb();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('conversation_sessions')
      .upsert({
        user_id: userId,
        builder_type: builderType || 'profile',
        current_question_id: currentQuestionId,
        history_path: historyPath || [],
        messages: messages || [],
        form_data: formData || {},
        updated_at: now
      }, { onConflict: 'user_id, builder_type' })
      .select()
      .single();

    if (error) {
      console.error('[ConversationSessionModel] saveSession error:', error.message);
      throw error;
    }
    return data;
  },

  /**
   * Delete a conversational progress session
   */
  deleteSession: async (userId, builderType = 'profile') => {
    const supabase = getDb();
    const { error } = await supabase
      .from('conversation_sessions')
      .delete()
      .eq('user_id', userId)
      .eq('builder_type', builderType);

    if (error) {
      console.error('[ConversationSessionModel] deleteSession error:', error.message);
      return false;
    }
    return true;
  }
};

export default ConversationSessionModel;
