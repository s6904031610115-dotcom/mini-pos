"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function SellPage() {
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('name');
    if (data) setProducts(data);
  }

  const selectedProduct = products.find(p => p.id === selectedId);
  const totalPrice = selectedProduct ? selectedProduct.price * quantity : 0;

  async function handleSell(e) {
    e.preventDefault();
    if (!selectedProduct) return alert('กรุณาเลือกสินค้า');
    if (quantity > selectedProduct.stock) return alert('สินค้าในสต๊อกไม่พอ');

    // 1. บันทึกรายการขาย
    const { error: saleError } = await supabase.from('sales').insert([{
      product_id: selectedProduct.id,
      product_name: selectedProduct.name,
      quantity: parseInt(quantity),
      total_price: totalPrice
    }]);

    if (saleError) return alert('เกิดข้อผิดพลาด: ' + saleError.message);

    // 2. ตัดสต๊อก
    const newStock = selectedProduct.stock - quantity;
    await supabase.from('products').update({ stock: newStock }).eq('id', selectedProduct.id);

    alert('ขายสำเร็จ!');
    setQuantity(1);
    setSelectedId('');
    fetchProducts();
  }

  return (
    <div className="card">
      <h2>ขายสินค้า (หน้าร้าน Noir Muse)</h2>
      <form onSubmit={handleSell} style={{ marginTop: '1rem' }}>
        <div className="form-group">
          <label>เลือกสินค้า</label>
          <select value={selectedId} onChange={e => setSelectedId(e.target.value)}>
            <option value="">-- เลือกรายการ --</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} (คงเหลือ: {p.stock} {p.unit}) - {p.price}฿
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>จำนวน</label>
          <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} />
        </div>

        <div style={{ margin: '1.5rem 0', fontSize: '1.25rem', fontWeight: 'bold' }}>
          ยอดรวมทั้งหมด: <span style={{ color: '#2b9348' }}>{totalPrice} ฿</span>
        </div>

        <button type="submit" className="btn-primary">ยืนยันการขาย</button>
      </form>
    </div>
  );
}
