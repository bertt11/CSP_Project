import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

function ManageReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const q = query(
          collection(db, 'reservations'),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReservations(data);
        setLoading(false);
      } catch (error) {
        console.error('Gagal memuat data:', error);
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Kelola Pemesanan</h2>

      {loading ? (
        <p className="text-center">Memuat data pemesanan...</p>
      ) : reservations.length === 0 ? (
        <p className="text-center">Belum ada data pemesanan.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered text-center">
            <thead className="table-light">
              <tr>
                <th>No</th>
                <th>Nama Customer</th>
                <th>Nomor Meja</th>
                <th>Metode Pembayaran</th>
                <th>Total</th>
                <th>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res, index) => (
                <tr key={res.id}>
                  <td>{index + 1}</td>
                  <td>{res.name}</td>
                  <td>{res.tableNumber}</td>
                  <td>{res.method}</td>
                  <td>Rp {res.amount}</td>
                  <td>{res.createdAt?.toDate().toLocaleString() || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageReservations;
