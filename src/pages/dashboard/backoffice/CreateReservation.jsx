import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  StationIcon,
  LoadingSpinner,
  SaveIcon,
} from "../../../components/icons/Icons";
import { fetchEVOwners } from "../../../services/evOwnersService";
import { fetchChargeStations } from "../../../services/chargeStationsService";
import { createReservation } from "../../../services/reservationsService";

export default function CreateReservation() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    evOwnerId: "",
    chargeStationId: "",
    bookDate: "",
    fromTime: "",
    toTime: "",
  });
  const [evOwners, setEvOwners] = useState([]);
  const [chargeStations, setChargeStations] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState({ owner: "", station: "" });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        const [ownersData, stationsData] = await Promise.all([
          fetchEVOwners(),
          fetchChargeStations(),
        ]);
        setEvOwners(ownersData);
        setChargeStations(stationsData);
      } catch (err) {
        Swal.fire({
          title: "Error Loading Data",
          text: err.message,
          icon: "error",
          confirmButtonColor: "#ef4444",
        });
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, []);

  const selectedOwner = evOwners.find((o) => o.id === form.evOwnerId);
  const selectedStation = chargeStations.find(
    (s) => s.id === form.chargeStationId
  );

  const validateStep1 = () => {
    const newErrors = {};
    if (!form.evOwnerId) newErrors.evOwnerId = "Please select an EV Owner.";
    if (!form.chargeStationId)
      newErrors.chargeStationId = "Please select a Charge Station.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!form.bookDate) newErrors.bookDate = "Please choose a booking date.";
    if (!form.fromTime || !form.toTime)
      newErrors.time = "Please specify both start and end times.";
    else if (form.fromTime >= form.toTime)
      newErrors.time = "End time must be later than start time.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSearchChange = (type, value) =>
    setSearch((prev) => ({ ...prev, [type]: value }));

  const filteredOwners = evOwners.filter((o) => {
    const query = search.owner.toLowerCase();
    return (
      o.firstName.toLowerCase().includes(query) ||
      o.lastName.toLowerCase().includes(query) ||
      o.nic.toLowerCase().includes(query) ||
      o.vehicleNumber.toLowerCase().includes(query)
    );
  });

  const filteredStations = chargeStations.filter((s) => {
    const query = search.station.toLowerCase();
    return (
      s.stationName.toLowerCase().includes(query) ||
      s.type.toLowerCase().includes(query)
    );
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload = {
        ...form,
        bookDate: new Date(form.bookDate).toISOString(),
      };
      await createReservation(payload);
      Swal.fire({
        title: "Reservation Created!",
        text: "The EV owner has been successfully booked into the station.",
        icon: "success",
        confirmButtonColor: "#0ea5e9",
      });
      setForm({
        evOwnerId: "",
        chargeStationId: "",
        bookDate: "",
        fromTime: "",
        toTime: "",
      });
      setStep(1);
    } catch (err) {
      Swal.fire({
        title: "Failed to Create Reservation",
        text: err.message,
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderProgress = () => {
    const steps = ["Select", "Schedule", "Review"];
    return (
      <div className="flex justify-between mb-6">
        {steps.map((s, i) => {
          const num = i + 1;
          return (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold ${
                  step >= num
                    ? "bg-sky-600 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {num}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 ${
                    step > num ? "bg-sky-600" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderStep1 = () => (
    <>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Step 1: Select EV Owner and Charge Station
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* EV Owner Search */}
        <div>
          <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
            <UserIcon /> EV Owner
          </label>
          <input
            type="text"
            placeholder="Search EV owners..."
            value={search.owner}
            onChange={(e) => handleSearchChange("owner", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
          />
          {search.owner && (
            <div className="bg-white border rounded-lg mt-2 max-h-56 overflow-y-auto shadow-lg">
              {filteredOwners.length > 0 ? (
                filteredOwners.map((o) => (
                  <div
                    key={o.id}
                    onClick={() => {
                      setForm((f) => ({ ...f, evOwnerId: o.id }));
                      setSearch((s) => ({ ...s, owner: "" }));
                    }}
                    className="p-3 border-b hover:bg-sky-50 cursor-pointer"
                  >
                    <div className="font-semibold">
                      {o.firstName} {o.lastName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {o.nic} • {o.vehicleNumber}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-gray-500">
                  No results found
                </div>
              )}
            </div>
          )}
          {errors.evOwnerId && (
            <p className="text-red-600 text-sm mt-1">{errors.evOwnerId}</p>
          )}
          {selectedOwner && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-800">
              Selected Owner:{" "}
              <span className="font-semibold">
                {selectedOwner.firstName} {selectedOwner.lastName}
              </span>
              <br />
              Vehicle: {selectedOwner.vehicleNumber}
            </div>
          )}
        </div>

        {/* Charge Station Search */}
        <div>
          <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
            <StationIcon /> Charge Station
          </label>
          <input
            type="text"
            placeholder="Search charge stations..."
            value={search.station}
            onChange={(e) => handleSearchChange("station", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
          />
          {search.station && (
            <div className="bg-white border rounded-lg mt-2 max-h-56 overflow-y-auto shadow-lg">
              {filteredStations.length > 0 ? (
                filteredStations.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setForm((f) => ({ ...f, chargeStationId: s.id }));
                      setSearch((st) => ({ ...st, station: "" }));
                    }}
                    className="p-3 border-b hover:bg-sky-50 cursor-pointer"
                  >
                    <div className="font-semibold">{s.stationName}</div>
                    <div className="text-xs text-gray-500">
                      {s.type} • Slots: {s.slot}
                    </div>
                    <div
                      className={`text-xs ${
                        s.isAvailable ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {s.isAvailable ? "Available" : "Unavailable"}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-gray-500">
                  No stations found
                </div>
              )}
            </div>
          )}
          {errors.chargeStationId && (
            <p className="text-red-600 text-sm mt-1">
              {errors.chargeStationId}
            </p>
          )}
          {selectedStation && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-800">
              Selected Station:{" "}
              <span className="font-semibold">
                {selectedStation.stationName}
              </span>
              <br />
              Type: {selectedStation.type} • Slots: {selectedStation.slot}
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Step 2: Choose Schedule
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-2">
            <CalendarIcon /> Booking Date
          </label>
          <input
            type="date"
            name="bookDate"
            value={form.bookDate}
            onChange={(e) => setForm((f) => ({ ...f, bookDate: e.target.value }))}
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
          />
          {errors.bookDate && (
            <p className="text-red-600 text-sm mt-1">{errors.bookDate}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2">
              <ClockIcon /> From Time
            </label>
            <input
              type="time"
              name="fromTime"
              value={form.fromTime}
              onChange={(e) =>
                setForm((f) => ({ ...f, fromTime: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2">
              <ClockIcon /> To Time
            </label>
            <input
              type="time"
              name="toTime"
              value={form.toTime}
              onChange={(e) =>
                setForm((f) => ({ ...f, toTime: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>
      {errors.time && (
        <p className="text-red-600 text-sm mt-2">{errors.time}</p>
      )}
    </>
  );

  const renderStep3 = () => (
    <>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Step 3: Review & Confirm
      </h2>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <span className="font-medium text-gray-800">EV Owner:</span>
            <div>{selectedOwner?.firstName} {selectedOwner?.lastName}</div>
          </div>
          <div>
            <span className="font-medium text-gray-800">Charge Station:</span>
            <div>{selectedStation?.stationName}</div>
          </div>
          <div>
            <span className="font-medium text-gray-800">Date:</span>
            <div>{form.bookDate}</div>
          </div>
          <div>
            <span className="font-medium text-gray-800">Time:</span>
            <div>{form.fromTime} - {form.toTime}</div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <DashboardLayout title="Create Reservation">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-gradient-to-r from-sky-500 to-green-600 p-6 rounded-2xl text-white shadow-lg">
          <h1 className="text-2xl font-bold">Reservation Wizard</h1>
          <p className="text-sky-100">Follow the steps to schedule a booking.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-200">
          {loadingData ? (
            <div className="flex items-center justify-center space-x-2 text-gray-700 py-12">
              <LoadingSpinner />
              <span>Loading data...</span>
            </div>
          ) : (
            <>
              {renderProgress()}
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}

              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <button
                    onClick={handleBack}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg font-medium"
                  >
                    ← Back
                  </button>
                )}
                {step < 3 && (
                  <button
                    onClick={handleNext}
                    className="ml-auto bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-medium shadow-md"
                  >
                    Next →
                  </button>
                )}
                {step === 3 && (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="ml-auto flex items-center gap-2 bg-gradient-to-r from-sky-500 to-green-600 text-white px-8 py-3.5 rounded-lg font-semibold shadow-md hover:scale-105 transform transition disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner /> <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <SaveIcon /> <span>Confirm Reservation</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
