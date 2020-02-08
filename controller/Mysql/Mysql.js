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

const queryContents=(query,returnType)=>{query,returnType};

const PreparedStatementParamMaker = (...arg)=>[...arg]

const queryList={
    'RequestTime':queryContents(`select date_format(departDate,'%Y-%m-%d') from buslist GROUP BY departDate ORDER BY departDate ASC;`,
    `date_format(departDate,'%Y-%m-%d')`),

    'RequestBusList':queryContents(`select * from buslist where date_format(departDate,'%Y-%m-%d')=date_format( ? ,'%Y-%m-%d');`,
    `date_format(departDate,'%Y-%m-%d')`),

    'RequestEmptySeat':queryContents(`SELECT busSeat FROM reservation WHERE busNumber = ?\
    AND date_format(bus_date,'%Y-%m-%d') = date_format(?,'%Y-%m-%d');`,'busSeat')
};

let QueryTask = (query,prepared) =>{
    return new Promise((resolve,reject)=>{
        connection.query(query,prepared,(error,result,field)=>{

            let resultArr = [];
            let resultAttr = [];

            for(let i=0;i<field.length;++i){
                resultAttr.push(field[i]['name']);
            }

            for(let i=0;i<result.length;++i){
                let json = {};
                for(let j =0;j<field.length;++j){
                    json[field[j]['name']] = result[i][field[j]['name']];
                }

                resultArr.push(json);
            }   

            if(error){
                console.log(error);
                reject('error');
            }else{
                //resolve({attr:resultAttr,result:resultArr});
                resolve(result);
            }
        });
    })
}

let GetSqlResult = async (query,prepared )=>{
    //console.log(query);
    return await QueryTask(query,prepared);
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

        connection.commit();
    });
};

exports.GetSqlResult = GetSqlResult;
exports.queryList=queryList;