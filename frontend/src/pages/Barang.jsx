import { useEffect, useState } from 'react';
import { Package, Plus, Pencil, Trash2, Search, X } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

export default function Barang() {
  const [barangList, setBarangList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editingBarang, setEditingBarang] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    kode_barang: '',
    nama_barang: '',
    category_id: '',
    supplier_id: '',
    stok: '',
    stok_minimum: '',
    harga_beli: '',
    harga_jual: '',
    satuan: 'pcs',
  });

  useEffect(() => {
    fetchBarang();
    fetchCategories();
    fetchSuppliers();
  }, []);

  const fetchBarang = async () => {
    try {
      const response = await api.get('/barang');
      setBarangList(response.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (e) {
      console.error('Error fetching categories:', e);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await api.get('/suppliers');
      setSuppliers(response.data);
    } catch (e) {
      console.error('Error fetching suppliers:', e);
    }
  };

  const handleAdd = () => {
    setEditingBarang(null);
    setFormData({
      kode_barang: '',
      nama_barang: '',
      category_id: '',
      supplier_id: '',
      stok: '',
      stok_minimum: '',
      harga_beli: '',
      harga_jual: '',
      satuan: 'pcs',
    });
    setShowModal(true);
  };

  const handleEdit = (barang) => {
    setEditingBarang(barang);
    setFormData({
      kode_barang: barang.kode_barang,
      nama_barang: barang.nama_barang,
      category_id: barang.category_id,
      supplier_id: barang.supplier_id,
      stok: barang.stok,
      stok_minimum: barang.stok_minimum,
      harga_beli: barang.harga_beli,
      harga_jual: barang.harga_jual,
      satuan: barang.satuan || 'pcs', // ← INI PENTING!
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/barang/${deleteId}`);
      fetchBarang();
      toast.success('Barang berhasil dihapus');
    } catch (e) {
      toast.error('Gagal menghapus');
    } finally {
      setShowConfirm(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBarang) {
        await api.put(`/barang/${editingBarang.id}`, formData);
        toast.success('Barang berhasil diupdate');
      } else {
        await api.post('/barang', formData);
        toast.success('Barang baru berhasil ditambahkan');
      }
      setShowModal(false);
      fetchBarang();
    } catch (error) {
      console.error('Error response:', error.response?.data);
      toast.error('Gagal menyimpan data');
    }
  };

  const filtered = barangList.filter(
    (b) =>
      b.nama_barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.kode_barang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatRupiah = (a) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(a);

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Data Barang</h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola semua inventaris gudang Anda
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2 shadow-sm"
        >
          <Plus size={18} />
          <span>Tambah Barang</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center space-x-2 text-gray-500">
          <Search size={20} />
          <input
            type="text"
            placeholder="Cari nama atau kode barang..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full outline-none text-gray-800 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Kode', 'Nama Barang', 'Kategori', 'Supplier', 'Stok', 'Harga Beli', 'Harga Jual', 'Satuan', 'Aksi'].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.length > 0 ? (
                filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {b.kode_barang}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {b.nama_barang}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {b.category?.nama_kategori || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {b.supplier?.nama_supplier || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          b.stok <= b.stok_minimum
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {b.stok}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatRupiah(b.harga_beli)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatRupiah(b.harga_jual)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {b.satuan || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm flex space-x-2">
                      <button
                        onClick={() => handleEdit(b)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    Tidak ada data barang
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingBarang ? 'Edit Barang' : 'Tambah Barang Baru'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kode Barang
                </label>
                <input
                  type="text"
                  value={formData.kode_barang}
                  onChange={(e) =>
                    setFormData({ ...formData, kode_barang: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Barang
                </label>
                <input
                  type="text"
                  value={formData.nama_barang}
                  onChange={(e) =>
                    setFormData({ ...formData, nama_barang: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stok
                </label>
                <input
                  type="number"
                  value={formData.stok}
                  onChange={(e) =>
                    setFormData({ ...formData, stok: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stok Minimum
                </label>
                <input
                  type="number"
                  value={formData.stok_minimum}
                  onChange={(e) =>
                    setFormData({ ...formData, stok_minimum: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Harga Beli
                </label>
                <input
                  type="number"
                  value={formData.harga_beli}
                  onChange={(e) =>
                    setFormData({ ...formData, harga_beli: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Harga Jual
                </label>
                <input
                  type="number"
                  value={formData.harga_jual}
                  onChange={(e) =>
                    setFormData({ ...formData, harga_jual: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Satuan
                </label>
                <select
                  value={formData.satuan}
                  onChange={(e) =>
                    setFormData({ ...formData, satuan: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                >
                  <option value="pcs">Pcs</option>
                  <option value="box">Box</option>
                  <option value="kg">Kg</option>
                  <option value="liter">Liter</option>
                  <option value="meter">Meter</option>
                  <option value="set">Set</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nama_kategori}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier
                </label>
                <select
                  value={formData.supplier_id}
                  onChange={(e) =>
                    setFormData({ ...formData, supplier_id: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
                  required
                >
                  <option value="">Pilih Supplier</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nama_supplier}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2 flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
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
        title="Hapus Barang"
        message="Yakin ingin menghapus barang ini? Tindakan ini tidak bisa dibatalkan."
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}