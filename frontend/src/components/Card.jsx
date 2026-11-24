function Card({ titre, valeur }) {
  return (
    <div className="col">
      <div className="card h-100 text-center">
        <div className="card-body">
          <h6 className="card-title">{titre}</h6>
          <p className="fs-3 fw-bold">{valeur}</p>
        </div>
      </div>
    </div>
  );
}
export default Card;