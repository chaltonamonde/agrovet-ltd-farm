'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { formatKsh } from '@/lib/utils';
import { sampleProducts } from '@/data/mockData';
import { Package, TrendingUp, AlertTriangle, Download, ArrowUpRight } from 'lucide-react';

interface OrderRecord {
  id: string;
  date: string;
  customer: string;
  phone: string;
  county: string;
  total: number;
  mpesaCode: string;
  status: 'Pending' | 'Processing' | 'Dispatched' | 'Delivered';
}

const initialOrders: OrderRecord[] = [
  { id: 'ORD-9421', date: '2024-10-10', customer: 'John Kamau', phone: '0722123456', county: 'Kiambu', total: 4720, mpesaCode: 'QJK84920KD', status: 'Delivered' },
  { id: 'ORD-9422', date: '2024-10-10', customer: 'Grace Wanjiku', phone: '0711987654', county: 'Nakuru', total: 8900, mpesaCode: 'QJK84931PL', status: 'Dispatched' },
  { id: 'ORD-9423', date: '2024-10-10', customer: 'David Omondi', phone: '0733456789', county: 'Kisumu', total: 11200, mpesaCode: 'QJK84945MN', status: 'Processing' },
  { id: 'ORD-9424', date: '2024-10-09', customer: 'Peter Kiprono', phone: '0700112233', county: 'Uasin Gishu', total: 3200, mpesaCode: 'Pending POD', status: 'Pending' }
];

export default function AdminPage() {
  const [role, setRole] = useState<'owner' | 'staff'>('owner');
  const [orders, setOrders] = useState<OrderRecord[]>(initialOrders);

  const totalRev = orders.reduce((sum, o) => sum + o.total, 0);

  const updateStatus = (id: string, newStatus: OrderRecord['status']) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const exportCsv = () => {
    let csv = "Order ID,Date,Customer,Phone,County,Total (KSh),M-Pesa Code,Status\n";
    orders.forEach(o => {
      csv += `"${o.id}","${o.date}","${o.customer}","${o.phone}","${o.county}",${o.total},"${o.mpesaCode}","${o.status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'Agrovet_Orders.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-idle/40">
        <div>
          <span className="label-caps text-leaf block mb-1">INTERNAL STORE OPERATIONS</span>
          <h1 className="font-heading text-3xl md:text-4xl text-forest">Agrovet Ltd Operations Portal</h1>
          <p className="text-gray-500 text-sm">Kirinyaga Road, Nairobi Branch • M-Pesa Daraja Automated Reconciliation</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={role}
            onChange={e => setRole(e.target.value as 'owner' | 'staff')}
            className="border border-leaf text-forest font-bold px-3 py-1.5 rounded-full text-xs"
          >
            <option value="owner">Role: Store Owner (Full Access)</option>
            <option value="staff">Role: Staff (Orders Only)</option>
          </select>
          <button onClick={exportCsv} className="btn btn-leaf text-xs py-2 px-3 flex items-center gap-1.5">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card p-5 rounded-2xl border border-idle/40 border-l-4 border-l-leaf">
          <div className="text-xs uppercase font-bold text-gray-500 mb-1">Daily Revenue</div>
          <div className="font-heading text-3xl font-extrabold text-forest">{formatKsh(totalRev)}</div>
          <div className="text-xs text-leaf mt-1 flex items-center gap-1"><TrendingUp size={12}/> +18% today</div>
        </div>

        <div className="bg-card p-5 rounded-2xl border border-idle/40 border-l-4 border-l-gold">
          <div className="text-xs uppercase font-bold text-gray-500 mb-1">Total Orders</div>
          <div className="font-heading text-3xl font-extrabold text-forest">{orders.length}</div>
          <div className="text-xs text-gray-500 mt-1">4 Kenyan Counties</div>
        </div>

        <div className="bg-card p-5 rounded-2xl border border-idle/40 border-l-4 border-l-danger">
          <div className="text-xs uppercase font-bold text-danger mb-1">Low Stock Alerts</div>
          <div className="font-heading text-3xl font-extrabold text-danger">3 SKUs</div>
          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1"><AlertTriangle size={12}/> Restock required</div>
        </div>

        <div className="bg-card p-5 rounded-2xl border border-idle/40 border-l-4 border-l-forest">
          <div className="text-xs uppercase font-bold text-gray-500 mb-1">Registered Products</div>
          <div className="font-heading text-3xl font-extrabold text-forest">{sampleProducts.length}</div>
          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Package size={12}/> PCPB Certified</div>
        </div>
      </div>

      {/* Orders Pipeline Table */}
      <div className="bg-card rounded-2xl border border-idle/40 p-6 mb-8">
        <h2 className="font-heading text-xl text-forest mb-4">Farmer Order & County Courier Dispatch</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-pale-2 text-forest border-b border-idle/40">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">County</th>
                <th className="p-3">Total</th>
                <th className="p-3">M-Pesa Receipt</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-b border-idle/20 hover:bg-page">
                  <td className="p-3 font-bold text-forest">{o.id}</td>
                  <td className="p-3">
                    <div className="font-medium">{o.customer}</div>
                    <div className="text-xs text-gray-500">{o.phone}</div>
                  </td>
                  <td className="p-3">{o.county}</td>
                  <td className="p-3 font-bold text-forest">{formatKsh(o.total)}</td>
                  <td className="p-3"><code className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">{o.mpesaCode}</code></td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      o.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      o.status === 'Dispatched' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <select
                      value={o.status}
                      onChange={e => updateStatus(o.id, e.target.value as OrderRecord['status'])}
                      className="border border-idle/60 rounded px-2 py-1 text-xs"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
