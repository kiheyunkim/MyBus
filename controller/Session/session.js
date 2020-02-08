const fs = require('fs');
const sha256 = require('sha256');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const connectionInfo = JSON.parse(fs.readFileSync(__dirname+ '/../../AuthInfo/sessionDbInfo.json',{encoding:'UTF-8'}));

exports.AddMysqlSession = (app)=>{
    var options = {
      host : connectionInfo.host,
      port : connectionInfo.port,
      user : connectionInfo.user,
      password: connectionInfo.password,
      clearExpired : true,
      database : connectionInfo.database,
      endConnectionOnClose : true,
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