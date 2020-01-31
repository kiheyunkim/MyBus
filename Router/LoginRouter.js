const LoginRouter = require('express').Router();
const passport = require('passport');

LoginRouter.get('/',(request,response)=>{       //세션 만료 파악
    if(request.session.passport === undefined){
        response.redirect('/google');
    }else{
        response.redirect('/main.html');
    }
});

LoginRouter.get('/google',
    passport.authenticate('google', { scope: [
        'https://www.googleapis.com/auth/userinfo.email'],
        accessType: 'offline',  prompt: 'select_account'}),//approvalPrompt: 'force'
(req, res)=>{ }
// The request will be redirected to Google for authentication, so this
// function will not be called.
);

LoginRouter.get('/callback',
    passport.authenticate('google', { failureRedirect: '/loginfail' }),
    (request, response)=>{
    response.redirect("/main.html");
});





module.exports = LoginRouter;