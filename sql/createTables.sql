--Creating Primary tables Activity, Log, Team, Shoe, PersonalRecord, Device, and Person
CREATE TABLE Activity_tbl
(
    activity_id SERIAL primary key,
    activity varchar(50) not null,

    primary key (activity_id)
);

CREATE TABLE Log_tbl
(
	log_id SERIAL primary key,
  person_id integer not null,
	activity_id integer not null,
	logDate date not null,
	distance decimal,
	activityTime varchar(10),
	sleep varchar(10),
	heartRate integer,
  logTitle varchar(30),
	description varchar(500),

	foreign key (activity_id) references Activity_tbl on delete no action,
  foreign key (person_id) references Person_tbl on delete no action
);

CREATE TABLE Team_tbl
(
	team_id SERIAL primary key,
	teamName varchar(50) not null,
	teamDescription varchar(250) not null,
	isRestricted boolean not null
);

CREATE TABLE Shoe_tbl
(
	shoe_id SERIAL primary key,
  person_id integer not null,
	shoeName varchar(50) not null,
	maxMileage decimal,
	currentMileage decimal not null,
	purchaseDate date,
	isRetired boolean not null,
	currentShoe boolean not null,

  foreign key (person_id) references Person_tbl on delete no action
);

CREATE TABLE PersonalRecord_tbl
(
	pr_id SERIAL primary key,
  person_id integer not null,
	prTime varchar(10) not null,
	prEvent varchar(50) not null,
	prDate date,

  foreign key (person_id) references Person_tbl on delete no action
);

CREATE TABLE DeviceInfo_tbl
(
	device_id SERIAL primary key,
  person_id integer not null,
	deviceName varchar(25),
	data jsonb,

  foreign key (person_id) references Person_tbl on delete no action
);

CREATE TABLE Person_tbl
(
    person_id SERIAL primary key,
    username varchar(25) not null,
    password varchar(64) not null,
    email varchar(50) not null,
    sex varchar(6) not null,
    firstname varchar(25) not null,
    lastname varchar(40) not null,
    isPublic boolean not null,
    birthdate date not null
);

--Creating associative tables for Person and Log, Team, Shoe, PR, Device
CREATE TABLE Person_Team_tbl
(
  person_id integer not null,
  team_id integer not null,
  isCoach boolean not null,

  foreign key (person_id) references Person_tbl on delete cascade,
  foreign key (team_id) references Team_tbl on delete cascade,
  primary key (person_id, team_id)
);
