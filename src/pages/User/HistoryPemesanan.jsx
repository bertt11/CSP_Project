import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function ReservationHistory() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userEmail) return;

    const fetchReservations = async () => {
      const q = query(
        collection(db, 'reservations'),
        where('user_email', '==', userEmail),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReservations(data);
      setLoading(false);
    };

    fetchReservations();
  }, [userEmail]);

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">History Pemesanan</h2>
      {loading ? (
        <p className="text-center">Memuat data...</p>
      ) : reservations.length === 0 ? (
        <p className="text-center">Belum ada riwayat pemesanan.</p>
      ) : (
        <table className="table table-bordered text-center">
          <thead className="table-light">
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Meja</th>
              <th>Metode</th>
              <th>Status</th>
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
                <td>
                  <span className={`badge bg-${
                    res.status === 'settlement' ? 'success' :
                    res.status === 'pending' ? 'warning' : 'danger'
                  }`}>
                    {res.status}
                  </span>
                </td>
                <td>{res.createdAt?.toDate().toLocaleString() || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ReservationHistory;
