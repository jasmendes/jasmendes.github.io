// Initialize Supabase client for pages that load this script
(function(){
  if (window.supabaseClient) return;
  if (!window.supabase) return; // supabase-js must be loaded first
  window.supabaseClient = window.supabase.createClient(
    "https://rdactxwmqqxognfiltgt.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkYWN0eHdtcXF4b2duZmlsdGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExODY5MzcsImV4cCI6MjA5Njc2MjkzN30.gpukeBC44WRNmzBVhTg1_nB756DbWRzpX88rDdzO-Eo"
  );

// Global helper to save a score reusing the same checks as insertTestScore in index.html
window.saveScore = async function(
    score,
    subject = '',
    difficulty = '',
    totalQuestions = null
  ) {
    try {

      const {
        data: { user },
        error: authError
      } = await window.supabaseClient.auth.getUser();

      if (authError || !user) {
        console.error('Utilizador não autenticado');
        return null;
      }

      // Buscar username e email da tabela users
      const {
        data: userProfile,
        error: profileError
      } = await window.supabaseClient
        .from('users')
        .select('username, email')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Erro ao obter perfil:', profileError);
        return null;
      }

      function normalizeDifficulty(d) {
        if (!d) return null;

        const s = String(d).toLowerCase();

        if (
          s.includes('easy') ||
          s === 'e' ||
          s.includes('begin')
        ) {
          return 'easy';
        }

        if (
          s.includes('hard') ||
          s === 'h' ||
          s.includes('adv')
        ) {
          return 'hard';
        }

        return 'medium';
      }

      const insertObj = {
        user_id: user.id,
        username: userProfile.username,
        email: userProfile.email,
        score: Number(score) || 0,
        date: new Date().toISOString()
      };

      if (subject) {
        insertObj.subject = subject;
      }

      const normDiff = normalizeDifficulty(difficulty);

      if (normDiff) {
        insertObj.difficulty = normDiff;
      }

      if (totalQuestions) {
        insertObj.total_questions = totalQuestions;
      }

      console.log('A inserir score:', insertObj);

      const { data, error } =
        await window.supabaseClient
          .from('scores')
          .insert([insertObj])
          .select();

      if (error) {
        console.error('Erro ao inserir score:', error);
        return null;
      }

      console.log('Score guardado:', data);

      return data;

    } catch (err) {
      console.error('saveScore error:', err);
      return null;
    }
  };
})();
