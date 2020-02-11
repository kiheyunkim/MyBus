const mysql = require('mysql');
const fs = require('fs');
const connectionInfo = JSON.parse(fs.readFileSync(__dirname+ '/../../AuthInfo/connectionInfo.json',{encoding:'UTF-8'}));

const connection = mysql.createConnection({
    host     : connectionInfo.host,
    port     : connectionInfo.port,
    user     : connectionInfo.user,
    password : connectionInfo.password,
    database : connectionInfo.database,
    endConnectionOnClose: true
});

const ToMysqlArray = (...arr)=>{
    return "('" + arr.join("','") + "')";
}

let QueryTask = (query,prepared) =>{
    return new Promise((resolve,reject)=>{
        connection.query(query,prepared,(error,result,field)=>{
            if(error){
                reject(error);
            }else{
                resolve(result);
            }
        });
    })
}

let GetSqlResult = async (query,prepared )=>{
    console.log(query);
    return await QueryTask(query,prepared);
}

let DoRollBack = ()=>{
    connection.rollback();
}
//async는 리턴을 하면 항상 promise를 리턴한다
//위에서 넘어온 result를 그냥 출력하려 하면 안된다
//위의 result를 받고 나서는 then으로 기다림을 해줘야한다.

exports.GetSqlResult = GetSqlResult;
exports.DoRollBack=DoRollBack;
exports.ToMysqlArray = ToMysqlArray;