import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Button from "../../components/loading/Button";
import { registerUser } from "../../services/authService";
import registerImage from "../../assets/auth/register-customer.png";

export default function SignUp() {
  const navigate = useNavigate();

  // Consolidated form state
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    agree: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  // ------------------- Input Handlers ------------------- //
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ------------------- Validation ------------------- //
  const validateForm = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Enter a valid email address";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!form.role) newErrors.role = "Please select a user role";
    if (!form.agree) newErrors.agree = "You must accept the Terms of Service";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ------------------- Register Handler ------------------- //
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const payload = {
        email: form.email,
        fullName: form.fullName,
        password: form.password,
        roles: [form.role],
      };

      await registerUser(payload);

      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Your account has been created successfully.",
        confirmButtonColor: "#10B981",
      });

      navigate("/login");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: err.message || "Something went wrong. Please try again.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  // ------------------- UI ------------------- //
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-br from-sky-50 to-gray-100">
      <div className="flex flex-col md:flex-row bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-6xl">
        {/* Left Image Section */}
        <aside className="hidden md:flex md:w-1/2">
          <img
            src={registerImage}
            alt="EV Registration Illustration"
            className="w-full h-full object-cover"
          />
        </aside>

        {/* Right Registration Form */}
        <main className="flex-1 flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-extrabold text-sky-600 mb-2">
              Join the EV Network ⚡
            </h1>
            <p className="text-gray-500 mb-6">
              Register to manage your EV charging operations easily and
              efficiently.
            </p>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 bg-white/60 backdrop-blur-lg p-4 md:p-0"
            >
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={form.fullName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 ${
                    errors.fullName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
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
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Select Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 ${
                    errors.role ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Choose your role</option>
                  <option value="Backoffice">Backoffice</option>
                  <option value="StationOperator">Station Operator</option>
                </select>
                {errors.role && (
                  <p className="text-sm text-red-600 mt-1">{errors.role}</p>
                )}
              </div>

              {/* Password */}
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
                    placeholder="Enter password"
                    value={form.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPwd ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPwd ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPwd((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPwd ? (
                      <FaEyeSlash size={18} />
                    ) : (
                      <FaEye size={18} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-2 mt-3">
                <input
                  type="checkbox"
                  id="agree"
                  name="agree"
                  checked={form.agree}
                  onChange={handleChange}
                  className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                />
                <label
                  htmlFor="agree"
                  className="text-sm text-gray-700 leading-tight"
                >
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-sky-600 hover:text-sky-700 font-semibold underline"
                  >
                    Terms of Service
                  </Link>
                </label>
              </div>
              {errors.agree && (
                <p className="text-sm text-red-600 mt-1">{errors.agree}</p>
              )}

              {/* Submit Button */}
              <Button onClick={handleSubmit} loading={loading} disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>

              {/* Redirect to login */}
              <p className="text-center text-sm text-gray-600 mt-4">
                Already registered?{" "}
                <Link
                  to="/login"
                  className="text-sky-600 font-semibold hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
}
