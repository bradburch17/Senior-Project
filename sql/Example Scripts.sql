select p.username, t.teamname from person_tbl AS p, team_tbl as t where p.person_id in (select person_id from person_team_tbl) and t.team_id in (select team_id from person_team_tbl)

select p.username, l.*, t.teamname from person_tbl AS p, team_tbl as t, log_tbl as l where p.person_id in (select person_id from person_team_tbl) and t.team_id in (select team_id from person_team_tbl) and p.person_id in (select person_id from person_log_tbl) and l.log_id in (select log_id from person_log_tbl)

SELECT p.username, json_agg(json_build_array(l.*, a.activity)) as logs
FROM person_log_tbl pl
INNER JOIN person_tbl p ON pl.person_id = p.person_id
INNER JOIN log_tbl l ON pl.log_id = l.log_id
INNER JOIN activity_tbl a ON l.activity_id = a.activity_id
GROUP BY p.username;



select p.username, p.sex, p.birthdate, p.firstname, p.lastname, t.teams, s.shoes, pr.prs, d.devicename
from person_tbl p
left join person_team_tbl tp  on tp.person_id = p.person_id
left join lateral  (select  json_agg(json_build_object('team', t.* )) as teams
                                from    team_tbl t
                                where   tp.team_id = t.team_id
                                ) t on true

            left join lateral  (select  json_agg(json_build_object('shoe', s.* )) as shoes
                                from    shoe_tbl s
                                where   s.person_id = p.person_id
                                ) s on true


            left join lateral  (select  json_agg(json_build_object('pr'  , pr.*)) as prs
                                from    personalrecord_tbl pr
                                where   pr.person_id = p.person_id
                                ) pr on true
	   left join           deviceinfo_tbl      d   on d.person_id     = p.person_id;



		 SELECT p.username, p.sex, p.birthdate, p.firstname, p.lastname, json_agg(json_build_object('team', t.*)) as teams, json_agg(json_build_object('shoe', s.*)) as shoes, json_agg(json_build_object('pr', pr.*)) as prs, d.devicename FROM person_tbl p
		 LEFT JOIN person_team_tbl tp ON tp.person_id = p.person_id
		 LEFT JOIN team_tbl t ON tp.team_id = t.team_id
		 LEFT JOIN shoe_tbl s on s.person_id = p.person_id
		 LEFT JOIN personalrecord_tbl pr on pr.person_id = p.person_id
		 LEFT JOIN deviceinfo_tbl d on d.person_id = p.person_id
		 WHERE p.person_id = 1
		 GROUP BY p.username, p.sex, p.birthdate, p.firstname, p.lastname, d.devicename
