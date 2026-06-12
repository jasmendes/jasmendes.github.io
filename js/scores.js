// Generic saveScore helper used by game pages
window.saveScore = window.saveScore || (async function(score, subject = 'General', difficulty = 'medium', total_questions = null) {
  const username = sessionStorage.getItem('username');
  const userId = sessionStorage.getItem('userId') || null;
  
  console.log('window.saveScore called:', { score, subject, difficulty, total_questions, username, userId });
  
  if (!username) {
    console.error('No username in sessionStorage');
    return;
  }

  const payload = { username, score, subject, difficulty };
  if (total_questions !== null) payload.total_questions = total_questions;
  if (userId) payload.user_id = userId;

  console.log('Payload to insert:', payload);

  try {
    if (!window.supabaseClient) {
      console.error('window.supabaseClient is not defined');
      throw new Error('Supabase client not initialized');
    }
    
    const { data, error } = await window.supabaseClient
      .from('scores')
      .insert([payload])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return;
    }

    console.log('Insert successful. Data:', data);
    sessionStorage.setItem('lastScoreSubject', subject);
    sessionStorage.setItem('lastScoreDifficulty', difficulty);
    sessionStorage.setItem('lastScore', String(score));

    console.log(`Score ${score} salvo para ${username}`);
    return data;
  } catch (err) {
    console.error('Save score error:', err);
  }
});

// Hide logout controls when no user session exists
document.addEventListener('DOMContentLoaded', () => {
  try {
    const username = sessionStorage.getItem('username') || localStorage.getItem('isLoggedIn');
    if (!username) {
      // common logout selectors across pages
      const selectors = ['.logout-btn', '.btn-logout', '#logoutBtn', '.button-ghost'];
      selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => el.style.display = 'none');
      });
    }
  } catch (err) {
    console.warn('Could not adjust logout visibility:', err);
  }
});
