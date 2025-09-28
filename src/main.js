import { createClient } from '@supabase/supabase-js';

//TODO: FOR AFTER I IMPLEMENT SAVED QUIZZES. I PRESS ON THEM, BUT FIRST A FUNCTION RUNS WHIHC LOADS ALL CURRENT QUESTIONS   
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
    document.getElementById('signin-btn').addEventListener('click', populateQuizzes);
    document.getElementById('signup-btn').addEventListener('click', populateQuizzes );
  //  document.getElementById('back2').addEventListener('click', backToCreateQuiz );

    document.getElementById('backToQuizzes').addEventListener('click', showDashboardScreen);

    // Dashboard buttons
    document.getElementById('create-quiz-btn').addEventListener('click', showCreateQuizScreen);
//    document.getElementById('join-quiz-btn').addEventListener('click', showJoinQuizModal);
    //document.getElementById('signout-btn').addEventListener('click', signOut);
    
    // Quiz creation buttons
        document.getElementById('save-btn').addEventListener('click', saveNewQuizInfo);
        document.getElementById('addTime').addEventListener('click', ShowAddQuestionScreen);
        document.getElementById('saveQuestion').addEventListener('click', saveNewQuestion);
        document.getElementById('deleteQuestion').addEventListener('click', deleteQuestion);
        document.getElementById('updateQuestion').addEventListener('click', updateQuestion);



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
 * Shows the add question view to make a question for the first time.
 * 
 * 
 ****************************************************************************************************************************************/
function ShowAddQuestionScreen(){
//removing delete and update button from screen if it is there. adding in the save question button instead
        document.getElementById("deleteQuestion").classList.add("hidden");
        document.getElementById("saveQuestion").classList.remove("hidden");
       document.getElementById("updateQuestion").classList.add("hidden");

//loop to reset all text boxes and checkboxes for new question
        for(let i = 1;i<5;i++){
            const input = document.getElementById('op' + i);
            input.value = "";
            const check = document.getElementById('cor' + i);
            check.checked = false;
        }
        //reset question field textbox
        const input = document.getElementById("QuestionTime");
        input.value = "";
        

        
        
    


//hide all other screens.
    hideAllScreens();
    //show the full add question screen.
    document.getElementById('addQuestion').classList.remove('hidden');

}

/************************************************************************************************************************************
 * shows question bank screen for current quiz. looks through questions table and fetches and displays all question names of questiosn
 * in the quiz
 * 
 * 
 ****************************************************************************************************************************************/
async function showQuestionBank(id){

//hiding all screens and then showing the question bank screen
 hideAllScreens();
    document.getElementById('questions-screen').classList.remove('hidden');

    
}



/************************************************************************************************************************************
 * edit Question function goes back into question screen, this time with a view for deleting question or updating with related updates
 * done on options
 * 
 ****************************************************************************************************************************************/
