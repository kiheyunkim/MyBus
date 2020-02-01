const CommonRouter = require('express').Router();

CommonRouter.all('/*',(request,response,next)=>{    //이영역은 모든 접근이 세션이 인증 되어있어야함.
    if(request.session.passport === undefined){     //만료 판단
        if ((request.header('X-Requested-With') !== null &&      //Ajax로 온것인가.
        (request.header('X-Requested-With')).toLowerCase() === 'xmlhttprequest') ||
        request.header('ORIGIN') !== null){
            response.json({'message':'unAutherized'});
            return;
        }else{
            response.redirect('/');
            return;
        }
    }

    next();
})

CommonRouter.get('/logout', (request, response)=>{
    request.logOut();
    request.session.destroy((err)=>{
        response.redirect(302,'/');
    })
});

CommonRouter.post('/addRequest',(request,response)=>{
    console.log(request.body);


    response.json({'message':'ok'});
})

module.exports = CommonRouter;