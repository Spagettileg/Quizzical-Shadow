/*VARIABLES*/

/*--I have created two variables which will pull information from the questions.html file via Id and Class name. 
They will reference the quiz questions and quiz answers. I want the answers to be an array so that we have four different options to choose from--*/

/*--I have created another two variables which will pull information from the questions.html file via Id. 
They will reference the number of questions a user is currently on and the users score--*/

/*--Another variable has been added to manage the progress bar. This variable also links to an Id within questions.html.
I will reference to this variable within questions.js in order to fill the progress bar as the game is played--*/

/*--Two more variables added. LoadingSpinner and quiz. Both link to Ids within questions.html. Both are called upon within
questions.js. Ultimately these two variables will be responsible for the loading spinner appearing and disappearing when
we are loading questions from the API. This avoids any blank screens or empty fields. This has been done for better UX.--*/

/*--I've chosen 'const' as my variable because it can't and won't be changed, unlike let and var where their contents can be changed--*/

const quizQ = document.getElementById("quiz-question");
const quizA = Array.from(document.getElementsByClassName("quiz-answer"));
const tallyQ = document.getElementById("questionTally");
const tallyS = document.getElementById("scoreTally");
const currentProg = document.getElementById("progression");
const loadingSpinner = document.getElementById("loading-spinner");
const quiz = document.getElementById("quiz");

/*--I have created another handful of variables which will each have a role to play--*/

/*--currentQ will be our current question which will be an object because it can potentially have many values--*/
/*--answerDelay will be in place so that there will be a slight delay before a user can chose another answer--*/
/*--The score variable will be the users score which will start at 0--*/
/*--qNum is a variable that will determine which question number the user is on--*/
/*--availableQ is an empty array which will be an available copy of our question set, we will take questions out 
of our availableQ array as the user uses them. The user will be presented with a unique question each time--*/
/*--time is a variable has has been set 10. This will be how long a user has to answer each question within the game--*/
/*--quizQuests is a variable which contains a handful of questions in the form of objects. 
Each object consists of one question and four possible answers. The object also contains the actual answer--*/

let currentQ = {};
let answerDelay = false;
let score = 0;
let qNum = 0;
let time = 10;
let availableQ = [];
let quizQuests = [];

/*--The correctPoints variable is how many points will be awarded for a correct answer--*/
/*--The incorrectPoints variable is how many points will be deducted for an incorrect answer--*/
/*--The totalQuests variable set the limit for how many questions a user will be given--*/

const correctPoints = 10;
const incorrectPoints = 3;
const totalQuests = 10;


/*FETCH API*/

/*--Here I've used fetch and pasted in a URL from a free quiz database API (https://opentdb.com/). What I needed to do next was 
transform each question and answer fetched into the format we're using for the Quizzical website. Please see the questions.json file within
the Quizzical directory. What I want is for those fetched questions to be placed into my questions.json file and then we'll use
those questions because they'll be in the correct format. The function below is going to ask for a response and that response is 
going to be a return of a json version of the data. Ultimately I want the quizQuests variable to hold all of this data. 
I've used the map method again to iterate through the arrays. So the questions I've taken from the API will be within loadedQuest 
and I've created a function, within that function I will transform it to the correct format. A variable was made to hold this data 
called convertedQuest and it's going to be an object with a question property which is obviously coming from the loadedQuest as 
stated before--*/

/*--Next up I've created a variable called possibleAnswers. I've used the spread operator again and within that I've called the
loadedQuest and all of its incorrect answers. The API data we have received refers to their incorrect answers as incorrect_answers
and their correct answers as correct_answers. So what this spread operator will do is give us an array of incorrect answers. What I 
really wanted to do was get these incorrect answers and the correct answer to display randomly on the page so that every time the 
game is played and a specific question is displayed, the answer should display in a different order. To do this Math.floor(Math.random)
has been used. I have asked for a random index between 0 and 4 because we have 4 possible answers and then I've spliced the correct answer.
What this has essentially done is taken all of the incorrect answers and the correct answer and put them into the possibleAnswers variable
with the correct answer being in a random possition within the object. --*/

/*--Finally I've iterated through the possibleAnswers and for each answer and the index that it's at I've basically said I want to put them
as answer 1, 2, 3 & 4 and to do that I'm going to dynamically get the property "answer" plus whatever the index is and then assign it to answer.
I've then returned the convertedQuest to display those questions and I've called the gameBegin function at the bottom.--*/

fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple")
    .then(function (res) {
        return res.json();
    })

    .then(function (loadedQuest) {
        quizQuests = loadedQuest.results.map(function (loadedQuest) {
            const convertedQuest = {
                question: loadedQuest.question,
            };

            const possibleAnswers = [...loadedQuest.incorrect_answers];
            convertedQuest.answer = Math.floor(Math.random() * 4) + 1;
            possibleAnswers.splice(
                convertedQuest.answer - 1,
                0,
                loadedQuest.correct_answer
            );

            possibleAnswers.forEach(function (answer, index) {
                convertedQuest['answer' + (index + 1)] = answer;
            });
            return convertedQuest;
        });

        gameBegin();
    })


/*GAME BEGIN FUNCTION*/

/*--This is the gameBegin function which is the function that’ll be used at the beginning of the game. 
We’ll start on qNum (question number) 0 and we’ll start with a score of 0, and also the timer will start at 10.
availableQ is our empty array which will copy our questions from our quizQuests array using the spread operator. 
The spread operator [...quizQuests] takes an array, spreads out each of its items and puts them into a new array (availableQ). 
Ultimately when availableQ runs out of items, the game will finish. Either that or when totalQuests reaches it’s limit, the game will end.--*/

/*--the nextQuest function will be called within the gameBegin function to initiate the next question within the game. 
Basically when we have started the game and chosen our first answer, we’ll move onto the next question--*/

/*--Quiz questions will not be displayed when loading spinner is active. Loading spinner will not be displayed when questions are
being displayed. This has been done because when questions are being loaded from the API, there is a slight time delay and empty
fields are displayed, sometimes for 1 second, sometimes for up to 5 seconds. This looked very sloppy so to counter this the 
loading spinner has been put in place.--*/

gameBegin = function () {
    score = 0;
    qNum = 0;
    availableQ = [...quizQuests];
    time = 10;
    nextQuest();
    quiz.classList.remove("d-none");
    loadingSpinner.classList.add("d-none");
};

/*NEXT QUESTION FUNCTION*/

/*--The function below basically says, if there are no more available questions in the availableQ array OR the totalQuests limit has been reached, 
a new page will be loaded. In this instance the completed.html page will be loaded and that will tell the user that they have completed the game--*/

/*--We want to save a user's score to local storage so that we can access it when we complete the quiz and we can use it then to add to the leaderboard.
What I have done is for local storage I have set item. The setItem method sets the value of the specified Storage Object item. In this case I've set the
item as newScore and it will have the value of score. Note that the value of score is set to 0 at the beginning of the game and will obviously increase
as the game goes on. When the game ends that score will be locally saved as the value--*/

/*--The game’s qNum will start at 0 but when we start playing the game qNum++ will increment the game’s question number to 1 and so on
until we reach our limit. The limit is set in the const variable totalQuests--*/

/*--The progress bar will fill as each question is answered. We call the currentProg variable which is linked to the progression id within questions.html
and we style it's width. The width for the child element is currently set to 0% and as each question is answered it shall move up a percentage depending on
how many questions there are in the totalQuests variable. So we take the qNum (question number) which starts at 1 and it's going to divide by the totalQuests
(total amount of questions) and we're going to times it by 100. So for example if we had 3 questions and we answered one question, the bar would raise by
33.33% whereas if we only multiplied it by 10 then the bar would only raise by 3.33% which is obviously too low!--*/

/*--In order for the question tally to update after we answer a question I've set the tallyQ innerHTML (this basically places it within the HTML document) to equal
the current question number over the total amount of questions. Long story short - The questionTally Id element (tallyQ) within questions.html will display the current question
over the total amount of questions, for example: 4/10. This will update dynamically depending on which question we're currently on. The totalQuests number will stay
the same throughout the entire game because it will be set to a specific number using a const variable--*/

/*--In order to generate a random question we need to do a little math. Math.random() will generate a random decimal number between 0 and 1. 
If we want a higher number than that we need to multiply it by a number. If we wanted a random number between 0 and 10 then we would * the Math.random() by 10. 
In this instance we don’t necessarily want to multiply it by a number, we want to multiply it by the number of remaining items within our availableQ array. 
If we have 10 questions remaining in our availableQ array and we use one question, we have 9 remaining. Math.random() * availableQ.length will generate a random 
number depending on how many questions are remaining with the array. Adding Math.floor to the beginning of this statement will get rid of the decimal point and 
take the first number presented to us. For example, if we had the number 2.5893546 and we added Math.floor to our statement it would remove the decimal point and 
any numbers following it and leave us with the number 2. Whilst playing the game, our next question will be question number 2 within the availableQ array. 
To reference this I have placed this statement within a variable called qCatalogue--*/