async function editQuestion(questionId){

    //showing the usual add question screen, but replacing save button with delete and update buttons
    ShowAddQuestionScreen();
    document.getElementById("updateQuestion").classList.remove("hidden");
    document.getElementById("deleteQuestion").classList.remove("hidden");
   document.getElementById("saveQuestion").classList.add("hidden");

   

   //making an HTML tag contain the questionID for future ease of use


    //getting all question options for the specific question being edited
    const {data: data2, error: error2} = await supabase.from('Options').select('*').eq('Question_id',questionId);
    
    const {data: data3, error: error3} = await supabase.from('Questions').select('Question').eq('id',questionId).single();

    //error check
    if(error2){
        console.error("ALERT",error2);
    }
    if(data2==null){
        console.log("YOOOOOOO");
    }
   //c
    let count = 0;
    //HTML tag set to question name for future reference.
    const quest = document.getElementById('QuestionTime');
    quest.value = data3.Question;
    quest.setAttribute("info",data3.Question);

    quest.setAttribute("questionId", questionId);
    //loops through all optioins and resets tags 
    for(let i = 1;i<5;i++){
        const inputTime = document.getElementById("op" + i);
        inputTime.setAttribute("checked","false");
        inputTime.setAttribute("opId","");
        inputTime.setAttribute("info","");
    }
    //for each option loop, sets HTML tags for each option and populates texboxes and checkboxes when needed
    data2.forEach(option => {

        count=1;

        //console.log("ok so like count is that and other is that " + count + option.option_number);
      
      
        //making sure we are on appropriate option number
        while(count!=option.option_number){
        console.log("yomannnnn" + count);

        count++;
       } 

       //populating textbox of option and setting HTML tags
        const myInput = document.getElementById("op" + count);
        myInput.setAttribute("opId",option.id);
        myInput.setAttribute("checked","false");
        const input = document.getElementById('op' + count);
        input.value = option.option_text;
        input.setAttribute("info",option.option_text);

        //if option is a correct option, checks the checkbox and sets HTML tag approaptiately
        if(option.Correctness){
            const check = document.getElementById('cor' + count);
            check.checked = true;
            input.setAttribute("checked","true");
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
 * 
 * 
 * 
 * 
 * 
 ****************************************************************************************************************************************/

/************************************************************************************************************************************
 * 
 * 
 * 
 * 
 * 
 ****************************************************************************************************************************************/

/************************************************************************************************************************************
 * function for updating questions.this includes removing options, adding options, and editing options and their checked status
 * 
 ****************************************************************************************************************************************/
async function updateQuestion(){

    
     //grabs the questionID from HTML tag   
    const myDiv = document.getElementById("QuestionTime");
    const questionId = myDiv.getAttribute("questionId");

    //making arrays to store any updates to exisiting options or any new options added
    const updates = [];
    const newEntries = [];

    for(let i = 1;i<5;i++){
    //gets html element for approrpiate option
        const input = document.getElementById("op" + i);
        const checker = document.getElementById("cor" + i);
        //gets options text
        const text = input.getAttribute("info");

        //gets if option is checked status
        const correct = input.getAttribute("checked");
        //gets ID of option in database from HTML tag
        let opId = input.getAttribute("opId");
        //resets them all once collected
        input.setAttribute("info","");
        input.setAttribute("opId","");
        input.setAttribute("checked","false");

//if the current option text box is empty, and it used to not be empty, then delete the option as it means user erased the option.
        if((input.value=="")&&(text!="")){
            const { data, error } = await supabase.from('Options').delete().eq('id', opId);
        }

                let right;

             //if option was checked correct, make right to true bool value, otherwise false   
        if(correct=="true"){
            console.log("YOOOOOO man he");
            right = true;
        }else{
            right = false;
        }
        console.log("to " + input.value + " he" + text + "he " );
        //if the option textbox used to be empty but now is not, it means user added an option
        if((text=="")&&(input.value!="")){

//push the new option info into newEntries set
                newEntries.push({
                    option_text: input.value,
                    Correctness: checker.checked,
                    Question_id: questionId,
                    option_number: i
                });
//set HTML tag with option text and then restart loop
                input.setAttribute("info",input.value);
                continue;

        }
        
        else if((text!=input.value)||(right!=checker.checked)){
                //final case if statement runs if either the text of an option has changed to new text, or the checkbox status has changed
                //if this happens, push this to updates set
                updates.push({
                    id: opId,
                    option_text: input.value,
                    Correctness: checker.checked,
                    Question_id: questionId,
                    option_number: i
                });
  
      
        }
        
    
    }
//getting info for actual question field.
    const quest = document.getElementById("QuestionTime")
    const oldQuest = quest.getAttribute("info");
    const idTime = quest.getAttribute("questionId");
    console.log("he " + oldQuest + " yo " + quest.value );
    //checking if question was changed
    if(oldQuest!=quest.value){
        console.log("BROMAN WHY7YYYY");
         const { data:data4, error:error4 } = await supabase.from('Questions').update({ Question: quest.value }).eq('id', idTime);
        if(error4){
            console.error("yo",error4);
        }
        //changing question attribute.
        quest.setAttribute("info",quest.value);
        //changing button on question bank
        const btnQuest = document.getElementById(quest.getAttribute("questionId"));
        btnQuest.textContent = quest.value;
    }
   
console.log(updates);
console.log(newEntries);
//push all updates to databse
const results = await Promise.all(
  updates.map(update =>
    supabase
      .from('Options')
      .update(update)
      .eq('id', update.id)
  )
);
//push all newEntries to database
const { data:data2, error:error2 } = await supabase.from('Options').insert(newEntries);
if(error2){
    console.error("oops", error2);
}
//show QuestionBankScreen upon completion
showQuestionBank();

}


/************************************************************************************************************************************
 * function for deleting questions and removing their buttons from question bank.
 * 
 ****************************************************************************************************************************************/
async function deleteQuestion(){
    //get questionID from html tag
        const quest = document.getElementById("QuestionTime");
        const questionId = quest.getAttribute("questionId");
//delete the question, cascade deleting related options as well.
        const { data, error } = await supabase.from('Questions').delete().eq('id', questionId).select();
       //get ID, and use it to find related button on question Bank screen 
        const theID = data[0]?.id;
        const myButton = document.getElementById(theID);
        //remove the button from the question bank screen and show question bank again.
        myButton.remove();
        showQuestionBank();
}



/************************************************************************************************************************************
 * todo list: add selector for correct answer, add edit/view questions, add save quizzes etc etc.]
 * 
 * 
 * 
 * 
 ****************************************************************************************************************************************/
async function saveNewQuestion(){

//grab the question text and the quizID (quiz Is in "secret" HTML tag)
    const question =  document.getElementById("QuestionTime");
    const quest = question.value;
    question.setAttribute("info",question.value);
    const div = document.getElementById("questions-screen")
    const quizId = div.getAttribute("quizId");
    //use info to add a new question into database
    const {data, error} = await supabase.from('Questions').insert([{Question: quest,QuizID:quizId}]).select();
//grab question ID
    const theID = data[0]?.id;
    console.log("heyyy it be the one which is " + data[0]?.id);
     if (error) {
        console.error('Insert failed:', error);
        console.log("go bro");

       
     }

     for(let i = 1;i<5;i++){
//get one of the option text box HTML elements and get its text contents
       
        const word = "op" + i;
        const op = document.getElementById(word);
        const option = op.value;
        if(i==1){
           // op.setAttribute("questionId",question.value);
        }


        console.log(option);

        //checks if it is not empty
        if((option.trim()!="")){
    //if not empty, gets the checkbox element for that option 
                const Correct = document.getElementById("cor" + i);
//pushes option to database with all info, including the checked status of checkbox
                const {data: data2, error:error2} = await supabase.from('Options').insert([{option_number: i,option_text:option,Correctness: Correct.checked,Question_id:data[0]?.id}]).select();
                if(error2){
                    console.error("error time",error2);
                }
                //sets the HTML tag for option ID with aprroiate gotten ID.
                op.setAttribute("opId",data2[0]?.id);

            
        }

     }



  //sets up the new button for the new question to be displayed on question bank screen
        
        const btnNew = document.createElement('button');
        btnNew.id = theID;
        btnNew.textContent = quest;
        const divTime = document.getElementById("questionsList");
        btnNew.classList.add("btn");
        btnNew.classList.add("secondary");
        btnNew.classList.add("large");
        divTime.appendChild(btnNew);
        document.getElementById(theID).addEventListener("click", () => editQuestion(theID));
        showQuestionBank(quizId);

        //const divTime = document.getElementById("quiz-list");


}



/************************************************************************************************************************************
 * 
 * saving new Quizzes to be made
 * 
 * 
 ****************************************************************************************************************************************/
async function  saveNewQuizInfo(){
//collects all info from quiz creation screen
    const title = document.getElementById('quiz-title').value;
    const descriprion = document.getElementById('description').value;
    const privacy = document.getElementById('privacy');
    //pushes new quiz info to database
    const {data, error} = await supabase.from('Quizzes').insert([{Quiz_Name: title,Private:privacy.checked,Quiz_Description:descriprion}]).select();
    //gets the questions-screen DIV and the quiz ID, and puts it in a HTML tag on the div for later use.
    const divTime = document.getElementById("questions-screen");
    let theId = data[0]?.id;
    divTime.setAttribute("quizId", data[0]?.id);

    console.log("YOOOO IT DID IT HEHEHE LET GO " +divTime.getAttribute("quizId"));
    if (error) {
        console.error('Insert failed:', error);
        console.log("to");

     }else{



//question bank diiff label than name of quiz. make them separatw so I can accerss it when needed. it will only change if different quiz is selected or made hehe.

        //shows the questions screen (question bank)  
            const parentDiv = document.getElementById("questionsList");
  
    Array.from(parentDiv.childNodes).forEach((child) => {
    parentDiv.removeChild(child);
    });
        showQuestionBank(theId);
        //puts question bank after the quiz name in the question bank screen
        document.getElementById("quiz-title-placeholder").textContent= title+ " Question Bank"
       //puts quiz ID in a invisible html label for later use.
        document.getElementById("secret").textContent= theId;
        console.log("yo. also " + theId);
         


     }
   //   console.log("to");

        const btnNew = document.createElement('button');
        btnNew.id = theId;
        btnNew.textContent = title;
        const divin = document.getElementById("user-quizzes");
        btnNew.classList.add("btn");
        btnNew.classList.add("secondary");
        btnNew.classList.add("large");
        divin.appendChild(btnNew);
        document.getElementById(theId).addEventListener("click", () => fillQuestionBank(theId));

}

/************************************************************************************************************************************
 * Fill question bank. function fills question bank up when quiz is selected
 * 
 * 
 * 
 * 
 ****************************************************************************************************************************************/
async function fillQuestionBank(id){

    const divTime = document.getElementById("questions-screen");
    divTime.setAttribute("quizId",id);
    const parentDiv = document.getElementById("questionsList");
  
    Array.from(parentDiv.childNodes).forEach((child) => {
    parentDiv.removeChild(child);
    });
   const {data, error} = await supabase.from('Questions').select('*').eq('QuizID',id);

    if (error) {
        console.error('Insert failed:', error);
    
     }

    
    //HTML tag set to question name for future reference.
/*    const quest = document.getElementById('QuestionTime');
    quest.value = data3.Question;
   quest.setAttribute("info",data3.Question);

    quest.setAttribute("questionId", questionId);
    //loops through all optioins and resets tags 
    for(let i = 1;i<5;i++){
        const inputTime = document.getElementById("op" + i);
        inputTime.setAttribute("checked","false");
        inputTime.setAttribute("opId","");
        inputTime.setAttribute("info","");
    }*/
    //for each option loop, sets HTML tags for each option and populates texboxes and checkboxes when needed
    data.forEach(question => {
        console.log(question.Question + "\n");
        const btnNew = document.createElement('button');
        btnNew.id = question.id;
        btnNew.textContent = question.Question;
        const divTime = document.getElementById("questionsList");
        btnNew.classList.add("btn");
        btnNew.classList.add("secondary");
        btnNew.classList.add("large");
        divTime.appendChild(btnNew);
        document.getElementById(question.id).addEventListener("click", () => editQuestion(question.id));
       
     
    });
    showQuestionBank(id);


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
async function showDashboardScreen() {
    //hmmmmmmmmmmmmmm
    hideAllScreens();

    document.getElementById('dashboard-screen').classList.remove('hidden');
}


/************************************************************************************************************************************
 * populates quiz options for user from database
 * 
 * 
 * 
 * 
 ****************************************************************************************************************************************/
async function populateQuizzes(){


    const {data: data2, error: error2} = await supabase.from('Quizzes').select('*');
    data2.forEach(quiz => {

        const btnNew = document.createElement('button');
        btnNew.id = quiz.id;
        btnNew.textContent = quiz.Quiz_Name;
        const divin = document.getElementById("user-quizzes");
        btnNew.classList.add("btn");
        btnNew.classList.add("secondary");
        btnNew.classList.add("large");
        divin.appendChild(btnNew);
        document.getElementById(quiz.id).addEventListener("click", () => fillQuestionBank(quiz.id));
       
    
    });
    showDashboardScreen();

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
