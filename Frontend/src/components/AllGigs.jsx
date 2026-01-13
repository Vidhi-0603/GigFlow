import {
  Search,
  Briefcase,
} from "lucide-react";
import axiosInstance from "../utils/AxiosInstance";
import { useEffect, useState } from "react";
import { GigCard } from "./GigCard";

export const AllGigs = () => {
  const [gigs, setGigs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const { data } = await axiosInstance.get("api/gigs/", {
          params: { search: searchTerm },
        });
        console.log("Gigs: ", data.gigs);

        setGigs(data.gigs);
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <>
      <div>
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search gigs by title, description, or category..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Page Title */}
        <div className="mb-6">
          <p className="text-gray-600 mt-1">
            {gigs.length} gig{gigs.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Gigs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig) => (
            <GigCard key={gig._id} gig={gig} />
          ))}
        </div>

        {gigs.length === 0 && (
          <div className="text-center py-16">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No gigs found
            </h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </>
  );
};
