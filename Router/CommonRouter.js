const CommonRouter = require('express').Router();
const mysql = require('../controller/Mysql/Mysql');

CommonRouter.all('/*',(request,response,next)=>{            //이영역은 모든 접근이 세션이 인증 되어있어야함.
    if(request.session.passport === undefined){             //만료 판단
        if ((request.header('X-Requested-With') !== undefined && //Ajax로 온것인가.
        (request.header('X-Requested-With')).toLowerCase() === 'xmlhttprequest') ||
        request.header('ORIGIN') !== undefined){
            response.json({'message':'unAutherized'});
        }else{
            response.redirect('/');
        }
        return;
    }  
    next();
});

//첫 시간표 조회(날짜)
CommonRouter.post('/RequestTime',(request,response)=>{
    mysql.GetSqlResult(`select date_format(departDate,'%Y-%m-%d') from buslist\
     GROUP BY departDate ORDER BY departDate ASC;`).then(
        (outfulfilled)=>{
            let arr = Array.from(outfulfilled);
            let times = [];
            for(let i=0;i<arr.length;++i){
                times.push(arr[i][`date_format(departDate,'%Y-%m-%d')`  ]);
            }
            response.json({times:times});
        }   
    )
});

//날짜에 따른 버스 목록 조회
CommonRouter.post('/RequestBusList',(request,response)=>{
    let requestDate = request.body.request; 
    mysql.GetSqlResult(`select * from buslist where \
    date_format(departDate,'%Y-%m-%d')=date_format('${requestDate}','%Y-%m-%d');`).then(
        (outfulfilled)=>{
            let arr = Array.from(outfulfilled);
            let results = [];
            for(let i=0;i<arr.length;++i){
                let busNum = arr[i].busNumber;
                let leftSeat = arr[i].seatUsed;
                results.push({busNum,leftSeat});
            }
            response.json({buses:results});
        }
    );
})

//동작1 예약하는 자리들이 현재 사용중인지? ->방지됨
//동작2 예약하는 자리들이 이미 예약 되어있는지? //prepurchase에 있는가 ->방지됨
//동작3 이미 예약되어있는 경우 예비 구매 테이블을 조사하고 구매테이블에서는 기존 소유자가 시간이 지났는지 확인(10분)
CommonRouter.post('/RequestEmptySeat',(request,response)=>{
    let busNumber = request.body.busNum === undefined ? 0 : request.body.busNum;
    let selectedDate = request.body.selectDate;

    if(busNumber === 0 || selectedDate === ''){//버튼없이 누르는것 방지//2차 방식 //1차는 클라
        response.json({result:'invalidAccess'});
        return;
    }
    //예약 순간에 다른 
    mysql.GetSqlResult(`
    SELECT  busSeat 
    FROM ((SELECT busNumber, busSeat 
           FROM reservation 
           WHERE date_format(bus_date,'%Y-%m-%d') = date_format(?,'%Y-%m-%d'))
           UNION 
           (SELECT busNumber, busSeat 
           FROM prepurchase 
           WHERE TIMESTAMPDIFF(MINUTE , reserv_date, NOW()) < 10 AND 
           date_format(bus_date,'%Y-%m-%d') = date_format(?,'%Y-%m-%d') )) AS A 
    WHERE A.busNumber = ? 
    ORDER BY A.busSeat;
    `,[selectedDate, selectedDate, busNumber])
    .then(
        (outfulfilled)=>{
            request.session.selectedDate = selectedDate;
            request.session.selectBusNum = busNumber;

            let arr = Array.from(outfulfilled);
            let seat=[];
            for(let i=0;i<arr.length;++i){
                seat.push([arr[i]['busSeat']]);
            }

            response.json({used:seat});
        }
    )
});

CommonRouter.post('/PrePurchase',async (request,response)=>{
    let prePurchaseList = Array.from(request.body.selected);
    request.session.purchaseList = prePurchaseList;     //선택한 목록 저장시켜버림
    //예약은 먼저한놈이 장땡 prepurchase에 등록할 떄는 transaction을 통해서 지정하여
    //다른 query들의 접근을 막아준다. 하지만 동시쓰기 상태에서는 예약된 것이 없다고 읽을 수 있다.
    //(다른 트렌젝션이 아직 끝나지 않았는데 읽는경우에) 따라서 bustime과 busDate를 함께 묶어 유일키
    //로 만들어주어 insert시에 이미 예약된 것이면 반드시 오류가 나도록 만들어준다.
    await mysql.GetSqlResult(`START TRANSACTION`);
    
    let requestSize = prePurchaseList.length;
    let successList = [];
    let failedList = [];
    for(let i=0;i<requestSize;++i){
        try {
            await mysql.GetSqlResult(`INSERT INTO prepurchase(busSeat,busNumber,bus_date, email)   
            VALUES (?,?,?,?);`
            ,[prePurchaseList[i],request.session.selectBusNum,
            request.session.selectedDate,request.session.passport.user[0].value]);

            successList.push(prePurchaseList[i]);
        } catch (error) {   
            if(error.code === 'ER_DUP_ENTRY'){
                console.log('hi');
                //다른놈이 먹었지만 다시 획득할 수 있어 졌을때
                console.log(request.session.passport.user[0].value, request.session.selectBusNum,
                    request.session.selectBusNum, request.session.selectedDate);
                await mysql.GetSqlResult(`UPDATE prepurchase SET email = ?, reserv_date=NOW() WHERE busSeat  = ? AND
                busNumber = ? AND bus_date = DATE(?)`,[request.session.passport.user[0].value, prePurchaseList[i],
                request.session.selectBusNum, request.session.selectedDate]);          
            }
            else{
                mysql.DoRollBack();
                console.log(error); //Real Error
                failedList.push(prePurchaseList[i]);
            }
        }
    }

    await mysql.GetSqlResult('COMMIT');

    if(failedList.length === requestSize){
        response.json({state : 'failed'});  //모두 실패
    }else if(successList.length === requestSize){
        response.json({message: successList, state : 'success'});   //모두 성공
    }else{
        response.json({message: successList, state : 'partlySuccess'});//부분 성공
    }
});

//10분 경과 안된 것을 가져와서 reservation Table로 이동시킨다.
//reserv_no 뺴고 전부 그대로 옮겨와준다. 안되면 현재 시간으로 표시한다.
CommonRouter.post('/RequestReserv',(request,response)=>{
    mysql.GetSqlResult(`SELECT busNumber, busSeat, reserv_date \
    FROM Reservation WHERE email = ${request.session.passport.user[0].value}`).then(
        (outfulfilled)=>{
            console.log(outfulfilled);
        }
    )
});

//오른쪽 상단 메뉴
CommonRouter.post('/checkReservation', (request, response)=>{
    request.logOut();
    request.session.destroy((err)=>{
        response.redirect(302,'/');
    })
});

CommonRouter.get('/logout', (request, response)=>{
    request.logOut();
    request.session.destroy((err)=>{
        response.redirect(302,'/');
    })
});

module.exports = CommonRouter;
/*
이스케이프 할떄 `/ @ `/ 을 붙여줘서 쿼리를 보낸다.
근거 : https://stackoverflow.com/questions/23446377/syntax-error-due-to-using-a-reserved-word-as-a-table-or-column-name-in-mysql
*/