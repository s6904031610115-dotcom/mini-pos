"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ sku: '', name: '', price: '', stock: '', unit: 'ขวด' });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error) setProducts(data || []);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.sku || !form.name || !form.price) return alert('กรุณากรอกข้อมูลให้ครบ');

    const { error } = await supabase.from('products').insert([{
      sku: form.sku,
      name: form.name,
      price: parseFloat(form.price),
      stock: parseInt(form.stock) || 0,
      unit: form.unit
    }]);

    if (error) {
      alert('เกิดข้อผิดพลาด: ' + error.message);
    } else {
      setForm({ sku: '', name: '', price: '', stock: '', unit: 'ขวด' });
      fetchProducts();
    }
  }

  async function handleDelete(id) {
    if (confirm('ยืนยันการลบสินค้า?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  }

  return (
    <div>
      <div className="card">
        <h2>เพิ่มสินค้าใหม่</h2>
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <div className="form-group">
            <label>SKU</label>
            <input value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} placeholder="เช่น NM-FRESH-S" />
          </div>
          <div className="form-group">
            <label>ชื่อสินค้า</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="ชื่อสินค้า Noir Muse" />
          </div>
          <div className="form-group">
            <label>ราคา (บาท)</label>
            <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
          </div>
          <div className="form-group">
            <label>จำนวนคงเหลือ</label>
            <input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
          </div>
          <div className="form-group">
            <label>หน่วยนับ</label>
            <input value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} />
          </div>
          <button type="submit" className="btn-primary">บันทึกสินค้า</button>
        </form>
      </div>

      <div className="card">
        <h2>รายการสินค้าในระบบ</h2>
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>ชื่อสินค้า</th>
              <th>ราคา</th>
              <th>คงเหลือ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.sku}</td>
                <td>{p.name}</td>
                <td>{p.price} ฿</td>
                <td>{p.stock} {p.unit}</td>
                <td>
                  <button onClick={() => handleDelete(p.id)} style={{ width: 'auto', padding: '0.3rem 0.6rem', background: '#e63946', color: 'white', border: 'none' }}>ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
