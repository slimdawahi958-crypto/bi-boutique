-- 1. Création des tables
CREATE TABLE IF NOT EXISTS produits (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prix NUMERIC(10,2) NOT NULL,
  stock INT NOT NULL
);

CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  ville VARCHAR(100),
  telephone VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS ventes (
  id SERIAL PRIMARY KEY,
  produit_id INT REFERENCES produits(id),
  client_id INT REFERENCES clients(id),
  quantite INT NOT NULL,
  date_vente TIMESTAMP DEFAULT NOW()
);

-- 2. Insertion des données (Produits informatiques)
INSERT INTO produits (nom, prix, stock) VALUES 
('PC Portable HP', 2500.00, 10),
('Souris Logitech', 45.50, 50),
('Clavier Mécanique', 150.00, 20),
('Imprimante Canon', 350.00, 5),
('Câble RJ45 (5m)', 15.00, 100),
('Câble USB-C', 25.00, 30),
('Barrette RAM 16GB', 180.00, 15),
('Écran Dell 24 pouces', 450.00, 8);

-- 3. Insertion des clients
INSERT INTO clients (nom, ville, telephone) VALUES 
('Ali Ben Salah', 'Sousse', '22123456'),
('Mariem Trabelsi', 'Tunis', '98765432'),
('Ahmed Mansour', 'Sfax', '55443322');

-- 4. Insertion des ventes
INSERT INTO ventes (produit_id, client_id, quantite) VALUES 
(1, 1, 1),
(2, 2, 3),
(5, 3, 10),
(8, 1, 2);