import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getCryptoData, getSupportedSymbols } from '../services/api';
import './CryptoDashboard.css';

const CryptoDashboard = () => {
  const [symbol, setSymbol] = useState('BTC');
  const [period, setPeriod] = useState('1y');
  const [data, setData] = useState(null);
  const [symbols, setSymbols] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSymbols();
  }, []);

  useEffect(() => {
    fetchData();
  }, [symbol, period]);

  const fetchSymbols = async () => {
    try {
      const response = await getSupportedSymbols();
      setSymbols(response.symbols);
    } catch (err) {
      console.error('Failed to fetch symbols:', err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCryptoData(symbol, period);
      setData(response);
    } catch (err) {
      setError('Failed to fetch crypto data');
    } finally {
      setLoading(false);
    }
  };

  const formatChartData = () => {
    if (!data || !data.prices) return [];
    return data.prices.map(price => ({
      date: price.date,
      close: price.close,
      high: price.high,
      low: price.low,
      volume: price.volume
    }));
  };

  return (
    <div className="dashboard">
      <h2>Crypto Dashboard</h2>
      
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
          <label>Period:</label>
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="1mo">1 Month</option>
            <option value="3mo">3 Months</option>
            <option value="6mo">6 Months</option>
            <option value="1y">1 Year</option>
            <option value="2y">2 Years</option>
          </select>
        </div>
      </div>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
      
      {data && (
        <div className="chart-container">
          <h3>{data.name} ({data.symbol})</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={formatChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="close" 
                stroke="#8884d8" 
                name="Close Price"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="high" 
                stroke="#82ca9d" 
                name="High"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="low" 
                stroke="#ff7300" 
                name="Low"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default CryptoDashboard;
