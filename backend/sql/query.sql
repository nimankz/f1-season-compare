use f1db;
-- SELECT with WHERE and ORDER BY
SELECT name, nationality FROM Driver WHERE nationality = 'GBR' ORDER BY name;

-- JOIN with Subquery
SELECT d.name
FROM Driver d
WHERE d.driver_number IN (SELECT driver_number FROM Result WHERE position = 1);

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

-- Stored Procedure
DELIMITER //
CREATE PROCEDURE GetDriverPoints(IN driverId VARCHAR(50))
BEGIN
    SELECT d.name, SUM(r.points) as total_points
    FROM Driver d
             JOIN Result r ON d.driver_number = r.driver_number
    WHERE d.id = driverId
    GROUP BY d.name;
END //
DELIMITER ;

-- Trigger
# DELIMITER //
# CREATE TRIGGER CheckYear
#     BEFORE INSERT ON Car
#     FOR EACH ROW
# BEGIN
#     IF NEW.year < 1950 THEN
#         SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Year must be >= 1950';
#     END IF;
# END //
# DELIMITER ;