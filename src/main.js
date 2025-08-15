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
    document.getElementById('back2').addEventListener('click', backToCreateQuiz );

    
    // Dashboard buttons
    document.getElementById('create-quiz-btn').addEventListener('click', showCreateQuizScreen);
//    document.getElementById('join-quiz-btn').addEventListener('click', showJoinQuizModal);
    //document.getElementById('signout-btn').addEventListener('click', signOut);
    
    // Quiz creation buttons
        document.getElementById('save-btn').addEventListener('click', saveNewQuizInfo);
        document.getElementById('addTime').addEventListener('click', ShowAddQuestionScreen);
        document.getElementById('saveQuestion').addEventListener('click', saveNewQuestion);



    //document.getElementById('add-question-btn').addEventListener('click', addQuestionForm);
  //  document.getElementById('publish-quiz-btn').addEventListener('click', publishQuiz);
    document.getElementById('back-to-dashboard-btn').addEventListener('click', showDashboardScreen);
    
    // Lobby buttons
   // document.getElementById('start-quiz-btn').addEventListener('click', startQuiz);
    
    // Results buttons
    //document.getElementById('return-to-dashboard-btn').addEventListener('click', showDashboardScreen);
}


/************************************************************************************************************************************
 * 
 * 
 * 
 * 
 * 
 ****************************************************************************************************************************************/
function ShowAddQuestionScreen(){

        const element = document.getElementById('Delete');
        if(element!=null){
            element.remove();
        }
        for(let i = 1;i<5;i++){
            const input = document.getElementById('op' + i);
            input.value = "";
            const check = document.getElementById('cor' + i);
            check.checked = false;
        }
        const input = document.getElementById("QuestionTime");
        input.value = "";
        

        
        
    

//put this database stuff in a different function hehe


    hideAllScreens();
    document.getElementById('addQuestion').classList.remove('hidden');

}

/************************************************************************************************************************************
 * shows question bank screen for current quiz. looks through questions table and fetches and displays all question names of questiosn
 * in the quiz
 * 
 * HEHEHEHEHEH
 ****************************************************************************************************************************************/
async function showQuestionBank(id){


    //when you delete a question, it's button gets deleted from questionBank, with ID being the question name maybe. 
    const myDiv = document.getElementById("questionsList");
    const buttons = myDiv.querySelectorAll('button');
    buttons.forEach(btn => btn.remove());
    hideAllScreens();
    document.getElementById('questions-screen').classList.remove('hidden');
    const {data, error} = await supabase.from('Questions').select('*').eq('QuizID',id);
    if(error){
        console.error("bro it an error");
    }else{
        let i = 0;

        data.forEach(question => {
            i++;
            const btnNew = document.createElement('button');
            btnNew.id = 'question' + i;
            btnNew.textContent = question.Question;
            const divTime = document.getElementById("questionsList");
            btnNew.classList.add("btn");
            btnNew.classList.add("secondary");
            btnNew.classList.add("large");
            divTime.appendChild(btnNew);
            document.getElementById("question" + i).addEventListener("click", () => editQuestion(question.id,question.Question));
        });

    }

    
    
}



/************************************************************************************************************************************
 * 
 * 
 * 
 * 
 * 
 ****************************************************************************************************************************************/
async function editQuestion(questionId,questionName){
    ShowAddQuestionScreen();
    const theDiv = document.getElementById("questionControl");
    const btnNew = document.createElement("button");
    btnNew.textContent ="Delete Question";
    btnNew.id = "Delete";
    btnNew.classList.add("btn");
    btnNew.classList.add("secondary");
    btnNew.classList.add("small");
    theDiv.appendChild(btnNew);

    console.log("HEYYYYYY IT HERE." + questionId + ".");
    const {data: data2, error: error2} = await supabase.from('Options').select('*').eq('Question_id',questionId);

    if(error2){
        console.error("ALERT",error2);
    }
    if(data2==null){
        console.log("YOOOOOOO");
    }
    let count = 0;
    const quest = document.getElementById('QuestionTime');
    quest.value = questionName;
    data2.forEach(option => {
        count++
        console.log("ok so like count is that and other is that " + count + option.option_number);
       while(count!=option.option_number){
        count++;
       } 
        
        const input = document.getElementById('op' + count);
        input.value = option.option_text;
        if(option.Correctness){
            const check = document.getElementById('cor' + count);
            check.checked = true;
        }
        
    });



}

/************************************************************************************************************************************
 * 
 * 
 * 
 * 
 * 
 ****************************************************************************************************************************************/



/************************************************************************************************************************************
 * todo list: add selector for correct answer, add edit/view questions, add save quizzes etc etc.]
 * 
 * 
 * 
 * 
 ****************************************************************************************************************************************/
async function saveNewQuestion(){

    const quest = document.getElementById("QuestionTime").value;
    const quizId = document.getElementById("secret").textContent;
    const {data, error} = await supabase.from('Questions').insert([{Question: quest,QuizID:quizId}]).select();
    const theID = data[0]?.id;
    console.log("heyyy it be the one which is " + data[0]?.id);
     if (error) {
        console.error('Insert failed:', error);
        console.log("go bro");

       
     }

     for(let i = 1;i<5;i++){

        const word = "op" + i;
        const option = document.getElementById(word).value;
        console.log(option);
        if((option.trim()!="")){
                const Correct = document.getElementById("cor" + i);
                const {data2, error} = await supabase.from('Options').insert([{option_number: i,option_text:option,Correctness: Correct.checked,Question_id:theID}]);
                if(error){
                    console.error("error time",error);
                }
            
        }

     }



  
     console.log("huh man");
        showQuestionBank(quizId);

}



/************************************************************************************************************************************
 * 
 * 
 * 
 * 
 * 
 ****************************************************************************************************************************************/
async function  saveNewQuizInfo(){
    const title = document.getElementById('quiz-title').value;

    const descriprion = document.getElementById('description').value;
    const privacy = document.getElementById('privacy');
    const {data, error} = await supabase.from('Quizzes').insert([{Quiz_Name: title,Private:privacy.checked,Quiz_Description:descriprion}]);
     if (error) {
        console.error('Insert failed:', error);
        console.log("to");

     }else{

        const {data, error} = await supabase.from('Quizzes').select('id').eq('Quiz_Name',title).single();




            if (error) {
        console.error('Insert failed:', error);
        console.log("to");

         }else{
            showQuestionBank(data.id);
            document.getElementById("quiz-title-placeholder").textContent= title+ " Question Bank"
          document.getElementById("secret").textContent= data.id;
          console.log("yo. also " + data.id);
         }


     }
   //   console.log("to");
    
 

}

/************************************************************************************************************************************
 * 
 * 
 * 
 * 
 * 
 ****************************************************************************************************************************************/
function backToCreateQuiz(){
    showCreateQuizScreen();
}


/************************************************************************************************************************************
 * 
 * 
 * 
 * 
 * 
 ****************************************************************************************************************************************/
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



/************************************************************************************************************************************
 * 
 * 
 * 
 * 
 * 
 ****************************************************************************************************************************************/
function showDashboardScreen() {
    hideAllScreens();
    document.getElementById('dashboard-screen').classList.remove('hidden');
}


/************************************************************************************************************************************
 * 
 * 
 * 
 * 
 * 
 ****************************************************************************************************************************************/
function showCreateQuizScreen() {

 
    hideAllScreens();
    document.getElementById('Info-quiz-screen').classList.remove('hidden');
   
}


/************************************************************************************************************************************
 * 
 * 
 * 
 * 
 * 
 ****************************************************************************************************************************************/
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
