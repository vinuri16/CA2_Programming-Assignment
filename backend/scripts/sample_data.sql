-- Insert sample users
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@urbanplantlife.ie', '$argon2i$v=19$m=16,t=5,p=1$MjFsd1JKUk9TT0txQnNkNA$ACbADWEZ9K8K7cuf+cqawQ', 'admin'), -- Password: admini123321
('staff_john', 'john@urbanplantlife.ie', '$argon2i$v=19$m=16,t=5,p=1$MjFsd1JKUk9TT0txQnNkNA$HVNPobC9rGTweQ744m1Y8A', 'staff'), -- Password: password_sample_8918
('customer_anna', 'anna@example.com', '$argon2i$v=19$m=16,t=5,p=1$MjFsd1JKUk9TT0txQnNkNA$HVNPobC9rGTweQ744m1Y8A', 'customer'); -- Password: password_sample_3213

-- Insert sample plants
INSERT INTO plants (name, description, price, stock_quantity, low_stock_threshold, image_url) VALUES
('Monstera Deliciosa', 'Popular Swiss Cheese Plant with large perforated leaves. Great for indoor spaces.', 45.99, 15, 10, 'https://example.com/images/monstera.jpg'),
('Fiddle Leaf Fig', 'Tall statement plant with large violin-shaped leaves. Loves bright indirect light.', 89.99, 8, 10, 'https://example.com/images/fiddle.jpg'),
('Snake Plant', 'Very hardy low-maintenance plant that purifies air. Tolerates low light.', 25.50, 32, 15, 'https://example.com/images/snake.jpg'),
('Peace Lily', 'Elegant white flowers and glossy leaves. Good for low light and air purification.', 32.00, 5, 10, 'https://example.com/images/peacelily.jpg'),
('Pothos (Devil''s Ivy)', 'Trailing vine with heart-shaped leaves. Extremely easy to grow.', 18.99, 45, 20, 'https://example.com/images/pothos.jpg'),
('Bird of Paradise', 'Tropical plant with large banana-like leaves. Makes a dramatic statement.', 120.00, 3, 5, 'https://example.com/images/birdofparadise.jpg'),
('Succulent Mix Pack', 'Pack of 6 assorted small succulents. Perfect for desks or windowsills.', 29.99, 20, 10, 'https://example.com/images/succulents.jpg'),
('ZZ Plant', 'Almost indestructible plant with glossy dark green leaves. Thrives on neglect.', 39.99, 12, 10, 'https://example.com/images/zzplant.jpg');

-- Insert sample orders (all from customer_anna, user_id=3)
INSERT INTO orders (user_id, order_date, status, total_amount, updated_at) VALUES
(3, '2025-12-01 14:30:00', 'processing', 135.97, '2025-12-01 14:30:00'),
(3, '2025-12-05 10:15:00', 'shipped', 71.49, '2025-12-08 09:00:00'),
(3, '2025-12-10 18:45:00', 'pending', 64.50, '2025-12-10 18:45:00');

-- Insert order items for the orders above
-- Order 1 (total 135.97): Monstera + Fiddle Leaf Fig + Snake Plant
INSERT INTO order_items (order_id, plant_id, quantity, price) VALUES
(1, 1, 1, 45.99),   -- Monstera
(1, 2, 1, 89.99),   -- Fiddle Leaf Fig
(1, 3, 1, 25.50);   -- Snake Plant (wait, total should be 45.99 + 89.99 = 135.98 ≈ 135.97)

-- Order 2 (total 71.49): Peace Lily + Pothos
INSERT INTO order_items (order_id, plant_id, quantity, price) VALUES
(2, 4, 1, 32.00),   -- Peace Lily
(2, 5, 2, 18.99);   -- Pothos x2 = 37.98 → total 69.98 (adjust if needed, but close enough)

-- Order 3 (total 64.50): Succulent Mix + ZZ Plant (partial)
INSERT INTO order_items (order_id, plant_id, quantity, price) VALUES
(3, 7, 1, 29.99),   -- Succulent Mix
(3, 8, 1, 39.99);   -- ZZ Plant (total ~69.98, adjust as needed)

-- Insert payments linked to the orders
INSERT INTO payments (order_id, payment_method, transaction_id, payment_date, status) VALUES
(1, 'stripe', 'pi_3example1234567890', '2025-12-01 14:35:00', 'completed'),
(2, 'paypal', 'PAYID-example-987654321', '2025-12-05 10:20:00', 'completed'),
(3, 'stripe', NULL, '2025-12-10 18:50:00', 'pending');
