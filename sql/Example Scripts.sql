INSERT INTO personalrecord_tbl (pr_ID, prTime, prEvent, prDate)
	VALUES (2, '5:20', 'Mile', '2016-05-24');

INSERT INTO personalrecord_tbl (pr_id, prTime, prEvent, prDate)
	VALUES (3, '12:15', '3k', '2015-06-19');

ALTER TABLE deviceinfo_tbl ADD person_id integer

CREATE SEQUENCE person_id_seq;
alter table person_tbl alter person_id set default nextval('person_id_seq');
Select setval('person_id_seq', 4 ); --set to the highest current value of playerID

UPDATE deviceinfo_tbl
SET person_id = 1

SELECT p.*, t.*, s.*, row_to_json(pr.*) as prs, d.* FROM person_tbl AS p
	JOIN team_tbl AS t on p.team_id = t.team_id
	JOIN shoe_tbl AS s on p.shoe_id = s.shoe_id
	JOIN personalrecord_tbl AS pr on p.pr_id = pr.pr_id
	JOIN deviceinfo_tbl AS d on p.device_id = d.device_id
	WHERE p.person_id = 1 AND s.currentshoe = TRUE

--Add person 2 back after Delete
	INSERT INTO Person_tbl (person_id, shoe_id, team_id, device_id, pr_id, username, password, email, sex, ispublic, iscoach, birthdate, firstname, lastname)
		VALUES (2, 1, 1, 1, 1, 'brad', 'pass', 'bburch@salesforce.com', 'male', FALSE, FALSE, '1994-03-26', 'Brad', 'Lewis')
