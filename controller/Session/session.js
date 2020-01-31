const sha256 = require('sha256');
const session = require('express-session');
const  MySQLStore = require('express-mysql-session')(session);

exports.AddMysqlSession = (app)=>{
    var options = {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'toor',
      clearExpired:true,
      database: 'session_test2',
      endConnectionOnClose: true,
    };
    
    var sessionStore = new MySQLStore(options);
    
    app.use(session({
      resave : false,
      saveUninitialized : false,
      secret : sha256((Math.random()*Math.random()*100000).toString()),
      store : sessionStore,
      cookie : { secure : false }
    }));

}