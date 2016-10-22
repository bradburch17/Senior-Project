--Creating Primary tables Activity, Log, Team, Shoe, PersonalRecord, Device, and Person
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
    -- shoe_id integer,
    -- team_id integer,
    -- device_id integer,
    -- pr_id integer,
    username varchar(25) not null,
    password varchar(64) not null,
    email varchar(50) not null,
    sex varchar(6) not null,
    firstname varchar(25) not null,
    lastname varchar(40) not null,
    isPublic boolean not null,
    -- isCoach boolean not null,
    birthdate date not null,

    primary key (person_id)
    -- foreign key (shoe_id) references Shoe_tbl on delete no action,
    -- foreign key (team_id) references Team_tbl on delete no action,
    -- foreign key (pr_id) references PersonalRecord_tbl on delete no action,
    -- foreign key (device_id) references DeviceInfo_tbl on delete no action
);

--Adding foreign key constraint to Team table
ALTER TABLE Team_tbl ADD FOREIGN KEY (coach_id) references Person_tbl;


--Creating associative tables for Person and Log, Team, Shoe, PR, Device
CREATE TABLE Person_Log_tbl
(
  person_id integer not null,
  log_id integer not null,

  foreign key (person_id) references Person_tbl on delete cascade,
  foreign key (log_id) references Log_tbl on delete cascade,
  primary key (person_id, log_id)
);

CREATE TABLE Person_Team_tbl
(
  person_id integer not null,
  team_id integer not null,
  isCoach boolean not null,

  foreign key (person_id) references Person_tbl on delete cascade,
  foreign key (team_id) references Team_tbl on delete cascade,
  primary key (person_id, team_id)
);

CREATE TABLE Person_Shoe_tbl
(
  person_id integer not null,
  shoe_id integer not null,

  foreign key (person_id) references Person_tbl on delete cascade,
  foreign key (shoe_id) references Shoe_tbl on delete cascade,
  primary key (person_id, shoe_id)
);

CREATE TABLE Person_PR_tbl
(
  person_id integer not null,
  pr_id integer not null,

  foreign key (person_id) references Person_tbl on delete cascade,
  foreign key (pr_id) references PersonalRecord_tbl on delete cascade,
  primary key (person_id, pr_id)
);

CREATE TABLE Person_Device_tbl
(
  person_id integer not null,
  device_id integer not null,

  foreign key (person_id) references Person_tbl on delete cascade,
  foreign key (device_id) references DeviceInfo_tbl on delete cascade,
  primary key (person_id, device_id)
);
