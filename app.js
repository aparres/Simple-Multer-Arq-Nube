var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const multer = require('multer');
const fs = require('fs');

const uploadPath = "/mnt/efs/";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })

const upload = new multer({storage: storage})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res, next) {
  
  let files = [];
  fs.readdirSync(uploadPath).forEach(file => {
      console.log(file)
      files.push({fileName: file})
  });
  console.log(files)
  res.render('index', { title: 'EBS Demo', files: files });
});

app.post('/', upload.single('myFile'), function (req, res) {
  if(req.file == undefined) {
      console.log("No upload file");
      res.send("ERROR")
  }

  res.redirect("/");
});

app.get('/get/:fileName', function(req, res) {
  res.sendFile(uploadPath+req.params.fileName)
})

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});*/

module.exports = app;
