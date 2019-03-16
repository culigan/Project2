var express = require('express');
const { Pool, Client } = require('pg');
const jserv = require('jservice-node')
const connectionString = 'postgres://qpqyscymjuncvz:c6f3d9bc91dfd5e1769ff500e86e626f16fd8d93af810166b9e24c14d78345dc@ec2-184-73-216-48.compute-1.amazonaws.com:5432/d7cs9hmfc9ug7c';
const PORT = process.env.PORT || 5000;

var app = express();

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
    response.sendFile(__dirname + '/public/home.html');
});
app.get('/selection', function (request, response) {
    
    if (request.query.style == "Jeopardy Style") {
        getJCategories(request, response);
        //response.end(response.render('jpage'));

    }
    else if (request.query.style == "Classic Style")
        response.render('cpage');
    //else if (request.query.command == "Back" || request.query.answer == "Back")
    //    response.render('home');
    
});
app.get('/question', function (request, response) {
    if (request.query.command == "Play Jeopardy") {
    
        var options = {
            value: 200,
            category: 11502,
        };
        var question = "";
        var answer = "";

        jserv.clues(options, function (error, result) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(result.body);
                response.render('question', ({ answer: data[0].answer}));
            }
            else
                response.status(500).json({ success: false, data: error });
            });
        }
    else if (request.query.style == "Classic Style")
        response.render('cpage');

});
app.get('/answer', function (request, response) {

    if (request.query.answer == "")
        response.render('question');
    
});
        
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

function getJCategories(request, response) {
    var id = 0;
    getCategoriesFromDb(id, function (error, result) {
        if (error || result == null ) {
            response.status(500).json({ success: false, data: error });
        } else {
            var rows = result;
            console.log(rows);
            response.render('jpage', rows);
        }
    });
}

function getCategoriesFromDb(id, callback) {
    console.log("Getting person from DB with id: " + id);
    var sql = "SELECT categoryname, category_id FROM jeopardycategories";


    const pool = new Pool({ connectionString: connectionString });
    pool.connect();

    pool.query(sql, function (err, result) {
        if (err) {
            console.log("Error in query: ")
            console.log(err);
            callback(err, null);
        }

        console.log("Found result: " + JSON.stringify(result));


        callback(null, result);
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