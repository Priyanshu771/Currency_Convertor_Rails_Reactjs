import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './CurrencyConverter.css';

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
      const currencyData = currencies.map((currency) => ({
        currency,
        rate: data.rates[currency],
      }));
      setCurrencyList(currencyData);
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

  const handleSaveData = async () => {
    try {
      await axios.post('/api/v1/currency_converter/save_data');
      console.log('Data saved successfully');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleDownload = () => {
    if (currencyList.length === 0) {
      console.error('Currency list not available');
      return;
    }

    const sheetData = currencyList.map((currency) => ({
      Currency: currency.currency,
      Rate: currency.rate,
    }));

    const sheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, 'Currency List');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAsExcelFile(excelBuffer, 'currency_list.xlsx');
  };

  const saveAsExcelFile = (buffer, fileName) => {
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, fileName);
  };

  return (
    <div className="container mt-5 convertor">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="text-center mb-4">Currency Converter</h2>
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <br />
          <div className="form-group">
            <label htmlFor="fromCurrency">From Currency</label>
            <select
              id="fromCurrency"
              className="form-control"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              <option value="">Select currency</option>
              {currencyList.map((currency) => (
                <option value={currency.currency} key={currency.currency}>
                  {currency.currency}
                </option>
              ))}
            </select>
          </div>
          <br />
          <div className="form-group">
            <label htmlFor="toCurrency">To Currency</label>
            <select
              id="toCurrency"
              className="form-control"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
            >
              <option value="">Select currency</option>
              {currencyList.map((currency) => (
                <option value={currency.currency} key={currency.currency}>
                  {currency.currency}
                </option>
              ))}
            </select>
          </div>
          <br />
          <div className="text-center buttons">
            <button className="btn btn-primary mr-2" onClick={handleConvert}>
              Convert
            </button>
            <button className="btn btn-primary mr-2" onClick={handleSaveData}>
              Save Data
            </button>
            <button className="btn btn-primary" onClick={handleDownload}>
              Download
            </button>
          </div>
          <br />
          {convertedAmount && (
            <div className="text-center mt-3">
              Converted Amount: {convertedAmount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
