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
    subject,
    difficulty,
    totalQuestions
) {

    const userId =
        sessionStorage.getItem('userId');

    const username =
        sessionStorage.getItem('username');

    const email =
        sessionStorage.getItem('email');

    if (!userId) {
        console.error('Sessão não encontrada');
        return;
    }

    const insertObj = {
        user_id: userId,
        username,
        email,
        score,
        subject,
        difficulty,
        total_questions: totalQuestions,
        date: new Date().toISOString()
    };

    const { data, error } =
        await supabaseClient
            .from('scores')
            .insert([insertObj])
            .select();

    if (error) {
        console.error(error);
        return null;
    }

    return data;
};
})();
