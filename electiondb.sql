
create database electiondb;
use electiondb;

CREATE TABLE constituency (
  constituency_id INT PRIMARY KEY AUTO_INCREMENT,
  constituency_name VARCHAR(30) NOT NULL,
  voter_count INT DEFAULT 0,
  state VARCHAR(30),
  UNIQUE KEY (constituency_name)
);


create table poll_booth (poll_booth_id int primary key, poll_booth_address varchar(30) NOT NULL, voter_count int default 0, evm_vvpat_no int unique NOT NULL ,constituency_id int NOT NULL, foreign key (constituency_id) references constituency(constituency_id));


create table voter ( aadhar_id int unique, first_name varchar(30) NOT NULL, last_name varchar(30) NOT NULL, middle_name varchar(30) default NULL, gender char(6) NOT NULL, dob date NOT NULL, age int, state varchar(30) NOT NULL, phone_no int NOT NULL, constituency_name varchar(30), foreign key (constituency_name) references constituency(constituency_name), poll_booth_id int NOT NULL, foreign key (poll_booth_id) references poll_booth(poll_booth_id), voter_id varchar(20) primary key);
create table login (aadhar_id int unique primary key, password varchar(200) NOT NULL, role varchar(20), party_name varchar(25));


delimiter //
create trigger set_voter_id before insert on voter for each row begin set NEW.voter_id = CONCAT(NEW.aadhar_id,NEW.poll_booth_id); end// 
delimiter ;

delimiter //
create trigger voter_age before insert on voter for each row begin set NEW.age = TIMESTAMPDIFF(YEAR, NEW.dob, CURDATE()); END;//

set global event_scheduler = ON//

create event update_age on schedule every 1 month do begin update voter set age = TIMESTAMPDIFF(YEAR, dob, CURDATE()); END;//

create trigger voter_age_on_update before update on voter for each row begin if NEW.dob != OLD.dob then set NEW.age = TIMESTAMPDIFF(YEAR, NEW.dob, CURDATE()); end if; end//

create trigger prevent_delete_constituency before delete on constituency for each row begin declare voters_count int; select count(*) into voters_count from voter where voter.constituency_name = OLD.constituency_name; if voters_count>0 then signal SQLSTATE '45000' set message_text = 'Cannot delete constituency when voters present in it'; end if; end//

create trigger prevent_delete_pollbooth before delete on poll_booth for each row begin declare voters_count int; select count(*) into voters_count from voter where voter.poll_booth_id = OLD.poll_booth_id; if voters_count>0 then signal SQLSTATE '45000' set message_text = 'Cannot delete poll booth when voters present in it'; end if; end//

delimiter ;

create table election (election_id int primary key, election_type char(20) NOT NULL, seats int default 0, dateofelection date, winner char(20));

create table election_cons (elec_id int, cons_id int, foreign key (elec_id) references election(election_id), foreign key (cons_id) references constituency(constituency_id) , primary key (elec_id,cons_id));

alter table election_cons add winner_c int;

delimiter //
create trigger update_seats after insert on election_cons for each row begin update election set election.seats = election.seats + 1 where election.election_id = NEW.elec_id; end;//
delimiter ;

create table official(aadhar_id int unique, first_name varchar(30) NOT NULL, last_name varchar(30) NOT NULL, middle_name varchar(30) default NULL, gender char(6) NOT NULL, dob date NOT NULL, age int, phone_no int NOT NULL, constituency_assigned varchar(30), foreign key (constituency_assigned) references constituency(constituency_name), poll_booth_assigned int, foreign key (poll_booth_assigned) references poll_booth(poll_booth_id), official_id varchar(20) primary key);

delimiter //
create trigger set_official_id before insert on official for each row begin set NEW.official_id = CONCAT(NEW.aadhar_id,'off'); end// 
delimiter ;

delimiter //
create trigger off_age before insert on official for each row begin set NEW.age = TIMESTAMPDIFF(YEAR, NEW.dob, CURDATE()); END;//

set global event_scheduler = ON//

create event update_off_age on schedule every 1 month do begin update official set age = TIMESTAMPDIFF(YEAR, dob, CURDATE()); END;//

create trigger official_age_on_update before update on official for each row begin if NEW.dob != OLD.dob then set NEW.age = TIMESTAMPDIFF(YEAR, NEW.dob, CURDATE()); end if; end//
delimiter ;

alter table official add official_rank char(25) NOT NULL;

alter table official add higher_rank_id int; 
alter table official modify column higher_rank_id varchar(20);
alter table official add foreign key (higher_rank_id) references official(official_id); 

create table party(party_name char(25) primary key, party_symbol char(10) unique, president char(30), party_funds int, headquarters char(20), seats_won int, party_leader varchar(20));

create table candidate(aadhar_id int unique, first_name varchar(30) NOT NULL, last_name varchar(30) NOT NULL, middle_name varchar(30) default NULL, gender char(6) NOT NULL, dob date NOT NULL, age int, phone_no int NOT NULL,cons_fight varchar(30), candidate_id varchar(20) primary key, foreign key (cons_fight) references constituency(constituency_name));


