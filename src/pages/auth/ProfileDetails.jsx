import Swal from "sweetalert2";
import Cookies from "js-cookie";
import Loading from "../../components/loading/Loading";
import registercustomer from "../../assets/auth/register-customer.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { USER_ROLE_COLORS } from "../../constants/user-roles";
import { getCurrentUser } from "../../services/authService";
import { formatLabel } from "../../utils/formatLabel";

export default function ProfileDetails() {
  const token = Cookies.get("accessToken");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [pageLoading, setPageLoading] = useState(true);
  const [errors, setErrors] = useState({});

  // Fetch user data
  const fetchProfile = async () => {
    try {
      setPageLoading(true);
      const userData = await getCurrentUser();
      setUser(userData);
      setForm({
        name: userData.name,
        email: userData.email,
        phone: userData.phone || "",
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message || "Failed to load profile",
        confirmButtonColor: "#dc2626",
        background: "#1f2937",
        color: "#f3f4f6"
      });
      navigate("/login");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return navigate("/login");
    fetchProfile();
  }, []);

  if (pageLoading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-purple-900">
        <Loading text="Loading Profile..." />
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white">
        Failed to load profile
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 relative bg-gradient-to-br from-gray-900 to-purple-900">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* Background Image for Mobile */}
      <div className="md:hidden absolute inset-0 z-0">
        <img
          src={registercustomer}
          alt="Profile Background"
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      <div className="bg-gray-800/90 w-full max-w-6xl flex flex-col md:flex-row rounded-2xl shadow-2xl overflow-hidden z-10 border border-purple-500/30 backdrop-blur-sm">
        {/* Left image */}
        <div className="hidden md:block md:w-1/2 bg-gray-900 relative">
          <img
            src={registercustomer}
            alt="Profile Visual"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent"></div>
          <div className="absolute bottom-8 left-8">
            <h2 className="text-2xl font-bold text-white">User Profile</h2>
            <p className="text-gray-300">Manage your account information</p>
          </div>
        </div>

        {/* Right form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-800/95 rounded-2xl md:rounded-none">
          <div className="flex flex-col w-full max-w-md">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">
                Account Overview
              </h2>
              <span
                className={`px-4 py-2 rounded-lg text-xs font-medium capitalize border ${
                  USER_ROLE_COLORS[user.role] || "bg-gray-700 text-gray-300 border-gray-600"
                }`}
              >
                {formatLabel(user.role)}
              </span>
            </div>

            <div className="space-y-6">
              {["name", "email"].map((key) => (
                <div key={key} className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300 capitalize">
                    {key === "email" ? "Email Address" : "Full Name"}
                  </label>
                  <div className="relative">
                    <input
                      type={key === "email" ? "email" : "text"}
                      value={form[key]}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                      className={`w-full px-4 py-3 bg-gray-700 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-gray-400 ${
                        errors[key] ? "border-red-500" : "border-gray-600"
                      }`}
                      readOnly={key === "email"}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <div className="w-6 h-6 bg-amber-500/20 rounded flex items-center justify-center">
                        <span className="text-amber-400 text-xs">🔒</span>
                      </div>
                    </div>
                  </div>
                  {errors[key] && (
                    <p className="text-red-400 text-sm mt-2">{errors[key]}</p>
                  )}
                </div>
              ))}
              
              {/* Account Status */}
              <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">Account Status</h3>
                    <p className="text-gray-400 text-sm">Your account is active and verified</p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Security Note */}
              <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
                <div className="flex items-start space-x-3">
                  <span className="text-amber-400 text-lg">⚠️</span>
                  <div>
                    <h4 className="font-semibold text-amber-300 text-sm">Security Notice</h4>
                    <p className="text-amber-200/80 text-xs mt-1">
                      Contact support to update your email address or other sensitive information.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}