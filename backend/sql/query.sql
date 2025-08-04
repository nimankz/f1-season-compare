use f1db;
-- SELECT with WHERE and ORDER BY
SELECT name, nationality FROM Driver WHERE nationality = 'GBR' ORDER BY name;
select circuit_name, country, race_type from race where race_type = 'Sprint' order by country;


-- JOIN with Subquery
SELECT d.name
FROM Driver d
WHERE d.driver_number IN (SELECT driver_number FROM Result WHERE position = 1);

select race.country, race.race_type, season,position,points,driver_number from race join f1db.result r on race.id = r.race_id;
-- GROUP BY and HAVING
SELECT d.name, SUM(r.points) as total_points
FROM Driver d
JOIN Result r ON d.driver_number = r.driver_number
GROUP BY d.name
HAVING total_points > 100;

-- Create View
CREATE VIEW TopDrivers AS
SELECT d.name, SUM(r.points) as total_points
FROM Driver d
JOIN Result r ON d.driver_number = r.driver_number
GROUP BY d.name
ORDER BY total_points DESC
LIMIT 5;

create view result_with_season as
select race.season, result.points, result.driver_number, driver.name,race.race_type, race.country
from result join race on (result.race_id = race.id)  join driver on driver.driver_number = result.driver_number;

select driver_number, name, season ,sum(points) as final_result_season
from result_with_season
where (season = 2023)
group by name,driver_number
order by (final_result_season) desc;


select driver_number, name, season ,sum(points) as final_result_season
from result_with_season
where (season = 2024)
group by name,driver_number
order by (final_result_season) desc;



