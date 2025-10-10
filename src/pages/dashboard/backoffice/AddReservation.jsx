import Swal from "sweetalert2";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useState, useEffect } from "react";
import { createReservation } from "../../../services/reservationsService";
import { fetchEVOwners } from "../../../services/evOwnersService";
import { fetchChargeStations } from "../../../services/chargeStationsService";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  StationIcon,
  LoadingSpinner,
  SaveIcon,
} from "../../../components/icons/Icons";

export default function AddReservation() {
  const [form, setForm] = useState({
    evOwnerId: "",
    chargeStationId: "",
    bookDate: "",
    fromTime: "",
    toTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [evOwners, setEvOwners] = useState([]);
  const [chargeStations, setChargeStations] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState({
    evOwner: "",
    chargeStation: "",
  });

  // Load EV Owners and Charge Stations
  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true);
      try {
        const [ownersData, stationsData] = await Promise.all([
          fetchEVOwners(),
          fetchChargeStations(),
        ]);
        setEvOwners(ownersData);
        setChargeStations(stationsData.filter((s) => s.isAvailable === true));
      } catch (err) {
        Swal.fire({
          title: "Error!",
          text: "Failed to load data: " + err.message,
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

  const handleSearchChange = (type, value) => {
    setSearchTerm((prev) => ({
      ...prev,
      [type]: value,
    }));
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
        title: "Booking Confirmed!",
        text: "Charging session scheduled successfully",
        icon: "success",
        confirmButtonColor: "#8b5cf6",
        background: "#1f2937",
        color: "#f3f4f6"
      });
      setForm({
        evOwnerId: "",
        chargeStationId: "",
        bookDate: "",
        fromTime: "",
        toTime: "",
      });
      setSearchTerm({
        evOwner: "",
        chargeStation: "",
      });
    } catch (err) {
      Swal.fire({
        title: "Booking Failed!",
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

  // Filter EV Owners based on search
  const filteredEvOwners = evOwners.filter(
    (owner) =>
      owner.firstName
        .toLowerCase()
        .includes(searchTerm.evOwner.toLowerCase()) ||
      owner.lastName.toLowerCase().includes(searchTerm.evOwner.toLowerCase()) ||
      owner.nic.toLowerCase().includes(searchTerm.evOwner.toLowerCase()) ||
      owner.vehicleNumber
        .toLowerCase()
        .includes(searchTerm.evOwner.toLowerCase())
  );

  // Filter Charge Stations based on search
  const filteredChargeStations = chargeStations.filter(
    (station) =>
      station.stationName
        .toLowerCase()
        .includes(searchTerm.chargeStation.toLowerCase()) ||
      station.type
        .toLowerCase()
        .includes(searchTerm.chargeStation.toLowerCase())
  );

  // Get selected EV Owner details
  const selectedEvOwner = evOwners.find((owner) => owner.id === form.evOwnerId);
  const selectedChargeStation = chargeStations.find(
    (station) => station.id === form.chargeStationId
  );

  return (
    <DashboardLayout title="Schedule Charging Session">
      <div className="mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-purple-600 to-amber-600 rounded-2xl shadow-2xl p-8 mb-8 text-white border border-purple-500/30">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
              <CalendarIcon />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Schedule Charging</h1>
              <p className="text-purple-100 mt-2 text-lg">
                Reserve charging slots for electric vehicle owners
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-700 bg-gray-900/50">
            <h2 className="text-xl font-semibold text-white flex items-center space-x-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <CalendarIcon />
              </div>
              <span>Session Details</span>
            </h2>
          </div>

          {loadingData ? (
            <div className="p-12 flex justify-center items-center">
              <LoadingSpinner />
              <span className="ml-3 text-gray-300">Loading station data...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* EV Owner Selection */}
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 text-sm font-semibold text-gray-300">
                    <div className="p-2 bg-gray-700 rounded-lg">
                      <UserIcon />
                    </div>
                    <span>Select EV Driver</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search drivers by name, NIC, or vehicle..."
                      value={searchTerm.evOwner}
                      onChange={(e) =>
                        handleSearchChange("evOwner", e.target.value)
                      }
                      className="w-full px-4 py-4 pl-12 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 hover:border-gray-500 text-white placeholder-gray-400"
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-amber-400">
                      <UserIcon />
                    </div>
                  </div>

                  {/* EV Owner Dropdown */}
                  {searchTerm.evOwner && (
                    <div className="absolute z-10 mt-2 w-full max-w-md bg-gray-700 border border-gray-600 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                      {filteredEvOwners.length > 0 ? (
                        filteredEvOwners.map((owner) => (
                          <div
                            key={owner.id}
                            onClick={() => {
                              setForm((prev) => ({
                                ...prev,
                                evOwnerId: owner.id,
                              }));
                              setSearchTerm((prev) => ({
                                ...prev,
                                evOwner: "",
                              }));
                            }}
                            className="p-4 hover:bg-gray-600 cursor-pointer border-b border-gray-600 last:border-b-0 transition-colors"
                          >
                            <div className="font-semibold text-white">
                              {owner.firstName} {owner.lastName}
                            </div>
                            <div className="text-sm text-gray-300">
                              NIC: {owner.nic} • Vehicle: {owner.vehicleNumber}
                            </div>
                            <div className="text-xs text-amber-400">
                              {owner.vehicleType}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-gray-400 text-center">
                          No drivers found
                        </div>
                      )}
                    </div>
                  )}

                  {/* Selected EV Owner Display */}
                  {selectedEvOwner && (
                    <div className="mt-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-green-300">
                            {selectedEvOwner.firstName} {selectedEvOwner.lastName}
                          </div>
                          <div className="text-sm text-green-400">
                            NIC: {selectedEvOwner.nic} • {selectedEvOwner.vehicleNumber}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({ ...prev, evOwnerId: "" }))
                          }
                          className="text-red-400 hover:text-red-300 p-1 rounded"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Charge Station Selection */}
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 text-sm font-semibold text-gray-300">
                    <div className="p-2 bg-gray-700 rounded-lg">
                      <StationIcon />
                    </div>
                    <span>Select Charger</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search stations by name or type..."
                      value={searchTerm.chargeStation}
                      onChange={(e) =>
                        handleSearchChange("chargeStation", e.target.value)
                      }
                      className="w-full px-4 py-4 pl-12 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 hover:border-gray-500 text-white placeholder-gray-400"
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-amber-400">
                      <StationIcon />
                    </div>
                  </div>

                  {/* Charge Station Dropdown */}
                  {searchTerm.chargeStation && (
                    <div className="absolute z-10 mt-2 w-full max-w-md bg-gray-700 border border-gray-600 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                      {filteredChargeStations.length > 0 ? (
                        filteredChargeStations.map((station) => (
                          <div
                            key={station.id}
                            onClick={() => {
                              setForm((prev) => ({
                                ...prev,
                                chargeStationId: station.id,
                              }));
                              setSearchTerm((prev) => ({
                                ...prev,
                                chargeStation: "",
                              }));
                            }}
                            className="p-4 hover:bg-gray-600 cursor-pointer border-b border-gray-600 last:border-b-0 transition-colors"
                          >
                            <div className="font-semibold text-white">
                              {station.stationName}
                            </div>
                            <div className="text-sm text-gray-300">
                              Type: {station.type} • Slots: {station.slot}
                            </div>
                            <div className={`text-xs ${station.isAvailable ? "text-green-400" : "text-red-400"}`}>
                              {station.isActive ? "🟢 ONLINE" : "🔴 OFFLINE"}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-gray-400 text-center">
                          No chargers available
                        </div>
                      )}
                    </div>
                  )}

                  {/* Selected Charge Station Display */}
                  {selectedChargeStation && (
                    <div className="mt-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-green-300">
                            {selectedChargeStation.stationName}
                          </div>
                          <div className="text-sm text-green-400">
                            Type: {selectedChargeStation.type} • {selectedChargeStation.slot} connectors
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              chargeStationId: "",
                            }))
                          }
                          className="text-red-400 hover:text-red-300 p-1 rounded"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Booking Date */}
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 text-sm font-semibold text-gray-300">
                    <div className="p-2 bg-gray-700 rounded-lg">
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

                {/* Time Slots */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3 text-sm font-semibold text-gray-300">
                      <div className="p-2 bg-gray-700 rounded-lg">
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
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3 text-sm font-semibold text-gray-300">
                      <div className="p-2 bg-gray-700 rounded-lg">
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
              </div>

              {/* Reservation Summary */}
              {(selectedEvOwner || selectedChargeStation) && (
                <div className="p-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
                  <h3 className="font-bold text-amber-300 text-lg mb-4 flex items-center space-x-2">
                    <span>📋</span>
                    <span>Session Summary</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    {selectedEvOwner && (
                      <div className="space-y-2">
                        <span className="font-semibold text-amber-400">Driver:</span>
                        <div className="space-y-1">
                          <div className="text-white">{selectedEvOwner.firstName} {selectedEvOwner.lastName}</div>
                          <div className="text-amber-300">Vehicle: {selectedEvOwner.vehicleNumber}</div>
                        </div>
                      </div>
                    )}
                    {selectedChargeStation && (
                      <div className="space-y-2">
                        <span className="font-semibold text-amber-400">Charger:</span>
                        <div className="space-y-1">
                          <div className="text-white">{selectedChargeStation.stationName}</div>
                          <div className="text-amber-300">Type: {selectedChargeStation.type}</div>
                        </div>
                      </div>
                    )}
                    {form.bookDate && (
                      <div className="space-y-2">
                        <span className="font-semibold text-amber-400">Date:</span>
                        <div className="text-white">
                          {new Date(form.bookDate).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                    )}
                    {(form.fromTime || form.toTime) && (
                      <div className="space-y-2">
                        <span className="font-semibold text-amber-400">Time Slot:</span>
                        <div className="text-white">
                          {form.fromTime} - {form.toTime}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end pt-8">
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
        <div className="mt-8 bg-purple-500/10 border border-purple-500/30 rounded-2xl p-8">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
              <svg
                className="w-6 h-6 text-purple-400"
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
              <h3 className="font-bold text-purple-300 text-lg">Booking Guidelines</h3>
              <ul className="mt-3 text-purple-200/80 space-y-2">
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span>Search drivers by name, NIC, or vehicle registration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span>Filter chargers by station name or connector type</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span>Select available time slots avoiding peak hours</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span>Ensure charger compatibility with vehicle type</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span>Complete all required fields to confirm booking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}