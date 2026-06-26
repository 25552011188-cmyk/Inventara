import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [logo, setLogo] = useState(null);

    // 1. Fetch Logo Custom dari Backend saat halaman dimuat
    useEffect(() => {
        const fetchLogo = async () => {
            try {
                // GANTI '/api/settings' dengan endpoint settings/logo kamu yang sebenarnya
                const response = await axios.get("/api/settings");
                if (response.data && response.data.logo) {
                    // Pastikan URL logo absolute atau di-handle dengan benar oleh Laravel
                    const logoUrl = response.data.logo.startsWith("http")
                        ? response.data.logo
                        : `${window.location.origin}/storage/${response.data.logo}`;
                    setLogo(logoUrl);
                }
            } catch (error) {
                // Jika gagal fetch logo (misal endpoint belum ada), biarkan null (akan pakai fallback)
                console.log("Logo belum diset atau endpoint belum tersedia.");
            }
        };

        fetchLogo();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // GANTI '/api/login' jika endpoint kamu berbeda (misal '/login')
            const response = await axios.post("/api/login", formData);

            const { token, user, access_token } = response.data;
            const finalToken = token || access_token;

            if (finalToken) {
                // 2. Simpan token ke localStorage (Wajib agar ProtectedRoute bekerja)
                localStorage.setItem("token", finalToken);

                // Opsional: Simpan data user jika dibutuhkan di frontend
                if (user) {
                    localStorage.setItem("user", JSON.stringify(user));
                }

                // Set default header axios untuk request selanjutnya
                axios.defaults.headers.common["Authorization"] =
                    `Bearer ${finalToken}`;

                toast.success(`Selamat datang, ${user?.name || "Admin"}!`);

                // 3. Redirect ke dashboard
                navigate("/dashboard", { replace: true });
            } else {
                toast.error("Login gagal: Token tidak ditemukan.");
            }
        } catch (error) {
            const message =
                error.response?.data?.message || "Email atau password salah.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-gray-100">
                {/* Logo & Branding */}
                <div className="text-center">
                    {logo ? (
                        <div className="mx-auto h-20 w-20 mb-4 flex items-center justify-center">
                            <img
                                src={logo}
                                alt="Company Logo"
                                className="max-h-20 max-w-full object-contain"
                            />
                        </div>
                    ) : (
                        <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                            <svg
                                className="h-10 w-10 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                />
                            </svg>
                        </div>
                    )}

                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                        {logo ? "Login" : "INVENTARA"}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Login Monitoring Gudang
                    </p>
                </div>

                {/* Login Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="admin@inventara.com"
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end">
                        <a
                            href="#"
                            className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                            onClick={(e) => {
                                e.preventDefault();
                                toast("Fitur ini belum tersedia", {
                                    icon: "ℹ️",
                                });
                            }}
                        >
                            Lupa password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        {loading ? (
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        ) : (
                            "Masuk"
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-gray-500">
                    <p>© 2026 Inventara • v1.0.0</p>
                    <p className="mt-1">Sistem Monitoring Gudang</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
