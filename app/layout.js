import './globals.css';

export const metadata = {
  title: 'Noir Muse - Mini POS',
  description: 'ระบบขายของและจัดการสต๊อก Noir Muse',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>
        <nav className="nav-bar">
          <div className="brand">NOIR MUSE POS</div>
          <div className="nav-links">
            <a href="/">รายการสินค้า</a>
            <a href="/sell">ขายสินค้า</a>
            <a href="/history">ประวัติการขาย</a>
          </div>
        </nav>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
