import { useEffect, useState } from 'react';
import { Truck, Plus, Pencil, Trash2, X } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

export default function Supplier() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({ nama_supplier: '', kontak: '', alamat: '' });

  useEffect(() => { fetchSuppliers(); }, []);

  const fetchSuppliers = async () => {
    try { 
      setSuppliers((await api.get('/suppliers')).data); 
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/suppliers/${editingItem.id}`, formData);
        toast.success('Supplier berhasil diupdate');
      } else {
        await api.post('/suppliers', formData);
        toast.success('Supplier baru berhasil ditambahkan');
      }
      setShowModal(false); 
      fetchSuppliers();
    } catch (e) { 
      toast.error('Gagal menyimpan data'); 
    }
  };

  const handleDelete = (id) => { 
    setDeleteId(id); 
    setShowConfirm(true); 
  };

  const confirmDelete = async () => {
    try { 
      await api.delete(`/suppliers/${deleteId}`); 
      fetchSuppliers(); 
      toast.success('Supplier berhasil dihapus'); 
    } catch (e) { 
      toast.error('Gagal menghapus'); 
    } finally { 
      setShowConfirm(false); 
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Data Supplier</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola daftar supplier atau vendor Anda</p>
        </div>
        <button 
          onClick={() => { 
            setEditingItem(null); 
            setFormData({ nama_supplier: '', kontak: '', alamat: '' }); 
            setShowModal(true); 
          }} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2 shadow-sm"
        >
          <Plus size={18} /> 
          <span>Tambah Supplier</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['ID', 'Nama Supplier', 'Kontak', 'Alamat', 'Aksi'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {suppliers.length > 0 ? suppliers.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-600">{s.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{s.nama_supplier}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{s.kontak || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">{s.alamat || '-'}</td>
                  <td className="px-6 py-4 text-sm flex space-x-2">
                    <button 
                      onClick={() => { 
                        setEditingItem(s); 
                        setFormData({ nama_supplier: s.nama_supplier, kontak: s.kontak || '', alamat: s.alamat || '' }); 
                        setShowModal(true); 
                      }} 
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(s.id)} 
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">Belum ada data supplier</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">{editingItem ? 'Edit Supplier' : 'Tambah Supplier'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Supplier</label>
                <input 
                  type="text" 
                  value={formData.nama_supplier} 
                  onChange={e => setFormData({...formData, nama_supplier: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kontak (No HP / Email)</label>
                <input 
                  type="text" 
                  value={formData.kontak} 
                  onChange={e => setFormData({...formData, kontak: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                <textarea 
                  value={formData.alamat} 
                  onChange={e => setFormData({...formData, alamat: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  rows="3"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                  Batal
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      <ConfirmModal 
        isOpen={showConfirm} 
        title="Hapus Supplier" 
        message="Yakin ingin menghapus supplier ini? Tindakan ini tidak bisa dibatalkan." 
        onConfirm={confirmDelete} 
        onCancel={() => setShowConfirm(false)} 
      />
    </div>
  );
}