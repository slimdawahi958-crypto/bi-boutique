import { useState, useEffect } from 'react';
const API = 'http://localhost:5000/api/produits';
const vide = { nom: '', prix: '', stock: '' };

function Produits() {
  const [liste, setListe] = useState([]);
  const [form, setForm] = useState(vide);
  const [idModif, setIdModif] = useState(null);   // null = mode ajout
  const [recherche, setRecherche] = useState('');

  const charger = () => fetch(API).then((r) => r.json()).then(setListe);
  useEffect(() => { charger(); }, []);

  // Ajouter (POST) ou modifier (PUT) selon idModif
  const enregistrer = () => {
    const url = idModif ? API + '/' + idModif : API;
    const methode = idModif ? 'PUT' : 'POST';
    fetch(url, {
      method: methode,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    }).then((r) => {
      if (!r.ok) alert('Erreur serveur : ' + r.status);
      setForm(vide);
      setIdModif(null);
      charger();
    });
  };

  const modifier = (p) => {
    setForm({ nom: p.nom, prix: p.prix, stock: p.stock });
    setIdModif(p.id);
  };

  const supprimer = (id) =>
    fetch(API + '/' + id, { method: 'DELETE' }).then((r) => {
      if (!r.ok) alert('Erreur serveur : ' + r.status);
      charger();
    });

  const affiches = liste.filter((p) =>
    p.nom.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <>
      <h3>Produits</h3>

      <div className="row g-2 mb-3">
        {['nom', 'prix', 'stock'].map((c) => (
          <div className="col" key={c}>
            <input className="form-control" placeholder={c} value={form[c]}
              onChange={(e) => setForm({ ...form, [c]: e.target.value })} />
          </div>
        ))}
        <div className="col">
          <button className="btn btn-primary" onClick={enregistrer}>
            {idModif ? 'Enregistrer' : 'Ajouter'}
          </button>
        </div>
      </div>

      <input className="form-control mb-3" placeholder="🔍 Chercher par nom..."
        value={recherche} onChange={(e) => setRecherche(e.target.value)} />

      <ul className="list-group">
        {affiches.map((p) => (
          <li className="list-group-item d-flex justify-content-between" key={p.id}>
            {p.nom} : {p.prix} DT (stock : {p.stock})
            <span>
              <button className="btn btn-sm btn-warning me-2" onClick={() => modifier(p)}>Modifier</button>
              <button className="btn btn-sm btn-danger" onClick={() => supprimer(p.id)}>Supprimer</button>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
export default Produits;