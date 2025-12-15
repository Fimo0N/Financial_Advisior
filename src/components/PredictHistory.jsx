import React from "react";

function PredictionHistory({ history, onClear }) {
  if (history.length === 0) {
    return <p>No prediction history yet.</p>;
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Prediction History</h3>
      <button onClick={onClear}>Clear History</button>

      <ul>
        {history.map((item, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            <strong>{item.symbol}</strong> —{" "}
            <em>{new Date(item.time).toLocaleString()}</em>
            <p>{item.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PredictionHistory;
