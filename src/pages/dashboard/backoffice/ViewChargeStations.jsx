import Swal from "sweetalert2";
import Loading from "../../../components/loading/Loading";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import { EditIcon, EyeIcon, LocationIcon } from "../../../components/icons/Icons";
import { CloseIcon, DeleteIcon } from "../../../components/icons/Icons";
import { SlotIcon, StationIcon } from "../../../components/icons/Icons";
import { fetchChargeStations } from "../../../services/chargeStationsService";
import { deleteChargeStation } from "../../../services/chargeStationsService";
import { fetchChargeStationById } from "../../../services/chargeStationsService";
import { updateChargeStation } from "../../../services/chargeStationsService";
import { updateChargeStationStatus } from "../../../services/chargeStationsService";
import Map from "../../../components/map/Map";

export default function ViewChargeStations() {
  const [chargeStations, setChargeStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});

  const chargerTypes = [
    "Type 1 (SAE J1772)",
    "Type 2 (Mennekes)",
    "CCS (Combo 1)",
    "CCS (Combo 2)",
    "CHAdeMO",
    "Tesla Supercharger",
    "GB/T (China)",
  ];

  const loadChargeStations = async () => {
    setLoading(true);
    try {
      const data = await fetchChargeStations();
      setChargeStations(data);
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
    loadChargeStations();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Confirm Deletion",
      text: "This charging station will be permanently removed from the network!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete Station",
      cancelButtonText: "Cancel",
      background: "#1f2937",
      color: "#f3f4f6"
    });
    if (!confirm.isConfirmed) return;

    try {
      await deleteChargeStation(id);
      Swal.fire({
        title: "Station Removed",
        text: "Charging station deleted successfully",
        icon: "success",
        background: "#1f2937",
        color: "#f3f4f6"
      });
      loadChargeStations();
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

  const handleStatusChange = async (id, isAvailable) => {
    try {
      await updateChargeStationStatus(id, isAvailable);
      Swal.fire({
        title: "Status Updated",
        text: "Station status changed successfully",
        icon: "success",
        background: "#1f2937",
        color: "#f3f4f6"
      });
      loadChargeStations();
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
      const station = await fetchChargeStationById(id);
      setSelectedStation(station);
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

  const handleEdit = async (station) => {
    setEditForm({ ...station });
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    try {
      // Prepare payload according to API requirements
      const payload = {
        ...editForm,
        slot: parseInt(editForm.slot),
        longitude: parseFloat(editForm.longitude),
        latitude: parseFloat(editForm.latitude),
      };

      await updateChargeStation(editForm.id, payload);
      Swal.fire({
        title: "Station Updated",
        text: "Charging station details updated successfully",
        icon: "success",
        background: "#1f2937",
        color: "#f3f4f6"
      });
      setShowEditModal(false);
      loadChargeStations();
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

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value === "" ? "" : Number(value),
    });
  };

  const handleEditLocationSelect = (location) => {
    setEditForm({
      ...editForm,
      latitude: location.lat,
      longitude: location.lng,
    });
  };

  // Convert station coordinates to map format [lng, lat]
  const getStationCoords = (station) => {
    if (station && station.longitude && station.latitude) {
      return [station.longitude, station.latitude];
    }
    return [79.8612, 6.9271]; // Default Sri Lanka coordinates
  };

  return (
    <DashboardLayout title="Charger Network">
      {loading ? (
        <Loading text="Loading Charging Infrastructure..." />
      ) : (
        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-purple-500/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Station Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Charger Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Connectors
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Coordinates
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Controls
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {chargeStations.map((station) => (
                  <tr
                    key={station.id}
                    className="hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/30">
                          <StationIcon />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white">
                            {station.stationName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {station.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                          <SlotIcon />
                        </div>
                        <span className="text-lg font-bold text-white">
                          {station.slot}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-400 font-mono">
                          Lng: {station.longitude}
                        </div>
                        <div className="text-sm text-gray-400 font-mono">
                          Lat: {station.latitude}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={station.isAvailable}
                        onChange={(e) =>
                          handleStatusChange(
                            station.id,
                            e.target.value === "true"
                          )
                        }
                        className={`text-sm font-bold py-2 px-4 rounded-xl border-0 focus:ring-2 focus:ring-amber-500 transition-all ${
                          station.isAvailable
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}
                      >
                        <option value="true">🟢 ONLINE</option>
                        <option value="false">🔴 OFFLINE</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleView(station.id)}
                          className="inline-flex items-center p-3 text-sm font-bold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-purple-500/30"
                          title="View Station Details"
                        >
                          <EyeIcon />
                        </button>
                        <button
                          onClick={() => handleEdit(station)}
                          className="inline-flex items-center p-3 text-sm font-bold text-white bg-amber-600 rounded-xl hover:bg-amber-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 border border-amber-500/30"
                          title="Edit Station"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => handleDelete(station.id)}
                          className="inline-flex items-center p-3 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 border border-red-500/30"
                          title="Remove Station"
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
      {showViewModal && selectedStation && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full transform transition-all border border-amber-500/30">
            <div className="px-8 py-6 border-b border-gray-700 flex justify-between items-center bg-gray-900/50 rounded-t-2xl">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
                Charger Station Details
              </h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-red-400 transition-colors duration-200 p-2 rounded-xl hover:bg-red-500/10 border border-gray-600"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Station Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-6 bg-amber-500/10 rounded-2xl border border-amber-500/30">
                  <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/30">
                    <StationIcon />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-300 text-xl">
                      {selectedStation.stationName}
                    </h3>
                    <p className="text-amber-400 text-lg">
                      {selectedStation.type}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-700">
                    <span className="font-semibold text-gray-300 flex items-center space-x-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <SlotIcon />
                      </div>
                      <span>Charging Connectors</span>
                    </span>
                    <span className="text-white font-bold text-lg">
                      {selectedStation.slot}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-700">
                    <span className="font-semibold text-gray-300 flex items-center space-x-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <LocationIcon />
                      </div>
                      <span>Longitude</span>
                    </span>
                    <span className="text-white font-mono">
                      {selectedStation.longitude}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-700">
                    <span className="font-semibold text-gray-300 flex items-center space-x-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <LocationIcon />
                      </div>
                      <span>Latitude</span>
                    </span>
                    <span className="text-white font-mono">
                      {selectedStation.latitude}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="font-semibold text-gray-300">Status</span>
                    <span
                      className={`px-4 py-2 rounded-xl text-sm font-bold ${
                        selectedStation.isAvailable
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {selectedStation.isAvailable ? "🟢 OPERATIONAL" : "🔴 OFFLINE"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Map Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <LocationIcon />
                  </div>
                  <span>Station Location</span>
                </h3>
                <div className="h-80 rounded-xl overflow-hidden border border-gray-600">
                  <Map 
                    onLocationSelect={() => {}} // Read-only for view
                    defaultCoords={getStationCoords(selectedStation)}
                    isEditable={false}
                  />
                </div>
                <div className="text-sm text-gray-400 bg-gray-700/50 p-4 rounded-xl border border-gray-600">
                  <p>📍 Charger station location displayed on map</p>
                </div>
              </div>
            </div>
            <div className="px-8 py-6 border-t border-gray-700 flex justify-end bg-gray-900/50 rounded-b-2xl">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-8 py-3 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 border border-amber-500/30"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full transform transition-all max-h-[90vh] overflow-y-auto border border-purple-500/30">
            <div className="px-8 py-6 border-b border-gray-700 flex justify-between items-center bg-gray-900/50 rounded-t-2xl">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
                Update Charger Station
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-red-400 transition-colors duration-200 p-2 rounded-xl hover:bg-red-500/10 border border-gray-600"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Form Section */}
              <div className="space-y-6">
                {/* Station Name */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 text-lg font-bold text-gray-300">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                      <StationIcon />
                    </div>
                    <span>Station Name</span>
                  </label>
                  <input
                    type="text"
                    name="stationName"
                    className="w-full px-4 py-4 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-white placeholder-gray-400"
                    value={editForm.stationName || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, stationName: e.target.value })
                    }
                  />
                </div>

                {/* Charger Type */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 text-lg font-bold text-gray-300">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                      <StationIcon />
                    </div>
                    <span>Charger Type</span>
                  </label>
                  <select
                    name="type"
                    value={editForm.type || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, type: e.target.value })
                    }
                    className="w-full px-4 py-4 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-white appearance-none"
                    required
                  >
                    <option value="" className="bg-gray-700">Select charger type</option>
                    {chargerTypes.map((type) => (
                      <option key={type} value={type} className="bg-gray-700">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Number of Slots */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 text-lg font-bold text-gray-300">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <SlotIcon />
                    </div>
                    <span>Number of Connectors</span>
                  </label>
                  <input
                    type="number"
                    name="slot"
                    value={editForm.slot || ""}
                    onChange={handleNumberChange}
                    min="1"
                    max="50"
                    className="w-full px-4 py-4 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-white"
                  />
                </div>

                {/* Coordinates Display */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white flex items-center space-x-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <LocationIcon />
                    </div>
                    <span>Location Coordinates</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-lg font-bold text-gray-300">
                        Longitude
                      </label>
                      <input
                        type="number"
                        name="longitude"
                        value={editForm.longitude || ""}
                        onChange={handleNumberChange}
                        step="0.000001"
                        className="w-full px-4 py-4 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-white bg-gray-600"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-lg font-bold text-gray-300">
                        Latitude
                      </label>
                      <input
                        type="number"
                        name="latitude"
                        value={editForm.latitude || ""}
                        onChange={handleNumberChange}
                        step="0.000001"
                        className="w-full px-4 py-4 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-white bg-gray-600"
                        readOnly
                      />
                    </div>
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
                        Station Status
                      </label>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={editForm.isAvailable || false}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          isAvailable: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500 rounded-xl peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-xl after:h-6 after:w-6 after:transition-all peer-checked:bg-amber-500"></div>
                    <span className="ml-3 text-lg font-bold text-white">
                      {editForm.isAvailable ? "🟢 ONLINE" : "🔴 OFFLINE"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Map Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <LocationIcon />
                  </div>
                  <span>Update Station Location</span>
                </h3>
                <div className="h-96 rounded-xl overflow-hidden border border-gray-600">
                  <Map 
                    onLocationSelect={handleEditLocationSelect}
                    defaultCoords={getStationCoords(editForm)}
                    isEditable={true}
                  />
                </div>
                <div className="text-sm text-gray-300 bg-purple-500/10 p-4 rounded-xl border border-purple-500/30">
                  <p className="font-bold text-purple-400">💡 Location Update Guide:</p>
                  <p>Click anywhere on the map to set new coordinates. Longitude and latitude will update automatically.</p>
                </div>
                {editForm.longitude && editForm.latitude && (
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                    <div className="flex items-center space-x-3 text-green-400">
                      <LocationIcon />
                      <span className="font-bold">Selected Location:</span>
                    </div>
                    <div className="mt-2 text-sm grid grid-cols-2 gap-3">
                      <div className="text-white">Longitude: <span className="font-mono text-green-300">{editForm.longitude}</span></div>
                      <div className="text-white">Latitude: <span className="font-mono text-green-300">{editForm.latitude}</span></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="px-8 py-6 border-t border-gray-700 flex justify-end space-x-4 bg-gray-900/50 rounded-b-2xl">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-8 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 font-bold"
              >
                Discard Changes
              </button>
              <button
                onClick={handleEditSave}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-amber-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-amber-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 border border-amber-500/30"
              >
                Update Station
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}