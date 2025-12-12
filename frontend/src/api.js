const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export async function fetchCustomers() {
  const r = await fetch(`${BASE}/customers`);
  return r.json();
}

export async function callCustomer(id) {
  const r = await fetch(`${BASE}/call`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
  return r.json();
}
