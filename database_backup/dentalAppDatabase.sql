
DROP TABLE IF EXISTS `dentist_dental_procedure`;
DROP TABLE IF EXISTS `appointment`;
DROP TABLE IF EXISTS `patient`;
DROP TABLE IF EXISTS `dentist`;
DROP TABLE IF EXISTS `dental_procedure`;


/* Create table for dentist */

CREATE TABLE `dentist`
(
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `first_name` varchar(255) NOT NULL,
    `last_name` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`)
)ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

LOCK TABLES `dentist` WRITE;
INSERT INTO `dentist`(id, first_name, last_name) VALUES
(10, 'Steve', 'Martin'),
(11, 'Marty', 'Feldman'),
(12, 'Jackie', 'Chan'),
(13, 'Gene', 'Wilder'),
(14, 'Doc', 'Holliday'),
(15, 'Ellen', 'DeGeneres');
UNLOCK TABLES;

/* Create table for dental_procedure */

CREATE TABLE `dental_procedure` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `description` TEXT,
    PRIMARY KEY (`id`)
)ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=latin1;

LOCK TABLES `dental_procedure` WRITE;
INSERT INTO `dental_procedure`(id, name, description) VALUES
(100, 'Routine Dental Exam', 'If you been coming to the office at least once a year.'),
(101, 'Comprehensive Exam', 'If you have not been to the office for more than a year.'),
(102, 'Dental Consultation', 'If you have questions about your dental treatments.'),
(103, 'Routine Dental Hygiene', 'If you have your teeth clean on regular basis.'),
(104, 'Gross Debridment', 'If you have not have your teeth clean for more than a year.'),
(105, 'Unavailable', 'Scheduled time off.');
UNLOCK TABLES;

/* Create the relational table `dentist_dental_procedure` which is the
   connecting table in the many-to-many relationship between
   the dentist and dental_procedure entities
*/
 
CREATE TABLE `dentist_dental_procedure` (
    `did` int(11) NOT NULL DEFAULT '0',
    `pid` int(11) NOT NULL DEFAULT '0',
    PRIMARY KEY (`did`,`pid`),
    FOREIGN KEY (`did`) REFERENCES `dentist` (`id`),
    FOREIGN KEY (`pid`) REFERENCES `dental_procedure` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `dentist_dental_procedure` WRITE;
INSERT INTO `dentist_dental_procedure`(did,pid) VALUES 
(10,100),(10,101),(10,102),(10,103),(10,104),(10,105),
(11,102),(11,103),(11,105),
(12,100),(12,101),(12,102),(12,105),
(13,100),(13,101),(13,102),(13,103),(13,105),
(14,100),(14,101),(14,102),(14,103),(14,104),(14,105),
(15,100),(15,101),(15,102),(15,103),(15,105);
UNLOCK TABLES;


-- create table for patient 

CREATE TABLE `patient` (
    `id` INT(11) AUTO_INCREMENT PRIMARY KEY,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `phone_number` VARCHAR(15) NOT NULL,
    `did` INT NOT NULL,
    FOREIGN KEY(`did`) REFERENCES `dentist`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT = 1000 DEFAULT CHARSET=latin1;
 
LOCK TABLES `patient` WRITE;
INSERT INTO `patient`(id, first_name, last_name, phone_number,did) VALUES
(1000,'Nemo','Fish','(916)555-0192',10),
(1001,'Justin','Cobb','(916)555-0162',11),
(1002,'Peter','Falk','(916)555-0125',12),
(1003,'Jack','Singer','(916)555-0171',13),
(1004,'Peggy','Sue','(916)555-0194',14),
(1005,'Selena','Gomez','(916)555-0154',10),
(1006,'Justin','Bieber','(916)555-0114',11),
(1007,'Ariana','Grande','(916)555-0137',12),
(1008,'Taylor','Swift','(916)555-0154',13),
(1009,'Adam','Levine','(916)555-0110',14);
UNLOCK TABLES;
 
-- create table for appointment

CREATE TABLE `appointment` (
    `date` DATE NOT NULL,
    `time` TIME NOT NULL,
    `ptid` INT (11),
    `pid`INT (11) NOT NULL DEFAULT '0',
    `did` INT (11) NOT NULL DEFAULT '0',
    PRIMARY KEY(`date`,`time`,`did`),
    FOREIGN KEY(`ptid`) REFERENCES `patient` (`id`),
    FOREIGN KEY(`pid`) REFERENCES `dental_procedure` (`id`),
    FOREIGN KEY(`did`) REFERENCES `dentist`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB CHARSET=latin1;
 
LOCK TABLES `appointment` WRITE;
INSERT INTO `appointment`(date,time,ptid,pid,did) VALUES
('2019-12-13','08:00:00',1000,100,10),
('2019-12-18','08:00:00',1000,103,10),
('2020-01-06','10:00:00',1001,101,11),
('2020-01-06','11:00:00',1006,100,11),
('2019-11-11','13:00:00',1002,102,12),
('2020-03-06','14:00:00',1003,103,13),
('2019-12-04','09:00:00',1004,104,14),
('2019-12-04','09:00:00',1008,104,13),
('2019-12-05','08:00:00',NULL,105,15),
('2019-12-05','08:30:00',NULL,105,15),
('2019-12-05','09:00:00',NULL,105,15),
('2019-12-05','09:30:00',NULL,105,15),
('2019-12-05','010:00:00',NULL,105,15);
UNLOCK TABLE;
