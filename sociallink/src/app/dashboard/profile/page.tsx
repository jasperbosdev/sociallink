"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabase";
import { useUserData } from "./util/useUserData";
import Nav from "../components/nav";

export default function Dashboard() {
  const router = useRouter();
  const { loading, error, userData } = useUserData();

  const hideFooter = () => {
    const footer = document.getElementById("footer");
    if (footer) {
      footer.style.display = "none";
    }
  };

  // State variables for toggles
  const [isAvatarEnabled, setIsAvatarEnabled] = useState(false);
  const [isBackgroundEnabled, setIsBackgroundEnabled] = useState(false);
  const [isBannerEnabled, setIsBannerEnabled] = useState(false);
  const [isCursorEnabled, setIsCursorEnabled] = useState(false);

  // State for form inputs
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // State for collapsible sections
  const [isAccountSettingsOpen, setAccountSettingsOpen] = useState(false);
  const [isFileSettingsOpen, setFileSettingsOpen] = useState(false);
  const [isCosmeticSettingsOpen, setCosmeticSettingsOpen] = useState(false);
  const [isSocialSettingsOpen, setSocialSettingsOpen] = useState(false);
  const [isCustomLinkSettingsOpen, setCustomLinkSettingsOpen] = useState(false);
  const [isMediaEmbedSettingsOpen, setMediaEmbedSettingsOpen] = useState(false);

  // State for avatar upload
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    hideFooter();
    // Set avatar preview if file is selected
    if (avatar) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(avatar);
    } else {
      setAvatarPreview(null);
    }
  }, [avatar]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setAvatar(event.target.files[0]);
    }
  };

  const uploadAvatar = async () => {
    if (!avatar || !userData) return;

    setUploading(true);
    const { username } = userData; // Assuming username is available in userData
    const fileName = `${username}-pfp`;

    const { data, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, avatar, {
        cacheControl: "3600",
        upsert: true, // Replace if file exists
      });

    if (uploadError) {
      console.error("Error uploading avatar:", uploadError);
    } else {
      console.log("Avatar uploaded successfully:", data);
    }
    setUploading(false);
    setAvatar(null); // Clear the selected file
  };

  return (
    <>
      <div className="flex">
        <Nav />
        <div className="flex flex-col justify-center items-center w-full px-4 mt-8">
          <div className="bg-[#101013] rounded-lg w-full relative sm:p-4 p-2 mb-4 max-w-6xl border border-4 rounded-xl border-white/20">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Left Column */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="bg-zinc-900 shadow-sm hover:shadow-md duration-100 w-full rounded-md p-4">
                  <h2 className="text-white font-bold text-xl cursor-pointer flex justify-between items-center">
                    <span className="select-none">
                      <i className="fas fa-user-edit mr-2"></i> Manage Bio
                    </span>
                  </h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <div className="bg-zinc-800 py-[7px] text-white rounded-md my-1 border-[3px] border-white/20 font-bold rounded-lg text-start p-2 text-center cursor-pointer hover:scale-[1.02] transition w-fit">
                      Save Changes
                    </div>
                    <div
                      className="bg-blue-700 py-[7px] text-white rounded-md my-1 border-[3px] border-blue-400 font-bold rounded-lg text-start p-2 text-center cursor-pointer hover:scale-[1.02] transition w-fit"
                      onClick={() =>
                        window.open("/u/" + `${userData.username}`, "_blank")
                      }
                    >
                      View Profile
                    </div>
                    {/* make this function set the profile back to a default template with all settings reset */}
                    <div className="bg-red-700 py-[7px] text-white rounded-md my-1 border-[3px] border-red-400 font-bold rounded-lg text-start p-2 text-center cursor-pointer hover:scale-[1.02] transition w-fit">
                      Reset Profile
                    </div>
                    {/* make this set the profile to a hidden state */}
                    <div className="bg-red-700 py-[7px] text-white rounded-md my-1 border-[3px] border-red-400 font-bold rounded-lg text-start p-2 text-center cursor-pointer hover:scale-[1.02] transition w-fit">
                      Disable Profile
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900 shadow-sm hover:shadow-md duration-100 w-full rounded-md p-4">
                  <h2
                    className="text-white font-bold text-xl cursor-pointer flex justify-between items-center"
                    onClick={() =>
                      setAccountSettingsOpen(!isAccountSettingsOpen)
                    }
                  >
                    <span className="select-none">
                      <i className="fas fa-cog mr-2"></i> Account Settings
                    </span>
                    <i
                      className={`fas fa-chevron-${
                        isAccountSettingsOpen ? "down" : "right"
                      } text-white`}
                    ></i>
                  </h2>
                  {isAccountSettingsOpen && (
                    <div className="mt-2">
                      <p>Account details go here.</p>
                    </div>
                  )}
                </div>

                <div className="bg-zinc-900 shadow-sm hover:shadow-md duration-100 w-full rounded-md p-4">
                  <h2
                    className="text-white font-bold text-xl cursor-pointer flex justify-between items-center"
                    onClick={() => setFileSettingsOpen(!isFileSettingsOpen)}
                  >
                    <span className="select-none">
                      <i className="fas fa-folder mr-2"></i> File Settings
                    </span>
                    <i
                      className={`fas fa-chevron-${
                        isFileSettingsOpen ? "down" : "right"
                      } text-white`}
                    ></i>
                  </h2>
                  {isFileSettingsOpen && (
                    <div className="flex mt-2 grid grid-cols-2 gap-4 flex-wrap">
                      <div className="flex flex-col">
                        <h3 className="text-white/80 text-lg mb-2 text-base font-bold">
                          Avatar
                        </h3>
                        <div
                          className="flex flex-col items-center justify-center px-10 rounded-lg py-5 space-y-2 border border-2 border-white/20 bg-white/10 cursor-pointer"
                          onClick={() =>
                            document
                              .getElementById("avatarUploadInput")
                              ?.click()
                          } // The whole box is now clickable
                        >
                          {/* Check if avatarPreview (newly selected file) or previously uploaded avatar exists */}
                          {avatarPreview || userData?.avatarUrl ? (
                            <img
                              src={avatarPreview || userData?.avatarUrl} // Display preview or current uploaded avatar
                              alt="Avatar Preview"
                              className="w-full object-cover rounded-lg" // Ensure avatar covers the entire box
                            />
                          ) : (
                            <>
                              <i className="fas fa-circle-user text-white/60 text-4xl"></i>
                              <p className="text-base text-white/60 font-semibold">
                                Click to upload a file
                              </p>
                            </>
                          )}

                          {/* File input for selecting new avatar */}
                          <input
                            id="avatarUploadInput"
                            type="file"
                            className="hidden"
                            onChange={handleAvatarChange} // Handle avatar file change
                          />
                        </div>

                        {/* Display file name if avatar is selected, outside the box */}
                        {avatar && (
                          <p className="text-sm text-white/60 mt-2">
                            {avatar.name.length > 10
                              ? avatar.name.substring(0, 10) + "..."
                              : avatar.name}
                          </p>
                        )}

                        {/* Button to upload the selected avatar */}
                        <button
                          className="mt-4 bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
                          onClick={uploadAvatar} // Start upload when button is clicked
                          disabled={uploading} // Disable the button while uploading
                        >
                          {uploading ? "Uploading..." : "Upload Avatar"}
                        </button>

                        <label className="mt-2 flex items-center cursor-pointer">
                          <span className="mr-2 text-white/60 font-semibold">
                            Use Discord Avatar
                          </span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={isAvatarEnabled}
                              onChange={() =>
                                setIsAvatarEnabled(!isAvatarEnabled)
                              }
                            />
                            <div
                              className={`block w-12 h-6 rounded-full ${
                                isAvatarEnabled ? "bg-green-500" : "bg-gray-300"
                              }`}
                            ></div>
                            <div
                              className={`dot absolute left-0 top-0 w-6 h-6 rounded-full bg-white transition ${
                                isAvatarEnabled ? "translate-x-6" : ""
                              }`}
                            ></div>
                          </div>
                        </label>
                      </div>

                      <div className="flex flex-col">
                        <h3 className="text-white/80 text-lg mb-2 text-base font-bold">
                          Background
                        </h3>
                        <div className="flex flex-col items-center justify-center px-10 rounded-lg py-5 space-y-2 border border-2 border-white/20 bg-white/10">
                          <i className="fas fa-photo-film text-white/60 text-4xl"></i>
                          <p className="text-base text-white/60 font-semibold">
                            Click to upload a file
                          </p>
                        </div>
                        <label className="mt-2 flex items-center cursor-pointer"></label>
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-white/80 text-lg mb-2 text-base font-bold">
                          Banner
                        </h3>
                        <div className="flex flex-col items-center justify-center px-10 rounded-lg py-5 space-y-2 border border-2 border-white/20 bg-white/10">
                          <i className="fas fa-image text-white/60 text-4xl"></i>
                          <p className="text-base text-white/60 font-semibold">
                            Click to upload a file
                          </p>
                        </div>
                        <label className="mt-2 flex items-center cursor-pointer">
                          <span className="mr-2 text-white/60 font-semibold">
                            Banner
                          </span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={isBannerEnabled}
                              onChange={() =>
                                setIsBannerEnabled(!isBannerEnabled)
                              }
                            />
                            <div
                              className={`block w-12 h-6 rounded-full ${
                                isBannerEnabled ? "bg-green-500" : "bg-gray-300"
                              }`}
                            ></div>
                            <div
                              className={`dot absolute left-0 top-0 w-6 h-6 rounded-full bg-white transition ${
                                isBannerEnabled ? "translate-x-6" : ""
                              }`}
                            ></div>
                          </div>
                        </label>
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-white/80 text-lg mb-2 text-base font-bold">
                          Cursor
                        </h3>
                        <div className="flex flex-col items-center justify-center px-10 rounded-lg py-5 space-y-2 border border-2 border-white/20 bg-white/10">
                          <i className="fas fa-arrow-pointer text-white/60 text-4xl"></i>
                          <p className="text-base text-white/60 font-semibold">
                            Click to upload a file
                          </p>
                        </div>
                        <label className="mt-2 flex items-center cursor-pointer">
                          <span className="mr-2 text-white/60 font-semibold">
                            Center Cursor
                          </span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={isCursorEnabled}
                              onChange={() =>
                                setIsCursorEnabled(!isCursorEnabled)
                              }
                            />
                            <div
                              className={`block w-12 h-6 rounded-full ${
                                isCursorEnabled ? "bg-green-500" : "bg-gray-300"
                              }`}
                            ></div>
                            <div
                              className={`dot absolute left-0 top-0 w-6 h-6 rounded-full bg-white transition ${
                                isCursorEnabled ? "translate-x-6" : ""
                              }`}
                            ></div>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="bg-zinc-900 shadow-sm hover:shadow-md duration-100 w-full rounded-md p-4">
                  <h2
                    className="text-white font-bold text-xl cursor-pointer flex justify-between items-center"
                    onClick={() =>
                      setCosmeticSettingsOpen(!isCosmeticSettingsOpen)
                    }
                  >
                    <span className="select-none">
                      <i className="fas fa-wand-magic-sparkles mr-2"></i>{" "}
                      Cosmetic Settings
                    </span>
                    <i
                      className={`fas fa-chevron-${
                        isCosmeticSettingsOpen ? "down" : "right"
                      } text-white`}
                    ></i>
                  </h2>
                  {isCosmeticSettingsOpen && (
                    <div className="mt-2">
                      <p>Cosmetic settings options go here.</p>
                    </div>
                  )}
                </div>

                <div className="bg-zinc-900 shadow-sm hover:shadow-md duration-100 w-full rounded-md p-4">
                  <h2
                    className="text-white font-bold text-xl cursor-pointer flex justify-between items-center"
                    onClick={() => setSocialSettingsOpen(!isSocialSettingsOpen)}
                  >
                    <span className="select-none">
                      <i className="fas fa-share-alt mr-2"></i> Social Settings
                    </span>
                    <i
                      className={`fas fa-chevron-${
                        isSocialSettingsOpen ? "down" : "right"
                      } text-white`}
                    ></i>
                  </h2>
                  {isSocialSettingsOpen && (
                    <div className="mt-2">
                      <p>Social settings options go here.</p>
                    </div>
                  )}
                </div>

                <div className="bg-zinc-900 shadow-sm hover:shadow-md duration-100 w-full rounded-md p-4">
                  <h2
                    className="text-white font-bold text-xl cursor-pointer flex justify-between items-center"
                    onClick={() =>
                      setCustomLinkSettingsOpen(!isCustomLinkSettingsOpen)
                    }
                  >
                    <span className="select-none">
                      <i className="fas fa-link mr-2"></i> Custom Link Settings
                    </span>
                    <i
                      className={`fas fa-chevron-${
                        isCustomLinkSettingsOpen ? "down" : "right"
                      } text-white`}
                    ></i>
                  </h2>
                  {isCustomLinkSettingsOpen && (
                    <div className="mt-2">
                      <p>Custom link settings options go here.</p>
                    </div>
                  )}
                </div>

                <div className="bg-zinc-900 shadow-sm hover:shadow-md duration-100 w-full rounded-md p-4">
                  <h2
                    className="text-white font-bold text-xl cursor-pointer flex justify-between items-center"
                    onClick={() =>
                      setMediaEmbedSettingsOpen(!isMediaEmbedSettingsOpen)
                    }
                  >
                    <span className="select-none">
                      <i className="fas fa-video mr-2"></i> Media Embed Settings
                    </span>
                    <i
                      className={`fas fa-chevron-${
                        isMediaEmbedSettingsOpen ? "down" : "right"
                      } text-white`}
                    ></i>
                  </h2>
                  {isMediaEmbedSettingsOpen && (
                    <div className="mt-2">
                      <p>Media embed settings options go here.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
