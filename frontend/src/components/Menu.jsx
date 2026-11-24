function Menu({ page, setPage }) {
  const pages = ['dashboard', 'produits', 'clients', 'ventes', 'alertes'];
  return (
    <div className="mb-4">
      {pages.map((p) => (
        <button key={p} className={'btn me-2 ' + (page === p ? 'btn-primary' : 'btn-outline-primary')}
          onClick={() => setPage(p)}>{p}</button>
      ))}
    </div>
  );
}
export default Menu;