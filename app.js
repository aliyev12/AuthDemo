const express = require('express'),
    app = express(),
    env = require('dotenv').config(),
    mongoose = require('mongoose'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    request = require('request'),
    User = require('./models/user');


/*===  MONGOOSE CONNECT  ===*/
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-fxbxa.mongodb.net/${process.env.DB_NAME}`, {
    useNewUrlParser: true
});

app.use(require('express-session')({
    secret: "Some secret bunch of words",
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


/*=== ROUTES ===*/
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/secret', (req, res) => {
    res.render('secret');
});


// - AUTH ROUTES -

// Show sign up form
app.get('/register', (req, res) => {
    res.render('register');
});

// Handling user sign up
app.post('/register', (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render('register');
        } else {
            passport.authenticate('local')(req, res, () => {
                // I stopped here...
            });
        }
    });
});




/*===  RUN SERVER  ===*/
app.listen(process.env.PORT, process.env.IP, () => console.log('Server running...'));