var express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const { Pool, Client } = require('pg');
const jserv = require('jservice-node')
const connectionString = 'postgres://qpqyscymjuncvz:c6f3d9bc91dfd5e1769ff500e86e626f16fd8d93af810166b9e24c14d78345dc@ec2-184-73-216-48.compute-1.amazonaws.com:5432/d7cs9hmfc9ug7c';
const PORT = process.env.PORT || 5000;

var app = express();

var jsonParser = bodyParser.json();
var urlendcodedParser = bodyParser.urlencoded({ extended: false });
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(session({
    name: 'server-session',
    secret: 'secret',
    saveUninitialized: true,
    resave: true,
    store: new FileStore()
}));

app.get('/', function (request, response) {
    response.sendFile(__dirname + '/public/home.html');
});
app.get('/selection', function (request, response) {
    
    if (request.query.style == "Jeopardy Style") {
        getJCategories(request, response);

    }
    else if (request.query.style == "Classic Style") {
        getCCategories(request, response);
    }
    
});
app.get('/question', function (request, response) {

    if (request.query.command == "Play Jeopardy") {
        var category = request.query.cat;
        var difficulty = request.query.diff;

        var options = {
            value: difficulty,
            category: category
        };
        var question = "";
        var answer = "";
        
        jserv.clues(options, function (error, result) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(result.body);
                jserv.category(category, function (errorT, responseT, resultTitle) {
                    if (!errorT && responseT.statusCode == 200) {
                        console.log(responseT, resultTitle);
                        response.render('question', ({ category: resultTitle.title, difficulty: difficulty, answer: data[0].answer, question: data[0].question, type: "Jeopardy"}));
                    }
                });
            }
            else
                response.status(500).json({ success: false, data: error });
        });
    }
    else if (request.query.command == "Play Classic") {
        var category = request.query.cat;
        var difficulty = request.query.diff;
        var getRequest = require('request');
        if (typeof request.session.score === 'undefined')
            request.session.score = 0;

        var urlReqest = "https://opentdb.com/api.php?amount=1&type=multiple&difficulty="
            + difficulty + '&category=' + category;
        getRequest(urlReqest, function (error, resp, body) {
            if (resp != null && resp.statusCode == 200) {
                response.render('questionClassic', JSON.parse(body));
            }
            else {
                console.log("Error: " + resp.statusCode);
            }
            Math.random(0, 4);
        
        });
    }

});
app.get('/answer', function (request, response) {

    if (request.query.answer == "")
        response.render('question');
    
});

app.post('/addScore', urlendcodedParser, function (request, response) {
    if (typeof request.session.username === 'undefined') {
        console.log("undefined");
        request.session.score = parseInt(request.body.score);
    }
    else
        request.session.score = parseInt(request.body.score) + parseInt(request.session.score);
    console.log(request.session.score);
    response.send({ score: request.session.score });
});        

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

function getCCategories(request, response) {
    console.log('get in function');
    var id = 0;
    getCCategoriesFromDb(id, function (error, result) {
        if (error || result == null) {
            response.status(500).json({ success: false, data: error });
        } else {
            console.log("second" + JSON.stringify(result));
            response.render('cpage', result);
        }
    });
}

function getCCategoriesFromDb(id, callback) {
    console.log("Getting person from DB with id: " + id);
    var sql = "SELECT category_id, categoryname FROM classiccategories";
    var sql1 = "SELECT diffname FROM classicdifficulty";


    const pool = new Pool({ connectionString: connectionString });
    pool.connect();

    pool.query(sql, function (err, result1) {
        pool.query(sql1, function (err, result2) {

            if (err) {
                console.log("Error in query: ")
                console.log(err);
                callback(err, null);
            }

            console.log("Found result: " + JSON.stringify(result1));
            console.log("Found result: " + JSON.stringify(result2));


            callback(null, { rows: result1.rows, rows2: result2.rows });
        });
    });

}

function getJCategories(request, response) {
    var id = 0;
    getCategoriesFromDb(id, function (error, result) {
        if (error || result == null ) {
            response.status(500).json({ success: false, data: error });
        } else {
            console.log("second" + result);
            response.render('jpage', result);
        }
    });
}

function getCategoriesFromDb(id, callback) {
    console.log("Getting person from DB with id: " + id);
    var sql = "SELECT categoryname, category_id FROM jeopardycategories";
    var sql1 = "SELECT difficultylevel, levelvalue FROM jeopardydifficulty";


    const pool = new Pool({ connectionString: connectionString });
    pool.connect();

    pool.query(sql, function (err, result1) {
        pool.query(sql1, function (err, result2) {

            if (err) {
                console.log("Error in query: ")
                console.log(err);
                callback(err, null);
            }

            console.log("Found result: " + JSON.stringify(result1));
            console.log("Found result: " + JSON.stringify(result2));


            callback(null, { rows: result1.rows, rows2: result2.rows });
        });
    });

}

function getPerson(request, response) {
    var id = request.query.id;
    getPersonFromDb(id, function (error, result) {
        if (error || result == null || result.length != 1) {
            response.status(500).json({ success: false, data: error });
        } else {
            var person = result[0];
            response.status(200).json(result[0]);
        }
    });
}

function getPersonFromDb(id, callback) {
    console.log("Getting person from DB with id: " + id);
    var sql = "SELECT * FROM person WHERE id = $1::int";

    var params = [id];

    const pool = new Pool({ connectionString: connectionString });
    pool.connect();

    pool.query(sql, params, function (err, result) {
        if (err) {
            console.log("Error in query: ")
            console.log(err);
            callback(err, null);
        }

        console.log("Found result: " + JSON.stringify(result.rows));


        callback(null, result.rows);
    });

} // end of getPersonFromDb