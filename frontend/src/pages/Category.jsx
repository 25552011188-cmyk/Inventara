import { useEffect, useState } from 'react';
import { Tag, Plus, Pencil, Trash2, X } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({ nama_kategori: '', deskripsi: '' });

  useEffect(() => { 
    fetchCategories(); 
  }, []);

  const fetchCategories = async () => {
    try { 
      setCategories((await api.get('/categories')).data); 
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
        await api.put(`/categories/${editingItem.id}`, formData);
        toast.success('Kategori berhasil diupdate');
      } else {
        await api.post('/categories', formData);
        toast.success('Kategori baru berhasil ditambahkan');
      }
      setShowModal(false); 
      fetchCategories();
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
      await api.delete(`/categories/${deleteId}`); 
      fetchCategories(); 
      toast.success('Kategori berhasil dihapus'); 
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
          <h1 className="text-2xl font-bold text-gray-800">Data Kategori</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola kategori atau jenis barang</p>
        </div>
        <button 
          onClick={() => { 
            setEditingItem(null); 
            setFormData({ nama_kategori: '', deskripsi: '' }); 
            setShowModal(true); 
          }} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2 shadow-sm"
        >
          <Plus size={18} /> 
          <span>Tambah Kategori</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['ID', 'Nama Kategori', 'Deskripsi', 'Aksi'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.length > 0 ? categories.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-600">{c.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{c.nama_kategori}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.deskripsi || '-'}</td>
                  <td className="px-6 py-4 text-sm flex space-x-2">
                    <button 
                      onClick={() => { 
                        setEditingItem(c); 
                        setFormData({ nama_kategori: c.nama_kategori, deskripsi: c.deskripsi || '' }); 
                        setShowModal(true); 
                      }} 
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(c.id)} 
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-500">Belum ada data kategori</td>
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
              <h2 className="text-lg font-semibold text-gray-800">{editingItem ? 'Edit Kategori' : 'Tambah Kategori'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
                <input 
                  type="text" 
                  value={formData.nama_kategori} 
                  onChange={e => setFormData({...formData, nama_kategori: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea 
                  value={formData.deskripsi} 
                  onChange={e => setFormData({...formData, deskripsi: e.target.value})} 
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
        title="Hapus Kategori" 
        message="Yakin ingin menghapus kategori ini? Tindakan ini tidak bisa dibatalkan." 
        onConfirm={confirmDelete} 
        onCancel={() => setShowConfirm(false)} 
      />
    </div>
  );
}