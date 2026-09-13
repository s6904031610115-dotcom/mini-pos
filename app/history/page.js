"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function HistoryPage() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetchSales();
  }, []);

  async function fetchSales() {
    const { data } = await supabase.from('sales').select('*').order('sold_at', { ascending: false });
    if (data) setSales(data);
  }

  const grandTotal = sales.reduce((sum, item) => sum + Number(item.total_price), 0);

  return (
    <div>
      <div className="card" style={{ textAlign: 'center', backgroundColor: '#1a1a1a', color: 'white' }}>
        <h3>ยอดขายสะสมทั้งหมด</h3>
        <h1 style={{ fontSize: '2.5rem', color: '#48bb78', marginTop: '0.5rem' }}>{grandTotal.toLocaleString()} ฿</h1>
      </div>

      <div className="card">
        <h2>ประวัติการขาย</h2>
        <table>
          <thead>
            <tr>
              <th>วัน-เวลา</th>
              <th>สินค้า</th>
              <th>จำนวน</th>
              <th>ยอดรวม</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(s => (
              <tr key={s.id}>
                <td>{new Date(s.sold_at).toLocaleString('th-TH')}</td>
                <td>{s.product_name}</td>
                <td>{s.quantity}</td>
                <td>{s.total_price} ฿</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
