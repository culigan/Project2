
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

function initialize() {
    clrRadio();
    findQuotes();
    //findApost();
}

function findApost() {
    document.getElementById('textans0').innerHTML = document.getElementById('textans0').innerHTML.rep("&amp;quot;;", "\"");//&#039&amp;quot;
    document.getElementById('textans1').innerHTML = document.getElementById('textans1').innerHTML.replace("&amp;quot;", "\"");
    document.getElementById('textans2').innerHTML = document.getElementById('textans2').innerHTML.replace("&amp;quot;", "\"");
    document.getElementById('textans4').innerHTML = document.getElementById('textans4').innerHTML.replace("&amp;quot;", "\"");
    var test = document.getElementById('quest').innerHTML;
    document.getElementById('quest').innerHTML = document.getElementById('quest').innerHTML.replace("&amp;quot;", "\"");
}

function findQuotes() {
    var zero = document.getElementById('textans0').innerHTML;
    var one = document.getElementById('textans1').innerHTML;
    var two = document.getElementById('textans2').innerHTML;
    var four = document.getElementById('textans4').innerHTML;
    var test = document.getElementById('quest').innerHTML;
    var quest = document.getElementById('quest').innerHTML;
    if (quest.search("&amp;quot;") != -1) {
        document.getElementById('quest').innerHTML = document.getElementById('quest').innerHTML.replace("&amp;quot;", "\"");
        if (quest.search("&amp;quot;") != -1) {
            document.getElementById('quest').innerHTML = document.getElementById('quest').innerHTML.replace("&amp;quot;", "\"");
        }
    }
    /*= document.getElementById('textans0').innerHTML.rep("&amp;quot;;", "\"");//&#039&amp;quot;
    document.getElementById('textans0').innerHTML = document.getElementById('textans0').innerHTML.rep("&amp;quot;;", "\"");//&#039&amp;quot;
    = document.getElementById('textans1').innerHTML.replace("&amp;quot;", "\"");
    document.getElementById('textans1').innerHTML = document.getElementById('textans1').innerHTML.replace("&amp;quot;", "\"");
    = document.getElementById('textans2').innerHTML.replace("&amp;quot;", "\"");
    document.getElementById('textans2').innerHTML = document.getElementById('textans2').innerHTML.replace("&amp;quot;", "\"");
    = document.getElementById('textans4').innerHTML.replace("&amp;quot;", "\"");
    document.getElementById('textans4').innerHTML = document.getElementById('textans4').innerHTML.replace("&amp;quot;", "\"");
    */
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