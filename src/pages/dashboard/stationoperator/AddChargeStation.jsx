import Swal from "sweetalert2";
import Cookies from "js-cookie";
import Map from "../../../components/map/Map";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useState } from "react";
import { SaveIcon, SlotIcon } from "../../../components/icons/Icons";
import { StationIcon, TypeIcon } from "../../../components/icons/Icons";
import { createChargeStation } from "../../../services/chargeStationsService";
import { LoadingSpinner, LocationIcon } from "../../../components/icons/Icons";

export default function AddChargeStation() {
  const [form, setForm] = useState({
    stationName: "",
    type: "",
    slot: "",
    longitude: "",
    latitude: "",
    isAvailable: true,
  });
  const [loading, setLoading] = useState(false);

  // Default coordinates (Sri Lanka)
  const defaultCoords = [79.8612, 6.9271];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value === "" ? "" : Number(value),
    });
  };

  const handleLocationSelect = (location) => {
    setForm({
      ...form,
      latitude: location.lat,
      longitude: location.lng,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const createdByUserId = Cookies.get("userId");

      if (!createdByUserId) {
        Swal.fire({
          title: "Authentication Required",
          text: "User session expired. Please log in again to deploy chargers.",
          icon: "error",
          confirmButtonColor: "#dc2626",
          background: "#1f2937",
          color: "#f3f4f6"
        });
        setLoading(false);
        return;
      }
      // Prepare payload according to API requirements
      const payload = {
        ...form,
        slot: parseInt(form.slot),
        longitude: parseFloat(form.longitude),
        latitude: parseFloat(form.latitude),
        createdByUserId,
      };

      await createChargeStation(payload);
      Swal.fire({
        title: "Charger Deployed!",
        text: "New charging station successfully added to the network",
        icon: "success",
        confirmButtonColor: "#8b5cf6",
        background: "#1f2937",
        color: "#f3f4f6"
      });
      setForm({
        stationName: "",
        type: "",
        slot: "",
        longitude: "",
        latitude: "",
        isAvailable: true,
      });
    } catch (err) {
      Swal.fire({
        title: "Deployment Failed",
        text: err.message,
        icon: "error",
        confirmButtonColor: "#dc2626",
        background: "#1f2937",
        color: "#f3f4f6"
      });
    } finally {
      setLoading(false);
    }
  };

  const chargerTypes = ["AC", "DC"];

  return (
    <DashboardLayout title="Deploy New Charger">
      <div className="mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-purple-600 to-amber-600 rounded-2xl shadow-2xl p-8 mb-8 text-white border border-purple-500/30">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
              <StationIcon />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Deploy Charging Infrastructure</h1>
              <p className="text-purple-100 mt-2 text-lg">
                Register new electric vehicle charging station in the network
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-gray-800 rounded-2xl shadow-2xl border border-purple-500/30 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-700 bg-gray-900/50">
              <h2 className="text-xl font-semibold text-white flex items-center space-x-3">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <StationIcon />
                </div>
                <span>Charger Configuration</span>
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Station Name */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 text-lg font-bold text-gray-300">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                      <StationIcon />
                    </div>
                    <span>Charger Name</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="stationName"
                      value={form.stationName}
                      onChange={handleChange}
                      placeholder="Enter charger station name"
                      className="w-full px-4 py-4 pl-12 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 hover:border-gray-500 text-white placeholder-gray-400"
                      required
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-amber-400">
                      <StationIcon />
                    </div>
                  </div>
                </div>

                {/* Charger Type */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 text-lg font-bold text-gray-300">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                      <TypeIcon />
                    </div>
                    <span>Charger Technology</span>
                  </label>
                  <div className="relative">
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className="w-full px-4 py-4 pl-12 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 hover:border-gray-500 text-white appearance-none"
                      required
                    >
                      <option value="" className="bg-gray-700">Select charger technology</option>
                      {chargerTypes.map((type) => (
                        <option key={type} value={type} className="bg-gray-700">
                          {type}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-amber-400">
                      <TypeIcon />
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Number of Slots */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 text-lg font-bold text-gray-300">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <SlotIcon />
                    </div>
                    <span>Connector Ports</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="slot"
                      value={form.slot}
                      onChange={handleNumberChange}
                      placeholder="Enter number of connectors"
                      min="1"
                      max="50"
                      className="w-full px-4 py-4 pl-12 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 hover:border-gray-500 text-white placeholder-gray-400"
                      required
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-400">
                      <SlotIcon />
                    </div>
                  </div>
                </div>

                {/* Coordinates Display */}
                <div className="md:col-span-2">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <LocationIcon />
                    </div>
                    <span>Location Coordinates</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-lg font-bold text-gray-300">
                        Longitude
                      </label>
                      <input
                        type="number"
                        name="longitude"
                        value={form.longitude}
                        onChange={handleNumberChange}
                        placeholder="Select location on map"
                        step="0.000001"
                        className="w-full px-4 py-4 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-white bg-gray-600"
                        required
                        readOnly
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-lg font-bold text-gray-300">
                        Latitude
                      </label>
                      <input
                        type="number"
                        name="latitude"
                        value={form.latitude}
                        onChange={handleNumberChange}
                        placeholder="Select location on map"
                        step="0.000001"
                        className="w-full px-4 py-4 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-white bg-gray-600"
                        required
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Current Coordinates Display */}
                  {(form.longitude || form.latitude) && (
                    <div className="mt-6 p-6 bg-green-500/10 border border-green-500/30 rounded-2xl">
                      <div className="flex items-center space-x-3 text-green-400">
                        <LocationIcon />
                        <span className="font-bold text-lg">
                          Location Locked!
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-6 text-lg">
                        <div>
                          <span className="font-medium text-gray-300">Longitude:</span>
                          <span className="font-mono ml-3 text-green-300">
                            {form.longitude}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-300">Latitude:</span>
                          <span className="font-mono ml-3 text-green-300">
                            {form.latitude}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-6 bg-gray-700/50 rounded-2xl border border-gray-600">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/30">
                    <svg
                      className="w-6 h-6 text-amber-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div>
                    <label className="block text-lg font-bold text-white">
                      Charger Status
                    </label>
                    <p className="text-sm text-gray-400">
                      Activate or deactivate this charging station
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={form.isAvailable}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500 rounded-xl peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-xl after:h-6 after:w-6 after:transition-all peer-checked:bg-amber-500"></div>
                  <span className="ml-3 text-lg font-bold text-white">
                    {form.isAvailable ? "🟢 ACTIVE" : "🔴 OFFLINE"}
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-8">
                <button
                  type="submit"
                  disabled={loading || !form.longitude || !form.latitude}
                  className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white font-bold rounded-2xl shadow-2xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-amber-500/30"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner />
                      <span className="ml-3">Deploying Charger...</span>
                    </>
                  ) : (
                    <>
                      <SaveIcon />
                      <span className="ml-3">Deploy Charging Station</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Map Section */}
          <div className="bg-gray-800 rounded-2xl shadow-2xl border border-purple-500/30 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-700 bg-gray-900/50">
              <h2 className="text-xl font-semibold text-white flex items-center space-x-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <LocationIcon />
                </div>
                <span>Select Charger Location</span>
              </h2>
              <p className="text-sm text-gray-400 mt-3">
                Click anywhere on the map to set precise charger location coordinates
              </p>
            </div>
            <div className="p-6 h-[600px]">
              <Map
                onLocationSelect={handleLocationSelect}
                defaultCoords={defaultCoords}
                isEditable={true}
              />
            </div>
            <div className="px-6 py-4 border-t border-gray-700 bg-gray-900/50">
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <svg
                    className="w-5 h-5 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span>
                  Click on the map to select your charging station location. Coordinates will be automatically captured.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-8">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/30">
              <svg
                className="w-6 h-6 text-amber-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-amber-300 text-lg">Deployment Guidelines</h3>
              <ul className="mt-3 text-amber-200/80 space-y-2">
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                  <span>Click on map to select precise charger location - coordinates auto-capture</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                  <span>Choose appropriate charger technology for vehicle compatibility</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                  <span>Set correct number of available charging connectors</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                  <span>Mark station offline during maintenance periods</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                  <span>All configuration fields are required for deployment</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}