
var express = require('../../');
var app = express();

//Set up handlebars view engine
var handlebars = require('express3-handlebars').
                 create({defaultLayout: 'main'});

app.engine('handlebars', handlebars.engine);

app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.render('home');
});

var fortunes = [
  "Conquer your fears or they will conquer you.",
  "Rivers need springs.",
  "Do not fear what you don't know.",
  "You will have a pleasant surprise.",
  "Whenever possible, keep it simple.",
];

app.get('/about', function(req, res) {
  var fortune =  fortunes[Math.floor(Math.random() * fortunes.length)];
  res.render('about', {fortune: fortune});
});



// 404 catch-all handler (middleware)
app.use(function(req, res, next){
  res.status(404);
  res.render('404');
});
// 500 error handler (middleware)
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

//Custom 500 page
app.use(function(err, req, res, next){
  console.error(err.stack);

  throw Error();

  res.type('text/plain');
  res.status(500);
  res.send('500 - Server internal error!');
});


app.listen(app.get('port'), function(){
  console.log('APP is running at 127.0.0.1:'+ app.get('port') +
  ' press Ctrt+C to terminate.');
});
