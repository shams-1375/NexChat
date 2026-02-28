import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "../hooks/useAuthUser";
import { updateProfile } from "../lib/api";
import { LANGUAGES } from "../constants"; // Import your languages array
import toast from "react-hot-toast";
import { UserIcon, MapPinIcon, LockIcon, SaveIcon } from "lucide-react";

const Profile = () => {
    const { authUser } = useAuthUser();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        fullName: authUser?.fullName || "",
        bio: authUser?.bio || "",
        nativeLanguage: authUser?.nativeLanguage || "",
        learningLanguage: authUser?.learningLanguage || "",
        location: authUser?.location || "",
        password: "",
    });

    const { mutate: update, isPending } = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            toast.success("Profile updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
            setFormData((prev) => ({ ...prev, password: "" }));
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update profile");
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const submissionData = { ...formData };
        if (!submissionData.password) delete submissionData.password;
        update(submissionData);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Header Card */}
            <div className="bg-base-200 rounded-3xl p-6 mb-8 border border-base-300">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="avatar">
                        <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <img src={authUser?.profilePic} alt="Profile" />
                        </div>
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold">{authUser?.fullName}</h2>
                        <p className="opacity-70">{authUser?.email}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="form-control">
                        <label className="label font-semibold">Full Name</label>
                        <div className="input input-bordered flex items-center gap-3">
                            <UserIcon className="size-4 opacity-50" />
                            <input
                                type="text"
                                className="grow"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="form-control">
                        <label className="label font-semibold">Location</label>
                        <div className="input input-bordered flex items-center gap-3">
                            <MapPinIcon className="size-4 opacity-50" />
                            <input
                                type="text"
                                className="grow"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* NATIVE LANGUAGE SELECT */}
                    <div className="form-control">
                        <label className="label font-semibold">Native Language</label>
                        <select
                            value={formData.nativeLanguage}
                            onChange={(e) => setFormData({ ...formData, nativeLanguage: e.target.value })}
                            className="select select-bordered w-full"
                        >
                            <option value="">Select your native language</option>
                            {LANGUAGES.map((lang) => (
                                <option key={`native-${lang}`} value={lang.toLowerCase()}>
                                    {lang}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* LEARNING LANGUAGE SELECT */}
                    <div className="form-control">
                        <label className="label font-semibold">Learning Language</label>
                        <select
                            value={formData.learningLanguage}
                            onChange={(e) => setFormData({ ...formData, learningLanguage: e.target.value })}
                            className="select select-bordered w-full"
                        >
                            <option value="">Select language you're learning</option>
                            {LANGUAGES.map((lang) => (
                                <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                                    {lang}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Bio */}
                <div className="form-control">
                    <label className="label font-semibold">Bio</label>
                    <textarea
                        className="textarea textarea-bordered h-24"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />
                </div>

                {/* Password */}
                <div className="form-control">
                    <label className="label font-semibold">
                        Change Password
                        <span className="label-text-alt opacity-50 ml-2">(Leave blank to keep current)</span>
                    </label>
                    <div className="input input-bordered flex items-center gap-3">
                        <LockIcon className="size-4 opacity-50" />
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="grow"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className={`btn btn-primary w-full ${isPending ? 'loading' : ''}`}
                    disabled={isPending}
                >
                    {!isPending && <SaveIcon className="size-4 mr-2" />}
                    {isPending ? "Updating..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
};

export default Profile;