/*--Our current question will be the available question that has been selected via our qCatalogue hence the currentQ = availableQ[qCatalogue] next we will take 
the quizQ’s (quiz question’s) HTML element, the innerHTML, and make it the currentQ (current question) --*/

/*--There’s a little function within the nextQuest function that will help us generate the answers for each question. Within the questions.html file I’ve placed 
a data-number within each question. Here we are referencing that data-number. This function is basically saying find the “answer” within the quizA variable and 
find it’s dataset-number and display the answers relating to the speficic currentQ (current question)--*/

/*--We’re taking the availableQ array and we’re splicing out the question that we just used so that we don’t randomly generate the same question twice. 
answerDelay is set to true so that when the question has loaded we’re giving permission to the user to go ahead and answer--*/

/*--Finally the counDown timer is called and the time is reset to 10. This is placed at the bottom so that that function is used first.
Obviously we don't want the countdown timer to start at just any point do we? We want it to start when a question is called--*/

nextQuest = function () {

    if (availableQ.length === 0 || qNum >= totalQuests) {
        localStorage.setItem("newScore", score);
        return window.location.assign("./completed.html");
    }

    qNum++;
    currentProg.style.width = `${((qNum - 1) / totalQuests) * 100}%`;
    tallyQ.innerHTML = qNum + "/" + totalQuests;

    const qCatalogue = Math.floor(Math.random() * availableQ.length);
    currentQ = availableQ[qCatalogue];
    quizQ.innerHTML = currentQ.question;

    quizA.forEach(function (answer) {
        const number = answer.dataset['number'];
        answer.innerHTML = currentQ['answer' + number];
    });

    availableQ.splice(qCatalogue, 1);
    answerDelay = true;

    countDown();
};

/*COUNTDOWN TIMER FUNCTION*/

/*--I've created the function below for question.html's timer. The first line will deduct 1 from the set time (10).
The first if statement says if the time is 10 or under, display it on the html page.
The second if statement says when the time goes under 1, clear the interval it's currently set at
and decrease the score. I then want it to reset it's time to 10 and call the nextQuest function. The setInterval
for the countDown function is 1000ms. This is deducting 1 from time every 1 second--*/

countDown = function () {

        timer.innerHTML = time;

    if (time < 1) {
        time = 10;
        nextQuest();
        decreaseScore(incorrectPoints);
    }
    else (time = time - 1)
}

setInterval("countDown()", 1000);

/*COLOUR CHANGE FUNCTION*/

/*--This little function will stop a user from being able to click an answer if the website isn’t ready for it. 
This function can go either two ways, chosenAnswer is an e-target for incorrect answers and chosenCorrect is a correct answer. 
The parentElement.classList add/remove code links to our style.css file and searches for the class names .correct and .incorrect.
This will change the colour of the buttons to either green or red depending on whether the question is answered correctly.
Text will also become white. I've chosen this because the original black text clashed with my chosen colours.
I've given this functon a setTimeout so that our correct/incorrect colours hang for just little over a second (1200ms).
This gives the user recognition that they have answered correctly or incorrectly.
Once an answer has been chosen the nextQuest() function will engage--*/

/*--Within the function below we have two if statements. These will increase or decrease points depending on whether the user
chose a correct or incorrect answer. if the user chose correctly, the increaseScore function shall be called and points will
be added. if the user chose incorrectly then the decreaseScore function shall be called and points will be decucted. These points
are dictated by the variables previously set (correctPoints / incorrectPoints)--*/

quizA.forEach(function (answer) {
    answer.addEventListener("click", function (e) {
        if (!answerDelay) return;
        answerDelay = false;

        const chosenAnswer = e.target;
        const chosenCorrect = chosenAnswer.dataset["number"];

        const colorChange = chosenCorrect == currentQ.answer ? "correct" : "incorrect";

        if (colorChange === "correct") {
            increaseScore(correctPoints);
        }

        if (colorChange === "incorrect") {
            decreaseScore(incorrectPoints);
        }

        chosenAnswer.parentElement.classList.add(colorChange);

        setTimeout(function () {
            chosenAnswer.parentElement.classList.remove(colorChange);
            time = 10;
            nextQuest();
        }, 1200);
    });
});

/*INCREASE/DECREASE SCORE FUNCTION*/

/*--The two functions below are set to either increase or decrease the score and then display it on the questions.html page
via the tallyS variable. These functions are called above in our if() statements. If the answer is correct, award points.
If the answer is incorrect, deduct points. This is made possible by stating score += / -= num--*/

increaseScore = function (num) {
    score += num;
    tallyS.innerText = score;
};

decreaseScore = function (num) {
    score -= num;
    tallyS.innerText = score;
}