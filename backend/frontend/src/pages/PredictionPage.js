import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getCryptoPrediction, getSupportedSymbols } from '../services/api';
import './PredictionPage.css';

const PredictionPage = () => {
  const [symbol, setSymbol] = useState('BTC');
  const [days, setDays] = useState(30);
  const [predictionData, setPredictionData] = useState(null);
  const [symbols, setSymbols] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSymbols();
  }, []);

  useEffect(() => {
    fetchPrediction();
  }, [symbol, days]);

  const fetchSymbols = async () => {
  try {
    const response = await getSupportedSymbols();
    setSymbols(response.symbols);
  } catch (err) {
    console.error('Failed to fetch symbols:', err);
  }
};

  const fetchPrediction = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCryptoPrediction(symbol, days);
      setPredictionData(response);
    } catch (err) {
      setError('Failed to fetch prediction');
    } finally {
      setLoading(false);
    }
  };

  const formatPredictionData = () => {
    if (!predictionData || !predictionData.predictions) return [];
    return predictionData.predictions.map((point) => ({
      date: point.date,
      predicted: point.predicted_price,
      confidence: point.confidence * 100,
    }));
  };

  return (
    <div className="prediction-page">
      <h2>Prediction Page</h2>

      <div className="controls">
        <div className="control-group">
          <label>Symbol:</label>
        <select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
        {symbols.map((s) => (
          <option key={s.symbol} value={s.symbol}>
          {s.symbol} - {s.ticker}
          </option>
        ))}
        </select>
        </div>

        <div className="control-group">
          <label>Days:</label>
        <input
          type="number"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          min="1"
          max="365"
        />
        </div>
      </div>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}

      {predictionData && (
        <div className="chart-container">
          <h3>{symbol} Prediction for {days} Days</h3>
          <p>Current Price: ${predictionData.current_price}</p>
          <p>Model: {predictionData.model_used}</p>
        </div>
      )}
    </div>
  );
};

export default PredictionPage;
