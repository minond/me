'use strict';

var express = require('express'),
    swig = require('swig'),
    app = express();

app.get('/', function (req, res) {
    res.render('index.html');
});

app.use('/public', express.static(__dirname + '/../public'));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/../views');
app.listen(process.env.PORT || 3000);
