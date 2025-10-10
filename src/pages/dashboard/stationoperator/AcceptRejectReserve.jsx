import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import Loading from "../../../components/loading/Loading";
import {
  fetchPendingReservations,
  updateReservationStatus,
} from "../../../services/reservationsService";
import {
  EyeIcon,
  CheckIcon,
  XIcon,
  ClockIcon,
  CalendarIcon,
  UserIcon,
  StationIcon,
  CloseIcon,
} from "../../../components/icons/Icons";

export default function AcceptRejectReserve() {
  const [reservations, setReservations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ------------------ Load Data ------------------ //
  useEffect(() => {
    loadPendingReservations();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [search, reservations]);

  const loadPendingReservations = async () => {
    try {
      setLoading(true);
      const data = await fetchPendingReservations(); // API: returns only pending reservations
      setReservations(data);
      setFiltered(data);
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // ------------------ Search & Filter ------------------ //
  const handleSearch = () => {
    if (search.trim() === "") {
      setFiltered(reservations);
      return;
    }
    const q = search.toLowerCase();
    const results = reservations.filter(
      (r) =>
        r.evOwnerId.toLowerCase().includes(q) ||
        r.chargeStationId.toLowerCase().includes(q)
    );
    setFiltered(results);
  };

  // ------------------ Accept / Reject Actions ------------------ //
  const handleAction = async (id, action) => {
    const confirm = await Swal.fire({
      title: `${action === "accept" ? "Accept" : "Reject"} Reservation`,
      text:
        action === "accept"
          ? "Are you sure you want to accept this reservation?"
          : "Are you sure you want to reject this reservation?",
      icon: action === "accept" ? "question" : "warning",
      showCancelButton: true,
      confirmButtonColor: action === "accept" ? "#10b981" : "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: action === "accept" ? "Accept" : "Reject",
    });
    if (!confirm.isConfirmed) return;

    try {
      await updateReservationStatus(id, action === "accept" ? "ACCEPTED" : "REJECTED");
      Swal.fire(
        "Success",
        `Reservation ${action === "accept" ? "accepted" : "rejected"} successfully.`,
        "success"
      );
      loadPendingReservations();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // ------------------ Helper Functions ------------------ //
  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatTime = (t) => (t ? t.substring(0, 5) : "N/A");

  const durationText = (from, to) => {
    if (!from || !to) return "—";
    const start = new Date(`1970-01-01T${from}`);
    const end = new Date(`1970-01-01T${to}`);
    const diff = (end - start) / (1000 * 60);
    return `${diff / 60} hrs`;
  };

  // ------------------ UI Render ------------------ //
  return (
    <DashboardLayout title="Accept / Reject Reservations">
      <div className="bg-gradient-to-r from-emerald-500 to-sky-600 text-white rounded-2xl p-6 shadow-lg mb-6">
        <h1 className="text-2xl font-bold">Pending Reservations</h1>
        <p className="text-emerald-100 text-sm mt-1">
          Review new reservation requests and approve or reject them.
        </p>
      </div>

      {/* Search bar */}
      <div className="flex justify-between items-center mb-6 flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by EV Owner ID or Station ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {loading ? (
        <Loading text="Loading pending reservations..." />
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-600">
          <CalendarIcon />
          <p className="mt-3 text-lg">No pending reservations found.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Header */}
              <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="text-gray-800 font-semibold">
                    EV Owner: {r.evOwnerId}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Station: {r.chargeStationId}
                  </p>
                </div>
                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg text-xs font-semibold">
                  Pending
                </div>
              </div>

              {/* Body */}
              <div className="p-5 text-sm text-gray-700 space-y-2">
                <div className="flex justify-between">
                  <span className="flex items-center gap-1 font-semibold">
                    <CalendarIcon /> Date:
                  </span>
                  <span>{formatDate(r.bookDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1 font-semibold">
                    <ClockIcon /> From:
                  </span>
                  <span className="font-mono">{formatTime(r.fromTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1 font-semibold">
                    <ClockIcon /> To:
                  </span>
                  <span className="font-mono">{formatTime(r.toTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Duration:</span>
                  <span>{durationText(r.fromTime, r.toTime)}</span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end gap-2 p-4 border-t border-gray-100">
                <button
                  onClick={() => setSelected(r) || setShowModal(true)}
                  className="p-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white"
                >
                  <EyeIcon />
                </button>
                <button
                  onClick={() => handleAction(r.id, "accept")}
                  className="p-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  <CheckIcon />
                </button>
                <button
                  onClick={() => handleAction(r.id, "reject")}
                  className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                >
                  <XIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for viewing details */}
      {showModal && selected && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden animate-fadeIn">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Reservation Details
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="p-6 space-y-4 text-gray-700 text-sm">
              <div className="flex justify-between">
                <span className="font-semibold flex items-center gap-1">
                  <UserIcon /> EV Owner ID:
                </span>
                <span className="font-mono">{selected.evOwnerId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold flex items-center gap-1">
                  <StationIcon /> Station ID:
                </span>
                <span className="font-mono">{selected.chargeStationId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold flex items-center gap-1">
                  <CalendarIcon /> Booking Date:
                </span>
                <span>{formatDate(selected.bookDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold flex items-center gap-1">
                  <ClockIcon /> From:
                </span>
                <span className="font-mono">{formatTime(selected.fromTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold flex items-center gap-1">
                  <ClockIcon /> To:
                </span>
                <span className="font-mono">{formatTime(selected.toTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Duration:</span>
                <span>{durationText(selected.fromTime, selected.toTime)}</span>
              </div>
            </div>
            <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => handleAction(selected.id, "reject")}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                Reject
              </button>
              <button
                onClick={() => handleAction(selected.id, "accept")}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
