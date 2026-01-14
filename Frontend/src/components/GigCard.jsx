import {
  DollarSign,
  User,
  Mail,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { useState } from "react";
import { BidCard } from "./BidCard";

export const GigCard = ({ gig, onGigAssigned }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [bids, setBids] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [isLoadingBids, setIsLoadingBids] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBidHired = (hiredBidId) => {
    setBids((prevBids) =>
      prevBids.map((bid) => {
        if (bid._id === hiredBidId) {
          return { ...bid, status: "hired" };
        }
        return { ...bid, status: "rejected" };
      })
    );
  };

  const viewAllBids = async () => {
    setIsLoadingBids(true);
    try {
      const { data } = await axiosInstance.get("/api/bids/", {
        params: { gigId: gig._id },
      });
      setBids(data.bids);
      console.log("bids:", data.bids);

      setIsBidModalOpen(true);
    } catch (error) {
      console.error("Error viewing bids:", error);
      alert("Failed to view bids. Please try again.");
    } finally {
      setIsLoadingBids(false);
    }
  };
  const handleBidding = async () => {
    if (!message.trim()) {
      alert("Please enter a message for your bid");
      return;
    }
    setIsSubmitting(true);
    try {
      const { data } = await axiosInstance.post("/api/bids/", {
        gigId: gig._id,
        message: message,
      });
      alert(data.message);
      setIsModalOpen(false);
      setMessage("");
    } catch (error) {
      console.error("Error submitting bid:", error);
      alert("Failed to submit bid. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition cursor-pointer p-6">
        <div className="flex items-start justify-between mb-3">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
            {gig.title}
          </span>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
            {gig.status}
          </span>
          {gig.ownerId?._id === user?._id && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
              Your Gig
            </span>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {gig.description}
        </p>

        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center text-green-600 font-semibold">
            <DollarSign className="w-4 h-4" />
            <span>{gig.budget}</span>
          </div>

          <div className="flex items-center text-gray-500">
            <Mail className="w-4 h-4 mr-1" />
            <span className="truncate max-w-[100px]">{gig.ownerId.email}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <User className="w-4 h-4 mr-1" />
            <span>{gig.ownerId.name}</span>
          </div>
        </div>
        {gig.ownerId?._id !== user?._id && (
          <>
            {gig.status === "open" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Place Bid
              </button>
            )}

            {gig.status === "assigned" && (
              <button
                disabled
                className="w-full bg-gray-400 text-white py-2 px-4 rounded-lg font-semibold cursor-not-allowed"
              >
                No more accepting bids
              </button>
            )}
          </>
        )}

        {gig.ownerId?._id === user?._id && (
          <button
            onClick={viewAllBids}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            View Bids
          </button>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                setMessage("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Message Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Proposal Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe why you're the best fit for this gig, your experience, and approach..."
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {message.length} characters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setMessage("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleBidding}
                disabled={isSubmitting || !message.trim()}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Bid"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bid Modal */}
      {isBidModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsBidModalOpen(false);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-6 h-6" />
            </button>
            {isLoadingBids && (
              <p className="text-center text-gray-500">Loading bids...</p>
            )}

            {!isLoadingBids && bids.length === 0 && (
              <p className="text-center text-gray-500">No bids yet</p>
            )}

            {!isLoadingBids &&
              bids.map((bid) => (
                <BidCard
                  key={bid._id}
                  bid={bid}
                  gig={gig}
                  onBidHired={handleBidHired}
                  onGigAssigned={onGigAssigned}
                />
              ))}
          </div>
        </div>
      )}
    </>
  );
};
