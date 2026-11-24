import { useState, useEffect } from 'react';
const API = 'http://localhost:5000/api/clients';
const vide = { nom: '', ville: '', telephone: '' };

function Clients() {
  const [liste, setListe] = useState([]);
  const [form, setForm] = useState(vide);

  const charger = () => fetch(API).then((r) => r.json()).then(setListe);
  useEffect(() => { charger(); }, []);

  const ajouter = () =>
    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    }).then((r) => {
      if (!r.ok) alert('Erreur serveur : ' + r.status);
      setForm(vide);
      charger();
    });

  const supprimer = (id) =>
    fetch(API + '/' + id, { method: 'DELETE' }).then((r) => {
      if (!r.ok) alert('Erreur serveur : ' + r.status);
      charger();
    });

  return (
    <>
      <h3>Clients</h3>

      <div className="row g-2 mb-3">
        {['nom', 'ville', 'telephone'].map((c) => (
          <div className="col" key={c}>
            <input className="form-control" placeholder={c} value={form[c]}
              onChange={(e) => setForm({ ...form, [c]: e.target.value })} />
          </div>
        ))}
        <div className="col">
          <button className="btn btn-primary" onClick={ajouter}>Ajouter</button>
        </div>
      </div>

      <ul className="list-group">
        {liste.map((c) => (
          <li className="list-group-item d-flex justify-content-between" key={c.id}>
            <span>{c.nom} ({c.ville}) 📞 {c.telephone || 'pas de numéro'}</span>
            <button className="btn btn-sm btn-danger" onClick={() => supprimer(c.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </>
  );
}
export default Clients;