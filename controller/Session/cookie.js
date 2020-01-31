const cookie = require('cookie-parser');

exports.AddCookieParse = (app)=>{
    app.use(cookie());
}