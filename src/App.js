import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import UploadFiles from "./components/UploadFiles/UploadFiles";
import Dashboard from "./components/Dashboard/Dashboard";
import FileHistory from "./components/FileHistory/FileHistory";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const STORAGE_KEY = "dataVisualizer_fileHistory";
const MAX_HISTORY_ITEMS = 10;

function App() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [currentFileName, setCurrentFileName] = useState("");
  const [fileHistory, setFileHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load file history from localStorage on component mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setFileHistory(parsedHistory);
      }
    } catch (error) {
      console.error("Error loading file history:", error);
    }
  }, []);

  // Save file history to localStorage whenever it changes
  useEffect(() => {
    if (fileHistory.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fileHistory));
      } catch (error) {
        console.error("Error saving file history:", error);
      }
    }
  }, [fileHistory]);

  const handleDataUpload = (uploadedData, uploadedColumns, fileName) => {
    setData(uploadedData);
    setColumns(uploadedColumns);
    setCurrentFileName(fileName);

    // Create history entry
    const historyEntry = {
      id: Date.now(),
      fileName: fileName,
      uploadDate: new Date().toISOString(),
      data: uploadedData,
      columns: uploadedColumns,
      rowCount: uploadedData.length,
      columnCount: uploadedColumns.length,
    };

    // Add to history (keep only MAX_HISTORY_ITEMS)
    setFileHistory((prevHistory) => {
      const newHistory = [historyEntry, ...prevHistory];
      return newHistory.slice(0, MAX_HISTORY_ITEMS);
    });

    setShowHistory(false);
  };

  const handleLoadFromHistory = (historyEntry) => {
    setData(historyEntry.data);
    setColumns(historyEntry.columns);
    setCurrentFileName(historyEntry.fileName);
    setShowHistory(false);
  };

  const handleDeleteFromHistory = (id) => {
    setFileHistory((prevHistory) =>
      prevHistory.filter((entry) => entry.id !== id)
    );
  };

  const handleClearHistory = () => {
    setFileHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleReset = () => {
    setData([]);
    setColumns([]);
    setCurrentFileName("");
    setShowHistory(false);
  };

  const handleToggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <>
      <Navbar
        onToggleHistory={handleToggleHistory}
        historyCount={fileHistory.length}
      />
      <div className="container-fluid min-vh-100 px-4 py-4">
        {!data.length ? (
          <>
            <UploadFiles onDataUpload={handleDataUpload} />
            {fileHistory.length > 0 && (
              <FileHistory
                fileHistory={fileHistory}
                onLoadFile={handleLoadFromHistory}
                onDeleteFile={handleDeleteFromHistory}
                onClearHistory={handleClearHistory}
              />
            )}
          </>
        ) : (
          <Dashboard
            data={data}
            columns={columns}
            fileName={currentFileName}
            onReset={handleReset}
            showHistory={showHistory}
            fileHistory={fileHistory}
            onLoadFromHistory={handleLoadFromHistory}
            onDeleteFromHistory={handleDeleteFromHistory}
            onClearHistory={handleClearHistory}
          />
        )}
      </div>
    </>
  );
}

export default App;