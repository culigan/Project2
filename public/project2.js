
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
            document.getElementById('score').innerHTML = (data.score).toString();
            if (checked) 
                document.getElementById('anstext').value = "Correct Answer! ";
            else
                document.getElementById('anstext').value = "Wrong Answer! ";

        },
        Error: function () {
            alert('ERROR!');
        }
    });
}

function goBack() {
    window.history.back();
}