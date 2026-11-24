const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "db",
  database: "bi_boutique",
  password: "12919751",
  port: 5432,
});
const app = express();
app.use(cors());
app.use(express.json());
const q = (sql, p) => pool.query(sql, p).then((r) => r.rows);

// ---- PRODUITS ----
app.get("/api/produits", async (req, res) =>
  res.json(await q("SELECT * FROM produits ORDER BY id")),
);
app.post("/api/produits", async (req, res) => {
  const { nom, prix, stock } = req.body;
  res.json(
    await q(
      "INSERT INTO produits(nom,prix,stock) VALUES($1,$2,$3) RETURNING *",
      [nom, prix, stock],
    ),
  );
});
app.put("/api/produits/:id", async (req, res) => {
  const { nom, prix, stock } = req.body;
  res.json(
    await q(
      "UPDATE produits SET nom=$1, prix=$2, stock=$3 WHERE id=$4 RETURNING *",
      [nom, prix, stock, req.params.id],
    ),
  );
});
app.put("/api/produits/:id/reappro", async (req, res) =>
  res.json(
    await q("UPDATE produits SET stock = stock + 10 WHERE id=$1 RETURNING *", [
      req.params.id,
    ]),
  ),
);
app.delete("/api/produits/:id", async (req, res) => {
  await q("DELETE FROM ventes WHERE produit_id=$1", [req.params.id]);
  res.json(
    await q("DELETE FROM produits WHERE id=$1 RETURNING *", [req.params.id]),
  );
});

// ---- CLIENTS ----
app.get("/api/clients", async (req, res) =>
  res.json(await q("SELECT * FROM clients ORDER BY id")),
);
app.post("/api/clients", async (req, res) => {
  const { nom, ville, telephone } = req.body;
  res.json(
    await q(
      "INSERT INTO clients(nom,ville,telephone) VALUES($1,$2,$3) RETURNING *",
      [nom, ville, telephone],
    ),
  );
});
app.delete("/api/clients/:id", async (req, res) => {
  await q("DELETE FROM ventes WHERE client_id=$1", [req.params.id]);
  res.json(
    await q("DELETE FROM clients WHERE id=$1 RETURNING *", [req.params.id]),
  );
});

// ---- VENTES ----
app.get("/api/ventes", async (req, res) =>
  res.json(
    await q(
      "SELECT v.id, p.nom AS produit, c.nom AS client, v.quantite, v.date_vente FROM ventes v JOIN produits p ON p.id=v.produit_id JOIN clients c ON c.id=v.client_id ORDER BY v.id DESC",
    ),
  ),
);
app.post("/api/ventes", async (req, res) => {
  const { produit_id, client_id, quantite } = req.body;
  await q(
    "INSERT INTO ventes(produit_id,client_id,quantite) VALUES($1,$2,$3)",
    [produit_id, client_id, quantite],
  );
  await q("UPDATE produits SET stock = stock - $1 WHERE id=$2", [
    quantite,
    produit_id,
  ]);
  res.json({ ok: true });
});

// ---- DASHBOARD (KPI) ----
app.get("/api/stats", async (req, res) => {
  const [kpi] = await q(
    "SELECT COALESCE(SUM(v.quantite*p.prix),0) AS ca, COUNT(*) AS nb FROM ventes v JOIN produits p ON p.id=v.produit_id",
  );
  const [top] = await q(
    "SELECT p.nom FROM ventes v JOIN produits p ON p.id=v.produit_id GROUP BY p.nom ORDER BY SUM(v.quantite) DESC LIMIT 1",
  );
  res.json({ ca: kpi.ca, nb: kpi.nb, top: top ? top.nom : "Aucune vente" });
});

app.listen(5000, () => console.log("API sur http://localhost:5000"));
