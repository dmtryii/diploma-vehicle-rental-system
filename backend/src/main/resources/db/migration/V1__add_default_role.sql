INSERT INTO roles (id, name, deleted, created_at, updated_at)
VALUES (gen_random_uuid(), 'ROLE_ADMIN', false, now(), now());

INSERT INTO roles (id, name, deleted, created_at, updated_at)
VALUES (gen_random_uuid(), 'ROLE_MANAGER', false, now(), now());

INSERT INTO roles (id, name, deleted, created_at, updated_at)
VALUES (gen_random_uuid(), 'ROLE_USER', false, now(), now());