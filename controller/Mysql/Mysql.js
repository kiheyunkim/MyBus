const mysql = require('mysql');
const fs = require('fs');
const connectionInfo = JSON.parse(fs.readFileSync(__dirname+ '/connectionInfo.json',{encoding:'UTF-8'}));

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : connectionInfo.user,
    password : connectionInfo.password,
    database : 'bus',
    endConnectionOnClose: true
});

<<<<<<< HEAD
let QueryTask = (query,prepared) =>{
    return new Promise((resolve,reject)=>{
        connection.query(query,prepared,(error,result,field)=>{
=======
let QueryTask = (query) =>{
    return new Promise((resolve,reject)=>{
        connection.query(query,(error,result,field)=>{
>>>>>>> 1d51751f0c033e7cc99af4663e0a81c962830743
            if(error){
                console.log(error);
                reject('error');
            }else{
                resolve(result);
            }
        });
    })
}

<<<<<<< HEAD
let GetSqlResult = async (query,prepared )=>{
    //console.log(query);
    return await QueryTask(query,prepared);
=======
let GetSqlResult = async (query)=>{
    return await QueryTask(query);
>>>>>>> 1d51751f0c033e7cc99af4663e0a81c962830743
}
//async는 리턴을 하면 항상 promise를 리턴한다
//위에서 넘어온 result를 그냥 출력하려 하면 안된다
//위의 result를 받고 나서는 then으로 기다림을 해줘야한다.

let TransactionTask = (query)=>{
    connection.beginTransaction((error)=>{
        if(error)
            throw error;
        
        connection.query(query, (error, results, fields)=> {
            if (error) {
              return connection.rollback(()=>{
                throw error;
              })}
            });
    });
};

exports.GetSqlResult = GetSqlResult;