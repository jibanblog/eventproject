

var express = require('express');
var http = require('http');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: true }));


var dateFormat = require('dateformat');
var now =  new Date();


app.set('view engine', 'ejs');


app.use('/js', express.static ( __dirname + '/node_modules/bootstrap/dist/js' ));
app.use('/js', express.static ( __dirname + '/node_modules/bootstrap/dist/css' ));
app.use('/js', express.static ( __dirname + '/node_modules/tether/dist/js' ));
app.use('/js', express.static ( __dirname + '/node_modules/jquery/dist' ));



const con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "mydb"
});

const siteTitle = "simple application";
const baseURL = "http://localhost:4000";

app.get('/', function (req, res) {
	con.query("SELECT * from e_events ORDER BY e_id ASC", (err, result) =>{
            
		res.render('pages/index', {
			siteTitle: siteTitle,
			pageTitle: "Event list",
			items: result
		});
	});
});


app.get('/event/add', (req, res) => {
	res.render('pages/add-event.ejs', {
		siteTitle: siteTitle,
		pageTitle: "Add New Events",
		items: ''
	});
});


app.post('/event/add', function (req, res) {
	var query = "INSERT INTO `e_events` (e_id,e_name,e_start_date,e_end_date) VALUES (";
	query += " '"+req.body.e_id+"',";
	query += " '"+req.body.e_name+"',";
	query += " '" +dateFormat(req.body.e_start_date,"yyyy-mm-dd")+"',";
	query += " '" +dateFormat(req.body.e_end_date, "yyyy-mm-dd")+"')";

	con.query(query, function (err, result) {
		res.redirect(baseURL);
	});
});


app.get('/event/edit/:e_id', function(req, res){
	con.query("SELECT * FROM e_events WHERE e_id = '"+req.params.e_id+"'",
		function(err,result){
		  result[0].e_id = result[0].e_id;
		  result[0].e_name = result[0].e_name;
          result[0].e_start_date = dateFormat(result[0].e_start_date,"yyyy-mm-dd");
          result[0].e_end_date = dateFormat(result[0].e_end_date, "yyyy-mm-dd");
	res.render('pages/edit-event', {
		siteTitle: siteTitle,
		pageTitle: "Edit Event",
		item: result
	});
		});
});



app.post('/event/edit/:e_id', function(req,res) {
	var query = "UPDATE `e_events` SET";
	query += " `e_id` = '"+req.body.e_id+"' , ";
	query += " `e_name` = '"+req.body.e_name+"' , ";
	query += " `e_start_date` = '"+req.body.e_start_date+"', ";
	query += " `e_end_date` = '"+req.body.e_end_date+"'";
	query += " WHERE `e_events`.`e_id` = "+req.body.e_id+" ";

	con.query(query, function(err, result) {
        
        if (result.affectedRows)
        {
        res.redirect(baseURL);
        }
	   
	    
		});
}); 


app.get('/event/delete/:e_id', function(req, res){
	con.query("DELETE FROM e_events WHERE e_id = ' " +req.params.e_id+ " ' ", function(err, result){
		if(result.affectedRows)
		{
			res.redirect(baseURL);
		}
	} );
});





var server = app.listen(4000, () => {
	console.log("server started on 4000...")
});