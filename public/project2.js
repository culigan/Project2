
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

function getJQuestion() {
    var questions = JSON.parse(document.getElementById('all').value); 
    document.getElementById('jeopardy').disabled = false;
    $.ajax({
        url: '/getIndex',
        type: "POST",
        success: function (data) {
            document.getElementById('quest').value = questions[data.index].question;
            document.getElementById('hanswer').value = questions[data.index].answer;
            document.getElementById('textans').value = "";
        },
        Error: function () {
            alert('ERROR!');
        }
    });

}
/*function getJeopardy(cat, diff) {
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
}*/

function getJAnswer() {
    var checked = true;
    document.getElementById('jeopardy').disabled = true;
    try {
        var apiAnswer = document.getElementById('hanswer').value.toUpperCase();
        var playerAnswer = document.getElementById('textans').value.toUpperCase();
        var pointValue = document.getElementById('diffvalue').value;
        var score = 0;

        if (playerAnswer == apiAnswer) {
            score = parseInt(pointValue);
        }
        else
            checked = false;
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
    document.getElementById('jeopardy').disabled = true;

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
        }A
    });
}

function newQuestion() {
    document.getElementById('jeopardy').disabled = false;
    location.reload();
    
   
}

function initialize() {
    clrRadio();
    findQuotes("&amp;quot;", "\"");
    findQuotes("&amp;#039;", "'");
    //findApost();
}

function findQuotes(valueToRepl, replaceValue) {
    var zero = document.getElementById('textans0').innerHTML;
    var one = document.getElementById('textans1').innerHTML;
    var two = document.getElementById('textans2').innerHTML;
    var four = document.getElementById('textans4').innerHTML;
    var quest = document.getElementById('quest').innerHTML;
    while (quest.search(valueToRepl) != -1) {
        document.getElementById('quest').innerHTML = document.getElementById('quest').innerHTML.replace(valueToRepl, replaceValue);
        quest = document.getElementById('quest').innerHTML;
    }
    while (zero.search(valueToRepl) != -1) {
        document.getElementById('textans0').innerHTML = document.getElementById('textans0').innerHTML.replace(valueToRepl, replaceValue);//&#039&amp;quot;
        zero = document.getElementById('textans0').innerHTML;
    }
    while (one.search(valueToRepl) != -1) {
        document.getElementById('textans1').innerHTML = document.getElementById('textans1').innerHTML.replace(valueToRepl, replaceValue);
        one = document.getElementById('textans1').innerHTML;
    }
    while (two.search(valueToRepl) != -1) {
        document.getElementById('textans2').innerHTML = document.getElementById('textans2').innerHTML.replace(valueToRepl, replaceValue);
        two = document.getElementById('textans2').innerHTML;
    }
    while (four.search(valueToRepl) != -1) {
        document.getElementById('textans4').innerHTML = document.getElementById('textans4').innerHTML.replace(valueToRepl, replaceValue);
        four = document.getElementById('textans4').innerHTML;
    }
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