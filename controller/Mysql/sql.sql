CREATE TABLE Reservation(
    reserv_no INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(50) NOT NULL,
    busNumber INT NOT NULL,
    busSeat INT NOT NULL,
    bus_date DATETIME NOT NULL,
    reserv_date DATETIME DEFAULT NOW()
);

CREATE TABLE BusList(
    departDate DATETIME,
    busNumber INT,
    seatUsed INT
);

CREATE TABLE prePurchase(
    busSeat INT NOT NULL,
    bus_date DATETIME,
    reserv_date DATETIME
);

INSERT INTO BusList VALUES ( DATE('2020-02-20'), 1001, 0);

<<<<<<< HEAD
INSERT INTO Reservation (email, busSeat, busNumber, bus_date) VALUES ( '123@123.com', 1, 1001, DATE('20-02-20'));
=======
INSERT INTO Reservation (email, busSeat, busNumber) VALUES ( '123@123.com', 1, 1001);
>>>>>>> 1d51751f0c033e7cc99af4663e0a81c962830743

SELECT * FROM Reservation WHERE email = '123@123.com';

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '사용할패스워드';
