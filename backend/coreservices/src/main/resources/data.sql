INSERT INTO roles (role, rolename) VALUES
(1, 'User'),
(2, 'Manager'),
(3, 'Admin'),
(4, 'Guest')
ON CONFLICT (role) DO UPDATE SET rolename = EXCLUDED.rolename;

INSERT INTO menus (mid, icon, menu) VALUES
(1, 'dashboard.png', 'Dashboard'),
(2, 'mytask.png', 'My Task'),
(3, 'taskmanager.png', 'Task Manager'),
(4, 'usermanager.png', 'User Manager'),
(5, 'myprofile.png', 'My Profile')
ON CONFLICT (mid) DO UPDATE SET icon = EXCLUDED.icon, menu = EXCLUDED.menu;

INSERT INTO rolesmapping (mid, role)
SELECT 1, 1 WHERE NOT EXISTS (SELECT 1 FROM rolesmapping WHERE mid = 1 AND role = 1);
INSERT INTO rolesmapping (mid, role)
SELECT 2, 1 WHERE NOT EXISTS (SELECT 1 FROM rolesmapping WHERE mid = 2 AND role = 1);
INSERT INTO rolesmapping (mid, role)
SELECT 5, 1 WHERE NOT EXISTS (SELECT 1 FROM rolesmapping WHERE mid = 5 AND role = 1);
INSERT INTO rolesmapping (mid, role)
SELECT 1, 2 WHERE NOT EXISTS (SELECT 1 FROM rolesmapping WHERE mid = 1 AND role = 2);
INSERT INTO rolesmapping (mid, role)
SELECT 2, 2 WHERE NOT EXISTS (SELECT 1 FROM rolesmapping WHERE mid = 2 AND role = 2);
INSERT INTO rolesmapping (mid, role)
SELECT 3, 2 WHERE NOT EXISTS (SELECT 1 FROM rolesmapping WHERE mid = 3 AND role = 2);
INSERT INTO rolesmapping (mid, role)
SELECT 5, 2 WHERE NOT EXISTS (SELECT 1 FROM rolesmapping WHERE mid = 5 AND role = 2);
INSERT INTO rolesmapping (mid, role)
SELECT 1, 3 WHERE NOT EXISTS (SELECT 1 FROM rolesmapping WHERE mid = 1 AND role = 3);
INSERT INTO rolesmapping (mid, role)
SELECT 2, 3 WHERE NOT EXISTS (SELECT 1 FROM rolesmapping WHERE mid = 2 AND role = 3);
INSERT INTO rolesmapping (mid, role)
SELECT 3, 3 WHERE NOT EXISTS (SELECT 1 FROM rolesmapping WHERE mid = 3 AND role = 3);
INSERT INTO rolesmapping (mid, role)
SELECT 4, 3 WHERE NOT EXISTS (SELECT 1 FROM rolesmapping WHERE mid = 4 AND role = 3);
INSERT INTO rolesmapping (mid, role)
SELECT 5, 3 WHERE NOT EXISTS (SELECT 1 FROM rolesmapping WHERE mid = 5 AND role = 3);

INSERT INTO users (email, fullname, password, phone, role, status) VALUES
('elan77@gmail.com', 'elango', '1234', '9488363541', 3, 1),
('ravi@gmail.com', 'ravi', '1234', '989898989', 2, 1)
ON CONFLICT (email) DO UPDATE SET
fullname = EXCLUDED.fullname,
password = EXCLUDED.password,
phone = EXCLUDED.phone,
role = EXCLUDED.role,
status = EXCLUDED.status;
