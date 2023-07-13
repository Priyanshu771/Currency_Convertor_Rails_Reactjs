import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [currencyList, setCurrencyList] = useState([]);

  useEffect(() => {
    fetchCurrencyList();
  }, []);

  const fetchCurrencyList = async () => {
    try {
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
      const data = response.data;
      const currencies = Object.keys(data.rates);
      setCurrencyList(currencies);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleConvert = async () => {
    if (amount && fromCurrency && toCurrency) {
      try {
        const response = await axios.post('/api/v1/currency_converter/convert', {
          amount,
          from: fromCurrency,
          to: toCurrency,
        });
        const data = response.data;
        setConvertedAmount(data.converted_amount);
        console.log('API Call successful');
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleDownload = async () => {
    if (currencyList.length === 0) {
      console.error('Currency list not available');
      return;
    }
  
    try {
      const response = await axios.get('/api/v1/currency_converter/data', {
        responseType: 'blob', // Set the response type to 'blob'
      });
  
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'data.xlsx';
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  
  
  const saveAsExcelFile = (buffer, fileName) => {
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, fileName);
  };
  
  return (
    <div>
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
        <option value="">Select currency</option>
        {currencyList.map((currency) => (
          <option value={currency} key={currency}>
            {currency}
          </option>
        ))}
      </select>
      <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
        <option value="">Select currency</option>
        {currencyList.map((currency) => (
          <option value={currency} key={currency}>
            {currency}
          </option>
        ))}
      </select>
      <button onClick={handleConvert}>Convert</button>
      <button onClick={handleDownload}>Download</button>
      <div>Converted Amount: {convertedAmount}</div>
    </div>
  );
};

export default CurrencyConverter;
