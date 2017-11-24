var express = require('express');
var router = express.Router();
var mysql = require('mysql')

var dburl = process.env.CLEARDB_DATABASE_URL;
var uri = dburl.split('/')[2]
var dbhost = uri.split('@')[1]
var dbuser = uri.split('@')[0].split(':')[0]
var dbpass = uri.split('@')[0].split(':')[1]
var dbname = dburl.split('/')[3].split('?')[0]
var pool = mysql.createPool({
  host     : dbhost,
  user     : dbuser,
  password : dbpass,
  database : dbname
});


/* GET home page. */
router.get('/', function(req, res, next) {
    pool.getConnection(function(err, connection) {
        connection.query('SELECT * FROM horarios', function(error, rows, fields) {
            connection.release();
            if(!error) {
                console.log(rows);
                res.render('index', {title: 'HWW Shiatsu', data: rows});
            }
            else {
                console.log('erro');
            }
        });
    })
});

router.post('/marcar', function(req, res, next) {
    pool.getConnection(function(err, connection) {
        connection.query(`UPDATE horarios SET nome="${req.body.nome}" WHERE horario="${req.body.horario}"`, function(error, rows, fields) {
            connection.release();
            if(!error){
                res.redirect('/');
            }
            else {
                console.log('erro');
            }
        })
    })
});

router.get('/liberar/:horario', function(req, res, next) {
    pool.getConnection(function(err, connection) {
        connection.query(`UPDATE horarios SET nome="" WHERE horario="${req.params.horario}"`, function(error, rows, fields) {
            connection.release();
            if(!error){
                res.redirect('/');
            }
            else {
                console.log('erro');
            }
        })
    })
});

module.exports = router;
