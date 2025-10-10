import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import Loading from "../../../components/loading/Loading";
import {
  fetchEVOwners,
  deleteEVOwner,
  fetchEVOwnerById,
  updateEVOwner,
  updateEVOwnerStatus,
} from "../../../services/evOwnersService";
import {
  EditIcon,
  EyeIcon,
  DeleteIcon,
  CloseIcon,
} from "../../../components/icons/Icons";

export default function EvOwnersList() {
  const [owners, setOwners] = useState([]);
  const [filteredOwners, setFilteredOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [activeOwner, setActiveOwner] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("view");
  const [form, setForm] = useState({});

  useEffect(() => {
    loadOwners();
  }, []);

  useEffect(() => {
    handleFilterAndSearch();
  }, [owners, search, filter]);

  const loadOwners = async () => {
    setLoading(true);
    try {
      const data = await fetchEVOwners();
      setOwners(data);
      setFilteredOwners(data);
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterAndSearch = () => {
    let filtered = owners;
    if (filter !== "all") {
      filtered = filtered.filter(
        (o) => o.isActive === (filter === "active")
      );
    }
    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.firstName.toLowerCase().includes(query) ||
          o.lastName.toLowerCase().includes(query) ||
          o.nic.toLowerCase().includes(query) ||
          o.vehicleNumber.toLowerCase().includes(query)
      );
    }
    setFilteredOwners(filtered);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This EV Owner record will be permanently removed!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    });
    if (!confirm.isConfirmed) return;
    try {
      await deleteEVOwner(id);
      Swal.fire("Deleted", "Owner removed successfully", "success");
      loadOwners();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await updateEVOwnerStatus(id, !currentStatus);
      Swal.fire("Updated", "Account status changed successfully", "success");
      loadOwners();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const openModal = async (id, newMode = "view") => {
    try {
      const owner = await fetchEVOwnerById(id);
      setActiveOwner(owner);
      setForm(owner);
      setMode(newMode);
      setShowModal(true);
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleEditSave = async () => {
    try {
      await updateEVOwner(form.id, form);
      Swal.fire("Success", "Owner details updated successfully", "success");
      setShowModal(false);
      loadOwners();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <DashboardLayout title="EV Owners List">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-500 to-green-600 rounded-2xl p-6 text-white shadow-lg mb-6">
        <h1 className="text-2xl font-bold">EV Owner Management</h1>
        <p className="text-sky-100">
          Manage registered electric vehicle owners in the system.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search owners by name, NIC, or vehicle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <Loading text="Loading EV Owners..." />
      ) : filteredOwners.length === 0 ? (
        <div className="text-center py-20 text-gray-600">
          <EyeIcon />
          <p className="mt-3 text-lg">No owners found.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOwners.map((owner) => (
            <div
              key={owner.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="text-gray-800 font-semibold">
                    {owner.firstName} {owner.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {owner.vehicleType} • {owner.vehicleNumber}
                  </p>
                </div>
                <select
                  value={owner.isActive}
                  onChange={(e) =>
                    handleStatusToggle(owner.id, e.target.value === "true")
                  }
                  className={`text-xs font-medium py-1.5 px-2 rounded-lg border-0 focus:ring-2 focus:ring-sky-500 ${
                    owner.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="p-5 space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span className="font-semibold">NIC:</span>
                  <span className="font-mono">{owner.nic}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Vehicle Type:</span>
                  <span>{owner.vehicleType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Vehicle Number:</span>
                  <span className="font-medium">{owner.vehicleNumber}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 p-4 border-t border-gray-100">
                <button
                  onClick={() => openModal(owner.id, "view")}
                  className="p-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white"
                >
                  <EyeIcon />
                </button>
                <button
                  onClick={() => openModal(owner.id, "edit")}
                  className="p-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  <EditIcon />
                </button>
                <button
                  onClick={() => handleDelete(owner.id)}
                  className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                >
                  <DeleteIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && activeOwner && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {mode === "view" ? "EV Owner Details" : "Edit EV Owner"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {mode === "view" ? (
                <div className="space-y-3 text-gray-700 text-sm">
                  <div className="flex justify-between">
                    <span className="font-semibold">Full Name:</span>
                    <span>
                      {activeOwner.firstName} {activeOwner.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">NIC:</span>
                    <span className="font-mono">{activeOwner.nic}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Vehicle Type:</span>
                    <span>{activeOwner.vehicleType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Vehicle Number:</span>
                    <span>{activeOwner.vehicleNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Status:</span>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        activeOwner.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {activeOwner.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  {[
                    { label: "First Name", key: "firstName" },
                    { label: "Last Name", key: "lastName" },
                    { label: "NIC", key: "nic" },
                    { label: "Vehicle Type", key: "vehicleType" },
                    { label: "Vehicle Number", key: "vehicleNumber" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        value={form[field.key] || ""}
                        onChange={(e) =>
                          setForm({ ...form, [field.key]: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  ))}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <label className="text-sm font-semibold text-gray-700">
                      Status
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.isActive || false}
                        onChange={(e) =>
                          setForm({ ...form, isActive: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sky-300 rounded-full peer peer-checked:bg-sky-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
                      <span className="ml-3 text-sm text-gray-700">
                        {form.isActive ? "Active" : "Inactive"}
                      </span>
                    </label>
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
