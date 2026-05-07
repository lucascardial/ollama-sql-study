INSERT INTO users (name, email, state, city, created_at) VALUES
('Ana Souza', 'ana@example.com', 'TO', 'Palmas', CURRENT_TIMESTAMP - INTERVAL '20 days'),
('Carlos Lima', 'carlos@example.com', 'TO', 'Araguaína', CURRENT_TIMESTAMP - INTERVAL '15 days'),
('Marina Alves', 'marina@example.com', 'SP', 'São Paulo', CURRENT_TIMESTAMP - INTERVAL '10 days'),
('João Pereira', 'joao@example.com', 'GO', 'Goiânia', CURRENT_TIMESTAMP - INTERVAL '8 days'),
('Fernanda Costa', 'fernanda@example.com', 'TO', 'Gurupi', CURRENT_TIMESTAMP - INTERVAL '5 days'),
('Rafael Santos', 'rafael@example.com', 'RJ', 'Rio de Janeiro', CURRENT_TIMESTAMP - INTERVAL '4 days'),
('Bianca Rocha', 'bianca@example.com', 'MG', 'Belo Horizonte', CURRENT_TIMESTAMP - INTERVAL '3 days'),
('Lucas Martins', 'lucas@example.com', 'TO', 'Porto Nacional', CURRENT_TIMESTAMP - INTERVAL '2 days');

INSERT INTO orders (user_id, total, status, paid_at, created_at) VALUES
(1, 120.00, 'paid', CURRENT_TIMESTAMP - INTERVAL '14 days', CURRENT_TIMESTAMP - INTERVAL '15 days'),
(1, 250.00, 'paid', CURRENT_TIMESTAMP - INTERVAL '6 days', CURRENT_TIMESTAMP - INTERVAL '14 days'),
(2, 300.00, 'paid', CURRENT_TIMESTAMP - INTERVAL '4 days', CURRENT_TIMESTAMP - INTERVAL '13 days'),
(2, 80.00, 'canceled', NULL, CURRENT_TIMESTAMP - INTERVAL '3 days'),
(3, 500.00, 'paid', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '12 days'),
(4, 180.00, 'paid', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '10 day'),
(5, 90.00, 'paid', CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '9 days'),
(5, 150.00, 'pending', NULL, CURRENT_TIMESTAMP - INTERVAL '1 day'),
(6, 220.00, 'paid', CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '8 days'),
(7, 75.00, 'paid', CURRENT_TIMESTAMP - INTERVAL '9 days', CURRENT_TIMESTAMP - INTERVAL '7 days'),
(8, 400.00, 'paid', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day');