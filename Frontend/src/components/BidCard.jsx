import { Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";

export const BidCard = ({ bid, gig }) => {
  const { user } = useAuth();
  const acceptBid = async () => {
    try {
      const { data } = await axiosInstance.patch(`/api/bids/${bid?._id}/hire`);
      alert(data.message);
    } catch (error) {
      console.error("Error hiring bid:", error);
      alert("Failed to hire bid. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition cursor-pointer p-6">
      <div className="flex items-start justify-between mb-3">
        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
          {bid.freelancerId?.name}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{bid.message}</p>

      <div className="flex items-center justify-between text-sm mb-4">
        <div className="flex items-center text-green-600 font-semibold">
          <Mail className="w-4 h-4" />
          <span className="ms-2">{bid.freelancerId.email}</span>
        </div>

        <div className="flex items-center text-gray-500">
          {/* < className="w-4 h-4 mr-1" /> */}
          <span className="truncate max-w-[100px]">{bid.status}</span>
        </div>
      </div>
      {gig.ownerId?._id === user?._id && (
        <>
          {bid.status === "pending" && (
            <button
              onClick={acceptBid}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Hire Bid
            </button>
          )}

          {bid.status === "hired" && (
            <button
              disabled
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg font-semibold cursor-not-allowed"
            >
              Hired
            </button>
          )}

          {bid.status === "rejected" && (
            <button
              disabled
              className="w-full bg-gray-400 text-white py-2 px-4 rounded-lg font-semibold cursor-not-allowed"
            >
              Rejected
            </button>
          )}
        </>
      )}
    </div>
  );
};
