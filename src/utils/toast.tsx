import toast from "react-hot-toast";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiInfo,
  FiBell,
} from "react-icons/fi";

/**
 * Shows a success toast notification
 * @param message The message to display
 */
export const showSuccessToast = (message: string) => {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white shadow-lg border-l-4 border-green-500 border-t border-r border-b border-gray-200 rounded-md pointer-events-auto flex overflow-hidden`}
        style={{
          transform: t.visible ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease-in-out",
        }}
      >
        <div className="flex-shrink-0 bg-green-50 flex items-center justify-center w-12">
          <FiCheckCircle className="text-green-500 w-6 h-6" />
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-start">
            <div className="ml-2 flex-1">
              <p className="text-sm font-bold text-gray-900">Success</p>
              <p className="mt-1 text-sm text-gray-600">{message}</p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full p-4 flex items-center justify-center text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black transition-colors"
            aria-label="Close notification"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>
    ),
    {
      position: "top-right",
      duration: 4000,
    }
  );
};

/**
 * Shows an error toast notification
 * @param message The error message to display
 */
export const showErrorToast = (message: string) => {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white shadow-lg border-l-4 border-red-500 border-t border-r border-b border-gray-200 rounded-md pointer-events-auto flex overflow-hidden`}
        style={{
          transform: t.visible ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease-in-out",
        }}
      >
        <div className="flex-shrink-0 bg-red-50 flex items-center justify-center w-12">
          <FiAlertCircle className="text-red-500 w-6 h-6" />
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-start">
            <div className="ml-2 flex-1">
              <p className="text-sm font-bold text-gray-900">Error</p>
              <p className="mt-1 text-sm text-gray-600">{message}</p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full p-4 flex items-center justify-center text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black transition-colors"
            aria-label="Close notification"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>
    ),
    {
      position: "top-right",
      duration: 5000, // Errors stay longer
    }
  );
};

/**
 * Shows an info toast notification
 * @param message The info message to display
 */
export const showInfoToast = (message: string) => {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white shadow-lg border-l-4 border-blue-500 border-t border-r border-b border-gray-200 rounded-md pointer-events-auto flex overflow-hidden`}
        style={{
          transform: t.visible ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease-in-out",
        }}
      >
        <div className="flex-shrink-0 bg-blue-50 flex items-center justify-center w-12">
          <FiInfo className="text-blue-500 w-6 h-6" />
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-start">
            <div className="ml-2 flex-1">
              <p className="text-sm font-bold text-gray-900">Information</p>
              <p className="mt-1 text-sm text-gray-600">{message}</p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full p-4 flex items-center justify-center text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black transition-colors"
            aria-label="Close notification"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>
    ),
    {
      position: "top-right",
      duration: 4000,
    }
  );
};

/**
 * Shows a notification toast with a user avatar
 * @param title The title/name to display
 * @param message The message content
 * @param avatarUrl Optional URL for the avatar image
 */
export const showNotificationToast = (
  title: string,
  message: string,
  avatarUrl?: string
) => {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white shadow-lg border-l-4 border-black border-t border-r border-b border-gray-200 rounded-md pointer-events-auto flex overflow-hidden`}
        style={{
          transform: t.visible ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease-in-out",
        }}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              {avatarUrl ? (
                <img
                  className="h-12 w-12 rounded-full border-2 border-gray-200"
                  src={avatarUrl}
                  alt=""
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center border-2 border-gray-200">
                  <span className="text-white font-bold text-lg">
                    {title.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-bold text-gray-900">{title}</p>
              <p className="mt-1 text-sm text-gray-600">{message}</p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full p-4 flex items-center justify-center text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black transition-colors"
            aria-label="Close notification"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>
    ),
    {
      position: "top-right",
      duration: 5000,
    }
  );
};

/**
 * Shows a warning toast notification
 * @param message The warning message to display
 */
export const showWarningToast = (message: string) => {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white shadow-lg border-l-4 border-yellow-500 border-t border-r border-b border-gray-200 rounded-md pointer-events-auto flex overflow-hidden`}
        style={{
          transform: t.visible ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease-in-out",
        }}
      >
        <div className="flex-shrink-0 bg-yellow-50 flex items-center justify-center w-12">
          <FiBell className="text-yellow-500 w-6 h-6" />
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-start">
            <div className="ml-2 flex-1">
              <p className="text-sm font-bold text-gray-900">Warning</p>
              <p className="mt-1 text-sm text-gray-600">{message}</p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full p-4 flex items-center justify-center text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black transition-colors"
            aria-label="Close notification"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>
    ),
    {
      position: "top-right",
      duration: 5000,
    }
  );
};

// Export a unified toast object for easier imports
export const AppToast = {
  success: showSuccessToast,
  error: showErrorToast,
  info: showInfoToast,
  warning: showWarningToast,
  notification: showNotificationToast,
};

export default AppToast;

// Usage examples:
//
// import AppToast from './utils/toast';
//
// // Success toast
// AppToast.success("Your changes have been saved successfully!");
//
// // Error toast
// AppToast.error("Failed to update user settings. Please try again.");
//
// // Info toast
// AppToast.info("Your session will expire in 5 minutes.");
//
// // Warning toast
// AppToast.warning("You have unsaved changes.");
//
// // Notification toast with default avatar (initial)
// AppToast.notification("John Doe", "Your meeting is scheduled for tomorrow at 2pm.");
//
// // Notification toast with custom avatar
// AppToast.notification(
//   "Jane Smith",
//   "I've shared the document with you.",
//   "https://example.com/avatar.jpg"
// );
