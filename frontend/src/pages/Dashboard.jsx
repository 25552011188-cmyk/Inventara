import { useEffect, useState } from 'react';
import { 
  Package, AlertTriangle, ArrowDownToLine, ArrowUpFromLine, 
  TrendingUp, TrendingDown, DollarSign, Warehouse 
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, AreaChart, Area 
} from 'recharts';
import api from '../services/api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/dashboard');
      setData(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading...</div></div>;
  }

  if (!data) return null;

  const stats = [
    {
      title: 'Total Barang',
      value: data.ringkasan.total_barang,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Stok Menipis',
      value: data.stok_kritis.stok_menipis,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Total Stok',
      value: data.ringkasan.total_stok,
      icon: Warehouse,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Nilai Stok',
      value: `Rp ${(data.ringkasan.nilai_stok / 1000000).toFixed(1)}jt`,
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ];

  const aktivitasHarian = [
    { label: 'Barang Masuk', value: data.hari_ini.barang_masuk, icon: ArrowDownToLine, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Barang Keluar', value: data.hari_ini.barang_keluar, icon: ArrowUpFromLine, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Pending', value: data.hari_ini.pending_keluar, icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Selamat datang di Inventara - Sistem Monitoring Gudang</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={stat.color} size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Mingguan */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Grafik 7 Hari Terakhir</h2>
            <p className="text-sm text-gray-500">Perbandingan barang masuk dan keluar</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data.grafik_mingguan}>
            <defs>
              <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorKeluar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="hari" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="masuk" 
              name="Barang Masuk" 
              stroke="#10b981" 
              fill="url(#colorMasuk)" 
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="keluar" 
              name="Barang Keluar" 
              stroke="#f59e0b" 
              fill="url(#colorKeluar)" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Grid 2 Kolom */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Barang Keluar */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Top 5 Barang Keluar</h2>
              <p className="text-sm text-gray-500">Bulan ini</p>
            </div>
            <TrendingUp className="text-blue-500" size={20} />
          </div>
          {data.top_barang_keluar.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.top_barang_keluar} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                <XAxis type="number" stroke="#6b7280" fontSize={12} />
                <YAxis 
                  type="category" 
                  dataKey="barang" 
                  stroke="#6b7280" 
                  fontSize={11} 
                  width={100}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="total_keluar" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              Belum ada data
            </div>
          )}
        </div>

        {/* Aktivitas & Stok Kritis */}
        <div className="space-y-6">
          {/* Aktivitas Hari Ini */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Aktivitas Hari Ini</h2>
            <div className="space-y-3">
              {aktivitasHarian.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className={`flex items-center justify-between p-3 ${item.bg} rounded-lg`}>
                    <div className="flex items-center space-x-3">
                      <Icon className={item.color} size={20} />
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </div>
                    <span className={`text-lg font-bold ${item.color}`}>{item.value}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stok Kritis */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Stok Kritis</h2>
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                {data.stok_kritis.stok_menipis} item
              </span>
            </div>
            {data.stok_kritis.daftar_menipis.length > 0 ? (
              <div className="space-y-2">
                {data.stok_kritis.daftar_menipis.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.nama_barang}</p>
                      <p className="text-xs text-gray-500">{item.kode_barang}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-600">{item.stok}</p>
                      <p className="text-xs text-gray-500">min: {item.stok_minimum}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                Semua stok aman 👍
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ringkasan Bulan Ini */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan Bulan Ini</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Masuk</p>
            <p className="text-2xl font-bold text-blue-600">{data.bulan_ini.total_masuk}</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Keluar</p>
            <p className="text-2xl font-bold text-orange-600">{data.bulan_ini.total_keluar}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Transaksi Masuk</p>
            <p className="text-2xl font-bold text-green-600">{data.bulan_ini.transaksi_masuk}</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Transaksi Keluar</p>
            <p className="text-2xl font-bold text-red-600">{data.bulan_ini.transaksi_keluar}</p>
          </div>
        </div>
      </div>
    </div>
  );
}