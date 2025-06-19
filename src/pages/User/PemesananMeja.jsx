import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { getAuth } from 'firebase/auth';


function ReserveTablePage() {
  const [selectedTable, setSelectedTable] = useState(null);
  const [formData, setFormData] = useState({ name: '', method: 'Midtrans' });
  const [tables, setTables] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');

  // Load Snap.js Midtrans
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', 'SB-Mid-client-A9AX-qszZH1Qttfq');
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const getTables = async () => {
    const snapshot = await getDocs(collection(db, 'tables'));
    const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setTables(data);
  };

  useEffect(() => {
    getTables();
  }, []);

  const handleTableClick = (table) => {
    if (table.status === 'available') {
      setSelectedTable(table);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e) => {
  e.preventDefault();

  try {
    // Request token dari backend seperti biasa
    const response = await fetch('http://localhost:5000/create-transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        tableNumber: selectedTable.number,
      })
    });

    const data = await response.json();

    if (data.token) {
      // Auto-simulasikan transaksi sukses tanpa membuka Snap UI
      const fakeResult = {
        payment_type: 'sandbox-auto',
        gross_amount: 1,
        transaction_status: 'settlement',
        transaction_id: 'sandbox-auto-' + Date.now(),
        order_id: 'ORDER-' + Date.now()
      };

      const auth = getAuth();
      const user = auth.currentUser;

      await addDoc(collection(db, 'reservations'), {
        name: formData.name,
        tableNumber: selectedTable.number,
        method: fakeResult.payment_type,
        amount: fakeResult.gross_amount,
        status: fakeResult.transaction_status,
        transaction_id: fakeResult.transaction_id,
        order_id: fakeResult.order_id,
        user_email: user?.email || 'unknown',
        createdAt: serverTimestamp()
      });

      alert('Pembayaran berhasil (simulasi)!');
      setFormData({ name: '', method: 'Midtrans' });
      setSelectedTable(null);
    } else {
      alert('Gagal mendapatkan token Midtrans');
    }

  } catch (error) {
    console.error('Midtrans error:', error);
    alert('Gagal melakukan proses pembayaran.');
  }
};


  // const handlePayment = async (e) => {
  //   e.preventDefault();

  //   try {
  //     // Request token from backend
  //     const response = await fetch('http://localhost:5000/create-transaction', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         name: formData.name,
  //         tableNumber: selectedTable.number,
  //       })
  //     });

  //     const data = await response.json();

  //     if (data.token) {
  //       window.snap.pay(data.token, {
  //       onSuccess: async function (result) {
  //         try {
  //           await addDoc(collection(db, 'reservations'), {
  //             name: formData.name,
  //             tableNumber: selectedTable.number,
  //             method: result.payment_type,
  //             amount: result.gross_amount,
  //             status: result.transaction_status,
  //             transaction_id: result.transaction_id,
  //             order_id: result.order_id,
  //             createdAt: serverTimestamp()
  //           });

  //           alert('Pembayaran berhasil!');
  //           setFormData({ name: '', method: 'Midtrans' });
  //           setSelectedTable(null);
  //         } catch (err) {
  //           console.error('Gagal simpan ke Firestore:', err);
  //           alert('Pembayaran berhasil tapi gagal simpan data.');
  //         }
  //       },
  //       onPending: function () {
  //         alert('Pembayaran tertunda (pending).');
  //       },
  //       onError: function (error) {
  //         console.error('Midtrans error:', error);
  //         alert('Terjadi kesalahan saat pembayaran.');
  //       }
  //     });

  //     } else {
  //       alert('Gagal mendapatkan token Midtrans');
  //     }

  //   } catch (error) {
  //     console.error('Midtrans error:', error);
  //     alert('Gagal melakukan proses pembayaran.');
  //   }
  // };

  const getColorByStatus = (status) => {
    switch (status) {
      case 'available': return '#28a745';
      case 'reserved': return '#ffc107';
      case 'in-use': return '#dc3545';
      default: return 'gray';
    }
  };

  const renderMejaGroup = (typeName, icon) => {
    const groupTables = tables
      .filter(t => t.type?.toLowerCase() === typeName.toLowerCase())
      .filter(t => (filterStatus ? t.status === filterStatus : true))
      .sort((a, b) => a.number - b.number);

    if (groupTables.length === 0) return null;

    return (
      <div className="mb-5">
        <h4 className="mb-3 text-uppercase fw-bold">{typeName}</h4>
        <div className="d-flex flex-wrap justify-content-center gap-3">
          {groupTables.map((table) => (
            <div
              key={table.id}
              onClick={() => handleTableClick(table)}
              style={{
                width: '55px',
                height: '55px',
                backgroundColor: getColorByStatus(table.status),
                borderRadius: '50%',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: table.status === 'available' ? 'pointer' : 'not-allowed',
                fontWeight: 'bold',
                fontSize: '16px',
                boxShadow: '0 0 10px rgba(0,0,0,0.3)',
                position: 'relative'
              }}
              title={`Meja ${table.number} (${table.status})`}
            >
              {icon && (
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  fontSize: '24px',
                  lineHeight: '1'
                }}>
                  {icon}
                </div>
              )}
              {table.number}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container text-center py-4">
      <h1 className="mb-4 fw-bold text-primary">PESAN MEJA</h1>

      {/* Filter Status */}
      <div className="mb-4 d-flex justify-content-center gap-3 align-items-center flex-wrap">
        <label className="form-label mb-0 fw-semibold">Filter Status:</label>
        <select
          className="form-select w-auto"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Semua</option>
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="in-use">In Use</option>
        </select>
        <button className="btn btn-outline-secondary" onClick={() => setFilterStatus('')}>
          Reset
        </button>
      </div>

      {/* Denah */}
      <img
        src="/images/denah.webp"
        alt="Denah Tempat"
        style={{
          width: '80%',
          maxWidth: '400px',
          borderRadius: '10px',
          marginBottom: '30px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
        }}
      />

      {/* Tipe Meja */}
      {renderMejaGroup('Basic', '')}
      {renderMejaGroup('VIP', '🌟')}
      {renderMejaGroup('VVIP', '👑')}

      {/* Modal Reservasi */}
      {selectedTable && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h5 className="modal-title mb-3">Reservasi Meja {selectedTable.number}</h5>
              <form onSubmit={handlePayment}>
                <div className="mb-2">
                  <label className="form-label">Nama</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Metode Pembayaran</label>
                  <select
                    name="method"
                    className="form-select"
                    value={formData.method}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Midtrans">Midtrans</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label className="form-label">Total Bayar</label>
                  <input
                    className="form-control"
                    type="text"
                    value="Rp 1"
                    disabled
                  />
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <button type="submit" className="btn btn-success">Bayar</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedTable(null)}>Batal</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReserveTablePage;
