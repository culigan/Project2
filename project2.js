function getAnswer() {

}

function getQuestion(request, response) {
    var gameType = require.query.command;
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

function getAnswer() {
    $.ajax({
        url: 'localhost:5000',
        type: "GET",
        data: { user: username },
        success: function (data) {
            alert("Item has been added to the cart!");
        },
        error: function () {
            alert("ERROR!");

        }
    });
}

function goBack() {
    window.history.back();
}