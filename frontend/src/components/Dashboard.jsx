import { useState, useEffect } from "react";
import Card from "./Card";

// Couleurs claires pour les parts du camembert
const couleurs = [
  "#8ecae6",
  "#ffd6a5",
  "#b7e4c7",
  "#ffafcc",
  "#cdb4db",
  "#fdffb6",
  "#a2d2ff",
  "#caffbf",
];

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [ventes, setVentes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/stats")
      .then((r) => r.json())
      .then(setStats);
    fetch("http://localhost:5000/api/ventes")
      .then((r) => r.json())
      .then(setVentes);
  }, []);

  // 1. Quantité vendue par produit
  const parProduit = {};
  ventes.forEach((v) => {
    parProduit[v.produit] = (parProduit[v.produit] || 0) + Number(v.quantite);
  });
  const noms = Object.keys(parProduit);
  const total = noms.reduce((somme, nom) => somme + parProduit[nom], 0);

  // 2. Construire le camembert : chaque produit = une part en %
  let debut = 0;
  const parts = noms.map((nom, i) => {
    const fin = debut + (parProduit[nom] / total) * 100;
    const part = couleurs[i % couleurs.length] + " " + debut + "% " + fin + "%";
    debut = fin;
    return part;
  });

  return (
    <>
      <h3>Tableau de bord</h3>

      {stats && (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          <Card titre="Chiffre d'affaires (DT)" valeur={stats.ca} />
          <Card titre="Nombre de ventes" valeur={stats.nb} />
          <Card titre="Produit star ⭐" valeur={stats.top} />
        </div>
      )}

      <div className="card shadow-sm mt-4">
        <div className="card-body">
          <h5 className="card-title">Répartition des produits vendus</h5>

          {total === 0 ? (
            <p className="text-muted">Aucune vente pour le moment.</p>
          ) : (
            <div className="d-flex align-items-center flex-wrap gap-5">
              {/* Le camembert */}
              <div
                style={{
                  width: 220,
                  height: 220,
                  borderRadius: "50%",
                  background: "conic-gradient(" + parts.join(", ") + ")",
                }}
              ></div>

              {/* La légende */}
              <ul className="list-unstyled mb-0">
                {noms.map((nom, i) => (
                  <li key={nom} className="mb-2">
                    <span
                      style={{
                        display: "inline-block",
                        width: 16,
                        height: 16,
                        borderRadius: 4,
                        marginRight: 8,
                        background: couleurs[i % couleurs.length],
                      }}
                    ></span>
                    {nom} : {parProduit[nom]} vendu(s) (
                    {Math.round((parProduit[nom] / total) * 100)} %)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default Dashboard;
