const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy;
//const app = require('express')();

let Addpassport = (app)=>{
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new googleStrategy({
        clientID: '586489203795-b8f2173hs2ke30dk3tqtqsra3hbneuln.apps.googleusercontent.com',
        clientSecret: '3et5-vIQHIvG5h20T2vxFSvQ',
        callbackURL: 'http://127.0.0.1:3000/login/callback'
    },
    (accessToken, refreshToken, profile, done)=> {      //로그인 되는 순간에 불러온다.
        // asynchronous verification, for effect...
        process.nextTick( ()=>{
          // To keep the example simple, the user's Google profile is returned to
          // represent the logged-in user.  In a typical application, you would want
          // to associate the Google account with a user record in your database,
          // and return that user instead.
          return done(null, profile.emails);
        });
    }));

    passport.serializeUser((user,done)=>{//값을 가져올떄(로그인 직후의 상황)
        done(null,user);
    });

    passport.deserializeUser((user,done)=>{//세션에 저장된 값을 가져올 때
        done(null,user);
    });
}

exports.Addpassport = Addpassport;