import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreatePayment() {
  const [name, setName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [bankLocation, setBankLocation] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("ZAR");
  const [paymentReference, setPaymentReference] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Conversion rates for reference only
  const exchangeRates = {
    ZAR: 1,
    GBP: 23.16,
    USD: 17.18,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const numericAmount = parseFloat(amount);
    const amountInZAR = numericAmount * (exchangeRates[currency] || 1);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/payment/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          bankName,
          accountNumber,
          swiftCode,
          bankLocation,
          amount: numericAmount, // store as entered
          currency,              // store selected currency
          amountInZAR,           // optional for reference
          paymentReference,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save payment");

      alert("Payment saved successfully!");
      navigate("/payments-list");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Make a Payment</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-2">
          <label>Name</label>
          <input className="form-control" value={name} onChange={e => setName(e.target.value)} required />
        </div>

        <div className="form-group mb-2">
          <label>Bank Name</label>
          <input className="form-control" value={bankName} onChange={e => setBankName(e.target.value)} required />
        </div>

        <div className="form-group mb-2">
          <label>Account Number</label>
          <input className="form-control" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} required />
        </div>

        <div className="form-group mb-2">
          <label>SWIFT Code</label>
          <input className="form-control" value={swiftCode} onChange={e => setSwiftCode(e.target.value)} required />
        </div>

        <div className="form-group mb-2">
          <label>Country/City of Bank</label>
          <input className="form-control" value={bankLocation} onChange={e => setBankLocation(e.target.value)} required />
        </div>

        <div className="form-group mb-2">
          <label>Currency</label>
          <select className="form-control" value={currency} onChange={e => setCurrency(e.target.value)} required>
            <option value="ZAR">ZAR</option>
            <option value="GBP">GBP</option>
            <option value="USD">USD</option>
          </select>
        </div>

        <div className="form-group mb-2">
          <label>Amount ({currency})</label>
          <input type="number" className="form-control" value={amount} onChange={e => setAmount(e.target.value)} required />
        </div>

        {currency !== "ZAR" && (
          <div className="mb-2">
            <small>Amount in ZAR: R{(parseFloat(amount) * exchangeRates[currency]).toFixed(2)}</small>
          </div>
        )}

        <div className="form-group mb-2">
          <label>Payment Reference</label>
          <input className="form-control" value={paymentReference} onChange={e => setPaymentReference(e.target.value)} required />
        </div>

        <button type="submit" className="btn btn-primary mt-3">Pay Now</button>
      </form>
    </div>
  );
}
