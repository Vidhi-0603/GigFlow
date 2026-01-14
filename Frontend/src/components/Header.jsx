import {
  Search,
  Home,
  Briefcase,
  LogOut,
  DollarSign,
  Clock,
  User,
  ChevronLeft,
  Mail,
  PlusCircle,
  X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
export const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState(0);
  const [view, setView] = useState("home");
  const navigate = useNavigate();
  const { logout } = useAuth();


  const handleGigPost = async () => {
    if (!title.trim() || !description.trim() || budget < 1) {
      alert("Please enter all required details for your gig");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await axiosInstance.post("/api/gigs/", {
        title,
        description,
        budget,
      });
      alert("Gig posted successfully!");
      setIsModalOpen(false);
      setTitle("");
      setDescription("");
      setBudget(0);
    } catch (error) {
      console.error("Error posting gig:", error);
      alert("Failed to post gig. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-indigo-600">Gigflow</h1>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setView("home");
                  navigate("/dashboard");
                }}
                className={`flex items-center px-4 py-2 rounded-lg transition ${
                  view === "home"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Home className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Home</span>
              </button>

              <button
                onClick={() => {
                  setView("myGigs");
                  navigate("/dashboard/mygigs");
                }}
                className={`flex items-center px-4 py-2 rounded-lg transition ${
                  view === "myGigs"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Briefcase className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">My Gigs</span>
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Post a Gig</span>
              </button>

              <button
                onClick={async () => {
                  await logout();
                  navigate("/",{replace:true});
                }}
                className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                setTitle("");
                setDescription("");
                setBudget(0);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Message Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Gig Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Gig Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Gig Budget
              </label>
              <input
                type="number"
                value={budget}
                min={100}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setTitle("");
                  setDescription("");
                  setBudget(0);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleGigPost}
                disabled={isSubmitting || !title.trim()}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Posting..." : "Post Gig"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
