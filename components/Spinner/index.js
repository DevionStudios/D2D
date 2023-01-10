

const Spinner = ({ className = "w-5 h-5", label = "Loading..." }) => {
  return (
    <div
    className="spinner-border"
    style={{ width: "15px", height: "15px" }}
    role="status"
  >
    <span className="visually-hidden">Loading...</span>
  </div>
  );
};

export default Spinner;
