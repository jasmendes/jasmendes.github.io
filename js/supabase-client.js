// Initialize Supabase client for pages that load this script
(function(){
  if (window.supabaseClient) return;
  if (!window.supabase) return; // supabase-js must be loaded first
  window.supabaseClient = window.supabase.createClient(
    "https://rdactxwmqqxognfiltgt.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkYWN0eHdtcXF4b2duZmlsdGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExODY5MzcsImV4cCI6MjA5Njc2MjkzN30.gpukeBC44WRNmzBVhTg1_nB756DbWRzpX88rDdzO-Eo"
  );


// Global helper to save a score reusing the same checks as insertTestScore in index.html
window.saveScore = async (score, subject, difficulty, totalQuestions) => {

    const {
        data: { user }
    } = await supabaseClient.auth.getUser();

    if (!user) {
        console.error('User not logged in');
        return;
    }

    console.log("ID:", user.id);
    console.log("EMAIL:", user.email);
    console.log("META:", user.username);
 
      
    const insertObj = {
        user_id: user.id,
        username:
            user.username, // Use username if available, otherwise fallback to email
        subject,
        difficulty,
        score: parseInt(score, 10),
        total_questions: totalQuestions,
        email: user.email
    };

    const { data, error } =
        await supabaseClient
            .from('scores')
            .insert([insertObj])
            .select();

    if (error) {
        console.error(error);
        return;
    }

    return data;
};

});
