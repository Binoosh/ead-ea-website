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
} from "../../../components/icons/Icons";
import { fetchReservationsWithDetails } from "../../../services/reservationsService";
import { deleteReservation } from "../../../services/reservationsService";
import { fetchReservationById } from "../../../services/reservationsService";
import { updateReservation } from "../../../services/reservationsService";

export default function ViewReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});

  const loadReservations = async () => {
    setLoading(true);
    try {
      const data = await fetchReservationsWithDetails();
      setReservations(data);
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
    loadReservations();
  }, []);

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
      loadReservations();
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

  const handleEdit = (reservation) => {
    setEditForm({
      id: reservation.id,
      evOwnerId: reservation.evOwner?.id,
      chargeStationId: reservation.chargeStation?.id,
      bookDate: reservation.bookDate,
      fromTime: reservation.fromTime,
      toTime: reservation.toTime,
    });

    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    try {
      const payload = {
        id: editForm.id,
        evOwnerId: editForm.evOwnerId,
        chargeStationId: editForm.chargeStationId,
        bookDate: new Date(editForm.bookDate).toISOString(),
        fromTime: editForm.fromTime,
        toTime: editForm.toTime,
      };

      console.log("Payload:", payload);

      await updateReservation(editForm.id, payload);

      Swal.fire({
        title: "Booking Updated",
        text: "Charging session rescheduled successfully",
        icon: "success",
        background: "#1f2937",
        color: "#f3f4f6"
      });
      setShowEditModal(false);
      loadReservations();
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

  // Format datetime for input
  const formatDateTimeForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  // Calculate duration in hours
  const calculateDuration = (fromTime, toTime) => {
    if (!fromTime || !toTime) return "N/A";

    const from = new Date(`2000-01-01T${fromTime}`);
    const to = new Date(`2000-01-01T${toTime}`);
    const diffHours = (to - from) / (1000 * 60 * 60);

    return `${diffHours.toFixed(1)}h`;
  };

  return (
    <DashboardLayout title="Session Calendar">
      {loading ? (
        <Loading text="Loading Charging Sessions..." />
      ) : (
        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-purple-500/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-amber-400 uppercase tracking-wider">
                    EV Driver
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Charger Station
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Session Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Time Window
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Session Controls
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {reservations.map((reservation) => (
                  <tr
                    key={reservation.id}
                    className="hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
                          <UserIcon />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white">
                            {reservation.evOwner?.firstName}{" "}
                            {reservation.evOwner?.lastName}
                          </div>
                          <div className="text-sm text-gray-400">
                            {reservation.evOwner?.vehicleNumber} •{" "}
                            {reservation.evOwner?.vehicleType}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            NIC: {reservation.evOwner?.nic}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/30">
                          <StationIcon />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white">
                            {reservation.chargeStation?.stationName}
                          </div>
                          <div className="text-sm text-gray-400">
                            {reservation.chargeStation?.type} •{" "}
                            {reservation.chargeStation?.slot} connectors
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {reservation.chargeStation?.isAvailable
                              ? "🟢 Available"
                              : "🔴 Unavailable"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <CalendarIcon />
                        </div>
                        <span className="text-lg font-bold text-white">
                          {formatDate(reservation.bookDate)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-amber-500/20 rounded-lg">
                          <ClockIcon />
                        </div>
                        <span className="text-lg font-bold text-white font-mono">
                          {formatTime(reservation.fromTime)} -{" "}
                          {formatTime(reservation.toTime)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="bg-gradient-to-r from-purple-500/20 to-amber-500/20 text-amber-400 px-4 py-2 rounded-xl text-sm font-bold border border-amber-500/30">
                        {calculateDuration(
                          reservation.fromTime,
                          reservation.toTime
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleView(reservation.id)}
                          className="inline-flex items-center p-3 text-sm font-bold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-purple-500/30"
                          title="View Session Details"
                        >
                          <EyeIcon />
                        </button>
                        <button
                          onClick={() => handleEdit(reservation)}
                          className="inline-flex items-center p-3 text-sm font-bold text-white bg-amber-600 rounded-xl hover:bg-amber-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 border border-amber-500/30"
                          title="Reschedule Session"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => handleDelete(reservation.id)}
                          className="inline-flex items-center p-3 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 border border-red-500/30"
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
            <div className="p-8 space-y-8">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* EV Owner Details */}
                <div className="space-y-6">
                  <h4 className="font-bold text-white text-lg flex items-center space-x-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <UserIcon />
                    </div>
                    <span>Driver Information</span>
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-700">
                      <span className="font-semibold text-gray-300">Name</span>
                      <span className="text-white text-lg">
                        {selectedReservation.evOwner?.firstName}{" "}
                        {selectedReservation.evOwner?.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-700">
                      <span className="font-semibold text-gray-300">NIC</span>
                      <span className="text-white font-mono text-lg">
                        {selectedReservation.evOwner?.nic}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-700">
                      <span className="font-semibold text-gray-300">Vehicle</span>
                      <span className="text-white text-lg">
                        {selectedReservation.evOwner?.vehicleNumber}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="font-semibold text-gray-300">
                        Vehicle Type
                      </span>
                      <span className="text-white text-lg">
                        {selectedReservation.evOwner?.vehicleType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Charge Station Details */}
                <div className="space-y-6">
                  <h4 className="font-bold text-white text-lg flex items-center space-x-3">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                      <StationIcon />
                    </div>
                    <span>Charger Information</span>
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-700">
                      <span className="font-semibold text-gray-300">
                        Station Name
                      </span>
                      <span className="text-white text-lg">
                        {selectedReservation.chargeStation?.stationName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-700">
                      <span className="font-semibold text-gray-300">
                        Charger Type
                      </span>
                      <span className="text-white text-lg">
                        {selectedReservation.chargeStation?.type}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-700">
                      <span className="font-semibold text-gray-300">Connectors</span>
                      <span className="text-white text-lg">
                        {selectedReservation.chargeStation?.slot}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="font-semibold text-gray-300">Status</span>
                      <span
                        className={`px-3 py-2 rounded-xl text-sm font-bold ${
                          selectedReservation.chargeStation?.isAvailable
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {selectedReservation.chargeStation?.isAvailable
                          ? "🟢 ONLINE"
                          : "🔴 OFFLINE"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-6">
                <h4 className="font-bold text-white text-lg flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <CalendarIcon />
                  </div>
                  <span>Session Information</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600">
                    <div className="text-sm font-semibold text-gray-300">
                      Session Date
                    </div>
                    <div className="text-xl font-bold text-white">
                      {formatDate(selectedReservation.bookDate)}
                    </div>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600">
                    <div className="text-sm font-semibold text-gray-300">
                      Time Window
                    </div>
                    <div className="text-xl font-bold text-white font-mono">
                      {formatTime(selectedReservation.fromTime)} -{" "}
                      {formatTime(selectedReservation.toTime)}
                    </div>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600">
                    <div className="text-sm font-semibold text-gray-300">
                      Duration
                    </div>
                    <div className="text-xl font-bold text-white">
                      {calculateDuration(
                        selectedReservation.fromTime,
                        selectedReservation.toTime
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full transform transition-all border border-purple-500/30">
            <div className="px-8 py-6 border-b border-gray-700 flex justify-between items-center bg-gray-900/50 rounded-t-2xl">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
                Reschedule Session
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-red-400 transition-colors duration-200 p-2 rounded-xl hover:bg-red-500/10 border border-gray-600"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="p-8 space-y-6">
              {/* Booking Date */}
              <div className="space-y-3">
                <label className="flex items-center space-x-3 text-lg font-bold text-gray-300">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <CalendarIcon />
                  </div>
                  <span>Session Date & Time</span>
                </label>
                <input
                  type="datetime-local"
                  name="bookDate"
                  className="w-full px-4 py-4 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-white"
                  value={formatDateTimeForInput(editForm.bookDate)}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bookDate: e.target.value })
                  }
                />
              </div>

              {/* Time Slots */}
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
                    className="w-full px-4 py-4 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-white"
                    value={editForm.fromTime || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, fromTime: e.target.value })
                    }
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
                    className="w-full px-4 py-4 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-white"
                    value={editForm.toTime || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, toTime: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="px-8 py-6 border-t border-gray-700 flex justify-end space-x-4 bg-gray-900/50 rounded-b-2xl">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-8 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 font-bold w-full"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-amber-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-amber-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 border border-amber-500/30 w-full"
              >
                Update Session
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}