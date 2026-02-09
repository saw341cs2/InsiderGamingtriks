import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://wtvlbyaxkixlnnzpplhw.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjIzNDVhY2I5LTdlM2UtNDJlMS05OWQyLTExMWVjMTU4YjYxOCJ9.eyJwcm9qZWN0SWQiOiJ3dHZsYnlheGtpeGxubnpwcGxodyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzcwNjY3NjE0LCJleHAiOjIwODYwMjc2MTQsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.7jT0WASlQkZdjsMTNbYUugwcRZCpmT-aH68WiNr_yl8';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };