import { useState, useEffect } from 'react';
const API = 'http://localhost:5000/api/produits';

function Alertes() {
  const [produits, setProduits] = useState([]);
  const [seuil, setSeuil] = useState(5);

  const charger = () => fetch(API).then((r) => r.json()).then(setProduits);
  useEffect(() => { charger(); }, []);

  const reappro = (id) => fetch(API + '/' + id + '/reappro', { method: 'PUT' }).then(charger);
  const faibles = produits.filter((p) => p.stock <= seuil);

  return (
    <>
      <h3>Alertes de stock ⚠️</h3>
      <input type="number" className="form-control w-25 mb-3" value={seuil}
        onChange={(e) => setSeuil(e.target.value)} />
      {faibles.length === 0 ? (
        <p className="text-success">Aucun produit en alerte ✅</p>
      ) : (
        <ul className="list-group">
          {faibles.map((p) => (
            <li className="list-group-item d-flex justify-content-between" key={p.id}>
              {p.nom} : stock {p.stock}
              <button className="btn btn-sm btn-warning" onClick={() => reappro(p.id)}>Réapprovisionner +10</button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
export default Alertes;