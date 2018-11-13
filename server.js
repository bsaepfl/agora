const express = require('express')
const next = require('next')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const expressSession = require('express-session')
const passport = require('passport')
const TequilaStrategy = require('passport-tequila').Strategy

passport.serializeUser(function (user, done) {
  done(null, user)
})
passport.deserializeUser(function (obj, done) {
  done(null, obj)
})

var tequila = new TequilaStrategy({
  service: 'Agora',
  request: ['displayname', 'uniqueid'],
  allows: ['http://localhost:3000']
})
passport.use(tequila)

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
  .then(() => {
    const server = express()

    server.use(cors())
    server.use(cookieParser())
    server.use(bodyParser.urlencoded({ extended: false }))
    server.use(expressSession({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false
    }))
    server.use(passport.initialize())
    server.use(passport.session())

    server.get('/me', tequila.ensureAuthenticated, (req, res) => {
      return app.render(req, res, '/private', { user: req.user })
    })

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })
