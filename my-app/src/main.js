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
    const yar = document.getElementById('quiz-title').value;
    const {data, error} = await supabase.from('Users').insert([{email: yar}]);
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

// Screen Navigation Functions
/*function showAuthScreen() {
    hideAllScreens();
    document.getElementById('auth-screen').classList.remove('hidden');
}*/

function showDashboardScreen() {
    hideAllScreens();
    document.getElementById('dashboard-screen').classList.remove('hidden');
}

function showCreateQuizScreen() {
 
    hideAllScreens();
    document.getElementById('Info-quiz-screen').classList.remove('hidden');
   
}

/*function showLobbyScreen(quizId) {
    hideAllScreens();
    document.getElementById('lobby-screen').classList.remove('hidden');
    setupLobby(quizId);
}

function showPlayScreen(quizId) {
    hideAllScreens();
    document.getElementById('play-screen').classList.remove('hidden');
    startQuizSession(quizId);
}

function showResultsScreen(score, leaderboard) {
    hideAllScreens();
    document.getElementById('results-screen').classList.remove('hidden');
    displayResults(score, leaderboard);
}*/

function hideAllScreens() {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.add('hidden'));
}

// Quiz Creation Functions
/*function initializeQuizForm() {
    document.getElementById('questions-container').innerHTML = '';
    document.getElementById('quiz-title').value = '';
    addQuestionForm();
}

function addQuestionForm() {
    const questionsContainer = document.getElementById('questions-container');
    const questionCount = questionsContainer.children.length + 1;
    
    const questionHtml = `
        <div class="question-item" data-question-id="${questionCount}">
            <h4>Question ${questionCount}</h4>
            <div class="form-group">
                <label for="question-${questionCount}-text">Question Text</label>
                <input type="text" id="question-${questionCount}-text" placeholder="Enter your question">
            </div>
            <div class="form-group">
                <label>Options</label>
                <div class="options-list">
                    ${[1, 2, 3, 4].map(optNum => `
                        <div class="option-row">
                            <input type="radio" name="question-${questionCount}-correct" value="${optNum}" ${optNum === 1 ? 'checked' : ''}>
                            <input type="text" id="question-${questionCount}-option-${optNum}" placeholder="Option ${optNum}">
                        </div>
                    `).join('')}
                </div>
            </div>
            <button class="btn small danger remove-question-btn">Remove Question</button>
        </div>
    `;
    
    questionsContainer.insertAdjacentHTML('beforeend', questionHtml);
    
    // Add event listener to the new remove button
    questionsContainer.lastElementChild.querySelector('.remove-question-btn')
        .addEventListener('click', function() {
            this.closest('.question-item').remove();
            // Renumber remaining questions
            Array.from(questionsContainer.children).forEach((q, idx) => {
                q.setAttribute('data-question-id', idx + 1);
                q.querySelector('h4').textContent = `Question ${idx + 1}`;
            });
        });
}

async function publishQuiz() {
    const title = document.getElementById('quiz-title').value.trim();
    const topic = document.getElementById('quiz-topic').value;
    const questions = [];
    
    // Validate quiz title
    if (!title) {
        alert('Please enter a quiz title');
        return;
    }
    
    // Collect questions
    const questionElements = document.querySelectorAll('.question-item');
    
    if (questionElements.length === 0) {
        alert('Please add at least one question');
        return;
    }
    
    questionElements.forEach(qEl => {
        const qId = qEl.dataset.questionId;
        const text = document.getElementById(`question-${qId}-text`).value.trim();
        const options = [];
        let correctAnswer = 0;
        
        // Validate question text
        if (!text) {
            alert(`Please enter text for question ${qId}`);
            throw new Error('Validation failed');
        }
        
        // Collect options
        for (let i = 1; i <= 4; i++) {
            const optionText = document.getElementById(`question-${qId}-option-${i}`).value.trim();
            if (!optionText) {
                alert(`Please enter all options for question ${qId}`);
                throw new Error('Validation failed');
            }
            options.push(optionText);
            
            // Check if this option is the correct answer
            if (document.querySelector(`input[name="question-${qId}-correct"]:checked`).value == i) {
                correctAnswer = i - 1; // Using 0-based index
            }
        }
        
        questions.push({
            text,
            options,
            correctAnswer
        });
    });
    
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');
        
        // Generate a random join code
        const joinCode = generateJoinCode();
        
        // Create quiz document in Firestore
        const quizRef = await db.collection('quizzes').add({
            title,
            topic,
            questions,
            creatorId: user.uid,
            creatorName: user.displayName || user.email,
            joinCode,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'waiting' // waiting, in-progress, completed
        });
        
        // Show lobby screen with the new quiz
        showLobbyScreen(quizRef.id);
        
    } catch (error) {
        console.error('Error publishing quiz:', error);
        alert('Failed to publish quiz. Please try again.');
    }
}

function generateJoinCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid ambiguous characters
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Lobby Functions
function setupLobby(quizId) {
    // Listen for quiz updates
    const quizRef = db.collection('quizzes').doc(quizId);
    
    quizRef.onSnapshot(doc => {
        if (doc.exists) {
            const quiz = doc.data();
            
            // Update lobby UI
            document.getElementById('lobby-quiz-title').textContent = quiz.title;
            document.getElementById('join-code').textContent = quiz.joinCode;
            
            // Listen for players (assuming you have a subcollection for players)
            quizRef.collection('players').onSnapshot(snapshot => {
                const playersList = document.getElementById('players-list');
                playersList.innerHTML = '';
                
                snapshot.forEach(playerDoc => {
                    const player = playerDoc.data();
                    const playerEl = document.createElement('div');
                    playerEl.className = 'player-badge';
                    playerEl.textContent = player.name;
                    playersList.appendChild(playerEl);
                });
                
                document.getElementById('player-count').textContent = snapshot.size;
            });
        } else {
            alert('Quiz not found');
            showDashboardScreen();
        }
    });
}

function startQuiz() {
    // In a real app, you would update the quiz status to "in-progress"
    // and notify all players to start the quiz
    
    // For this skeleton, we'll just simulate starting a quiz
    const quizId = 'simulated-quiz'; // In real app, you'd get this from the lobby
    showPlayScreen(quizId);
}

// Quiz Play Functions
async function startQuizSession(quizId) {
    // In a real app, you would:
    // 1. Get the quiz questions from Firestore
    // 2. Set up real-time updates for the quiz progress
    // 3. Handle player answers and scoring
    
    // For this skeleton, we'll use sample data
    const sampleQuiz = {
        title: "Sample Quiz",
        questions: [
            {
                text: "What is the capital of France?",
                options: ["London", "Paris", "Berlin", "Madrid"],
                correctAnswer: 1
            },
            {
                text: "Which planet is known as the Red Planet?",
                options: ["Venus", "Mars", "Jupiter", "Saturn"],
                correctAnswer: 1
            }
        ]
    };
    
    document.getElementById('current-quiz-title').textContent = sampleQuiz.title;
    document.getElementById('total-questions').textContent = sampleQuiz.questions.length;
    
    let currentQuestionIndex = 0;
    let score = 0;
    
    function displayQuestion(index) {
        if (index >= sampleQuiz.questions.length) {
            // Quiz completed
            showResultsScreen(score, [
                {name: "You", score: score},
                {name: "Player 2", score: Math.floor(score * 0.8)},
                {name: "Player 3", score: Math.floor(score * 0.6)}
            ]);
            return;
        }
        
        const question = sampleQuiz.questions[index];
        document.getElementById('question-number').textContent = index + 1;
        document.getElementById('question-text').textContent = question.text;
        
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, i) => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'option-btn';
            optionBtn.textContent = option;
            optionBtn.dataset.optionIndex = i;
            
            optionBtn.addEventListener('click', function() {
                // Check if answer is correct
                if (i === question.correctAnswer) {
                    score += 10;
                    this.classList.add('selected');
                    this.style.backgroundColor = 'var(--success-color)';
                } else {
                    this.classList.add('selected');
                    this.style.backgroundColor = 'var(--danger-color)';
                    // Highlight correct answer
                    Array.from(optionsContainer.children)[question.correctAnswer]
                        .style.backgroundColor = 'var(--success-color)';
                }
                
                // Disable all options after selection
                Array.from(optionsContainer.children).forEach(btn => {
                    btn.disabled = true;
                });
                
                // Move to next question after delay
                setTimeout(() => {
                    currentQuestionIndex++;
                    displayQuestion(currentQuestionIndex);
                }, 2000);
            });
            
            optionsContainer.appendChild(optionBtn);
        });
        
        // Start timer (simplified)
        let timeRemaining = 10;
        document.getElementById('time-remaining').textContent = timeRemaining;
        
        const timerInterval = setInterval(() => {
            timeRemaining--;
            document.getElementById('time-remaining').textContent = timeRemaining;
            
            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                // Time's up - move to next question
                currentQuestionIndex++;
                displayQuestion(currentQuestionIndex);
            }
        }, 1000);
    }
    
    // Start with first question
    displayQuestion(0);
}

// Results Functions
function displayResults(score, leaderboard) {
    document.getElementById('final-score').textContent = score;
    
    // Set score message based on performance
    let message;
    if (score >= 80) message = "Amazing job!";
    else if (score >= 60) message = "Great work!";
    else if (score >= 40) message = "Good effort!";
    else message = "Keep practicing!";
    
    document.getElementById('score-message').textContent = message;
    
    // Display leaderboard
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';
    
    leaderboard.sort((a, b) => b.score - a.score).forEach(player => {
        const li = document.createElement('li');
        li.textContent = `${player.name}: ${player.score} points`;
        leaderboardList.appendChild(li);
    });
}

// User Quizzes Management
async function loadUserQuizzes(userId) {
    try {
        const quizzesSnapshot = await db.collection('quizzes')
            .where('creatorId', '==', userId)
            .orderBy('createdAt', 'desc')
            .limit(5)
            .get();
            
        const quizzesContainer = document.getElementById('user-quizzes');
        quizzesContainer.innerHTML = '';
        
        if (quizzesSnapshot.empty) {
            quizzesContainer.innerHTML = '<p>You haven\'t created any quizzes yet.</p>';
            return;
        }
        
        quizzesSnapshot.forEach(doc => {
            const quiz = doc.data();
            const quizCard = document.createElement('div');
            quizCard.className = 'quiz-card';
            quizCard.innerHTML = `
                <h4>${quiz.title}</h4>
                <p>Topic: ${quiz.topic}</p>
                <p>Questions: ${quiz.questions.length}</p>
                <button class="btn small play-quiz-btn" data-quiz-id="${doc.id}">Play Again</button>
            `;
            
            quizzesContainer.appendChild(quizCard);
            
            // Add event listener to play button
            quizCard.querySelector('.play-quiz-btn').addEventListener('click', function() {
                showLobbyScreen(this.dataset.quizId);
            });
        });
    } catch (error) {
        console.error('Error loading user quizzes:', error);
        document.getElementById('user-quizzes').innerHTML = '<p>Error loading quizzes. Please try again.</p>';
    }
}*/

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

/*function signInAnonymously() {
    auth.signInAnonymously()
        .then(() => {
            // Signed in
            showDashboardScreen();
        })
        .catch(error => {
            console.error('Anonymous sign-in error:', error);
            alert('Failed to sign in. Please try again.');
        });
}*/

/*function signOut() {
    auth.signOut()
        .then(() => {
            showAuthScreen();
        })
        .catch(error => {
            console.error('Sign out error:', error);
        });
}

// Utility Functions
function showJoinQuizModal() {
    // In a real app, you would show a modal to enter a join code
    alert('Join quiz functionality would be implemented here');
}*/