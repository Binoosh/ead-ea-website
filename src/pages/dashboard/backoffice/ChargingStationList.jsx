import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import Loading from "../../../components/loading/Loading";
import {
  StationIcon,
  LocationIcon,
  EditIcon,
  DeleteIcon,
  EyeIcon,
  SlotIcon,
  CloseIcon,
} from "../../../components/icons/Icons";
import Map from "../../../components/map/Map";
import {
  fetchChargeStations,
  deleteChargeStation,
  fetchChargeStationById,
  updateChargeStation,
  updateChargeStationStatus,
} from "../../../services/chargeStationsService";

export default function ChargingStationList() {
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [activeStation, setActiveStation] = useState(null);
  const [modalMode, setModalMode] = useState("view"); // 'view' or 'edit'
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({});
  const chargerTypes = [
    "Type 1 (SAE J1772)",
    "Type 2 (Mennekes)",
    "CCS (Combo 1)",
    "CCS (Combo 2)",
    "CHAdeMO",
    "Tesla Supercharger",
    "GB/T (China)",
  ];

  useEffect(() => {
    loadStations();
  }, []);

  useEffect(() => {
    handleFilterAndSearch();
  }, [search, filter, stations]);

  const loadStations = async () => {
    try {
      setLoading(true);
      const data = await fetchChargeStations();
      setStations(data);
      setFilteredStations(data);
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterAndSearch = () => {
    let filtered = stations;
    if (filter !== "all") {
      filtered = filtered.filter(
        (s) => s.isAvailable === (filter === "available")
      );
    }
    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.stationName.toLowerCase().includes(query) ||
          s.type.toLowerCase().includes(query)
      );
    }
    setFilteredStations(filtered);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete this station?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    });
    if (!confirm.isConfirmed) return;

    try {
      await deleteChargeStation(id);
      Swal.fire("Deleted!", "Station removed successfully.", "success");
      loadStations();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await updateChargeStationStatus(id, !currentStatus);
      Swal.fire("Success", "Station status updated.", "success");
      loadStations();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const openViewModal = async (id, mode = "view") => {
    try {
      const station = await fetchChargeStationById(id);
      setActiveStation(station);
      setForm(station);
      setModalMode(mode);
      setShowModal(true);
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleEditSave = async () => {
    try {
      const payload = {
        ...form,
        slot: parseInt(form.slot),
        longitude: parseFloat(form.longitude),
        latitude: parseFloat(form.latitude),
      };
      await updateChargeStation(form.id, payload);
      Swal.fire("Updated", "Station details saved successfully.", "success");
      setShowModal(false);
      loadStations();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const getCoords = (station) =>
    station?.longitude && station?.latitude
      ? [station.longitude, station.latitude]
      : [79.8612, 6.9271]; // Default Sri Lanka

  return (
    <DashboardLayout title="Charging Station List">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-500 to-green-600 p-6 rounded-2xl text-white shadow-lg">
          <h1 className="text-2xl font-bold">Charging Stations</h1>
          <p className="text-sky-100">Manage and monitor all active stations.</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
          <input
            type="text"
            placeholder="Search by name or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">All Stations</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>

        {/* Stations Grid */}
        {loading ? (
          <Loading text="Loading Charging Stations..." />
        ) : filteredStations.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <StationIcon />
            <p className="mt-4 text-lg">No charging stations found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredStations.map((station) => (
              <div
                key={station.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="p-5 flex justify-between items-center border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <StationIcon />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {station.stationName}
                      </h3>
                      <p className="text-sm text-gray-500">{station.type}</p>
                    </div>
                  </div>
                  <select
                    value={station.isAvailable}
                    onChange={(e) =>
                      handleStatusToggle(
                        station.id,
                        e.target.value === "true"
                      )
                    }
                    className={`text-xs font-medium py-1.5 px-2 rounded-lg border-0 focus:ring-2 focus:ring-emerald-500 ${
                      station.isAvailable
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    <option value="true">Available</option>
                    <option value="false">Unavailable</option>
                  </select>
                </div>

                {/* Map Snapshot */}
                <div className="h-48 border-b border-gray-100">
                  <Map
                    onLocationSelect={() => {}}
                    defaultCoords={getCoords(station)}
                    isEditable={false}
                  />
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1 text-gray-700">
                      <SlotIcon /> Slots:
                    </span>
                    <span className="font-semibold">{station.slot}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1 text-gray-700">
                      <LocationIcon /> Longitude:
                    </span>
                    <span className="font-mono">{station.longitude}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1 text-gray-700">
                      <LocationIcon /> Latitude:
                    </span>
                    <span className="font-mono">{station.latitude}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end items-center p-4 border-t border-gray-100 space-x-2">
                  <button
                    onClick={() => openViewModal(station.id, "view")}
                    className="p-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white"
                  >
                    <EyeIcon />
                  </button>
                  <button
                    onClick={() => openViewModal(station.id, "edit")}
                    className="p-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={() => handleDelete(station.id)}
                    className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View/Edit Modal */}
        {showModal && activeStation && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl overflow-hidden animate-fadeIn">
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  {modalMode === "view"
                    ? "Station Details"
                    : "Edit Charging Station"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Content */}
              <div className="grid lg:grid-cols-2 gap-6 p-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <StationIcon />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">
                          {form.stationName}
                        </h3>
                        <p className="text-sm text-gray-500">{form.type}</p>
                      </div>
                    </div>
                  </div>

                  {modalMode === "edit" ? (
                    <>
                      <label className="block text-sm font-semibold text-gray-700">
                        Station Name
                      </label>
                      <input
                        type="text"
                        value={form.stationName}
                        onChange={(e) =>
                          setForm({ ...form, stationName: e.target.value })
                        }
                        className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-sky-500"
                      />

                      <label className="block text-sm font-semibold text-gray-700">
                        Charger Type
                      </label>
                      <select
                        value={form.type}
                        onChange={(e) =>
                          setForm({ ...form, type: e.target.value })
                        }
                        className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-sky-500"
                      >
                        {chargerTypes.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>

                      <label className="block text-sm font-semibold text-gray-700">
                        Slots
                      </label>
                      <input
                        type="number"
                        value={form.slot}
                        min="1"
                        onChange={(e) =>
                          setForm({ ...form, slot: e.target.value })
                        }
                        className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-sky-500"
                      />
                    </>
                  ) : (
                    <div className="space-y-3 text-sm text-gray-700">
                      <p>
                        <span className="font-semibold">Slots:</span>{" "}
                        {activeStation.slot}
                      </p>
                      <p>
                        <span className="font-semibold">Longitude:</span>{" "}
                        {activeStation.longitude}
                      </p>
                      <p>
                        <span className="font-semibold">Latitude:</span>{" "}
                        {activeStation.latitude}
                      </p>
                      <p>
                        <span className="font-semibold">Status:</span>{" "}
                        {activeStation.isAvailable ? "Available" : "Unavailable"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <LocationIcon /> Station Location
                  </h3>
                  <div className="h-72 border border-gray-200 rounded-lg overflow-hidden">
                    <Map
                      onLocationSelect={(loc) =>
                        modalMode === "edit" &&
                        setForm({
                          ...form,
                          longitude: loc.lng,
                          latitude: loc.lat,
                        })
                      }
                      defaultCoords={getCoords(form)}
                      isEditable={modalMode === "edit"}
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end px-6 py-4 border-t border-gray-200 space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                {modalMode === "edit" && (
                  <button
                    onClick={handleEditSave}
                    className="px-5 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                  >
                    Save Changes
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
