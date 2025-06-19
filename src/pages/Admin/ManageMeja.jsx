import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

function AdminPage() {
  const [tables, setTables] = useState([]);
  const [filteredTables, setFilteredTables] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newType, setNewType] = useState('VIP');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');

  const tableCollection = collection(db, 'tables');

  useEffect(() => {
    const fetchTables = async () => {
      const data = await getDocs(tableCollection);
      const tablesData = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setTables(tablesData);
      setFilteredTables(tablesData);
    };
    fetchTables();
  }, []);

  useEffect(() => {
    let filtered = [...tables];
    if (filterStatus) {
      filtered = filtered.filter(t => t.status === filterStatus);
    }
    if (filterType) {
      filtered = filtered.filter(t => t.type === filterType);
    }
    setFilteredTables(filtered);
  }, [filterStatus, filterType, tables]);

  const handleAddTable = async () => {
    const maxNumber = Math.max(0, ...tables.map(t => t.number || 0));
    const newTable = {
      number: maxNumber + 1,
      status: 'available',
      type: newType,
    };
    const docRef = await addDoc(tableCollection, newTable);
    const tableWithId = { ...newTable, id: docRef.id };
    setTables(prev => [...prev, tableWithId]);
    setShowModal(false);
    setNewType('VIP');
  };

  const handleChangeStatus = async (id, newStatus) => {
    await updateDoc(doc(db, 'tables', id), { status: newStatus });
    setTables(prev => prev.map(t => (t.id === id ? { ...t, status: newStatus } : t)));
  };

  const handleChangeType = async (id, newType) => {
    await updateDoc(doc(db, 'tables', id), { type: newType });
    setTables(prev => prev.map(t => (t.id === id ? { ...t, type: newType } : t)));
  };

  const handleDeleteTable = async (id) => {
    const confirm = window.confirm('Yakin ingin menghapus meja ini?');
    if (!confirm) return;
    await deleteDoc(doc(db, 'tables', id));
    setTables(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Manajemen Meja</h2>

      <div className="d-flex flex-wrap gap-3 align-items-center mb-3">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Tambah Meja Baru
        </button>

        <select className="form-select w-auto" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">Filter Status</option>
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="in-use">In Use</option>
        </select>

        <select className="form-select w-auto" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">Filter Tipe</option>
          <option value="VIP">VIP</option>
          <option value="VVIP">VVIP</option>
          <option value="Basic">Basic</option>
        </select>

        <button className="btn btn-outline-secondary" onClick={() => {
          setFilterStatus('');
          setFilterType('');
        }}>
          Reset Filter
        </button>
      </div>

      <table className="table table-bordered text-center align-middle">
        <thead className="table-light">
          <tr>
            <th>No.</th>
            <th>Nomor Meja</th>
            <th>Status</th>
            <th>Tipe</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {[...filteredTables].sort((a, b) => a.number - b.number).map((table, index) => (
            <tr key={table.id}>
              <td>{index + 1}</td>
              <td>{table.number}</td>

              {/* Dropdown Status */}
              <td>
                <select
                  className="form-select form-select-sm"
                  value={table.status}
                  onChange={(e) => handleChangeStatus(table.id, e.target.value)}
                >
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="in-use">In Use</option>
                </select>
              </td>

              {/* Dropdown Tipe */}
              <td>
                <select
                  className="form-select form-select-sm"
                  value={table.type}
                  onChange={(e) => handleChangeType(table.id, e.target.value)}
                >
                  <option value="VIP">VIP</option>
                  <option value="VVIP">VVIP</option>
                  <option value="Basic">Basic</option>
                </select>
              </td>

              <td className="d-flex justify-content-center gap-2">
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDeleteTable(table.id)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Tambah */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h5 className="modal-title">Tambah Meja Baru</h5>
              <div className="mb-3">
                <label className="form-label">Tipe Meja</label>
                <select
                  className="form-select"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                >
                  <option value="VIP">VIP</option>
                  <option value="VVIP">VVIP</option>
                  <option value="Basic">Basic</option>
                </select>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                <button className="btn btn-primary" onClick={handleAddTable}>Simpan</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
