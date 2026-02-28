import { useState } from "react";
import { XIcon, MapPinIcon, MailIcon, UserMinusIcon, AlertCircleIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFriend } from "../lib/api";
import { getLanguageFlag } from "./FriendCard";
import toast from "react-hot-toast";

const FriendProfileModal = ({ friend, onClose, isLoading }) => {
    const queryClient = useQueryClient();
    const [showConfirm, setShowConfirm] = useState(false);

    const { mutate: unfriend, isPending: isRemoving } = useMutation({
        mutationFn: () => removeFriend(friend._id),
        onSuccess: () => {
            toast.success(`${friend.fullName} removed from friends`);
            queryClient.invalidateQueries({ queryKey: ["friends"] });
            queryClient.invalidateQueries({ queryKey: ["recommendedUsers"] });
            onClose();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to remove friend");
        }
    });

    if (!friend) return null;

    const capitalize = (str = "") => str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

    return (
        <div className="modal modal-open z-50">
            <div className="modal-box relative max-w-md border border-base-300">
                {/* Close Button */}
                <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    <XIcon className="size-5" />
                </button>

                {!showConfirm ? (
                    /* MAIN PROFILE VIEW */
                    <div className="flex flex-col items-center text-center space-y-4 pt-4">
                        <div className="avatar">
                            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img src={friend.profilePic} alt={friend.fullName} onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/user.png";
                                }} />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold">{friend.fullName}</h3>
                            {isLoading ? (
                                <span className="loading loading-dots loading-xs opacity-50"></span>
                            ) : (
                                <div className="flex items-center justify-center gap-1 opacity-70 text-sm">
                                    <MailIcon className="size-3" />
                                    <span>{friend.email}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap justify-center gap-2">
                            <span className="badge badge-secondary p-3">
                                {getLanguageFlag(friend.nativeLanguage)} Native: {capitalize(friend.nativeLanguage)}
                            </span>
                            <span className="badge badge-outline p-3">
                                {getLanguageFlag(friend.learningLanguage)} Learning: {capitalize(friend.learningLanguage)}
                            </span>
                        </div>

                        <div className="divider my-0"></div>

                        <div className="w-full text-left space-y-3">
                            {isLoading ? (
                                <div className="flex flex-col gap-2">
                                    <div className="skeleton h-4 w-1/2"></div>
                                    <div className="skeleton h-20 w-full"></div>
                                </div>
                            ) : (
                                <>
                                    {friend.location && (
                                        <div className="flex items-center gap-2 text-sm opacity-80">
                                            <MapPinIcon className="size-4 text-primary" />
                                            <span>{friend.location}</span>
                                        </div>
                                    )}
                                    <div className="bg-base-200 p-4 rounded-xl border border-base-300">
                                        <p className="text-sm italic leading-relaxed">
                                            {friend.bio || "No bio provided yet."}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="w-full pt-4">
                            <button
                                onClick={() => setShowConfirm(true)}
                                disabled={isLoading}
                                className="btn btn-error btn-outline btn-sm w-full gap-2"
                            >
                                <UserMinusIcon className="size-4" />
                                Remove Friend
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="py-6 text-center animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-center mb-4 text-error">
                            <AlertCircleIcon className="size-16" />
                        </div>
                        <h3 className="text-xl font-bold">Unfriend {friend.fullName}?</h3>
                        <p className="py-4 opacity-70">
                            They will be removed from your friend list and you won't be able to message them until you reconnect.
                        </p>
                        <div className="flex flex-col gap-2 mt-4">
                            <button
                                className="btn btn-error w-full"
                                onClick={() => unfriend()}
                                disabled={isRemoving}
                            >
                                {isRemoving ? <span className="loading loading-spinner"></span> : "Yes, Remove Friend"}
                            </button>
                            <button
                                className="btn btn-ghost w-full"
                                onClick={() => setShowConfirm(false)}
                                disabled={isRemoving}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className="modal-backdrop bg-black/50" onClick={onClose}></div>
        </div>
    );
};

export default FriendProfileModal;