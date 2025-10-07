import React, { useEffect, useState } from "react";

export default function PaymentsList() {
  const [payments, setPayments] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchPayments() {
      try {
        const res = await fetch("http://localhost:3001/payment/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setPayments(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchPayments();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;

    try {
      const res = await fetch(`http://localhost:3001/payment/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setPayments(payments.filter(p => p._id !== id));
      } else {
        console.error("Failed to delete payment");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatAmount = (num) => {
    if (num == null) return "";
    return Number(num).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="container mt-4">
      <h3>All Payments</h3>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Bank</th>
            <th>Account Number</th>
            <th>SWIFT</th>
            <th>Bank Location</th>
            <th>Amount</th>
            <th>Reference</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.bankName}</td>
              <td>{p.accountNumber}</td>
              <td>{p.swiftCode}</td>
              <td>{p.bankLocation}</td>
              <td>
                {formatAmount(p.amount)} {p.currency || ""}
                {p.currency !== "ZAR" && p.amountInZAR != null
                  ? ` (R${formatAmount(p.amountInZAR)})`
                  : ""}
              </td>
              <td>{p.paymentReference}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
