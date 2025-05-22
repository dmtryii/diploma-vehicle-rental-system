
-- INSERT admin
INSERT INTO users (id, username, email, password_hash, first_name, last_name, gender, birthday, deleted, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'admin',
    'admin@default.com',
    '$2a$10$24wHW7f0D/p9sAkcgbcpeeVEYzrhNp9mjN72XJ9jsy2b5jsyj3WKy',
    'Admin',
    'Admin',
    'MALE',
    '2000-01-01',
    false,
    now(),
    now()
);

WITH user_id AS (
    SELECT id FROM users WHERE username = 'admin'
), role_id AS (
    SELECT id FROM roles WHERE name = 'ROLE_ADMIN'
)
INSERT INTO users_roles (user_id, role_id)
SELECT user_id.id, role_id.id FROM user_id, role_id;


-- INSERT manager
INSERT INTO users (id, username, email, password_hash, first_name, last_name, gender, birthday, deleted, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'manager',
    'manager@gmail.com',
    '$2a$10$24wHW7f0D/p9sAkcgbcpeeVEYzrhNp9mjN72XJ9jsy2b5jsyj3WKy',
    'Manager',
    'Manager',
    'MALE',
    '2000-01-01',
    false,
    now(),
    now()
);

WITH user_id AS (
    SELECT id FROM users WHERE username = 'manager'
), role_id AS (
    SELECT id FROM roles WHERE name = 'ROLE_MANAGER'
)
INSERT INTO users_roles (user_id, role_id)
SELECT user_id.id, role_id.id FROM user_id, role_id;


-- INSERT user
INSERT INTO users (id, username, email, password_hash, first_name, last_name, gender, birthday, deleted, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'dmtryii',
    'dmtryii@gmail.com',
    '$2a$10$24wHW7f0D/p9sAkcgbcpeeVEYzrhNp9mjN72XJ9jsy2b5jsyj3WKy',
    'Dmytro',
    'Trokhymenko',
    'MALE',
    '2002-10-04',
    false,
    now(),
    now()
);

WITH user_id AS (
    SELECT id FROM users WHERE username = 'dmtryii'
), role_id AS (
    SELECT id FROM roles WHERE name = 'ROLE_USER'
)
INSERT INTO users_roles (user_id, role_id)
SELECT user_id.id, role_id.id FROM user_id, role_id;
