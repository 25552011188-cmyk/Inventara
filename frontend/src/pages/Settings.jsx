import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { Upload, Save, Image as ImageIcon } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Settings() {
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentLogo, setCurrentLogo] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchLogo();
  }, []);

  const fetchLogo = async () => {
    try {
      const res = await api.get('/settings');
      if (res.data.logo_url) {
        setCurrentLogo(res.data.logo_url);
      }
    } catch (e) { console.error(e); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!logo) {
      toast.error('Pilih file logo dulu bro!');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('logo', logo);

    try {
      await api.post('/settings/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Logo berhasil diganti!');
      fetchLogo(); // Refresh data
      setLogo(null);
      setPreview(null);
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      toast.error('Gagal upload logo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Pengaturan Aplikasi</h1>
        <p className="text-gray-500 text-sm mt-1">Custom branding untuk Inventara</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <ImageIcon size={20} />
          <span>Ganti Logo Aplikasi</span>
        </h2>
        
        <div className="space-y-4">
          {/* Preview Logo Saat Ini */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50">
            <p className="text-sm text-gray-500 mb-3">Logo Saat Ini:</p>
            {currentLogo ? (
              <img src={currentLogo} alt="Current Logo" className="h-16 object-contain mb-2" />
            ) : (
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl mb-2">
                I
              </div>
            )}
            <p className="text-xs text-gray-400">Inventara (Default)</p>
          </div>

          {/* Form Upload */}
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Logo Baru</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {/* Preview Logo Baru */}
            {preview && (
              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                <img src={preview} alt="Preview" className="h-12 object-contain" />
                <span className="text-sm text-blue-700">Preview logo baru</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2 disabled:opacity-50"
            >
              <Upload size={18} />
              <span>{loading ? 'Mengupload...' : 'Simpan Logo'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}