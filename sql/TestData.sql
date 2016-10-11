INSERT INTO personalrecord_tbl (prTime, prEvent, prDate)
  VALUES ('5:20', 'Mile', '2016-05-24');

INSERT INTO personalrecord_tbl (prTime, prEvent, prDate)
  VALUES ('12:15', '3k', '2015-06-19');

INSERT INTO personalrecord_tbl (prTime, prEvent, prDate)
  VALUES ('17:51', '5k', '2016-06-19');

INSERT INTO shoe_tbl (shoename, maxmileage, currentmileage, purchasedate, isretired, currentshoe)
  VALUES ('Brooks Ravenna 6', 600, 251, '2016-05-29', FALSE, TRUE);

INSERT INTO shoe_tbl (shoename, maxmileage, currentmileage, purchasedate, isretired, currentshoe)
  VALUES ('Nike Free', 600, 251, '2016-05-29', FALSE, TRUE);

INSERT INTO activity_tbl (activity)
  VALUES ('Run');

INSERT INTO activity_tbl (activity)
  VALUES ('Bike');

  INSERT INTO activity_tbl (activity)
    VALUES ('Swim');

INSERT INTO deviceinfo_tbl (devicename)
  VALUES ('FitBit');

INSERT INTO deviceinfo_tbl (devicename)
  VALUES ('FitBit 2');

INSERT INTO Person_tbl (shoe_id, team_id, device_id, pr_id, username, password, email, sex, ispublic, iscoach, birthdate, firstname, lastname)
  VALUES (1, null, 1, 1, 'bradburch', 'password', 'bradburch77@gmail.com', 'Male', FALSE, FALSE, '1994-03-26', 'Brad', 'Burch');

INSERT INTO Person_tbl (shoe_id, team_id, device_id, pr_id, username, password, email, sex, ispublic, iscoach, birthdate, firstname, lastname)
  VALUES (2, null, 2, 3, 'cjcopeland', 'password1', 'calebcopeland@gmail.com', 'Male', FALSE, FALSE, '1995-04-06', 'CJ', 'Copeland');

INSERT INTO team_tbl (coach_id, teamname, teamdescription, isrestricted)
  VALUES (2, 'Team Tiger', 'DePauw Cross Country Team', FALSE);

UPDATE person_tbl SET team_id = 1;
