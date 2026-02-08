import React from "react";
import { MdAccessTimeFilled } from "react-icons/md";

function Navbar({ onToggleHistory, historyCount }) {
  return (
    <nav className="navbar navbar-dark shadow-sm custom-navbar">
      <div className="container-fluid px-4">
        <a className="navbar-brand fw-bold" href="/"> 
        <h1 className="navbar-brand fw-semibold mb-0">Data Visualizer</h1>
        </a>
        {historyCount > 0 && (
          <button
            className="btn btn-outline-light btn-sm history-toggle-btn"
            onClick={onToggleHistory}
          >
            <MdAccessTimeFilled />
            History ({historyCount})
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
