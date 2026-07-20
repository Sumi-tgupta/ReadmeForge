import { getDb } from '../db/connection.js';
import { v4 as uuidv4 } from 'uuid';

export const UserModel = {
  /**
   * Find a user by their unique GitHub account ID
   */
  findByGithubId: async (githubId) => {
    const supabase = getDb();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('github_id', githubId.toString())
      .maybeSingle();

    if (error) {
      console.error('[UserModel] findByGithubId error:', error.message);
      return null;
    }
    return data;
  },

  /**
   * Find a user by their internal UUID
   */
  findById: async (id) => {
    const supabase = getDb();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('[UserModel] findById error:', error.message);
      return null;
    }
    return data;
  },

  /**
   * Insert a newly authenticated GitHub user or update their login parameters
   */
  upsertGithubUser: async (githubProfile) => {
    const existing = await UserModel.findByGithubId(githubProfile.id.toString());
    const supabase = getDb();

    const now = new Date().toISOString();
    const displayName = githubProfile.name || githubProfile.login;
    const profileUrl = githubProfile.html_url || `https://github.com/${githubProfile.login}`;

    if (existing) {
      // Update profile info & last login
      const { data, error } = await supabase
        .from('users')
        .update({
          display_name: displayName,
          username: githubProfile.login,
          email: githubProfile.email || null,
          avatar_url: githubProfile.avatar_url,
          profile_url: profileUrl,
          last_login: now,
          updated_at: now
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        console.error('[UserModel] upsert update error:', error.message);
        return existing;
      }
      return data;
    } else {
      // Create new user profile
      const newId = uuidv4();
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: newId,
          github_id: githubProfile.id.toString(),
          username: githubProfile.login,
          display_name: displayName,
          email: githubProfile.email || null,
          avatar_url: githubProfile.avatar_url,
          profile_url: profileUrl,
          plan: 'free',
          credits: 20,
          credits_reset_at: now,
          role: 'user',
          created_at: now,
          last_login: now,
          updated_at: now
        })
        .select()
        .single();

      if (error) {
        console.error('[UserModel] upsert insert error:', error.message);
        throw error;
      }
      return data;
    }
  },

  /**
   * Get credit balance and plan details for a specific user
   */
  getCreditsAndPlan: async (userId) => {
    const supabase = getDb();
    const { data, error } = await supabase
      .from('users')
      .select('credits, plan, credits_reset_at')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('[UserModel] getCreditsAndPlan error:', error.message);
      return null;
    }
    return data;
  },

  /**
   * Deduct 1 credit for a user (if not premium)
   */
  deductCredit: async (userId) => {
    const supabase = getDb();
    
    // Attempt atomic RPC deduction (production-ready, avoids TOCTOU race conditions)
    const { data: rpcData, error: rpcError } = await supabase
      .rpc('deduct_user_credit', { user_uuid: userId });

    if (rpcError) {
      console.error('[UserModel] deduct_user_credit RPC error:', rpcError.message);
      throw new Error(`Failed to deduct credit: ${rpcError.message}`);
    }

    return { credits: rpcData };
  }
};

export default UserModel;
