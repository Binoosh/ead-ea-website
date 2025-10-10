import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { loginUser } from "../../services/authService";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import registercustomer from "../../assets/auth/register-customer.png";
import Button from "../../components/loading/Button";

export default function LoginPage() {
  const navigate = useNavigate();

  // Consolidated form state
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  // ---------------------- Validation ---------------------- //
  const validateForm = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Enter a valid email address";
    if (!form.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------------- Handle Input ---------------------- //
  const handleInputChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ---------------------- Login Action ---------------------- //
  const handleLogin = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const data = await loginUser({
        email: form.email,
        password: form.password,
      });

      // Expiry (60 days if remember, else 3 hours)
      const expires = form.remember ? 60 : 0.125;

      const cookieData = {
        accessToken: data.accessToken,
        accessTokenExpiresAtUtc: data.accessTokenExpiresAtUtc,
        refreshToken: data.refreshToken,
        refreshTokenExpiresAtUtc: data.refreshTokenExpiresAtUtc,
        email: data.email,
        fullName: data.fullName,
        roles: JSON.stringify(data.roles),
      };

      Object.entries(cookieData).forEach(([key, val]) =>
        Cookies.set(key, val, { expires })
      );

      navigate("/");
      window.location.reload();
    } catch (err) {
      Swal.fire({
        title: "Login Failed",
        text: err.message || "Unable to log in. Please try again.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  // ---------------------- UI Layout ---------------------- //
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10 relative">
      {/* Mobile background */}
      <div className="absolute md:hidden inset-0 z-0">
        <img
          src={registercustomer}
          alt="EV Login Background"
          className="w-full h-full object-cover opacity-70"
        />
      </div>

      <div className="relative z-10 bg-white shadow-2xl rounded-3xl flex flex-col md:flex-row w-full max-w-6xl overflow-hidden">
        {/* Left Image */}
        <aside className="hidden md:flex md:w-1/2 bg-gray-100">
          <img
            src={registercustomer}
            alt="EV Illustration"
            className="w-full h-full object-cover"
          />
        </aside>

        {/* Right Login Form */}
        <main className="flex-1 p-8 md:p-12 flex items-center justify-center">
          <div className="w-full max-w-md space-y-8">
            <header>
              <h1 className="text-4xl font-extrabold text-sky-600 mb-1">
                Welcome Back 👋
              </h1>
              <p className="text-gray-500">Log in to your EV Station account</p>
            </header>

            {/* ---------------------- Form ---------------------- */}
            <form
              className="space-y-5 mt-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPwd ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPwd ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember + Forgot */}
              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                  />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sky-600 hover:text-sky-700 font-semibold"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                onClick={handleLogin}
                loading={loading}
                disabled={!form.email || !form.password || loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <hr className="flex-grow border-gray-300" />
              <span className="text-sm text-gray-500">or</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            {/* Google Login */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 border border-red-500 rounded-lg py-2.5 text-gray-800 font-medium hover:bg-gray-50 transition-all"
            >
              <FaGoogle className="text-red-500" />
              Continue with Google
            </button>

            {/* Signup Redirect */}
            <p className="text-sm text-center text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-sky-600 font-semibold hover:underline hover:text-sky-700"
              >
                Create one
              </Link>
            </p>
          </div>
        </main>
      </div>
    </section>
  );
}
