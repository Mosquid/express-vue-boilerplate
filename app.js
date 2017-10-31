const express     = require('express')
const path        = require('path')
const app         = express()
const http        = require('http')
const httpServer  = http.createServer(app).listen(5000)
const logger      = require('morgan')
const htmlRender  = require('ejs')
const session     = require('express-session')
const serveStatic = require('serve-static')

app.engine('html', htmlRender.renderFile)
app.use(serveStatic('public'))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'html')

app.use(session({
	secret: 'anystringoftext',
	saveUninitialized: true,
	resave: true
}))

app.use(logger('dev'));

app.get('/', function(req, res, next) {
  res.render('index', { done: true })
})
