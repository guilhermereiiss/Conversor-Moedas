import "./App.css";
import { useState, useEffect } from "react";
import ImgConv from "./assets/5082433-conceitos-de-conversao-de-moeda-vetor.jpg";

const API_URL = "https://economia.awesomeapi.com.br/json/all";

const ALLOWED_CURRENCIES = ["USD", "EUR", "BRL", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "ARS", "MXN"];

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("BRL");
  const [rates, setRates] = useState<{ [key: string]: number }>({});
  const [converted, setConverted] = useState<number | null>(null);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        const formattedRates: { [key: string]: number } = { BRL: 1.0 };
        Object.keys(data).forEach((key) => {
          if (ALLOWED_CURRENCIES.includes(key)) {
            formattedRates[key] = parseFloat(data[key].high);
          }
        });
        setRates(formattedRates);
      })
      .catch((error) => console.error("Erro ao buscar taxas", error));
  }, []);

  const convertCurrency = () => {
    if (rates[fromCurrency] && rates[toCurrency] && amount) {
      const rate = rates[toCurrency] / rates[fromCurrency];
      setConverted(parseFloat(amount) * rate);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 flex items-center gap-8">
        <img src={ImgConv} alt="Conversão" className="w-1/3 hidden md:block" />
        <div className="flex-1 space-y-6">
          <h1 className="text-2xl font-bold text-center text-gray-800">Conversor de Moedas</h1>
          <div className="flex flex-col space-y-4">
            <label className="font-semibold text-gray-700">De:</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="border p-3 w-full rounded-md focus:ring-2 focus:ring-green-500"
            >
              {Object.keys(rates).map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
            <label className="font-semibold text-gray-700">Para:</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="border p-3 w-full rounded-md focus:ring-2 focus:ring-green-500"
            >
              {Object.keys(rates).map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
            <label className="font-semibold text-gray-700">Valor:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Digite o valor"
              className="border p-3 w-full rounded-md focus:ring-2 focus:ring-green-500"
            />
            <button onClick={convertCurrency} className="bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition">
              Converter
            </button>
            {converted !== null && (
              <div className="text-lg font-semibold text-gray-800 text-center">
                Convertido: {converted.toFixed(2)} {toCurrency}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
