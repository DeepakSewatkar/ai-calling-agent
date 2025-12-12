import React, { useEffect, useState } from "react";

export default function CallLogs() {
  const [logs, setLogs] = useState([]);
  const base = import.meta.env.VITE_API_BASE || "http://localhost:4000";

  useEffect(() => {
    fetch(base + "/call-logs")
      .then((r) => r.json())
      .then(setLogs)
      .catch((e) => {
        console.error("Failed to load logs", e);
        setLogs([]);
      });
  }, []);

  return (
    <div style={{ marginTop: 24 }}>
      <h2>Call Logs</h2>
      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f1f5f9" }}>
            <th>Time</th>
            <th>Name</th>
            <th>Number</th>
            <th>Status</th>
            <th>SID</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr><td colSpan="6">No calls yet</td></tr>
          ) : (
            logs.map((log) => (
              <tr key={log.sid}>
                <td>{new Date(log.time).toLocaleString()}</td>
                <td>{log.name}</td>
                <td>{log.number}</td>
                <td>{log.order_status}</td>
                <td style={{ fontFamily: "monospace" }}>{log.sid}</td>
                <td>{log.source}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
