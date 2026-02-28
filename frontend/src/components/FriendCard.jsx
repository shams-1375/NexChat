import { useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { LANGUAGE_TO_FLAG } from "../constants";
import { getFriendProfile } from "../lib/api";
import FriendProfileModal from "./FriendProfileModal";

const FriendCard = ({ friend }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: fullFriendData, isLoading } = useQuery({
        queryKey: ["friendProfile", friend._id],
        queryFn: () => getFriendProfile(friend._id),
        enabled: isModalOpen,
    });

    return (
        <>
            <div className="card bg-base-200 pb-3 hover:shadow-md transition-shadow">
                <div className="card-body p-4">
                    {/* USER INFO - Clickable */}
                    <div
                        className="flex items-center gap-3 mb-3 cursor-pointer rounded-xl p-3  hover:bg-base-100"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <div className="avatar size-12">
                            <img
                                src={friend.profilePic}
                                alt={friend.fullName}
                                className="rounded-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/user.png";
                                }}
                            />
                        </div>
                        <h3 className="font-semibold truncate">{friend.fullName}</h3>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className="badge badge-secondary text-xs">
                            {getLanguageFlag(friend.nativeLanguage)}
                            Native: {friend.nativeLanguage}
                        </span>
                        <span className="badge badge-outline text-xs">
                            {getLanguageFlag(friend.learningLanguage)}
                            Learning: {friend.learningLanguage}
                        </span>
                    </div>

                    <Link to={`/chat/${friend._id}`} className="btn btn-outline mt-3 w-full">
                        Message
                    </Link>
                </div>
            </div>

            {isModalOpen && (
                <FriendProfileModal
                    friend={fullFriendData || friend}
                    isLoading={isLoading}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
};
export default FriendCard;

export function getLanguageFlag(language) {
    if (!language) return null;
    const langLower = language.toLowerCase();
    const countryCode = LANGUAGE_TO_FLAG[langLower];

    if (countryCode) {
        return (
            <img
                src={`https://flagcdn.com/24x18/${countryCode}.png`}
                alt={`${langLower} flag`}
                className="h-3 mr-1 inline-block"
            />
        );
    }
    return null;
}