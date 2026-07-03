import { getDb } from '../db/connection.js';

export const UserSettingsModel = {
  /**
   * Fetch settings for a specific user
   */
  getSettings: async (userId) => {
    const supabase = getDb();
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('[UserSettingsModel] getSettings error:', error.message);
      return null;
    }
    return data;
  },

  /**
   * Create or update settings for a specific user
   */
  upsertSettings: async (userId, settings) => {
    const supabase = getDb();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        theme: settings.theme || 'system',
        builder_style: settings.builderStyle || 'wizard',
        font_size: settings.fontSize || 'md',
        updated_at: now
      })
      .select()
      .single();

    if (error) {
      console.error('[UserSettingsModel] upsertSettings error:', error.message);
      throw error;
    }
    return data;
  }
};

export default UserSettingsModel;
