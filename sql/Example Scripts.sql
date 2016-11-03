INSERT INTO personalrecord_tbl (prTime, prEvent, prDate)
	VALUES ('5:20', 'Mile', '2016-05-24');

INSERT INTO personalrecord_tbl (prTime, prEvent, prDate)
	VALUES ('12:15', '3k', '2015-06-19');


select p.username, t.teamname from person_tbl AS p, team_tbl as t where p.person_id in (select person_id from person_team_tbl) and t.team_id in (select team_id from person_team_tbl)

select p.username, l.*, t.teamname from person_tbl AS p, team_tbl as t, log_tbl as l where p.person_id in (select person_id from person_team_tbl) and t.team_id in (select team_id from person_team_tbl) and p.person_id in (select person_id from person_log_tbl) and l.log_id in (select log_id from person_log_tbl)

SELECT p.username, json_agg(json_build_array(l.*, a.activity)) as logs
FROM person_log_tbl pl
INNER JOIN person_tbl p ON pl.person_id = p.person_id
INNER JOIN log_tbl l ON pl.log_id = l.log_id
INNER JOIN activity_tbl a ON l.activity_id = a.activity_id
GROUP BY p.username;
