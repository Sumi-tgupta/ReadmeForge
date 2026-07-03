import 'dotenv/config';
import { getDb } from './connection.js';
import { sessionManager } from '../sessionManager.js';
import { UserModel } from '../models/User.js';
import { v4 as uuidv4 } from 'uuid';

async function runTest() {
  const supabase = getDb();
  
  // 1. Create a dummy user profile
  const dummyUserId = uuidv4();
  const dummyGithubId = '99999999';
  console.log('Inserting dummy user:', dummyUserId);
  
  const { data: user, error: userErr } = await supabase
    .from('users')
    .insert({
      id: dummyUserId,
      github_id: dummyGithubId,
      username: 'dummy_tester',
      display_name: 'Dummy Tester',
      email: 'tester@example.com',
      avatar_url: 'https://example.com/avatar.png',
      profile_url: 'https://github.com/dummy_tester',
      plan: 'free',
      credits: 20,
      role: 'user'
    })
    .select()
    .single();

  if (userErr) {
    console.error('❌ Failed to insert dummy user:', userErr.message);
    process.exit(1);
  }
  console.log('✅ Dummy user inserted successfully:', user);

  // 2. Create a session for this user
  const dummySessionId = uuidv4();
  const expiresAt = new Date(Date.now() + 600000).toISOString(); // 10 mins
  console.log('Inserting dummy session:', dummySessionId);
  
  const { data: session, error: sessionErr } = await supabase
    .from('sessions')
    .insert({
      id: dummySessionId,
      user_id: dummyUserId,
      expires_at: expiresAt
    })
    .select()
    .single();

  if (sessionErr) {
    console.error('❌ Failed to insert dummy session:', sessionErr.message);
    // Cleanup user
    await supabase.from('users').delete().eq('id', dummyUserId);
    process.exit(1);
  }
  console.log('✅ Dummy session inserted successfully:', session);

  // 3. Simulate request object with cookie
  const mockReq = {
    headers: {
      cookie: `session_id=${dummySessionId}`
    }
  };

  // 4. Run sessionManager.getSession
  console.log('Running sessionManager.getSession...');
  const activeSession = await sessionManager.getSession(mockReq);
  console.log('Result activeSession:', activeSession);

  if (activeSession && activeSession.user && activeSession.user.username === 'dummy_tester') {
    console.log('🎉 sessionManager.getSession join query works perfectly!');
  } else {
    console.error('❌ sessionManager.getSession failed to resolve user properly.');
  }

  // 5. Cleanup dummy data
  console.log('Cleaning up dummy data...');
  await supabase.from('sessions').delete().eq('id', dummySessionId);
  await supabase.from('users').delete().eq('id', dummyUserId);
  console.log('Cleanup complete.');
  
  process.exit(0);
}

runTest();
