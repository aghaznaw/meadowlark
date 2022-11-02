
var express = require('../../');
var app = express();
var fortune = require('./lib/fortune.js');

//Set up handlebars view engine
var handlebars = require('express3-handlebars').
                 create({defaultLayout: 'main',
                 helpers: {
                   section: function(name, options){
                     if(!this._sections) this._sections = {};
                     this._sections[name] = options.fn(this);
                     return null;
                   }
                 }
                });

var formidable = require('formidable');

app.use(require('body-parser')());
app.engine('handlebars', handlebars.engine);
app.disable('x-powered-by');
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next){
  res.locals.showTests = req.query.test;
   next();
});

app.post('/contest/vacation-photo/:year/:month', function(req, res){
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files){
    if(err){
      return redirect(303, '/error');
    }
    console.log("Fields recived: ");
    console.log(fields);
    console.log("Files recived: ");
    console.log(files);
    res.redirect(303, '/thank-you');
  })
});

app.get('/contest/vacation-photo', function(req, res){
  var date = new Date();
  res.render('contest/vacation-photo', {year: date.getFullYear(),
        month: date.getMonth()});
});

app.get('/newsletter', function(req, res){
  res.render('newsletter', {csrf: 'CSRF token goes here'});
});

app.post('/process', function(req, res){
  if(req.xhr || accepts('json, html') === 'json'){
    //IF there is no problem
    res.send({success: true});
  }else{
    //If there was an error we would redirect to the error page.
    res.redirect(303, '/thank-you');
  }
});

//The function returns current weather data
function getWeatherData(){
  return {
    locations: [
      {
        name: 'Portland',
        forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
        iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
        weather: 'Overcast',
        temp: '54.1 F (12.3 C)',

      },
      {
        name: 'Bend',
        forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
        iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
        weather: 'Partly Cloudy',
        temp: '55.0 F (12.8 C)',
      },
      {
        name: 'Manzanita',
        forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
        iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
        weather: 'Light Rain',
        temp: '55.0 F (12.8 C)',
      },
    ],
  };
}

//The middleware inject the data into res.locals.partials object
app.use(function(req, res, next){
  if(!res.locals.partials) res.locals.partials = {};
  res.locals.partials.weather = getWeatherData();
  next();
});

app.use(function(req, res, next){
  res.locals.partials.calc = "There are several ways to calculate the numbers";
  next();
});

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/headers', function(req, res){
  res.set('Content-type', 'text/plian');
  var s = '';
  for(var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
  res.send(s);
});

app.get('/about', function(req, res) {

  res.render('about', {fortune: fortune.getFortune(),
                      pageTestScript: '/qa/tests-about.js',
                    testsFortune: '/qa/tests-unit.js'});
});

app.get('/tours/hood-river', function(req, res){
  res.render('tours/hood-river');
})

app.get('/tours/request-group-rate', function(req, res){
  res.render('tours/request-group-rate');
})

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
