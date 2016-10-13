CREATE TABLE Activity_tbl
(
    activity_id SERIAL,
    activity varchar(50) not null,

    primary key (activity_id)
);

CREATE TABLE Log_tbl
(
	log_id SERIAL,
	activity_id integer not null,
	logDate date not null,
	distance decimal,
	activityTime varchar(10),
	sleep varchar(10),
	heartRate integer,
	description varchar(500),

	primary key	(log_id),
	foreign key (activity_id) references Activity_tbl on delete no action
);

CREATE TABLE Team_tbl
(
	team_id SERIAL,
	coach_id integer not null,
	teamName varchar(50) not null,
	teamDescription varchar(250) not null,
	isRestricted boolean not null,

	primary key (team_id)
);

CREATE TABLE Shoe_tbl
(
	shoe_id SERIAL,
	shoeName varchar(50) not null,
	maxMileage decimal,
	currentMileage decimal not null,
	purchaseDate date,
	isRetired boolean not null,
	currentShoe boolean not null,

	primary key (shoe_id)
);

CREATE TABLE PersonalRecord_tbl
(
	pr_id SERIAL,
	prTime varchar(10) not null,
	prEvent varchar(50) not null,
	prDate date,

	primary key (pr_id)
);

CREATE TABLE DeviceInfo_tbl
(
	device_id SERIAL,
	deviceName varchar(25) not null,

	primary key (device_id)
);

CREATE TABLE Person_tbl
(
    person_id SERIAL,
    shoe_id integer,
    team_id integer,
    device_id integer,
    pr_id integer,
    username varchar(25) not null,
    password varchar(64) not null,
    email varchar(50) not null,
    sex varchar(6) not null,
    firstname varchar(25) not null,
    lastname varchar(40) not null,
    isPublic boolean not null,
    isCoach boolean not null,
    birthdate date not null,

    primary key (person_id),
    foreign key (shoe_id) references Shoe_tbl on delete no action,
    foreign key (team_id) references Team_tbl on delete no action,
    foreign key (pr_id) references PersonalRecord_tbl on delete no action,
    foreign key (device_id) references DeviceInfo_tbl on delete no action
);

ALTER TABLE Team_tbl ADD FOREIGN KEY (coach_id) references Person_tbl

--Add Autoincrement sequences
CREATE SEQUENCE person_id_seq;
ALTER TABLE person_tbl ALTER person_id set default nextval('person_id_seq');
--Select setval('person_id_seq', 1);

CREATE SEQUENCE shoe_id_seq;
ALTER TABLE shoe_tbl ALTER shoe_id set default nextval('shoe_id_seq');
--Select setval('shoe_id_seq', 1);

CREATE SEQUENCE activity_id_seq;
alter table activity_tbl alter activity_id set default nextval('activity_id_seq');
--Select setval('activity_id_seq', 1);

CREATE SEQUENCE log_id_seq;
alter table log_tbl alter log_id set default nextval('log_id_seq');
--Select setval('log_id_seq', 1);

CREATE SEQUENCE team_id_seq;
alter table team_tbl alter team_id set default nextval('team_id_seq');
--Select setval('team_id_seq', 1);

CREATE SEQUENCE personalrecord_id_seq;
ALTER TABLE personalrecord_tbl ALTER pr_id SET default nextval('personalrecord_id_seq');
--Select setval('personalrecord_id_seq', 1);

CREATE SEQUENCE device_id_seq;
ALTER TABLE deviceinfo_tbl ALTER device_id SET default nextval('device_id_seq');
--Select setval('device_id_seq', 1);
