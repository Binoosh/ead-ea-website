import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import Loading from "../../../components/loading/Loading";
import {
  fetchReservations,
  deleteReservation,
  fetchReservationById,
  updateReservation,
} from "../../../services/reservationsService";
import {
  EyeIcon,
  EditIcon,
  DeleteIcon,
  CloseIcon,
  ClockIcon,
  UserIcon,
  StationIcon,
  CalendarIcon,
} from "../../../components/icons/Icons";

export default function ViewCustReservations() {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("view");
  const [form, setForm] = useState({});

  // ---------------------------- LOADERS ---------------------------- //

  useEffect(() => {
    loadReservations();
  }, []);

  useEffect(() => {
    handleFilterAndSearch();
  }, [reservations, search, filter]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await fetchReservations();
      setReservations(data);
      setFilteredReservations(data);
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterAndSearch = () => {
    let data = reservations;
    if (filter !== "all") {
      const today = new Date();
      data = data.filter((r) => {
        const bookDate = new Date(r.bookDate);
        if (filter === "past") return bookDate < today;
        if (filter === "upcoming") return bookDate >= today;
        return true;
      });
    }

    if (search.trim() !== "") {
      const q = search.toLowerCase();
      data = data.filter(
        (r) =>
          r.evOwnerId.toLowerCase().includes(q) ||
          r.chargeStationId.toLowerCase().includes(q) ||
          formatDate(r.bookDate).toLowerCase().includes(q)
      );
    }
    setFilteredReservations(data);
  };

  // ---------------------------- ACTION HANDLERS ---------------------------- //

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This reservation record will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    });
    if (!confirm.isConfirmed) return;

    try {
      await deleteReservation(id);
      Swal.fire("Deleted", "Reservation removed successfully.", "success");
      loadReservations();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const openModal = async (id, mode = "view") => {
    try {
      const reservation = await fetchReservationById(id);
      setSelected(reservation);
      setForm(reservation);
      setMode(mode);
      setShowModal(true);
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleEditSave = async () => {
    try {
      const payload = {
        ...form,
        bookDate: new Date(form.bookDate).toISOString(),
      };
      await updateReservation(form.id, payload);
      Swal.fire("Success", "Reservation updated successfully.", "success");
      setShowModal(false);
      loadReservations();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // ---------------------------- FORMAT HELPERS ---------------------------- //

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (t) => (t ? t.substring(0, 5) : "N/A");

  const formatDateTimeForInput = (d) => new Date(d).toISOString().slice(0, 16);

  const durationText = (from, to) => {
    if (!from || !to) return "—";
    const start = new Date(`1970-01-01T${from}`);
    const end = new Date(`1970-01-01T${to}`);
    const mins = (end - start) / (1000 * 60);
    const hrs = (mins / 60).toFixed(1);
    return `${hrs} hrs`;
  };

  // ---------------------------- RENDER ---------------------------- //

  return (
    <DashboardLayout title="Customer Reservations">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-2xl p-6 shadow-lg mb-6">
        <h1 className="text-2xl font-bold">Manage Customer Reservations</h1>
        <p className="text-sky-100 text-sm mt-1">
          View, filter, and manage customer EV station bookings.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by owner ID, station ID, or date..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-sky-500"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
        >
          <option value="all">All</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>
      </div>

      {/* Content Area */}
      {loading ? (
        <Loading text="Loading Reservations..." />
      ) : filteredReservations.length === 0 ? (
        <div className="text-center py-20 text-gray-600">
          <CalendarIcon />
          <p className="mt-4 text-lg font-medium">No reservations found.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredReservations.map((res) => (
            <div
              key={res.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {res.evOwnerId}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(res.bookDate)}
                  </p>
                </div>
                <div className="bg-sky-100 text-sky-800 px-3 py-1 rounded-lg text-xs font-semibold">
                  {durationText(res.fromTime, res.toTime)}
                </div>
              </div>

              {/* Details */}
              <div className="p-5 space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span className="font-semibold flex items-center gap-1">
                    <StationIcon /> Station ID:
                  </span>
                  <span className="font-mono">{res.chargeStationId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold flex items-center gap-1">
                    <ClockIcon /> From:
                  </span>
                  <span className="font-mono">{formatTime(res.fromTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold flex items-center gap-1">
                    <ClockIcon /> To:
                  </span>
                  <span className="font-mono">{formatTime(res.toTime)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 p-4 border-t border-gray-100">
                <button
                  onClick={() => openModal(res.id, "view")}
                  className="p-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg"
                >
                  <EyeIcon />
                </button>
                <button
                  onClick={() => openModal(res.id, "edit")}
                  className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg"
                >
                  <EditIcon />
                </button>
                <button
                  onClick={() => handleDelete(res.id)}
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                >
                  <DeleteIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Unified Modal */}
      {showModal && selected && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {mode === "view"
                  ? "Reservation Details"
                  : "Edit Customer Reservation"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {mode === "view" ? (
                <div className="space-y-3 text-gray-700 text-sm">
                  <div className="flex justify-between">
                    <span className="font-semibold flex items-center gap-2">
                      <UserIcon /> EV Owner ID:
                    </span>
                    <span className="font-mono">{selected.evOwnerId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold flex items-center gap-2">
                      <StationIcon /> Station ID:
                    </span>
                    <span className="font-mono">{selected.chargeStationId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold flex items-center gap-2">
                      <CalendarIcon /> Book Date:
                    </span>
                    <span>{formatDate(selected.bookDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold flex items-center gap-2">
                      <ClockIcon /> From:
                    </span>
                    <span className="font-mono">
                      {formatTime(selected.fromTime)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold flex items-center gap-2">
                      <ClockIcon /> To:
                    </span>
                    <span className="font-mono">
                      {formatTime(selected.toTime)}
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex gap-2 items-center">
                      <UserIcon /> EV Owner ID
                    </label>
                    <input
                      type="text"
                      value={form.evOwnerId || ""}
                      onChange={(e) =>
                        setForm({ ...form, evOwnerId: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex gap-2 items-center">
                      <StationIcon /> Charge Station ID
                    </label>
                    <input
                      type="text"
                      value={form.chargeStationId || ""}
                      onChange={(e) =>
                        setForm({ ...form, chargeStationId: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex gap-2 items-center">
                      <CalendarIcon /> Booking Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={formatDateTimeForInput(form.bookDate)}
                      onChange={(e) =>
                        setForm({ ...form, bookDate: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex gap-2 items-center">
                        <ClockIcon /> From Time
                      </label>
                      <input
                        type="time"
                        value={form.fromTime || ""}
                        onChange={(e) =>
                          setForm({ ...form, fromTime: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex gap-2 items-center">
                        <ClockIcon /> To Time
                      </label>
                      <input
                        type="time"
                        value={form.toTime || ""}
                        onChange={(e) =>
                          setForm({ ...form, toTime: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end items-center px-6 py-4 border-t border-gray-200 space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              {mode === "edit" && (
                <button
                  onClick={handleEditSave}
                  className="px-5 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
