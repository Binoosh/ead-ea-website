import PropTypes from "prop-types";
import { IoMdClose } from "react-icons/io";

const DashModel = ({
  title,
  saveUpdate,
  closeModal,
  loading = false,
  children,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto p-6 animate-fadeIn">
        <header className="flex items-center justify-between border-b pb-3 mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-sky-700">
            {title}
          </h2>
          <button
            type="button"
            onClick={closeModal}
            className="text-gray-500 hover:text-red-500 transition-colors text-xl"
            aria-label="Close modal"
          >
            <IoMdClose />
          </button>
        </header>

        <div className="text-sm text-gray-700">{children}</div>

        {typeof saveUpdate === "function" && (
          <footer className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              onClick={closeModal}
              type="button"
              className="px-4 py-2 text-sm font-medium border rounded-md text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={saveUpdate}
              disabled={loading}
              type="button"
              className={`px-4 py-2 text-sm font-semibold rounded-md text-white ${
                loading
                  ? "bg-sky-400 cursor-not-allowed opacity-70"
                  : "bg-sky-600 hover:bg-sky-700"
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </footer>
        )}
      </div>
    </div>
  );
};

DashModel.propTypes = {
  title: PropTypes.string.isRequired,
  saveUpdate: PropTypes.func,
  closeModal: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  children: PropTypes.node,
};

export default DashModel;
