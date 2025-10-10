import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { createReservation } from "../../services/reservationsService";
import { fetchChargeStations } from "../../services/chargeStationsService";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  StationIcon,
  LoadingSpinner,
  SaveIcon,
} from "../../components/icons/Icons";
import Cookies from "js-cookie";

export default function AddReservationEVOwner() {
  const [form, setForm] = useState({
    evOwnerId: "",
    chargeStationId: "",
    bookDate: "",
    fromTime: "",
    toTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [chargeStations, setChargeStations] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [evOwnerInfo, setEvOwnerInfo] = useState(null);

  // Get EV Owner ID from cookies and load data
  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true);
      try {
        // Get EV Owner ID from cookies
        const evOwnerId = Cookies.get("evOwnerId");

        if (!evOwnerId) {
          Swal.fire({
            title: "Authentication Required",
            text: "EV Driver account not found. Please login to book charging sessions.",
            icon: "error",
            confirmButtonColor: "#dc2626",
            background: "#1f2937",
            color: "#f3f4f6"
          });
          return;
        }

        // Set EV Owner ID in form
        setForm((prev) => ({
          ...prev,
          evOwnerId: evOwnerId,
        }));

        // Set EV owner info from cookies
        const firstName = Cookies.get("evOwnerFirstName");
        const lastName = Cookies.get("evOwnerLastName");
        const vehicleType = Cookies.get("evOwnerVehicleType");
        const vehicleNumber = Cookies.get("evOwnerVehicleNumber");

        setEvOwnerInfo({
          id: evOwnerId,
          name: `${firstName || ''} ${lastName || ''}`.trim() || "Your Account",
          vehicle: `${vehicleType || ''} (${vehicleNumber || ''})`.trim() || "Your Vehicle"
        });

        // Load charge stations
        const stationsData = await fetchChargeStations();
        setChargeStations(stationsData.filter((s) => s.isAvailable === true));
      } catch (err) {
        Swal.fire({
          title: "Error Loading Data",
          text: "Failed to load charging infrastructure: " + err.message,
          icon: "error",
          confirmButtonColor: "#dc2626",
          background: "#1f2937",
          color: "#f3f4f6"
        });
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare payload according to API requirements
      const payload = {
        ...form,
        bookDate: new Date(form.bookDate).toISOString(),
      };

      await createReservation(payload);
      Swal.fire({
        title: "Session Booked!",
        text: "Charging session scheduled successfully",
        icon: "success",
        confirmButtonColor: "#8b5cf6",
        background: "#1f2937",
        color: "#f3f4f6"
      });
      setForm({
        evOwnerId: form.evOwnerId, // Keep the EV Owner ID from cookies
        chargeStationId: "",
        bookDate: "",
        fromTime: "",
        toTime: "",
      });
    } catch (err) {
      Swal.fire({
        title: "Booking Failed",
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

  // Get selected charge station details
  const selectedChargeStation = chargeStations.find(
    (station) => station.id === form.chargeStationId
  );

  return (
    <div className="flex justify-center max-w-7xl mx-auto p-8 min-h-screen">
      <div className="flex flex-col w-full">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-purple-600 to-amber-600 rounded-2xl shadow-2xl p-8 mb-8 text-white border border-purple-500/30">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
              <CalendarIcon />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Schedule Charging Session</h1>
              <p className="text-purple-100 mt-2 text-lg">
                Reserve your charging slot at available charging infrastructure
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-8">
          {/* Form Card */}
          <div className="bg-gray-800 rounded-2xl shadow-2xl border border-purple-500/30 overflow-hidden w-3/5">
            <div className="px-8 py-6 border-b border-gray-700 bg-gray-900/50">
              <h2 className="text-2xl font-semibold text-white flex items-center space-x-3">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <CalendarIcon />
                </div>
                <span>Session Configuration</span>
              </h2>
            </div>

            {loadingData ? (
              <div className="p-12 flex justify-center items-center">
                <LoadingSpinner />
                <span className="ml-3 text-gray-300 text-lg">Loading charging infrastructure...</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Charge Station Selection */}
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 text-lg font-bold text-gray-300">
                      <div className="p-2 bg-amber-500/20 rounded-lg">
                        <StationIcon />
                      </div>
                      <span>Select Charger</span>
                    </label>
                    <div className="relative">
                      <select
                        name="chargeStationId"
                        value={form.chargeStationId}
                        onChange={handleChange}
                        className="w-full px-4 py-4 pl-12 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 hover:border-gray-500 text-white appearance-none"
                        required
                      >
                        <option value="" className="bg-gray-700">Choose charging station...</option>
                        {chargeStations.map((station) => (
                          <option key={station.id} value={station.id} className="bg-gray-700">
                            {station.stationName} - {station.type} ({station.slot} connectors)
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-amber-400">
                        <StationIcon />
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

                  {/* Booking Date */}
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 text-lg font-bold text-gray-300">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <CalendarIcon />
                      </div>
                      <span>Session Date</span>
                    </label>
                    <input
                      type="date"
                      name="bookDate"
                      value={form.bookDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-4 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 hover:border-gray-500 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 text-lg font-bold text-gray-300">
                      <div className="p-2 bg-amber-500/20 rounded-lg">
                        <ClockIcon />
                      </div>
                      <span>Start Time</span>
                    </label>
                    <input
                      type="time"
                      name="fromTime"
                      value={form.fromTime}
                      onChange={handleChange}
                      className="w-full px-4 py-4 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 hover:border-gray-500 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 text-lg font-bold text-gray-300">
                      <div className="p-2 bg-amber-500/20 rounded-lg">
                        <ClockIcon />
                      </div>
                      <span>End Time</span>
                    </label>
                    <input
                      type="time"
                      name="toTime"
                      value={form.toTime}
                      onChange={handleChange}
                      className="w-full px-4 py-4 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 hover:border-gray-500 text-white"
                      required
                    />
                  </div>
                </div>

                {/* Reservation Summary */}
                {(form.chargeStationId || form.bookDate || form.fromTime || form.toTime) && (
                  <div className="p-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
                    <h3 className="font-bold text-amber-300 text-xl mb-4">
                      Session Summary
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-lg">
                      {selectedChargeStation && (
                        <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600">
                          <span className="font-semibold text-amber-400">
                            Charger:
                          </span>
                          <div className="mt-2 text-white">
                            {selectedChargeStation.stationName}
                            <div className="text-sm text-gray-400">
                              {selectedChargeStation.type} Technology
                            </div>
                          </div>
                        </div>
                      )}
                      {form.bookDate && (
                        <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600">
                          <span className="font-semibold text-amber-400">
                            Date:
                          </span>
                          <div className="mt-2 text-white">
                            {new Date(form.bookDate).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </div>
                        </div>
                      )}
                      {(form.fromTime || form.toTime) && (
                        <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600">
                          <span className="font-semibold text-amber-400">
                            Time Window:
                          </span>
                          <div className="mt-2 text-white font-mono text-lg">
                            {form.fromTime} - {form.toTime}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end pt-6">
                  <button
                    type="submit"
                    disabled={
                      loading ||
                      !form.evOwnerId ||
                      !form.chargeStationId ||
                      !form.bookDate ||
                      !form.fromTime ||
                      !form.toTime
                    }
                    className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white font-bold rounded-2xl shadow-2xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-amber-500/30"
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner />
                        <span className="ml-3">Scheduling Session...</span>
                      </>
                    ) : (
                      <>
                        <SaveIcon />
                        <span className="ml-3">Confirm Booking</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-gray-800 rounded-2xl shadow-2xl border border-purple-500/30 p-8 w-2/5">
            <div className="space-y-8">
              {/* Driver Info Card */}
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6">
                <h3 className="font-bold text-purple-300 text-xl mb-4 flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <UserIcon />
                  </div>
                  <span>Driver Profile</span>
                </h3>
                <div className="space-y-3 text-purple-200">
                  <div className="flex justify-between">
                    <span className="font-semibold">Account:</span>
                    <span>{evOwnerInfo?.name || "Loading..."}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Vehicle:</span>
                    <span>{evOwnerInfo?.vehicle || "Loading..."}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Status:</span>
                    <span className="text-green-400">🟢 Ready to Charge</span>
                  </div>
                </div>
              </div>

              {/* Booking Guidelines */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6">
                <h3 className="font-bold text-amber-300 text-xl mb-4">Booking Guidelines</h3>
                <ul className="space-y-3 text-amber-200/80">
                  <li className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Your EV Driver account is automatically authenticated</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Choose from available charging stations in the network</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Select compatible time windows for your charging needs</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Ensure charger compatibility with your vehicle type</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>All session details are required for booking confirmation</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Only operational charging stations are available for booking</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}