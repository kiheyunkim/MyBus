CREATE TABLE reservation(
    reserv_no INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    busNumber INT NOT NULL,
    busSeat INT NOT NULL,
    bus_date DATETIME NOT NULL,
    reserv_date DATETIME DEFAULT NOW()
);

CREATE TABLE busList(
    departDate DATETIME,
    busNumber INT,
    seatUsed INT
);

CREATE TABLE prePurchase(
    busSeat INT NOT NULL,
    busNumber INT NOT NULL,
    bus_date DATETIME,
    reserv_date DATETIME DEFAULT NOW(),
    email VARCHAR(255) NOT NULL,
    PRIMARY KEY(busSeat, busNumber)
);

INSERT INTO prepurchase(busSeat,busNumber,bus_date) VALUES (10,1001,DATE('20-02-20'));
INSERT INTO prepurchase(busSeat,busNumber,bus_date) VALUES (2,1001,DATE('20-02-20'));

INSERT INTO BusList VALUES ( DATE('2020-02-20'), 1001, 40);

INSERT INTO Reservation (email, busSeat, busNumber, bus_date) VALUES ( '123@123.com', 1, 1001, DATE('20-02-20'));

SELECT * FROM Reservation WHERE email = '123@123.com';

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '사용할패스워드';


SELECT busNumber, busSeat from reservation where busSeat NOT INT(1,2,3) AND busNumber NOT IN(1001);  #1차

SELECT A.busNumber, A.busSeat
FROM (SELECT busNumber, busSeat 
      FROM reservation 
      WHERE busSeat NOT IN(1,3) AND busNumber NOT IN(1002)) AS A
WHERE (A.busNumber, A.busSeat) NOT IN (
      (SELECT busNumber, busSeat FROM prepurchase));

-- 아래에 있는 내용이 2가지 DB에서 있는 모든 좌석을 긁어오는 SQL 템플릿
-- 시간차를 추가해야한다.
-- 추가함
SELECT  busSeat 
FROM ((SELECT busNumber, busSeat 
       FROM reservation 
       WHERE date_format(bus_date,'%Y-%m-%d') = date_format("2020-02-20",'%Y-%m-%d'))
       UNION 
       (SELECT busNumber, busSeat 
       FROM prepurchase 
       WHERE TIMESTAMPDIFF(MINUTE , reserv_date, NOW()) < 10 AND 
       date_format(bus_date,'%Y-%m-%d') = date_format("2020-02-20",'%Y-%m-%d') )) AS A 
WHERE A.busNumber = 1001 
ORDER BY A.busSeat;

SELECT  busSeat 
FROM ((SELECT busNumber, busSeat 
       FROM reservation 
       WHERE date_format(bus_date,'%Y-%m-%d') = date_format("2020-02-20",'%Y-%m-%d'))
       UNION 
       (SELECT busNumber, busSeat 
       FROM prepurchase 
       WHERE TIMESTAMPDIFF(MINUTE , reserv_date, NOW()) < 10 AND 
       date_format(bus_date,'%Y-%m-%d') = date_format("2020-02-20",'%Y-%m-%d') )) AS A 
WHERE A.busNumber = 1001 
ORDER BY A.busSeat;


START TRANSACTION;

COMMIT;
