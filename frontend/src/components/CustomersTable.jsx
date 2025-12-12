import React, { useEffect, useState } from 'react';
import { fetchCustomers, callCustomer } from '../api';

export default function CustomersTable() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers().then(setCustomers);
  }, []);

  const handleCall = async (id, name) => {
    const res = await callCustomer(id);

    if (res.error) {
      alert('Call failed: ' + res.error);
    } else {
      alert(`Call triggered for ${name}. SID: ${res.sid}`);
    }
  };

  return (
    <div>
      <h2>Customer List</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Number</th>
            <th>Status</th>
            <th>Call</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.number}</td>
              <td>{c.order_status}</td>
              <td>
                <button
                  disabled={!['pending', 'delayed'].includes(c.order_status)}
                  onClick={() => handleCall(c.id, c.name)}
                >
                  Call
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
