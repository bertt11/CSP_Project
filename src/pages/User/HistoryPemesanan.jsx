import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function ReservationHistory() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const email = user.email;
        setUserEmail(email);
        console.log('User login:', email);

        try {
          const q = query(
            collection(db, 'reservations'),
            where('user_email', '==', email),
            orderBy('createdAt', 'desc')
          );

          const snapshot = await getDocs(q);
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          setReservations(data);
        } catch (error) {
          console.error('Gagal mengambil data:', error);
        }
      } else {
        console.warn('User belum login.');
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">History Pemesanan Anda</h2>

      {loading ? (
        <p className="text-center">Memuat data...</p>
      ) : reservations.length === 0 ? (
        <p className="text-center">Belum ada riwayat pemesanan.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered text-center">
            <thead className="table-light">
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>No. Meja</th>
                <th>Metode</th>
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

export default ReservationHistory;
