import { useState } from "react";
import Swal from "sweetalert2";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import Map from "../../../components/map/Map";
import {
  StationIcon,
  TypeIcon,
  SlotIcon,
  LocationIcon,
  LoadingSpinner,
  SaveIcon,
} from "../../../components/icons/Icons";
import { createChargeStation } from "../../../services/chargeStationsService";

export default function CreateChargeStation() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    stationName: "",
    type: "",
    slot: "",
    longitude: "",
    latitude: "",
    isAvailable: true,
  });

  const chargerTypes = [
    "DC",
    "Type 1 (SAE J1772)",
    "Type 2 (Mennekes)",
    "CCS (Combo 1)",
    "CCS (Combo 2)",
    "CHAdeMO",
    "Tesla Supercharger",
    "GB/T (China)",
  ];

  const defaultCoords = [79.8612, 6.9271];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value === "" ? "" : Number(value),
    }));
  };

  const handleLocationSelect = (coords) => {
    setForm((prev) => ({
      ...prev,
      latitude: coords.lat,
      longitude: coords.lng,
    }));
  };

  const validateStepOne = () => {
    const newErrors = {};
    if (!form.stationName) newErrors.stationName = "Station name is required.";
    if (!form.type) newErrors.type = "Please select a charger type.";
    if (!form.slot || form.slot <= 0)
      newErrors.slot = "Slot count must be greater than zero.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStepTwo = () => {
    const newErrors = {};
    if (!form.latitude || !form.longitude)
      newErrors.location = "Please select a valid location on the map.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setForm({
      stationName: "",
      type: "",
      slot: "",
      longitude: "",
      latitude: "",
      isAvailable: true,
    });
    setErrors({});
    setStep(1);
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      slot: parseInt(form.slot),
      longitude: parseFloat(form.longitude),
      latitude: parseFloat(form.latitude),
    };

    setLoading(true);
    try {
      await createChargeStation(payload);
      Swal.fire({
        title: "Station Added Successfully!",
        text: "Your charging station is now registered in the system.",
        icon: "success",
        confirmButtonColor: "#0ea5e9",
        background: "#ffffff",
      });
      resetForm();
    } catch (err) {
      Swal.fire({
        title: "Failed to Add Station",
        text: err.message || "Something went wrong.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (step === 1 && validateStepOne()) setStep(2);
    else if (step === 2 && validateStepTwo()) setStep(3);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const confirmSubmit = async () => {
    const confirmation = await Swal.fire({
      title: "Confirm Submission",
      text: "Are you sure you want to add this charging station?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0ea5e9",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "Yes, add it",
    });
    if (confirmation.isConfirmed) {
      await handleSubmit();
    }
  };

  return (
    <DashboardLayout title="Add New Charging Station">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-gradient-to-r from-sky-500 to-green-600 p-6 rounded-2xl shadow-lg text-white">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-lg">
              <StationIcon />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Charging Station Setup</h1>
              <p className="text-sky-100">
                Step {step} of 3 — Fill details, set location, and confirm.
              </p>
            </div>
          </div>
        </div>

        {step === 1 && (
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <StationIcon /> <span>General Information</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Station Name
                </label>
                <input
                  type="text"
                  name="stationName"
                  value={form.stationName}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.stationName
                      ? "border-red-500"
                      : "border-gray-300 focus:border-sky-500"
                  } rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-300`}
                  placeholder="Enter station name"
                />
                {errors.stationName && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.stationName}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Charger Type
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.type
                      ? "border-red-500"
                      : "border-gray-300 focus:border-sky-500"
                  } rounded-lg px-4 py-3 bg-white`}
                >
                  <option value="">Select type</option>
                  {chargerTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="text-red-600 text-sm mt-1">{errors.type}</p>
                )}
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Number of Slots
                </label>
                <input
                  type="number"
                  name="slot"
                  value={form.slot}
                  onChange={handleNumberChange}
                  min="1"
                  max="50"
                  className={`w-full border ${
                    errors.slot
                      ? "border-red-500"
                      : "border-gray-300 focus:border-sky-500"
                  } rounded-lg px-4 py-3`}
                  placeholder="Enter slot count"
                />
                {errors.slot && (
                  <p className="text-red-600 text-sm mt-1">{errors.slot}</p>
                )}
              </div>

              <div className="flex items-center justify-between col-span-2 mt-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={form.isAvailable}
                    onChange={handleChange}
                    className="accent-sky-600 w-4 h-4"
                  />
                  <span className="text-gray-700 font-medium">
                    Station is available
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={handleNextStep}
                className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-medium shadow-md"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <LocationIcon /> <span>Select Location</span>
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Click anywhere on the map to set latitude and longitude for your
              charging station.
            </p>
            <div className="h-[500px] rounded-lg overflow-hidden mb-6">
              <Map
                onLocationSelect={handleLocationSelect}
                defaultCoords={defaultCoords}
                isEditable={true}
              />
            </div>

            {errors.location && (
              <p className="text-red-600 text-sm mb-2">{errors.location}</p>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Latitude
                </label>
                <input
                  type="text"
                  value={form.latitude}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Longitude
                </label>
                <input
                  type="text"
                  value={form.longitude}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrevStep}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg font-medium"
              >
                ← Back
              </button>
              <button
                onClick={handleNextStep}
                className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-medium shadow-md"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <SaveIcon /> <span>Review & Submit</span>
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Review all the details before confirming. Make sure everything is
              accurate.
            </p>

            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <p>
                  <span className="font-semibold">Station Name:</span>{" "}
                  {form.stationName}
                </p>
                <p>
                  <span className="font-semibold">Type:</span> {form.type}
                </p>
                <p>
                  <span className="font-semibold">Slots:</span> {form.slot}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  {form.isAvailable ? "Available" : "Unavailable"}
                </p>
                <p>
                  <span className="font-semibold">Latitude:</span>{" "}
                  {form.latitude || "Not set"}
                </p>
                <p>
                  <span className="font-semibold">Longitude:</span>{" "}
                  {form.longitude || "Not set"}
                </p>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrevStep}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg font-medium"
              >
                ← Back
              </button>

              <button
                disabled={loading}
                onClick={confirmSubmit}
                className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-green-600 text-white px-8 py-3.5 rounded-lg font-semibold shadow-md hover:scale-105 transform transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <LoadingSpinner /> <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <SaveIcon /> <span>Confirm & Add Station</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
