import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function BarangMasuk() {
    const [transaksi, setTransaksi] = useState([]);
    const [barangList, setBarangList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        barang_id: "",
        jumlah: "",
        tanggal: new Date().toISOString().split("T")[0],
        keterangan: "",
    });

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [transaksiRes, barangRes] = await Promise.all([
                api.get("/barang-masuk"),
                api.get("/barang"),
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
            await api.post("/barang-masuk", formData);
            setShowModal(false);
            setFormData({
                barang_id: "",
                jumlah: "",
                tanggal: new Date().toISOString().split("T")[0],
                keterangan: "",
            });
            fetchData();
            toast.success("Barang masuk berhasil ditambahkan!");
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            toast.error("Gagal menambahkan barang masuk");
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Barang Masuk
                </h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Tambah Barang Masuk
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Tanggal
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Kode Barang
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Nama Barang
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Jumlah
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Keterangan
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {transaksi.length > 0 ? (
                            transaksi.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm">
                                        {new Date(
                                            item.tanggal,
                                        ).toLocaleDateString("id-ID")}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        {item.barang?.kode_barang || "-"}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {item.barang?.nama_barang || "-"}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                            +{item.jumlah}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {item.keterangan || "-"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="px-6 py-4 text-center text-gray-500"
                                >
                                    Belum ada transaksi barang masuk
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            Tambah Barang Masuk
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Barang *
                                </label>
                                <select
                                    value={formData.barang_id}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            barang_id: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required
                                >
                                    <option value="">Pilih Barang</option>
                                    {barangList.map((barang) => (
                                        <option
                                            key={barang.id}
                                            value={barang.id}
                                        >
                                            {barang.kode_barang} -{" "}
                                            {barang.nama_barang}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Jumlah *
                                </label>
                                <input
                                    type="number"
                                    value={formData.jumlah}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            jumlah: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required
                                    min="1"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Tanggal *
                                </label>
                                <input
                                    type="date"
                                    value={formData.tanggal}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            tanggal: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Keterangan
                                </label>
                                <textarea
                                    value={formData.keterangan}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            keterangan: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border rounded-lg"
                                    rows="3"
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-200 rounded-lg"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
