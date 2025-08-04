import { createClient } from '@supabase/supabase-js';


//make the arguments environment variables to protect them. 
 const supabase = createClient('https://oagnewailunfaiotqxqe.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZ25ld2FpbHVuZmFpb3RxeHFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MDM2MTIsImV4cCI6MjA2ODM3OTYxMn0.HRDc6lqzWEe0b3h3gyLmpSjALVM66loR_IUKv1mXWA4');

// Main App Controller
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Firebase
//    initializeFirebase();
    
    // Set up UI event listeners
    setupEventListeners();
    
    // Check auth state
   // checkAuthState();
});





// UI Event Listeners
function setupEventListeners() {
    // Auth screen buttons
    document.getElementById('signin-btn').addEventListener('click', showDashboardScreen);
    document.getElementById('signup-btn').addEventListener('click', showDashboardScreen );
    
    // Dashboard buttons
    document.getElementById('create-quiz-btn').addEventListener('click', showCreateQuizScreen);
//    document.getElementById('join-quiz-btn').addEventListener('click', showJoinQuizModal);
    //document.getElementById('signout-btn').addEventListener('click', signOut);
    
    // Quiz creation buttons
        document.getElementById('save-btn').addEventListener('click', save);

    //document.getElementById('add-question-btn').addEventListener('click', addQuestionForm);
  //  document.getElementById('publish-quiz-btn').addEventListener('click', publishQuiz);
    document.getElementById('back-to-dashboard-btn').addEventListener('click', showDashboardScreen);
    
    // Lobby buttons
   // document.getElementById('start-quiz-btn').addEventListener('click', startQuiz);
    
    // Results buttons
    //document.getElementById('return-to-dashboard-btn').addEventListener('click', showDashboardScreen);
}

// Auth State Management
async function  save(){
    const title = document.getElementById('quiz-title').value;
    const descriprion = document.getElementById('description').value;
    const privacy = document.getElementById('privacy');
    const {data, error} = await supabase.from('Quizzes').insert([{Quiz_Name: title,Private:privacy.checked,Quiz_Description:descriprion}]);
     if (error) {
        console.error('Insert failed:', error);
        console.log("to");

     }
   //   console.log("to");
    hideAllScreens();
    document.getElementById('questions-screen').classList.remove('hidden');

}
function checkAuthState() {
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in
            showDashboardScreen();
            loadUserQuizzes(user.uid);
            document.getElementById('username-display').textContent = user.displayName || user.email;
        } else {
            // No user is signed in
            showAuthScreen();
        }
    });
}



function showDashboardScreen() {
    hideAllScreens();
    document.getElementById('dashboard-screen').classList.remove('hidden');
}

function showCreateQuizScreen() {
 
    hideAllScreens();
    document.getElementById('Info-quiz-screen').classList.remove('hidden');
   
}



function hideAllScreens() {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.add('hidden'));
}



// Auth Functions
function showSignInModal() {
	showDashboardScreen();
    // In a real app, you would show a modal with email/password fields
    // For this skeleton, we'll use Firebase's anonymous auth
    //signInAnonymously();
}

function showSignUpModal() {
    // In a real app, you would show a sign-up form
    // For this skeleton, we'll use Firebase's anonymous auth
   showDashboardScreen();
	//signInAnonymously();
}
