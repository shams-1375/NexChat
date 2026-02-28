import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon, AlertTriangleIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../lib/api";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const navigate = useNavigate();

  const isChatPage = location.pathname?.startsWith("/chat");
  // Check if user is currently viewing the notifications page
  const isNotificationPage = location.pathname === "/notifications";

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { logoutMutation, isPending } = useLogout();

  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    // Refetch less often to avoid badge flickering
    staleTime: 1000 * 60,
  });

  const incomingRequests = friendRequests?.incomingRequest || [];
  const acceptedRequests = friendRequests?.acceptedRequest || [];

  const totalNotifications = incomingRequests.length + acceptedRequests.length;

  // Logic: Show badge only if there are notifications AND we aren't already looking at them
  const showBadge = totalNotifications > 0 && !isNotificationPage;

  return (
    <>
      <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end w-full">
            {isChatPage && (
              <div className="pl-5">
                <Link to="/" className="flex items-center gap-2.5">
                  <ShipWheelIcon className="size-9 text-primary" />
                  <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                    NextChat
                  </span>
                </Link>
              </div>
            )}

            <div className="flex items-center gap-3 sm:gap-4 ml-auto">
              <Link to={"/notifications"}>
                <button className="btn btn-ghost btn-circle relative">
                  <BellIcon className={`h-6 w-6 text-base-content ${showBadge ? "opacity-100" : "opacity-70"}`} />

                  {showBadge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-in zoom-in duration-300">
                      {totalNotifications > 9 ? "9+" : totalNotifications}
                    </span>
                  )}
                </button>
              </Link>

              <ThemeSelector />

              <div className="avatar cursor-pointer">
                <div className="w-9 rounded-full ring-primary ring-offset-base-100 hover:ring-2 transition-all">
                  <img
                    src={authUser?.profilePic}
                    alt="User Avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/user.png";
                    }}
                    onClick={() => navigate("/profile")}
                  />
                </div>
              </div>

              <button
                className="btn btn-ghost btn-circle"
                onClick={() => setIsLogoutModalOpen(true)}
              >
                <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isLogoutModalOpen && (
        <div className="modal modal-open z-[100]">
          <div className="modal-box max-w-sm text-center">
            <div className="flex justify-center mb-4 text-error">
              <AlertTriangleIcon className="size-12" />
            </div>
            <h3 className="font-bold text-xl">Confirm Logout</h3>
            <p className="py-4 opacity-70">Are you sure you want to log out?</p>

            <div className="modal-action grid grid-cols-2 gap-3">
              <button className="btn btn-outline" onClick={() => setIsLogoutModalOpen(false)} disabled={isPending}>
                Cancel
              </button>
              <button className="btn btn-error" onClick={() => logoutMutation()} disabled={isPending}>
                {isPending ? <span className="loading loading-spinner"></span> : "Logout"}
              </button>
            </div>
          </div>
          <div className="modal-backdrop bg-black/40" onClick={() => setIsLogoutModalOpen(false)}></div>
        </div>
      )}
    </>
  );
};

export default Navbar;