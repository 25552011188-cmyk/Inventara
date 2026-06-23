import { useEffect, useState } from 'react';
import { ArrowUpFromLine, Plus, CheckCircle, XCircle, Clock, X } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

export default function BarangKeluar() {
    const [transaksi, setTransaksi] = useState([]);
    const [barangList, setBarangList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [actionId, setActionId] = useState(null);
    const [formData, setFormData] = useState({
        barang_id: '',
        jumlah: '',
        tanggal: new Date().toISOString().split('T')[0],
        keterangan: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [transaksiRes, barangRes] = await Promise.all([
                api.get('/barang-keluar'),
                api.get('/barang'),
            ]);
            setTransaksi(transaksiRes.data);
            setBarangList(barangRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/barang-keluar', formData);
            setShowModal(false);
            setFormData({
                barang_id: '',
                jumlah: '',
                tanggal: new Date().toISOString().split('T')[0],
                keterangan: ''
            });
            fetchData();
            toast.success('Permintaan barang keluar berhasil dibuat!');
        } catch (error) {
            toast.error('Gagal membuat permintaan');
        }
    };

    const handleApprove = (id) => {
        setActionId(id);
        setConfirmAction('approve');
        setShowConfirm(true);
    };

    const handleReject = (id) => {
        setActionId(id);
        setConfirmAction('reject');
        setShowConfirm(true);
    };

    const executeAction = async () => {
        try {
            if (confirmAction === 'approve') {
                await api.post(`/barang-keluar/${actionId}/approve`);
                toast.success('Barang keluar disetujui!');
            } else {
                await api.post(`/barang-keluar/${actionId}/reject`);
                toast.success('Barang keluar ditolak');
            }
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal memproses');
        } finally {
            setShowConfirm(false);
            setActionId(null);
            setConfirmAction(null);
        }
    };

    const cancelAction = () => {
        setShowConfirm(false);
        setActionId(null);
        setConfirmAction(null);
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return <div className="text-center py-10 text-gray-500">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Barang Keluar</h1>
                    <p className="text-gray-500 text-sm mt-1">Kelola permintaan dan persetujuan barang keluar</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2 shadow-sm"
                >
                    <Plus size={18} />
                    <span>Request Barang Keluar</span>
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                {['Tanggal', 'Kode', 'Nama Barang', 'Jumlah', 'Status', 'Aksi'].map(h => (
                                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {transaksi.length > 0 ? (
                                transaksi.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(item.tanggal).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {item.barang?.kode_barang || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {item.barang?.nama_barang || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                                -{item.jumlah}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                                                {item.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {item.status === 'pending' && (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleApprove(item.id)}
                                                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xs font-medium flex items-center space-x-1"
                                                    >
                                                        <CheckCircle size={14} />
                                                        <span>Approve</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(item.id)}
                                                        className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs font-medium flex items-center space-x-1"
                                                    >
                                                        <XCircle size={14} />
                                                        <span>Reject</span>
                                                    </button>
                                                </div>
                                            )}
                                            {item.status === 'approved' && (
                                                <span className="text-green-600 text-xs font-medium">
                                                    ✓ Disetujui
                                                </span>
                                            )}
                                            {item.status === 'rejected' && (
                                                <span className="text-red-600 text-xs font-medium">
                                                    ✗ Ditolak
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                        Belum ada transaksi barang keluar
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
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-800">Request Barang Keluar</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Barang</label>
                                <select
                                    value={formData.barang_id}
                                    onChange={(e) => setFormData({ ...formData, barang_id: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Pilih Barang</option>
                                    {barangList.map((barang) => (
                                        <option key={barang.id} value={barang.id}>
                                            {barang.kode_barang} - {barang.nama_barang} (Stok: {barang.stok})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
                                <input
                                    type="number"
                                    value={formData.jumlah}
                                    onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    min="1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                                <input
                                    type="date"
                                    value={formData.tanggal}
                                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                                <textarea
                                    value={formData.keterangan}
                                    onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                                    Batal
                                </button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                    Kirim Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi */}
            <ConfirmModal
                isOpen={showConfirm}
                title={confirmAction === 'approve' ? 'Konfirmasi Persetujuan' : 'Konfirmasi Penolakan'}
                message={
                    confirmAction === 'approve'
                        ? 'Apakah Anda yakin ingin menyetujui barang keluar ini? Stok akan otomatis berkurang.'
                        : 'Apakah Anda yakin ingin menolak permintaan barang keluar ini?'
                }
                confirmText={confirmAction === 'approve' ? 'Ya, Setujui' : 'Ya, Tolak'}
                type={confirmAction === 'approve' ? 'warning' : 'danger'}
                onConfirm={executeAction}
                onCancel={cancelAction}
            />
        </div>
    );
}