const STORAGE_KEY = "prediction_history";

export function savePrediction(entry) {
  const existing = getPredictions();
  const updated = [entry, ...existing].slice(0, 10); // keep last 10
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getPredictions() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function clearPredictions() {
  localStorage.removeItem(STORAGE_KEY);
}
