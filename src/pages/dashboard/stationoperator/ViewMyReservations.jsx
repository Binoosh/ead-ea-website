import Swal from "sweetalert2";
import Loading from "../../../components/loading/Loading";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import { EditIcon, EyeIcon } from "../../../components/icons/Icons";
import { CloseIcon, DeleteIcon } from "../../../components/icons/Icons";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  StationIcon,
  FilterIcon,
} from "../../../components/icons/Icons";
import { fetchReservationsWithDetails } from "../../../services/reservationsService";
import { fetchMyChargeStations } from "../../../services/chargeStationsService";
import { deleteReservation } from "../../../services/reservationsService";
import { fetchReservationById } from "../../../services/reservationsService";
import Cookies from "js-cookie";

export default function ViewMyReservations() {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [myStations, setMyStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState("all");
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [userId, setUserId] = useState(null);

  // Load user ID from cookies and initial data
  useEffect(() => {
    const userCookie = Cookies.get("userId");
    if (userCookie) {
      setUserId(userCookie);
    } else {
      Swal.fire({
        title: "Authentication Required",
        text: "User session not found. Please login to access your bookings.",
        icon: "error",
        background: "#1f2937",
        color: "#f3f4f6"
      });
    }
  }, []);

  const loadData = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      // Load reservations and user's stations in parallel
      const [reservationsData, stationsData] = await Promise.all([
        fetchReservationsWithDetails(),
        fetchMyChargeStations(userId),
      ]);

      setReservations(reservationsData);
      setMyStations(stationsData);
      setFilteredReservations(reservationsData); // Initially show all reservations
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message,
        icon: "error",
        background: "#1f2937",
        color: "#f3f4f6"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadData();
    }
  }, [userId]);

  // Filter reservations when station selection changes
  useEffect(() => {
    if (selectedStation === "all") {
      setFilteredReservations(reservations);
    } else {
      const filtered = reservations.filter(
        (reservation) => reservation.chargeStation?.id === selectedStation
      );
      setFilteredReservations(filtered);
    }
  }, [selectedStation, reservations]);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Cancel Booking?",
      text: "This charging session will be permanently cancelled!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Cancel Session",
      cancelButtonText: "Keep Booking",
      background: "#1f2937",
      color: "#f3f4f6"
    });
    if (!confirm.isConfirmed) return;

    try {
      await deleteReservation(id);
      Swal.fire({
        title: "Session Cancelled",
        text: "Charging booking removed successfully",
        icon: "success",
        background: "#1f2937",
        color: "#f3f4f6"
      });
      loadData();
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message,
        icon: "error",
        background: "#1f2937",
        color: "#f3f4f6"
      });
    }
  };

  const handleView = async (id) => {
    try {
      const reservation = await fetchReservationById(id);
      setSelectedReservation(reservation);
      setShowViewModal(true);
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message,
        icon: "error",
        background: "#1f2937",
        color: "#f3f4f6"
      });
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return timeString.substring(0, 5); // Extract HH:MM from HH:MM:SS
  };

  // Calculate duration in hours
  const calculateDuration = (fromTime, toTime) => {
    if (!fromTime || !toTime) return "N/A";

    const from = new Date(`2000-01-01T${fromTime}`);
    const to = new Date(`2000-01-01T${toTime}`);
    const diffHours = (to - from) / (1000 * 60 * 60);

    return `${diffHours.toFixed(1)}h`;
  };

  // Get station name by ID
  const getStationName = (stationId) => {
    const station = myStations.find((s) => s.id === stationId);
    return station ? station.stationName : "Unknown Charger";
  };

  return (
    <DashboardLayout title="Session Management">
      {/* Station Filter Section */}
      <div className="bg-gray-800 rounded-2xl shadow-2xl border border-purple-500/30 p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Charging Session Management
            </h2>
            <p className="text-gray-400 text-lg mt-2">
              Monitor and manage charging sessions across your infrastructure
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
              <FilterIcon className="text-purple-400" />
            </div>
            <select
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              className="px-6 py-3.5 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-white min-w-[250px] appearance-none"
            >
              <option value="all" className="bg-gray-700">All Charging Stations</option>
              {myStations.map((station) => (
                <option key={station.id} value={station.id} className="bg-gray-700">
                  {station.stationName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <Loading text="Loading Charging Sessions..." />
      ) : filteredReservations.length === 0 ? (
        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-purple-500/30 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
              <CalendarIcon />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {selectedStation === "all"
                ? "No Active Sessions"
                : "No Sessions for This Charger"}
            </h3>
            <p className="text-gray-400 text-lg mb-8">
              {selectedStation === "all"
                ? "There are no active charging sessions across your network."
                : `No charging sessions scheduled for ${getStationName(
                    selectedStation
                  )}.`}
            </p>
            {selectedStation !== "all" && (
              <button
                onClick={() => setSelectedStation("all")}
                className="px-6 py-3 text-amber-400 hover:text-amber-300 font-bold text-lg transition-colors"
              >
                View All Chargers
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-purple-500/30 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-700 bg-gray-900/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {selectedStation === "all"
                    ? `All Charging Sessions (${filteredReservations.length})`
                    : `${getStationName(selectedStation)} Sessions (${
                        filteredReservations.length
                      })`}
                </h3>
                <p className="text-gray-400 text-lg mt-2">
                  Manage active and upcoming charging sessions
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900/80">
                <tr>
                  <th className="px-8 py-6 text-left text-sm font-bold text-amber-400 uppercase tracking-wider">
                    Charger Station
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-amber-400 uppercase tracking-wider">
                    Session Date
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-amber-400 uppercase tracking-wider">
                    Time Window
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-amber-400 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-amber-400 uppercase tracking-wider">
                    EV Driver
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-amber-400 uppercase tracking-wider">
                    Session Controls
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredReservations.map((reservation) => (
                  <tr
                    key={reservation.id}
                    className="hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/30">
                          <StationIcon />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white">
                            {reservation.chargeStation?.stationName ||
                              "Unknown Charger"}
                          </div>
                          <div className="text-sm text-gray-400">
                            {reservation.chargeStation?.type || "N/A"} Technology
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <CalendarIcon />
                        </div>
                        <span className="text-lg font-bold text-white">
                          {formatDate(reservation.bookDate)}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-lg text-white">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-amber-500/20 rounded-lg">
                            <ClockIcon />
                          </div>
                          <span className="font-mono text-lg">
                            {formatTime(reservation.fromTime)}
                          </span>
                          <span className="text-gray-400 text-xl">-</span>
                          <span className="font-mono text-lg">
                            {formatTime(reservation.toTime)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="bg-gradient-to-r from-purple-500/20 to-amber-500/20 text-amber-400 px-4 py-3 rounded-xl text-lg font-bold border border-amber-500/30">
                        {calculateDuration(
                          reservation.fromTime,
                          reservation.toTime
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
                          <UserIcon />
                        </div>
                        <div className="text-lg font-bold text-white">
                          {reservation.evOwner
                            ? `${reservation.evOwner.firstName} ${reservation.evOwner.lastName}`
                            : "Guest Driver"}
                          <br />
                          <span className="font-light text-sm text-gray-400">
                            {reservation.evOwner
                              ? `${reservation.evOwner.vehicleType} (${reservation.evOwner.vehicleNumber})`
                              : "Vehicle N/A"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-lg font-bold">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleView(reservation.id)}
                          className="inline-flex items-center p-3 text-lg font-bold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-purple-500/30"
                          title="View Session Details"
                        >
                          <EyeIcon />
                        </button>
                        <button
                          onClick={() => handleDelete(reservation.id)}
                          className="inline-flex items-center p-3 text-lg font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 border border-red-500/30"
                          title="Cancel Session"
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedReservation && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full transform transition-all border border-amber-500/30">
            <div className="px-8 py-6 border-b border-gray-700 flex justify-between items-center bg-gray-900/50 rounded-t-2xl">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
                Session Details
              </h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-red-400 transition-colors duration-200 p-2 rounded-xl hover:bg-red-500/10 border border-gray-600"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center space-x-4 p-6 bg-purple-500/10 rounded-2xl border border-purple-500/30">
                <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
                  <CalendarIcon />
                </div>
                <div>
                  <h3 className="font-bold text-purple-300 text-xl">
                    Session #{selectedReservation.id?.slice(-6)}
                  </h3>
                  <p className="text-purple-400 text-lg">
                    {formatDate(selectedReservation.bookDate)}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="font-semibold text-gray-300 flex items-center space-x-3">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                      <StationIcon />
                    </div>
                    <span>Charger Station</span>
                  </span>
                  <span className="text-white text-lg text-right">
                    <div className="font-bold">
                      {selectedReservation.chargeStation?.stationName ||
                        "Unknown"}
                    </div>
                    <div className="text-sm text-gray-400">
                      {selectedReservation.chargeStation?.type || "N/A"} Technology
                    </div>
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="font-semibold text-gray-300 flex items-center space-x-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <UserIcon />
                    </div>
                    <span>EV Driver</span>
                  </span>
                  <span className="text-white text-lg text-right">
                    <div className="font-bold">
                      {selectedReservation.evOwner
                        ? `${selectedReservation.evOwner.firstName} ${selectedReservation.evOwner.lastName}`
                        : "Guest Driver"}
                    </div>
                    <div className="text-sm text-gray-400">
                      {selectedReservation.evOwner
                        ? `${selectedReservation.evOwner.vehicleType} (${selectedReservation.evOwner.vehicleNumber})`
                        : "Vehicle N/A"}
                    </div>
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="font-semibold text-gray-300 flex items-center space-x-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <CalendarIcon />
                    </div>
                    <span>Session Date</span>
                  </span>
                  <span className="text-white text-lg">
                    {formatDate(selectedReservation.bookDate)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="font-semibold text-gray-300 flex items-center space-x-3">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                      <ClockIcon />
                    </div>
                    <span>Time Window</span>
                  </span>
                  <span className="text-white text-lg font-mono">
                    {formatTime(selectedReservation.fromTime)} -{" "}
                    {formatTime(selectedReservation.toTime)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="font-semibold text-gray-300">Duration</span>
                  <span className="text-white text-lg">
                    {calculateDuration(
                      selectedReservation.fromTime,
                      selectedReservation.toTime
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}