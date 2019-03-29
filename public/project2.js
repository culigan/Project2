
function getQuestion(request, response) {
    var gameType = request.query.command;
    var cat = request.query.cat;
    var diff = request.query.diff;
    var returnQuest = "";

    if (gameType == "Play Jeopardy")
        returnQuest = getJeopardy(cat, diff);
    else
        returnQuest = getClassic(cat, diff);
}

function getJeopardy(cat, diff) {
    $.ajax({
        url: 'jService.io',
        type: "GET",
        data: { category: cat, difficulty: diff },
        success: function (data) {
            document.getElementById('quest').innerHTML = JSON.stringify(data);
        },
        Error: function () {
            alert('ERROR!');
        }
    });
}

function getClassic(cat, diff) {
    $.ajax({
        url: 'https://opentdb.com/api',
        type: "GET",
        data: { category: cat, difficulty: diff },
        success: function (data) {
            document.getElementById('quest').innerHTML = JSON.stringify(data);
        },
        Error: function () {
            alert('ERROR!');
        }
    });
}

function getJAnswer() {
    try {
        var apiAnswer = document.getElementById('hanswer').value.toUpperCase();
        var playerAnswer = document.getElementById('textans').value.toUpperCase();
        var pointValue = document.getElementById('title').value;
        var score = 0;

        if (playerAnswer == apiAnswer) {
            score = parseInt(pointValue);
        }
    }
    catch (err) {
        document.getElementById('diffvalue').innerHTML = err;
    }
    $.ajax({
        url: '/addScore',
        type: "POST",
        data: { score: score },
        success: function (data) {
            console.log(data);
            document.getElementById('score').innerHTML = "Your Score is: " + (data.score).toString();
            if (checked) {
                document.getElementById('anstext').innerHTML = "Correct Answer!";
            }
            else
                document.getElementById('anstext').innerHTML = "Wrong Answer!";

        },
        Error: function () {
            alert('ERROR!');
        }
    });
}

function getCAnswer() {
    var checked = document.getElementById('textans4').checked;
    var score = 0;

    if (checked) {
        score++;           
    }
    

    $.ajax({
        url: '/addScore',
        type: "POST",
        data: { score: score },
        success: function (data) {
            console.log(data);
            document.getElementById('score').innerHTML = "Your Score is: " + (data.score).toString();
            if (checked) {
                document.getElementById('anstext').innerHTML = "Correct Answer!";
            }
            else
                document.getElementById('anstext').innerHTML = "Wrong Answer!";

        },
        Error: function () {
            alert('ERROR!');
        }
    });
}

function newQuestion() {
    location.reload();
    
   
}

function clrRadio() {
    document.getElementById('textans0').checked = false;
    document.getElementById('textans1').checked = false;
    document.getElementById('textans2').checked = false;
    document.getElementById('textans4').checked = false;
}

function goBack() {
    window.history.back();
}