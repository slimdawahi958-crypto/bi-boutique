import { useState, useEffect } from 'react';
const API = 'http://localhost:5000/api/';

function Ventes() {
  const [produits, setProduits] = useState([]);
  const [clients, setClients] = useState([]);
  const [ventes, setVentes] = useState([]);
  const [form, setForm] = useState({ produit_id: '', client_id: '', quantite: 1 });

  const charger = () => fetch(API + 'ventes').then((r) => r.json()).then(setVentes);
  useEffect(() => {
    fetch(API + 'produits').then((r) => r.json()).then(setProduits);
    fetch(API + 'clients').then((r) => r.json()).then(setClients);
    charger();
  }, []);

  const vendre = () =>
    fetch(API + 'ventes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      .then(() => charger());

  return (
    <>
      <h3>Ventes</h3>
      <div className="row g-2 mb-3">
        <div className="col">
          <select className="form-select" onChange={(e) => setForm({ ...form, produit_id: e.target.value })}>
            <option>Produit</option>
            {produits.map((p) => <option key={p.id} value={p.id}>{p.nom}</option>)}
          </select>
        </div>
        <div className="col">
          <select className="form-select" onChange={(e) => setForm({ ...form, client_id: e.target.value })}>
            <option>Client</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
          </select>
        </div>
        <div className="col">
          <input type="number" className="form-control" value={form.quantite}
            onChange={(e) => setForm({ ...form, quantite: e.target.value })} />
        </div>
        <div className="col"><button className="btn btn-success" onClick={vendre}>Vendre</button></div>
      </div>
      <table className="table">
        <thead><tr><th>Produit</th><th>Client</th><th>Qté</th></tr></thead>
        <tbody>
          {ventes.map((v) => (<tr key={v.id}><td>{v.produit}</td><td>{v.client}</td><td>{v.quantite}</td></tr>))}
        </tbody>
      </table>
    </>
  );
}
export default Ventes;