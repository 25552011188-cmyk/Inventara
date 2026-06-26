import { useEffect, useState } from 'react';
import { Package, Plus, Pencil, Trash2, Search, X, PackageCheck, PackageX } from 'lucide-react';
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
      satuan: barang.satuan || 'pcs',
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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Memuat data barang...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Data Barang</h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola semua inventaris gudang Anda
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <Plus size={18} />
          <span className="font-medium">Tambah Barang</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <Search size={20} className="text-blue-600" />
          </div>
          <input
            type="text"
            placeholder="Cari nama atau kode barang..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full outline-none text-gray-800 placeholder-gray-400 text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={16} className="text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200 sticky top-0 z-10 shadow-sm">
              <tr>
                {['Kode', 'Nama Barang', 'Kategori', 'Supplier', 'Stok', 'Harga Beli', 'Harga Jual', 'Satuan', 'Aksi'].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length > 0 ? (
                filtered.map((b) => {
                  const isLowStock = b.stok <= b.stok_minimum;
                  return (
                    <tr key={b.id} className="hover:bg-blue-50/30 transition-colors duration-150 group">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {b.kode_barang}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                        {b.nama_barang}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium border border-indigo-100">
                          {b.category?.nama_kategori || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="px-2.5 py-1 bg-gray-50 text-gray-700 rounded-lg text-xs font-medium border border-gray-200">
                          {b.supplier?.nama_supplier || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                            isLowStock
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {isLowStock ? <PackageX size={14} /> : <PackageCheck size={14} />}
                          <span>{b.stok}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                        {formatRupiah(b.harga_beli)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                        {formatRupiah(b.harga_jual)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">
                          {b.satuan || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => handleEdit(b)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(b.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <Package size={32} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium">Tidak ada data barang</p>
                        <p className="text-gray-400 text-sm mt-1">
                          {searchTerm ? 'Coba ubah kata kunci pencarian' : 'Mulai dengan menambahkan barang pertama'}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingBarang ? 'Edit Barang' : 'Tambah Barang Baru'}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {editingBarang ? 'Perbarui informasi barang' : 'Isi detail barang baru'}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kode Barang
                </label>
                <input
                  type="text"
                  value={formData.kode_barang}
                  onChange={(e) =>
                    setFormData({ ...formData, kode_barang: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 text-sm"
                  placeholder="Contoh: BRG001"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Barang
                </label>
                <input
                  type="text"
                  value={formData.nama_barang}
                  onChange={(e) =>
                    setFormData({ ...formData, nama_barang: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 text-sm"
                  placeholder="Nama lengkap barang"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Stok
                </label>
                <input
                  type="number"
                  value={formData.stok}
                  onChange={(e) =>
                    setFormData({ ...formData, stok: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 text-sm"
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Stok Minimum
                </label>
                <input
                  type="number"
                  value={formData.stok_minimum}
                  onChange={(e) =>
                    setFormData({ ...formData, stok_minimum: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 text-sm"
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Harga Beli
                </label>
                <input
                  type="number"
                  value={formData.harga_beli}
                  onChange={(e) =>
                    setFormData({ ...formData, harga_beli: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 text-sm"
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Harga Jual
                </label>
                <input
                  type="number"
                  value={formData.harga_jual}
                  onChange={(e) =>
                    setFormData({ ...formData, harga_jual: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 text-sm"
                  placeholder="0"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Satuan
                </label>
                <select
                  value={formData.satuan}
                  onChange={(e) =>
                    setFormData({ ...formData, satuan: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 text-sm"
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 text-sm"
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Supplier
                </label>
                <select
                  value={formData.supplier_id}
                  onChange={(e) =>
                    setFormData({ ...formData, supplier_id: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 text-sm"
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

              <div className="col-span-2 flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium text-sm shadow-md hover:shadow-lg"
                >
                  {editingBarang ? 'Update' : 'Simpan'}
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