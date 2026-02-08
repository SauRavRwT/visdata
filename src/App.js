import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import UploadFiles from "./components/UploadFiles/UploadFiles";
import Dashboard from "./components/Dashboard/Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  const handleDataUpload = (uploadedData, uploadedColumns) => {
    setData(uploadedData);
    setColumns(uploadedColumns);
  };

  const handleReset = () => {
    setData([]);
    setColumns([]);
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid min-vh-100 px-4 py-4">
        {!data.length ? (
          <UploadFiles onDataUpload={handleDataUpload} />
        ) : (
          <Dashboard data={data} columns={columns} onReset={handleReset} />
        )}
      </div>
    </>
  );
}

export default App;
