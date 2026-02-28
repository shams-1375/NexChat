import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import { Link } from "react-router";
import { UsersIcon } from "lucide-react";
import FriendCard from "../components/FriendCard";

const FriendsPage = () => {
  // Fetch only the established friends
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
            <p className="opacity-70">Manage and chat with your language partners</p>
          </div>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

        {/* Friends Grid */}
        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <div className="card bg-base-200 p-10 text-center">
            <div className="flex justify-center mb-4">
              <UsersIcon className="size-12 opacity-20" />
            </div>
            <h3 className="font-semibold text-xl mb-2">No friends yet</h3>
            <p className="text-base-content opacity-70 mb-6">
              You haven't added any friends yet. Head back to the home page to find partners!
            </p>
            <Link to="/" className="btn btn-primary w-fit mx-auto">
              Find Language Partners
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;