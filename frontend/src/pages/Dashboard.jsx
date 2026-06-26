import { useEffect, useState } from 'react';
import { 
  Package, AlertTriangle, ArrowDownToLine, ArrowUpFromLine, 
  TrendingUp, DollarSign, Warehouse 
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Stat Cards Configuration
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
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Nilai Stok',
      value: `Rp ${(data.ringkasan.nilai_stok / 1000000).toFixed(1)}jt`,
      icon: DollarSign,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  const aktivitasHarian = [
    { label: 'Barang Masuk', value: data.hari_ini.barang_masuk, icon: ArrowDownToLine, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Barang Keluar', value: data.hari_ini.barang_keluar, icon: ArrowUpFromLine, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending', value: data.hari_ini.pending_keluar, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Selamat datang di Inventara - Sistem Monitoring Gudang</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-default">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className={stat.color} size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Mingguan */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Grafik 7 Hari Terakhir</h2>
            <p className="text-sm text-gray-500">Perbandingan barang masuk dan keluar</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data.grafik_mingguan}>
            <defs>
              {/* Gradient Biru untuk Barang Masuk */}
              <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              {/* Gradient Indigo untuk Barang Keluar */}
              <linearGradient id="colorKeluar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="hari" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                padding: '12px'
              }} 
            />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
            <Area 
              type="monotone" 
              dataKey="masuk" 
              name="Barang Masuk" 
              stroke="#3b82f6" 
              fill="url(#colorMasuk)" 
              strokeWidth={3}
            />
            <Area 
              type="monotone" 
              dataKey="keluar" 
              name="Barang Keluar" 
              stroke="#6366f1" 
              fill="url(#colorKeluar)" 
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Grid 2 Kolom */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Barang Keluar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Top 5 Barang Keluar</h2>
              <p className="text-sm text-gray-500">Bulan ini</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingUp className="text-blue-600" size={20} />
            </div>
          </div>
          {data.top_barang_keluar.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.top_barang_keluar} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                <XAxis type="number" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis 
                  type="category" 
                  dataKey="barang" 
                  stroke="#6b7280" 
                  fontSize={12} 
                  width={120}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Bar dataKey="total_keluar" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400 bg-gray-50 rounded-xl">
              Belum ada data
            </div>
          )}
        </div>

        {/* Aktivitas & Stok Kritis */}
        <div className="space-y-6">
          {/* Aktivitas Hari Ini */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Hari Ini</h2>
            <div className="space-y-3">
              {aktivitasHarian.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${item.bg} rounded-lg flex items-center justify-center`}>
                        <Icon className={item.color} size={18} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </div>
                    <span className={`text-lg font-bold ${item.color}`}>{item.value}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stok Kritis */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Stok Kritis</h2>
              <span className="px-2.5 py-1 bg-red-50 text-red-600 rounded-full text-xs font-semibold border border-red-100">
                {data.stok_kritis.stok_menipis} item
              </span>
            </div>
            {data.stok_kritis.daftar_menipis.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {data.stok_kritis.daftar_menipis.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-red-50/50 border border-red-100 rounded-xl">
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
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm bg-gray-50 rounded-xl">
                Semua stok aman 👍
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ringkasan Bulan Ini */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Bulan Ini</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Total Masuk</p>
            <p className="text-2xl font-bold text-blue-600">{data.bulan_ini.total_masuk}</p>
          </div>
          <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Total Keluar</p>
            <p className="text-2xl font-bold text-indigo-600">{data.bulan_ini.total_keluar}</p>
          </div>
          <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Transaksi Masuk</p>
            <p className="text-2xl font-bold text-emerald-600">{data.bulan_ini.transaksi_masuk}</p>
          </div>
          <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Transaksi Keluar</p>
            <p className="text-2xl font-bold text-amber-600">{data.bulan_ini.transaksi_keluar}</p>
          </div>
        </div>
      </div>
    </div>
  );
}