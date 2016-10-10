INSERT INTO personalrecord_tbl (pr_ID, prTime, prEvent, prDate) 
	VALUES (2, '5:20', 'Mile', '2016-05-24'); 

INSERT INTO personalrecord_tbl (pr_id, prTime, prEvent, prDate)
	VALUES (3, '12:15', '3k', '2015-06-19');

ALTER TABLE deviceinfo_tbl ADD person_id integer

UPDATE deviceinfo_tbl
SET person_id = 1

SELECT * FROM person_tbl AS p 
	JOIN team_tbl AS t on p.person_id = t.person_id
	JOIN shoe_tbl AS s on p.person_id = s.person_id
	GROUP BY personalrecord_tbl AS pr on p.person_id = pr.person_id
	JOIN deviceinfo_tbl AS d on p.person_id = d.person_id
	WHERE p.person_id = 1 AND s.currentshoe = TRUE