delimiter //
create trigger set_canidate_id before insert on candidate for each row begin set NEW.candidate_id = CONCAT(NEW.aadhar_id,'can'); end// 
delimiter ;

delimiter //
create trigger cand_age before insert on candidate for each row begin set NEW.age = TIMESTAMPDIFF(YEAR, NEW.dob, CURDATE()); END;//

set global event_scheduler = ON//

create event update_cand_age on schedule every 1 month do begin update candidate set age = TIMESTAMPDIFF(YEAR, dob, CURDATE()); END;//

create trigger cand_age_on_update before update on candidate for each row begin if NEW.dob != OLD.dob then set NEW.age = TIMESTAMPDIFF(YEAR, NEW.dob, CURDATE()); end if; end//
delimiter ;

DELIMITER //

CREATE FUNCTION total_voters(constituency_id INT) RETURNS INT
DETERMINISTIC
BEGIN
  DECLARE total INT DEFAULT 0;

  SELECT voter_count INTO total FROM constituency WHERE constituency_id = constituency_id;

  SET total = total + (
    SELECT COALESCE(SUM(total_voters(sub.constituency_id)), 0)
    FROM constituency sub
    WHERE sub.parent_constituency_id = constituency_id
  );

  RETURN total;
END //

DELIMITER ;

alter table election_cons modify winner_c varchar(20);

alter table election_cons add foreign key (winner_c) references candidate(candidate_id);

alter table voter modify constituency_name varchar(30) NOT NULL;

alter table candidate add column party_rep char(25) NOT NULL, add foreign key (party_rep) references party(party_name);

alter table party add column party_member_count int default 0;

delimiter //
create trigger add_count after insert on voter for each row begin update poll_booth set poll_booth.voter_count = poll_booth.voter_count +1 where poll_booth.poll_booth_id = NEW.poll_booth_id; update constituency set constituency.voter_count = constituency.voter_count+1 where constituency.constituency_name =  NEW.constituency_name; end//
delimiter ;

delimiter //
create trigger sub_count after delete on voter for each row begin update poll_booth set poll_booth.voter_count = poll_booth.voter_count -1 where poll_booth.poll_booth_id = OLD.poll_booth_id; update constituency set constituency.voter_count = constituency.voter_count-1 where constituency.constituency_name =  OLD.constituency_name; end//
delimiter ;

drop table election_cons;



alter table constituency add column election_id int, add foreign key(election_id) references election(election_id);
alter table constituency add column current_mla varchar(20) unique, add foreign key (current_mla) references candidate(candidate_id);

alter table voter modify phone_no varchar(10);
alter table voter modify aadhar_id varchar(5);
alter table candidate modify phone_no varchar(10);
alter table candidate modify aadhar_id varchar(5); 
alter table official modify phone_no varchar(10);
alter table official modify aadhar_id varchar(5);

GRANT SELECT, INSERT, UPDATE, DELETE ON electiondb.* TO 'official_user'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON electiondb.election TO 'official_user'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON electiondb.poll_booth TO 'official_user'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON electiondb.constituency TO 'official_user'@'localhost';

FLUSH PRIVILEGES;

insert into constituency(constituency_id,constituency_name,state) values(1,'Bangalore Urban','Karnataka') ;
insert into constituency(constituency_id,constituency_name,state) values(2,'Bangalore Rural','Karnataka');

insert into poll_booth(poll_booth_id,poll_booth_address,evm_vvpat_no,constituency_id) values(1,'Indiranagar',1,1);
insert into poll_booth(poll_booth_id,poll_booth_address,evm_vvpat_no,constituency_id) values(2,'K R Pura',12,1); 

insert into voter(aadhar_id,first_name,last_name,middle_name,gender,dob,state,phone_no,constituency_name,poll_booth_id) values ('9269','Manish','Ponnu','Kailasam','Male','2004-05-23','Karnataka','8073496504','Bangalore Urban',1);
insert into voter(aadhar_id,first_name,last_name,gender,dob,state,phone_no,constituency_name,poll_booth_id) values ('8080','Priyam','Roy','Male','2004-03-16','Karnataka','8431527126','Bangalore Urban',1);

insert into party(party_name,party_symbol,president,party_funds,headquarters) values('Bharatiya Janata Party','Lotus','J P Nadda',5000,'New Delhi');
insert into party(party_name,party_symbol,president,party_funds,headquarters) values('Aam Aadmi Party','Broom','Arvind Kejirwal',2500,'New Delhi');
insert into party(party_name,party_symbol,president,party_funds,headquarters) values('Indian National Congress','Palm','Mallikarjun Kharge',3300,'New Delhi');
insert into party(party_name,party_symbol,president,party_funds,headquarters) values('Janata Dal','Farmer','H D Devegowda',800,'Bangalore');


delimiter //
create trigger add_party after insert on candidate for each row begin update party set party.party_member_count = party.party_member_count +1 where party.party_name = NEW.party_rep; end//
delimiter ;

delimiter //
create trigger sub_party after delete on candidate for each row begin update party set party.party_member_count = party.party_member_count -1 where party.party_name = OLD.party_rep; end//
delimiter ;


