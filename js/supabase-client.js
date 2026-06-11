// Initialize Supabase client for pages that load this script
(function(){
  if (window.supabaseClient) return;
  if (!window.supabase) return; // supabase-js must be loaded first
  window.supabaseClient = window.supabase.createClient(
    "https://rdactxwmqqxognfiltgt.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkYWN0eHdtcXF4b2duZmlsdGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExODY5MzcsImV4cCI6MjA5Njc2MjkzN30.gpukeBC44WRNmzBVhTg1_nB756DbWRzpX88rDdzO-Eo"
  );
})();
