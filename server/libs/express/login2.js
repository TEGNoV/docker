const users = [{
    id: 'flo',
    username: 'flo',
    password: 'sun124'
}]

const uuid = require("uuid");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const cors = require('cors')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const login = async (app) => {
    app.use(function (req, res, next) {
      
        res.header("Access-Control-Allow-Credentials", true);
        res.header("Access-Control-Allow-Origin", req.headers.origin);
        res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
        res.header(
            "Access-Control-Allow-Headers",
            "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
        );
        if ("OPTIONS" == req.method) {
            res.send(200);
        } else {
            next();
        }
    });


    // configure passport.js to use the local strategy
    passport.use(new LocalStrategy({
        usernameField: 'username'
    },
        (username, password, done) => {
            // here is where you make a call to the database
            // to find the user based on their username or username address
            // for now, we'll just pretend we found that it was users[0]
            const user = users[0]
            if (username === user.username && password === user.password) {
                return done(null, user)
            }
        }
    ));

    // tell passport how to serialize the user
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        const user = users[0].id === id ? users[0] : false;
        done(null, user);
    });

    var bodyParser = require('body-parser')
    app.use(bodyParser.urlencoded({
        extended: false
    }))
  

    // add & configure middleware
    app.use(bodyParser.urlencoded({
        extended: false
    }))
    app.use(bodyParser.json())
    app.use(session({
        genid: (req) => {
            return uuid.v4() // use UUIDs for session IDs
        },
        cookie: { maxAge: 600000 },
        store: new FileStore(),
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true
    }))
    app.use(passport.initialize());
    app.use(passport.session());


    app.get('/api/logout', (req, res) => {
        if (req.isAuthenticated()) {
            req.logout()
        } else {
            console.log("kein login!")
        }
    })

    app.get('/api/login', (req, res) => {
        console.log("hier 1 appi login")
    })

    app.get('/api/authi', (req, res) => {
        if (req.isAuthenticated()) {
            res.send({ auth: true })
        } else {
            res.send({ login: "nope" })
        }
    })

    app.post('/api/login', (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            req.login(user, (err) => {
                res.send({ auth: true })
            })
        })
            (req, res, next);
    })
}
exports.login = login;