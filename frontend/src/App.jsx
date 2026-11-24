import { useState } from 'react';
import Menu from './components/Menu';
import Produits from './components/Produits';
import Clients from './components/Clients';
import Ventes from './components/Ventes';
import Dashboard from './components/Dashboard';
import Alertes from './components/Alertes';

function App() {
  const [page, setPage] = useState('dashboard');
  return (
    <div className="container py-3">
      <h1 className="h1">📊 VisiShop</h1>
      <Menu page={page} setPage={setPage} />
      {page === 'dashboard' && <Dashboard />}
      {page === 'produits' && <Produits />}
      {page === 'clients' && <Clients />}
      {page === 'ventes' && <Ventes />}
      {page === 'alertes' && <Alertes />}
    </div>
  );
}
export default App;