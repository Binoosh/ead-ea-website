import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import Loading from "../../../components/loading/Loading";
import Swal from "sweetalert2";
import {
  fetchEVOwners,
  deleteEVOwner,
  fetchEVOwnerById,
  updateEVOwner,
  updateEVOwnerStatus,
} from "../../../services/evOwnersService";
import {
  CloseIcon,
  DeleteIcon,
  EditIcon,
  EyeIcon,
} from "../../../components/icons/Icons";

export default function ViewEVOwners() {
  const [evOwners, setEvOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});

  const loadEVOwners = async () => {
    setLoading(true);
    try {
      const data = await fetchEVOwners();
      setEvOwners(data);
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
    loadEVOwners();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Remove Driver?",
      text: "This EV driver will be permanently removed from the system!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Remove Driver",
      cancelButtonText: "Cancel",
      background: "#1f2937",
      color: "#f3f4f6"
    });
    if (!confirm.isConfirmed) return;

    try {
      await deleteEVOwner(id);
      Swal.fire({
        title: "Driver Removed",
        text: "EV driver deleted successfully",
        icon: "success",
        background: "#1f2937",
        color: "#f3f4f6"
      });
      loadEVOwners();
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

  const handleStatusChange = async (id, isActive) => {
    try {
      await updateEVOwnerStatus(id, isActive);
      Swal.fire({
        title: "Status Updated",
        text: "Driver status changed successfully",
        icon: "success",
        background: "#1f2937",
        color: "#f3f4f6"
      });
      loadEVOwners();
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
      const owner = await fetchEVOwnerById(id);
      setSelectedOwner(owner);
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

  const handleEdit = async (owner) => {
    setEditForm({ ...owner });
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    try {
      await updateEVOwner(editForm.id, editForm);
      Swal.fire({
        title: "Driver Updated",
        text: "EV driver details updated successfully",
        icon: "success",
        background: "#1f2937",
        color: "#f3f4f6"
      });
      setShowEditModal(false);
      loadEVOwners();
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

  return (
    <DashboardLayout title="Driver Directory">
      {loading ? (
        <Loading text="Loading Driver Database..." />
      ) : (
        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-purple-500/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Driver Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-amber-400 uppercase tracking-wider">
                    NIC Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Vehicle Model
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-amber-400 uppercase tracking-wider">
                    License Plate
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Account Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {evOwners.map((owner) => (
                  <tr
                    key={owner.id}
                    className="hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                          {owner.firstName?.charAt(0)}
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white">
                            {owner.firstName} {owner.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-mono">
                      {owner.nic}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {owner.vehicleType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-white">
                      {owner.vehicleNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={owner.isActive}
                        onChange={(e) =>
                          handleStatusChange(
                            owner.id,
                            e.target.value === "true"
                          )
                        }
                        className={`text-sm font-bold py-2 px-4 rounded-xl border-0 focus:ring-2 focus:ring-amber-500 transition-all ${
                          owner.isActive
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}
                      >
                        <option value="true">🟢 ACTIVE</option>
                        <option value="false">🔴 INACTIVE</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleView(owner.id)}
                          className="inline-flex items-center p-3 text-sm font-bold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-purple-500/30"
                          title="View Driver Details"
                        >
                          <EyeIcon />
                        </button>
                        <button
                          onClick={() => handleEdit(owner)}
                          className="inline-flex items-center p-3 text-sm font-bold text-white bg-amber-600 rounded-xl hover:bg-amber-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 border border-amber-500/30"
                          title="Edit Driver"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => handleDelete(owner.id)}
                          className="inline-flex items-center p-3 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 border border-red-500/30"
                          title="Remove Driver"
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
      {showViewModal && selectedOwner && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full transform transition-all border border-amber-500/30">
            <div className="px-8 py-6 border-b border-gray-700 flex justify-between items-center bg-gray-900/50 rounded-t-2xl">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
                Driver Profile
              </h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-red-400 transition-colors duration-200 p-2 rounded-xl hover:bg-red-500/10 border border-gray-600"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <span className="font-semibold text-gray-300">Full Name</span>
                <span className="text-white text-lg font-bold">
                  {selectedOwner.firstName} {selectedOwner.lastName}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <span className="font-semibold text-gray-300">NIC Number</span>
                <span className="text-white font-mono text-lg">
                  {selectedOwner.nic}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <span className="font-semibold text-gray-300">
                  Vehicle Model
                </span>
                <span className="text-white text-lg">
                  {selectedOwner.vehicleType}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <span className="font-semibold text-gray-300">
                  License Plate
                </span>
                <span className="text-white text-lg font-bold">
                  {selectedOwner.vehicleNumber}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="font-semibold text-gray-300">Status</span>
                <span
                  className={`px-4 py-2 rounded-xl text-sm font-bold ${
                    selectedOwner.isActive
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  {selectedOwner.isActive ? "🟢 ACTIVE" : "🔴 INACTIVE"}
                </span>
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
                Update Driver
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-red-400 transition-colors duration-200 p-2 rounded-xl hover:bg-red-500/10 border border-gray-600"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="p-8 space-y-6">
              {[
                "firstName",
                "lastName",
                "nic",
                "vehicleType",
                "vehicleNumber",
              ].map((field) => (
                <div key={field} className="space-y-3">
                  <label className="block text-lg font-bold text-gray-300">
                    {field.charAt(0).toUpperCase() +
                      field.slice(1).replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-4 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-white"
                    value={editForm[field] || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, [field]: e.target.value })
                    }
                  />
                </div>
              ))}
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
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}