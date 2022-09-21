// Variables
var timerEl = document.querySelector(".timer");
var startButton = document.querySelector(".start-button");
var boxEl = document.querySelector(".box");
var questionEl = document.querySelector(".text-heading");
var textEl = document.querySelector(".text-container");
var backButton = document.querySelector(".back-button");
var resetButton = document.querySelector(".reset-button");
var listEl = document.querySelector(".highscore-list-container");
var buttonContainer = document.querySelector(".button-container");

// Questions with continued questions after answer.
var questionArray = [ 
    {
        question: "Which of the following is a programing language?",
        choice1: "HTML",
        choice2: "JavaScript",
        choice3: "Both A and B",
        choice4: "None of the above",
        answer: "2"
    },
    {
        question: "Inside which HTML element do we put the JavaScript?",
        choice1: "<div>",
        choice2: "<p>",
        choice3: "<script>",
        choice4: "<link>",
        answer: "3"
    },
    {
        question: "Which unique identifier is used to identify a single element?",
        choice1: "class",
        choice2: "universal",
        choice3: "nth child",
        choice4: "None of the above",
        answer: "4"
    },
    {
        question: "How do you declare a CSS Variable using syntax?",
        choice1: "--",
        choice2: "++",
        choice3: "==",
        choice4: "None of the above",
        answer: "1"
    },
    {
        question: "Which justify-content will evenly distribute items in the line with equal space around them?",
        choice1: "space-between",
        choice2: "space-around",
        choice3: "space-evenly",
        choice4: "center",
        answer: "2"
    },
    {
        question: "Which of the following is a Primitive Type?",
        choice1: "string",
        choice2: "number",
        choice3: "boolean",
        choice4: "all of the above",
        answer: "4"
    },
    {
        question: "Which of the following Logical Comparison Operators represents strict equality?",
        choice1: "==",
        choice2: "!==",
        choice3: "===",
        choice4: "none of the above",
        answer: "3"
    },
    {
        question: "Which of the following is not a array method?",
        choice1: ".sort",
        choice2: ".slice",
        choice3: ".copy",
        choice4: ".replace",
        answer: "3"
    },
    {
        question: "How do you convert objects to strings using JSON?",
        choice1: "JSON.parse()",
        choice2: "JSON.stringify()",
        choice3: "JSON.string()",
        choice4: "None of the above",
        answer: "2"
    },
    {
        question: "Which of the following is a Window Object Method?",
        choice1: "alert()",
        choice2: "script()",
        choice3: "countdown()",
        choice4: "warn()",
        answer: "1"
    },
    {
        question: "How do you convert strings to obejects using JSON?",
        choice1: "JSON.parse()",
        choice2: "JSON.stringify()",
        choice3: "JSON.string()",
        choice4: "None of the above",
        answer: "1"
    }
];
var gameStatus = false;
var sortArrayQuestions = [];
var choiceArray = [];
var currentQuestionIndex = 0;
var currentSortArrayIndex = 0;
var score = 0;

function countdown(timeLeft) {

    if (!timeLeft) {
        timeLeft = 60;
    }
  
    timeInterval = setInterval(function () {
        if (timeLeft > -1) {
            timerEl.textContent = timeLeft;
            timeLeft--;
        } else {
            // The game ends when timer reaches zero.
            gameStatus = false;
            gameOver();
        }
    }, 1000);
}

// RNG for sorting placement of questions
function randomSort(arr) {
    var count = arr.length;
    var index = 0;

    for (var i = 0; i < count; i++) {
        index = Math.abs(Math.floor(Math.random() * count));
        while (sortArrayQuestions.includes(index)) {
            index = Math.abs(Math.floor(Math.random() * count));
        }
        sortArrayQuestions[i] = index;
    }
}

// Shows the participant if answer was correct or incorrect after selecting a choice.
function flashText() {
    var timeOut = 3;
    var timeFooter;
    var footerQuestionEl = document.querySelector(".question-footer");

    timeFooter = setInterval(function () { 
        if (timeOut > 1) {
            timeOut--;
        } else {
            //Question footer will hide after three seconds.
            footerQuestionEl.setAttribute("style", "display: none;"); 
            clearInterval(timeFooter);
        }
    }, 1000);
}

function initQuestion(currentSortArrayIndex) {
    // Removes the current elements inside boxEl except for H1 then create a list for button answers.
    var ul;
    var li;
    var button;
    var buttonOld;
    var footerQuestionEl;
    var footerHeader;
    var listClass = 0;

    // Replaces header with question and moves choices into a separate array.
    currentQuestionIndex = sortArrayQuestions[currentSortArrayIndex];
    questionEl.textContent = questionArray[currentQuestionIndex].question;
    choiceArray = [
        questionArray[currentQuestionIndex].choice1,
        questionArray[currentQuestionIndex].choice2,
        questionArray[currentQuestionIndex].choice3,
        questionArray[currentQuestionIndex].choice4
    ];
    
    if (currentSortArrayIndex === 0) {
        // This handles the initial creation of answer buttons, removes text-container, and adds buttons for choices
        boxEl.removeChild(textEl);
        boxEl.setAttribute("style", "text-align: left;");

        ul = document.createElement("ul");
        ul.setAttribute("id", "choices");
        boxEl.appendChild(ul);

        // Creates 'footer' to show if answer is correct or not
        footerQuestionEl = document.createElement("div");
        footerQuestionEl.setAttribute("class", "question-footer");
        footerQuestionEl.setAttribute("style", "display: none;");
        boxEl.append(footerQuestionEl);
    
        footerHeader = document.createElement("h2");
        footerHeader.setAttribute("class", "question-head");
        footerQuestionEl.append(footerHeader);

        // Creates a button for every choice; then, adds a class for each to check it against questionArray[answer]
        choiceArray.forEach(function(element, index) {
            listClass = index + 1;
            li = document.createElement("li");
            button = document.createElement("button");
            li.setAttribute("class", "li-" + listClass);
            
            button.textContent = listClass + ". " + element + " ";
            button.setAttribute("class", listClass);
            
            ul.appendChild(li);
            li.appendChild(button);
        });
    } else {
        // Replaces buttons textContent with the new ones
        choiceArray.forEach(function(element, index) {
            listClass = index + 1;
            li = document.getElementsByClassName("li-"+listClass);
            buttonOld = document.getElementsByClassName(listClass);
            button = document.createElement("button");
            button.textContent = listClass + ". " + element + " ";
            button.setAttribute("class", listClass);
            li[0].appendChild(button);
            buttonOld[0].replaceWith(button);
        });
    }
    
}

// Start Button.
// Timer with start button click.
// minus to time when questions are answered incorrectly.
// When all questions have been answered
// Game is over.
// When game is over, save initials and score.