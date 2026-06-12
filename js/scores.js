// Generic saveScore helper used by game pages
window.saveScore = window.saveScore || (async function(score, subject = 'General', difficulty = 'medium', total_questions = null) {
  const username = sessionStorage.getItem('username');
  const userId = sessionStorage.getItem('userId') || null;
  if (!username) return;

  const payload = { username, score, subject, difficulty };
  if (total_questions !== null) payload.total_questions = total_questions;
  if (userId) payload.user_id = userId;

  try {
    const { data, error } = await window.supabaseClient
      .from('scores')
      .insert([payload])
      .select();

    if (error) {
      console.error('Erro ao salvar score:', error);
      return;
    }

    sessionStorage.setItem('lastScoreSubject', subject);
    sessionStorage.setItem('lastScoreDifficulty', difficulty);
    sessionStorage.setItem('lastScore', String(score));

    console.log(`Score ${score} salvo para ${username}`);
    return data;
  } catch (err) {
    console.error('Save score error:', err);
  }
});
