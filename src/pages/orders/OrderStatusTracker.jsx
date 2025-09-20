import {
  FiPackage,
  FiLoader,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

const statusConfig = {
  pending: {
    color: "warning",
    icon: <FiPackage />,
  },
  processing: {
    color: "primary",
    icon: <FiLoader />,
  },
  shipped: {
    color: "accent",
    icon: <FiTruck />,
  },
  delivered: {
    color: "success",
    icon: <FiCheckCircle />,
  },
  cancelled: {
    color: "error",
    icon: <FiXCircle />,
  },
};

const getColorClass = (color, type = "badge") => {
  const map = {
    primary: {
      badge: "bg-primary-100 text-primary-800",
      progress: "bg-primary-500",
      dotActive: "bg-primary-500 text-white",
      dotInactive: "bg-primary-200 text-primary-500",
      btn: "btn-primary",
      bg: "bg-primary-100 text-primary-800",
    },
    success: {
      badge: "bg-success-100 text-success-800",
      progress: "bg-success-500",
      dotActive: "bg-success-500 text-white",
      dotInactive: "bg-success-200 text-success-500",
      btn: "btn-success",
      bg: "bg-success-100 text-success-800",
    },
    accent: {
      badge: "bg-accent-100 text-accent-800",
      progress: "bg-accent-500",
      dotActive: "bg-accent-500 text-white",
      dotInactive: "bg-accent-200 text-accent-500",
      btn: "btn-accent",
      bg: "bg-accent-100 text-accent-800",
    },
    warning: {
      badge: "bg-warning-100 text-warning-800",
      progress: "bg-warning-500",
      dotActive: "bg-warning-500 text-white",
      dotInactive: "bg-warning-200 text-warning-500",
      btn: "btn-warning",
      bg: "bg-warning-100 text-warning-800",
    },
    error: {
      badge: "bg-error-100 text-error-800",
      progress: "bg-error-500",
      dotActive: "bg-error-500 text-white",
      dotInactive: "bg-error-200 text-error-500",
      btn: "btn-error",
      bg: "bg-error-100 text-error-800",
    },
    neutral: {
      badge: "bg-neutral-100 text-neutral-800",
      progress: "bg-neutral-300",
      dotActive: "bg-neutral-500 text-white",
      dotInactive: "bg-neutral-200 text-neutral-600",
      btn: "btn-secondary",
      bg: "bg-neutral-100 text-neutral-800",
    },
  };

  return map[color] || map.neutral;
};



const OrderStatusTracker = ({
  statuses = [],
  orderStatus,
  onStatusChange,
  loading,
}) => {
  const currentIndex = statuses.findIndex(
    (s) => s.toLowerCase() === orderStatus?.toLowerCase()
  );

  const currentColor =
    statusConfig[orderStatus?.toLowerCase()]?.color || "neutral";

  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-neutral-900">Order Status</h2>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
            getColorClass(currentColor, "badge").badge
          }`}
        >
          {orderStatus}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="overflow-hidden h-2 mb-6 text-xs flex rounded bg-neutral-200">
          <div
            className={`transition-all duration-500 ease-in-out flex flex-col text-center whitespace-nowrap text-white justify-center ${
              getColorClass(currentColor, "progress").progress
            }`}
            style={{
              width:
                currentIndex >= 0
                  ? `${((currentIndex + 1) / statuses.length) * 100}%`
                  : "0%",
            }}
          />
        </div>

        {/* Status Steps */}
        <div className="flex justify-between text-sm">
          {statuses.map((status, index) => {
            const lowerStatus = status.toLowerCase();
            const isActive = index <= currentIndex;
            const color = statusConfig[lowerStatus]?.color || "neutral";
            const icon = statusConfig[lowerStatus]?.icon || <FiPackage />;

            return (
              <div className="text-center" key={status}>
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center mx-auto ${
                    isActive
                      ? getColorClass(color, "dotActive").dotActive
                      : getColorClass(color, "dotInactive").dotInactive
                  }`}
                >
                  {icon}
                </div>
                <div className="mt-1 font-medium capitalize">{status}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Update Buttons */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-neutral-900 mb-2">
          Update Status
        </h3>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => {
            const lowerStatus = status.toLowerCase();
            const isCurrent = orderStatus?.toLowerCase() === lowerStatus;
            const color = statusConfig[lowerStatus]?.color || "neutral";

            return (
              <button
                key={status}
                onClick={() => onStatusChange(status.toLowerCase())}
                disabled={isCurrent || loading}
                className={`btn btn-sm ${
                  isCurrent
                    ? getColorClass(color, "btn").btn
                    : "btn-outline btn-secondary"
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderStatusTracker;

