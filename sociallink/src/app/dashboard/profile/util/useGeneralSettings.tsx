import { useEffect, useState } from "react";
import { supabase } from "../../../supabase";
import { useUserData } from "./useUserData";

export default function GeneralSettings() {
    const [animatedTitle, setAnimatedTitle] = useState(false);
    const [typingDesc, setTypingDesc] = useState(false);
    const [pageTitle, setPageTitle] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [description, setDescription] = useState('');
    const [saveStatus, setSaveStatus] = useState("");

    const { loading, error, userData } = useUserData();

    useEffect(() => {
        const fetchGeneralSettings = async () => {
            if (loading || !userData) {
                return;
            }

            const id = userData.id;

            // Fetch general settings based on the user ID
            const { data: publicUserData, error: publicUserError } = await supabase
              .from("users")
              .select("uid")
              .eq("id", id)
              .single();

            if (publicUserError) {
              console.error("Error fetching public user data:", publicUserError.message);
              return;
            }

            const uid = publicUserData.uid; // uid from public.users (int4)

            const { data: existingSettings, error: fetchError } = await supabase
                .from("profileGeneral")
                .select("*")
                .eq("uid", uid)
                .single();

            if (fetchError && fetchError.code !== "PGRST116") {
                console.error("Error fetching existing settings:", fetchError.message);
                return;
            }

            if (existingSettings) {
                setPageTitle(existingSettings.page_title);
                setDisplayName(existingSettings.display_name);
                setDescription(existingSettings.description);
                setAnimatedTitle(existingSettings.animated_title);
                setTypingDesc(existingSettings.typing_desc);
            }
        };

        fetchGeneralSettings();
    }, [loading, userData]);

    const uploadConfig = async () => {
        if (loading || !userData) {
            console.error("User data not ready or still loading");
            return;
        }
    
        const id = userData.id; // UUID from auth.users
    
        const { data: publicUserData, error: publicUserError } = await supabase
          .from("users")
          .select("uid")
          .eq("id", id)
          .single();
    
        if (publicUserError) {
            console.error("Error fetching public user data:", publicUserError.message);
            setSaveStatus("Error saving changes");
            return;
        }
    
        const uid = publicUserData.uid; // uid from public.users (int4)
    
        const { data: existingEntry, error: fetchError } = await supabase
          .from("profileGeneral")
          .select("id")
          .eq("uid", uid)
          .single();
    
        if (fetchError && fetchError.code !== "PGRST116") {
            console.error("Error fetching existing entry:", fetchError.message);
            setSaveStatus("Error saving changes");
            return;
        }
    
        let success = false;
        let fieldsUpdated = false;
    
        // Check if fields have been changed before updating
        if (existingEntry) {
            const { error: updateError } = await supabase
              .from("profileGeneral")
              .update({
                uid,
                page_title: pageTitle,
                display_name: displayName,
                description: description,
                animated_title: animatedTitle,
                typing_desc: typingDesc,
              })
              .eq("id", existingEntry.id);
    
            if (updateError) {
                console.error("Error updating config:", updateError.message);
                setSaveStatus("Error saving changes");
            } else {
                success = true;
                fieldsUpdated = true;
            }
        } else {
            const { error: insertError } = await supabase
              .from("profileGeneral")
              .insert({
                uid,
                page_title: pageTitle,
                display_name: displayName,
                description: description,
                animated_title: animatedTitle,
                typing_desc: typingDesc,
              });
    
            if (insertError) {
                console.error("Error inserting config:", insertError.message);
                setSaveStatus("Error saving changes");
            } else {
                success = true;
                fieldsUpdated = true;
            }
        }
    
        // Always show success message if at least one field was updated
        if (fieldsUpdated) {
            setSaveStatus("Settings saved successfully!");
            setTimeout(() => setSaveStatus(""), 3000); // Clear after 3 seconds
        }
    };    
    
    // If loading or userData is undefined, show a loading state or fallback UI
    if (loading || !userData) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="flex flex-col space-y-4 mt-2">
                <div className="flex flex-col space-y-2">
                    <p className="font-bold text-lg">Page Title</p>
                    <input
                        type="text"
                        value={pageTitle}
                        onChange={(e) => setPageTitle(e.target.value)}
                        className="w-full bg-[#101013] border-[3px] border-white/20 p-2 rounded-lg"
                        placeholder={`${userData.username}'s profile`}
                    />
                    <div className="flex items-center space-x-2">
                        <label className="text-white font-bold">Animated Title</label>
                        <div
                            className={`${
                                animatedTitle ? "bg-blue-500" : "bg-gray-500"
                            } cursor-pointer p-1 w-12 h-6 flex items-center rounded-full transition`}
                            onClick={() => setAnimatedTitle(!animatedTitle)}
                        >
                            <div
                                className={`${
                                    animatedTitle ? "translate-x-6" : "translate-x-0"
                                } w-5 h-5 bg-white rounded-full transform transition`}
                            ></div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col space-y-2">
                    <p className="font-bold text-lg">Display Name</p>
                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full bg-[#101013] border-[3px] border-white/20 p-2 rounded-lg"
                        placeholder={`${userData.username}`}
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <p className="font-bold text-lg">Description</p>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-[#101013] border-[3px] border-white/20 p-2 rounded-lg"
                        placeholder={`hello I am ${userData.username}`}
                    />
                    <div className="flex items-center space-x-2">
                        <label className="text-white font-bold">Typing Description</label>
                        <div
                            className={`${
                                typingDesc ? "bg-blue-500" : "bg-gray-500"
                            } cursor-pointer p-1 w-12 h-6 flex items-center rounded-full transition`}
                            onClick={() => setTypingDesc(!typingDesc)}
                        >
                            <div
                                className={`${
                                    typingDesc ? "translate-x-6" : "translate-x-0"
                                } w-5 h-5 bg-white rounded-full transform transition`}
                            ></div>
                        </div>
                    </div>
                </div>
                {/* Save button */}
                <div className="col-span-2">
                  <button
                    className="border border-[3px] border-white/60 text-white font-bold py-2 px-4 rounded-lg"
                    onClick={uploadConfig}>
                    Save Settings
                  </button>
                  {saveStatus && (
                    <p className="text-green-400 mt-2 text-sm">{saveStatus}</p>
                  )}
                </div>
            </div>
        </>
    );
}