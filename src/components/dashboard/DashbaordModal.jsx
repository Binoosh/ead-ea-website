import { IoMdClose } from "react-icons/io";
import PropTypes from "prop-types";

const DashboardModal = ({
  title,
  saveUpdate,
  closeModal,
  loading,
  children,
}) => (
  <div className="fixed inset-0 z-50 bg-black/80 flex justify-center items-center backdrop-blur-sm">
    <div className="bg-gray-800 border border-purple-500/30 p-8 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-auto shadow-2xl">
      {/* header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
          {title}
        </h2>
        {closeModal && (
          <button
            onClick={closeModal}
            className="text-red-400 hover:text-red-300 text-2xl leading-none p-2 rounded-lg hover:bg-red-500/10 transition-colors"
            aria-label="Close modal"
          >
            <IoMdClose />
          </button>
        )}
      </div>

      {/* body */}
      <div className="text-gray-300">{children}</div>

      {/* footer: only if saveUpdate provided */}
      {typeof saveUpdate === "function" && (
        <div className="flex space-x-4 mt-8">
          <button
            type="button"
            onClick={closeModal}
            className="w-full py-3 text-sm font-medium text-gray-300 border border-gray-600 rounded-xl hover:bg-gray-700 hover:border-gray-500 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={saveUpdate}
            disabled={loading}
            className="w-full py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-amber-600 rounded-xl hover:from-purple-700 hover:to-amber-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 disabled:transform-none"
          >
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      )}
    </div>
  </div>
);

DashboardModal.propTypes = {
  title: PropTypes.string.isRequired,
  saveUpdate: PropTypes.func,
  closeModal: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  children: PropTypes.node,
};

DashboardModal.defaultProps = {
  saveUpdate: null,
  loading: false,
  children: null,
};

export default DashboardModal;