INSERT INTO candidate (aadhar_id, first_name, last_name, gender, dob, phone_no, cons_fight, party_rep) 
VALUES 
    ('12345', 'Aarav', 'Gupta', 'Male', '1990-01-01', '1234567890', 'Bangalore Urban', 'Bharatiya Janata Party'),
    ('67890', 'Aditi', 'Sharma', 'Female', '1988-05-10', '2345678901', 'Bangalore Urban', 'Indian National Congress'),
    ('23456', 'Arjun', 'Patel', 'Male', '1987-09-20', '3456789012', 'Bangalore Urban', 'Janata Dal'),
    ('78901', 'Dia', 'Singh', 'Female', '1986-11-15', '4567890123', 'Mandya', 'Aam Aadmi Party'),


insert into election(election_id,election_type,dateofelection) values(1,'Lok Sabha','2023-11-17');
insert into election(election_id,election_type,dateofelection) values(2,'Assembly','2024-01-22');

alter table official modify official_rank varchar(40);

INSERT INTO official (aadhar_id, first_name, last_name, middle_name, gender, dob, phone_no, constituency_assigned, poll_booth_assigned, official_rank,higher_rank_id) VALUES
('12345', 'Aarav', 'Sharma', 'Kumar', 'Male', '1990-05-12', '9876543210', NULL, NULL, 'Chief Election Commissioner',NULL),
('23456', 'Diya', 'Patel', 'Nisha', 'Female', '1985-08-24', '8765432109', NULL, NULL, 'Election Commissioner','12345off'),
('34567', 'Ananya', 'Gupta', 'Singh', 'Female', '1982-11-03', '7654321098', 'Bangalore Urban', NULL, 'Electoral Officer','23456off'),
('45678', 'Krish', 'Kumar', 'Reddy', 'Male', '1976-04-17', '6543210987', 'Belagavi', NULL, 'Electoral Officer','23456off'),
('56789', 'Rhea', 'Shah', 'Iyer', 'Female', '1988-09-30', '5432109876', 'Bangalore Rural', NULL, 'Electoral Officer','23456off'),
('67890', 'Aryan', 'Chatterjee', 'Sinha', 'Male', '1995-02-08', '4321098765', 'Mandya', NULL, 'Electoral Officerr','23456off'),
('78901', 'Meera', 'Deshmukh', 'Kapoor', 'Female', '1979-07-21', '3210987654', 'Bangalore Urban', 1, 'Poll Booth Worker','34567off'),
('89012', 'Arjun', 'Tiwari', 'Joshi', 'Male', '1987-12-15', '2109876543', 'Belagavi', 6, 'Poll Booth Worker','45678off')

alter table candidate add constraint uniquecandcons unique (cons_fight,party_rep);


delimiter //
create procedure getconsinfo(in input_voter_id varchar(20)) begin select c.constituency_name, c.state, c.voter_count, concat(coalesce(cand.first_name,''),' ',coalesce(cand.middle_name,''),' ',coalesce(cand.last_name,'')) as candidate_name, cand.age,p.party_name,p.party_symbol from constituency c left join candidate cand on cand.cons_fight = c.constituency_name left join party p on cand.party_rep = p.party_name where cand.cons_fight in (select constituency_name from voter where voter_id = input_voter_id); end//
delimiter ;

delimiter //
create function malecount(cname varchar(30)) returns int deterministic begin declare male_count int; select sum(case when gender = 'Male' then 1 else 0 end) into male_count from voter where constituency_name = cname; return male_count; end//

create function femalecount(cname varchar(30)) returns int deterministic begin declare female_count int; select sum(case when gender = 'Female' then 1 else 0 end) into female_count from voter where constituency_name = cname; return female_count; end//

create procedure getconsdets() begin select c.constituency_name, malecount(c.constituency_name) as male_count, femalecount(c.constituency_name) AS female_count, count(distinct pb.poll_booth_id) as poll_booth_count from constituency c left join poll_booth pb on c.constituency_id = pb.constituency_id group by c.constituency_name; end//
create procedure getvoterdets() begin select aadhar_id, first_name, last_name, middle_name, gender, dob,age, state, phone_no, constituency_name, poll_booth_id, voter_id from voter; end//
create procedure getcanddets() begin select aadhar_id, first_name, last_name, middle_name, gender, dob,age, phone_no, cons_fight,candidate_id,party_rep from candidate; end//
create procedure getpartydets() begin select party_name,party_symbol,president,party_funds,headquarters,seats_won,party_member_count from party; end//
create procedure getofficialdets() begin select aadhar_id, first_name, last_name, middle_name, gender, dob, age,phone_no, constituency_assigned,poll_booth_assigned,official_id,official_rank,higher_rank_id from official; end//
delimiter ;

alter table constituency drop constraint constituency_ibfk_2;

alter table constituency drop column current_mla;
alter table party drop column party_leader;

DELIMITER //
CREATE TRIGGER increment_party_member_count
AFTER INSERT ON candidate
FOR EACH ROW
BEGIN
  UPDATE party
  SET party_member_count = party_member_count + 1
  WHERE party_name = NEW.party_rep;
END;
//
DELIMITER ;
