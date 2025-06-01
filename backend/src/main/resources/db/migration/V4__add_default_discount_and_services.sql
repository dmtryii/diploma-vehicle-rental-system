INSERT INTO additional_services (id, name, price, description, created_at, updated_at, deleted)
VALUES
    (gen_random_uuid(), 'Additional Insurance', 150.00, 'Covers damage and theft protection', NOW(), NOW(), false),
    (gen_random_uuid(), 'Child Seat', 50.00, 'Suitable for children up to 4 years old', NOW(), NOW(), false),
    (gen_random_uuid(), 'GPS Navigator', 30.00, 'Navigation device for European countries', NOW(), NOW(), false);


INSERT INTO discounts (id, name, amount, start_date, end_date, created_at, updated_at, deleted)
VALUES
    (gen_random_uuid(), 'Spring Discount', 10.00, NOW(), NOW() + INTERVAL '30 days', NOW(), NOW(), false),
    (gen_random_uuid(), 'New Customer Discount', 15.00, NOW(), NOW() + INTERVAL '60 days', NOW(), NOW(), false)