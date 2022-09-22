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
        question: "How do you convert strings to objects using JSON?",
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

function gameOver() {
    clearInterval(timeInterval);
    // Removes button choices once game over.
    var ul = document.querySelector("#choices");
    var footer = document.querySelector(".question-footer");
    boxEl.removeChild(ul);
    boxEl.removeChild(footer);

    // Replace header text depending on the score.
    questionEl.textContent = (score >= Math.round(questionArray.length * 0.70)) ? "Congratulations! All done!" : "Better luck next time! All done!";

    // Creates elements for the end-of-game page.
    var div = document.createElement("div");
    div.setAttribute("class", "text-containter");
    boxEl.appendChild(div);
    
    var text = document.createElement("p");
    text.textContent = "Your final score is " + score +".";
    div.appendChild(text);
    
    var form = document.createElement("form");
    form.setAttribute("method", "POST");
    div.appendChild(form);
    
    var labelForm = document.createElement("label");
    labelForm.textContent = "Enter initials: ";
    form.appendChild(labelForm);

    var inputForm = document.createElement("input");
    inputForm.setAttribute("type", "text");
    labelForm.appendChild(inputForm);

    var buttonForm = document.createElement("button");
    buttonForm.setAttribute("class", "submit-button");
    buttonForm.setAttribute("style", "width: 10vw; height: 40px;");
    buttonForm.addEventListener("click", submitClick);
    buttonForm.textContent = " Submit ";
    labelForm.appendChild(buttonForm);
}

function submitClick(event) {
    // Prevents refreshing of page when Submit button is clicked.
    event.preventDefault();

    var scoreArray = [];
    // Get stored userScores from localStorage using JSON to convert back to object.
    var userScores = JSON.parse(localStorage.getItem("userScores"));
    
    var userNewScore = {
        name: document.querySelector("input").value.trim(),
        score: score
    };

    // Prevents user from inputing blank initials into highscore screen.
    if (userNewScore.name === "") {
        window.alert("Initials cannot be blank");
        return;
    }

    // Saves initials to score.
    if (userScores === null) {
        scoreArray.push(userNewScore);
    } else {
        for (var i = 0; i < userScores.length; i++) {
            scoreArray.push(userScores[i]);
        }
        scoreArray.push(userNewScore);
        // Sort scores in descending order.
        scoreArray = scoreArray.sort(function (c1, c2) { return c2.score - c1.score; });
    }

    localStorage.setItem("userScores", JSON.stringify(scoreArray));
    // Changes webpage from index.html to highscore.html
    window.location.href = "./highscores.html";
    
    if (window.onload && window.location.href === './highscores.html') {
        loadScores();   
    } 
}

boxEl.addEventListener("click", function (event) {
    var element = event.target;
    var timeLeft;
    var footerQuestionEl = document.querySelector(".question-footer");
    var footerHeader = document.querySelector(".question-head");
    
    // Only clicks on button will trigger event.
    if (element.matches("button")) {
        var chosenAnswer = element.getAttribute("class");

        switch (chosenAnswer) {
            case "start-button":
                // Start Button.
                sortArrayQuestions = [];    // Initialise a new set of questions within the array everytime the start button is pressed.
                currentQuestionIndex = 0;   
                gameStatus = true;
            
                randomSort(questionArray);
                initQuestion(currentSortArrayIndex);
                
                // Timer countdown of 60 seconds with start button click.
                countdown();
                break;
            case "back-button":
                window.location.href = "./index.html";
                break;
            case "reset-button":
                localStorage.setItem("userScores", null);
        
                // Button will remove ul and li elements.
                var ul = document.querySelector("#highscore-list");
                listEl.removeChild(ul);
                // Button will clear highscores.
                buttonContainer.removeChild(resetButton);
                break;
            default:
                footerQuestionEl.setAttribute("style", "font-style: italic; border-top: 3px black solid");
                if (chosenAnswer === questionArray[currentQuestionIndex].answer) {
                    footerHeader.textContent = "Correct!";
                    // Footer flash.
                    flashText();
                    score++;
                    if (currentSortArrayIndex < questionArray.length - 1) {
                        // Moves on to next question.
                        currentSortArrayIndex++;
                        initQuestion(currentSortArrayIndex);
                    } else {
                        footerQuestionEl.setAttribute("style", "display: none;");
                        gameStatus = false;
                        gameOver();
                    }
                } else {
                    // Minus to time when questions are answered incorrectly.
                    footerHeader.textContent = "Incorrect!";
                    flashText();

                    clearInterval(timeInterval);
                    timeLeft = timerEl.textContent - 10;
                    if (timeLeft <= 0) {
                        // When timer reaches 0 - Gameover
                        timerEl.textContent = 0;
                        footerQuestionEl.setAttribute("style", "display: none;");
                        gameStatus = false;
                        gameOver();
                    }
                    countdown(timeLeft);
                }
                break;
        }
    }
});

// Load the scores into highscores.html
function loadScores() {
    // Unordered list and append every item in the userScores object into a list item
    var ul = document.createElement("ul");
    ul.setAttribute("id", "highscore-list");
    ul.setAttribute("style", "text-align: left;")
    listEl.appendChild(ul);

    var userScores = JSON.parse(localStorage.getItem("userScores"));
    
    // Name and score
    if (userScores !== null) {
        userScores.forEach((element, index) => {
            li = document.createElement("li");
            listClass = index + 1;
            li.setAttribute("class", "li-" + listClass);
            li.textContent = listClass + ". " + element.name + " - " + element.score;
            ul.appendChild(li);    
        });        
    } else {
        // No reset button when the userScores is empty
        buttonContainer.removeChild(resetButton);
    }
}


