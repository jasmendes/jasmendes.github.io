// Initialize Supabase client for pages that load this script
(function(){
  if (window.supabaseClient) return;
  if (!window.supabase) return; // supabase-js must be loaded first
  window.supabaseClient = window.supabase.createClient(
    "https://rdactxwmqqxognfiltgt.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkYWN0eHdtcXF4b2duZmlsdGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExODY5MzcsImV4cCI6MjA5Njc2MjkzN30.gpukeBC44WRNmzBVhTg1_nB756DbWRzpX88rDdzO-Eo"
  );

// Global helper to save a score reusing the same checks as insertTestScore in index.html
window.saveScore = async function(score, subject = '', difficulty = '', totalQuestions = null) {
  try {
    if (!window.supabaseClient) throw new Error('supabaseClient not initialized');

    const username = sessionStorage.getItem('username');
    if (!username) {
      console.log('No username in sessionStorage; cannot save score');
      return null;
    }

    // Verify user exists
    const { data: userExists, error: userErr } = await window.supabaseClient
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (userErr || !userExists) {
      console.warn('User does not exist or could not be verified:', userErr);
      return null;
    }

    const insertObj = {
      username,
      score: parseInt(score, 10) || 0,
      date: new Date().toISOString()
    };

    if (subject) insertObj.subject = subject;
    if (difficulty) insertObj.difficulty = difficulty;
    if (totalQuestions) insertObj.total_questions = totalQuestions;

    const { data, error } = await window.supabaseClient
      .from('scores')
      .insert([insertObj])
      .select();

    if (error) {
      console.error('Error inserting score:', error);
      return null;
    }

    console.log('Score inserted:', data);
    return data;
  } catch (err) {
    console.error('saveScore helper error:', err);
    return null;
  }
};
})();
