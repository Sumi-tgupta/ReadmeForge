import { getDb } from '../db/connection.js';
import { v4 as uuidv4 } from 'uuid';

export const GenerationModel = {
  /**
   * Track usage in the generation_history table (best-effort)
   */
  trackUsage: async (userId, model, usage, promptHash, builderType) => {
    try {
      const supabase = getDb();
      const id = uuidv4();
      
      const { error } = await supabase.from('generation_history').insert({
        id,
        user_id: userId || null,
        model,
        input_tokens: usage.inputTokens || 0,
        output_tokens: usage.outputTokens || 0,
        prompt_hash: promptHash,
        builder_type: builderType || 'profile',
        cached: false,
        created_at: new Date().toISOString()
      });

      if (error) throw error;
    } catch (err) {
      console.error('[GenerationHistory] Failed to track usage:', err.message);
    }
  },

  /**
   * Get generation usage stats for a specific user
   */
  getUsageStats: async (userId) => {
    try {
      const supabase = getDb();
      
      // Fetch user's generation history
      const { data: totalData, error: totalError } = await supabase
        .from('generation_history')
        .select('input_tokens, output_tokens')
        .eq('user_id', userId);

      if (totalError) throw totalError;

      const totalCount = totalData.length;
      const totalInputTokens = totalData.reduce((sum, row) => sum + (row.input_tokens || 0), 0);
      const totalOutputTokens = totalData.reduce((sum, row) => sum + (row.output_tokens || 0), 0);

      // Fetch today's generations count
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const { data: todayData, error: todayError } = await supabase
        .from('generation_history')
        .select('id')
        .eq('user_id', userId)
        .gte('created_at', todayStart.toISOString());

      if (todayError) throw todayError;

      return {
        totalGenerations: totalCount,
        totalInputTokens,
        totalOutputTokens,
        todayGenerations: todayData.length,
      };
    } catch (err) {
      console.error('[GenerationHistory] Failed to get usage stats:', err.message);
      return {
        totalGenerations: 0,
        totalInputTokens: 0,
        totalOutputTokens: 0,
        todayGenerations: 0,
      };
    }
  }
};

export default GenerationModel;
