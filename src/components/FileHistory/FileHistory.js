import React from "react";
import {
  MdOutlineDeleteForever,
  MdAccessTimeFilled,
  MdInsertDriveFile,
  MdTableChart,
  MdCalendarToday,
  MdDescription,
} from "react-icons/md";

function FileHistory({
  fileHistory,
  onLoadFile,
  onDeleteFile,
  onClearHistory,
}) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 8400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return <MdInsertDriveFile />;
    const ext = fileName.split(".").pop().toLowerCase();
    switch (ext) {
      case "xlsx":
      case "xls":
      case "csv":
        return <MdTableChart />;
      default:
        return <MdDescription />;
    }
  };

  if (fileHistory.length === 0) return null;

  return (
    <div className="container py-4">
      <div className="card shadow-sm border-0">
        {/* Header */}
        <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
          <h5 className="fw-semibold mb-0 d-flex align-items-center">
            <MdAccessTimeFilled className="me-2 text-dark" />
            Recent Files
          </h5>
          <button
            className="btn btn-sm btn-outline-danger d-flex align-items-center"
            onClick={onClearHistory}
          >
            <MdOutlineDeleteForever className="me-1" size={18} />
            Clear All
          </button>
        </div>

        {/* List Body */}
        <div className="card-body p-0">
          <div className="list-group list-group-flush">
            {fileHistory.map((entry) => (
              <div
                key={entry.id}
                className="list-group-item list-group-item-action d-flex align-items-center justify-content-between py-3"
                style={{ cursor: "pointer" }}
                onClick={() => onLoadFile(entry)}
              >
                <div className="d-flex align-items-center overflow-hidden">
                  <div className="me-3 fs-3 text-dark flex-shrink-0 d-flex">
                    {getFileIcon(entry.fileName)}
                  </div>

                  <div className="text-truncate">
                    <div className="fw-bold mb-1 text-dark text-truncate">
                      {entry.fileName}
                    </div>
                    <div className="small text-muted d-flex flex-wrap align-items-center">
                      <span className="me-3 d-flex align-items-center">
                        <MdCalendarToday className="me-1" size={14} />
                        {entry.rowCount} rows, {entry.columnCount} columns
                      </span>
                      <span>{formatDate(entry.uploadDate)}</span>
                    </div>
                  </div>
                </div>

                <button
                  className="btn btn-link text-danger p-2 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFile(entry.id);
                  }}
                  title="Delete File"
                >
                  <MdOutlineDeleteForever size={22} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileHistory;
