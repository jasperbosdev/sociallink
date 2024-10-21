import { useEffect, useState } from "react";
import { supabase } from "../../../supabase";
import { useUserData } from "./useUserData";

export default function EmbedSettings() {
  const [mediaTitle, setMediaTitle] = useState("");
  const [mediaValue, setMediaValue] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [existingSettings, setExistingSettings] = useState([]);

  // Fetch user data
  const { loading, userData } = useUserData();

  // Fetch custom link settings
  useEffect(() => {
    const fetchEmbedSettings = async () => {
      if (loading || !userData) {
        return;
      }

      const { id } = userData;

      const { data: publicUserData, error: publicUserError } = await supabase
        .from("users")
        .select("uid")
        .eq("id", id)
        .single();

      if (publicUserError) {
        console.error(publicUserError);
        return;
      }

      const uid = publicUserData.uid;

      const { data: mediaEmbeds, error: fetchError } = await supabase
        .from("profileEmbed")
        .select("*")
        .eq("uid", uid);

      if (fetchError) {
        console.error("Error fetching existing settings:", fetchError.message);
        return;
      }

      // Sort custom links alphabetically
      const sortedEmbeds = mediaEmbeds.sort((a, b) => 
        a.title.localeCompare(b.title)
      );

      // Update state with existing settings
      setExistingSettings(sortedEmbeds);
    };

    fetchEmbedSettings();
  }, [loading, userData]);

  const handleAddMediaEmbed = async () => {
    if (loading || !userData || !mediaTitle || !mediaValue) {
      console.error("User Media Embed not ready, Title or Link.");
      return;
    }

    const { id } = userData;

    const { data: publicUserData, error: publicUserError } = await supabase
      .from("users")
      .select("uid")
      .eq("id", id)
      .single();

    if (publicUserError) {
      console.error("Error fetching public user data:", publicUserError.message);
      setSaveStatus("Error adding custom link");
      return;
    }

    const uid = publicUserData.uid;

    // Insert new custom link
    const { error: insertError } = await supabase
      .from("profileEmbed")
      .insert([
        {
          uid,
          title: mediaTitle,
          value: mediaValue,
          updated_at: new Date().toISOString(),
        }
      ]);

    if (insertError) {
      console.error("Error inserting new custom link:", insertError.message);
      setSaveStatus("Error adding custom link");
      return;
    }

    // Fetch updated custom links
    const { data: updatedEmbeds, error: fetchError } = await supabase
      .from("profileEmbed")
      .select("*")
      .eq("uid", uid);

    if (fetchError) {
      console.error("Error fetching updated media embeds:", fetchError.message);
      setSaveStatus("Error fetching updated embeds");
      return;
    }

    setExistingSettings(updatedEmbeds);
    setSaveStatus("Media Embed added successfully");
    setMediaTitle("");
    setMediaValue("");
    setTimeout(() => setSaveStatus(""), 3000);
  };

  const handleDeleteMediaEmbed = async (mediaId) => {
    const { error } = await supabase
      .from("profileEmbed")
      .delete()
      .eq("id", mediaId);

    if (error) {
      console.error("Error deleting media embed:", error.message);
      setSaveStatus("Error deleting media embed");
      return;
    }

    // Refresh embeds
    const { data: updatedEmbeds, error: fetchError } = await supabase
      .from("profileEmbed")
      .select("*")
      .eq("uid", userData.uid);

    if (!fetchError) {
      setExistingSettings(updatedEmbeds);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col flex-1">
          <label className="font-bold">Title</label>
          <input
            className="bg-zinc-900 border border-[3px] rounded-lg border-white/20 p-2"
            placeholder="My epic playlist <3"
            value={mediaTitle}
            onChange={(e) => setMediaTitle(e.target.value)}
            disabled={existingSettings.length > 0}
          />
        </div>
        <div className="flex flex-col flex-1">
          <label className="font-bold">Media/Link</label>
          <input
            className="bg-zinc-900 border border-[3px] rounded-lg border-white/20 p-2"
            placeholder="https://spotify.com/playlist/blablabal"
            value={mediaValue}
            onChange={(e) => setMediaValue(e.target.value)}
            disabled={existingSettings.length > 0}
          />
        </div>
      </div>
      <div
        className={`border border-[3px] border-white/60 p-2 font-bold cursor-pointer rounded-lg hover:scale-[1.05] transition w-fit mt-4 ${existingSettings.length > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={existingSettings.length === 0 ? handleAddMediaEmbed : null}
      >
        Save Embed Settings
      </div>
      {saveStatus && (
        <p className={saveStatus.includes("Error") ? "text-red-500" : "text-green-500"}>
          {saveStatus}
        </p>
      )}

      {/* Existing Media Embeds Section */}
      <div className="py-2">
        <h3 className="text-white font-bold mt-2">Existing Embeds</h3>
        <p className="text-sm mb-2">(will be displayed in alphabetical order)</p>
        <div className="bg-zinc-900 border border-[3px] border-white/20 rounded-lg p-4">
          {existingSettings.length > 0 && (
            <div className="">
              <ul className="flex gap-2 flex-wrap">
                {existingSettings.map((media) => (
                  <div
                    key={media.id}
                    className="border border-[3px] items-center flex justify-center border-white/40 p-1 items-center rounded-lg flex-1 text-center min-w-[150px] hover:scale-[1.05] transition cursor-pointer select-none"
                  >
                    <li
                      className="text-white flex items-center justify-center"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this media embed?")) {
                            handleDeleteMediaEmbed(media.id);
                        }
                      }}
                    >
                      <i className={`fas ${media.icon} fa-xl mr-2`}></i>
                      <span className="font-bold text-sm">{media.title}</span>
                      <div
                        className="ml-2 rounded-xl border-2 border-red-600 p-1 cursor-pointer hover:scale-[1.05] transition"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the li click
                          if (window.confirm("Are you sure you want to delete this media embed?")) {
                            handleDeleteMediaEmbed(media.id);
                          }
                        }}
                      >
                        ❌
                      </div>
                    </li>
                  </div>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}