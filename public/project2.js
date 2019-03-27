
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
    var apiAnswer = document.getElementById('hanswer').value;
    var playerAnswer = document.getElementById('textans').value;

}

function getCAnswer() {
    var playerAnswer = document.getElementById('textans').value;
    var score = $.session.get('score');
    if (isNaN(score))
        score = 0;

    if (playerAnswer == "correct") {
        document.getElementById('score').innerHTML = (score + 1).toString();
        $.session.set('score', score);
        document.getElementById('anstext').innerHTML = "Correct Answer!";
    }
    else {
        document.getElementById('score').innerHTML = (score + 1).toString();
        document.getElementById('anstext').innerHTML = "Wrong Answer!";
    }
}

function goBack() {
    window.history.back();
}