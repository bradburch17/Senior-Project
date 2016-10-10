CREATE TABLE Activity_tbl
(
    activity_ID integer not null,
    activity varchar(50) not null,

    primary key (activity_ID)
);

CREATE TABLE Log_tbl
(
  person_id integer not null,
	log_ID integer not null,
	activity_ID integer not null,
	logDate date not null,
	distance decimal not null,
	activityTime time not null,
	sleep time not null,
	heartRate integer not null,
	description varchar(500) not null,

	primary key	(log_ID),
	foreign key (activity_ID) references Activity_tbl on delete no action
);

CREATE TABLE Team_tbl
(
  person_id integer not null,
	team_ID integer not null,
	coach_ID integer not null,
	teamName varchar(50) not null,
	teamDescription varchar(250) not null,
	isRestricted boolean not null,

	primary key (team_ID)
);

CREATE TABLE Shoe_tbl
(
  person_id integer not null,
	shoe_ID integer not null,
	shoeName varchar(50) not null,
	maxMileage decimal,
	currentMileage decimal not null,
	purchaseDate date,
	isRetired boolean not null,
	currentShoe boolean not null,

	primary key (shoe_ID)
);

CREATE TABLE PersonalRecord_tbl
(
  person_id integer not null,
	pr_ID integer not null,
	prTime varchar(10) not null,
	prEvent varchar(50) not null,
	prDate date not null,

	primary key (pr_ID)
);

CREATE TABLE DeviceInfo_tbl
(
  person_id integer not null,
	device_ID integer not null,
	deviceName varchar(25) not null,

	primary key (device_ID)
);

CREATE TABLE Person_tbl
(
    person_ID integer not null,
    shoe_ID integer,
    team_ID integer,
    device_ID integer,
    pr_ID integer,
    username varchar(25) not null,
    password varchar(64) not null,
    email varchar(50) not null,
    sex varchar(6) not null,
    isPublic boolean not null,
    isCoach boolean not null,
    birthdate date not null,

    primary key (person_ID),
    foreign key (shoe_ID) references Shoe_tbl on delete no action,
    foreign key (team_ID) references Team_tbl on delete no action,
    foreign key (pr_ID) references PersonalRecord_tbl on delete no action,
    foreign key (device_ID) references DeviceInfo_tbl on delete no action
);

ALTER TABLE Team_tbl ADD FOREIGN KEY (coach_ID) references Person_tbl
