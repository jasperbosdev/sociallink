import { useEffect, useState } from "react";
import { supabase } from "../../../supabase";
import { useUserData } from "./useUserData";

export default function CustomSettings() {
  const [linkTitle, setLinkTitle] = useState("");
  const [linkValue, setLinkValue] = useState("");
  const [linkIcon, setLinkIcon] = useState("fa-link");
  const [saveStatus, setSaveStatus] = useState("");
  const [existingSettings, setExistingSettings] = useState<any[]>([]);
  const [selectedLink, setSelectedLink] = useState(null); // for delete

  // Fetch user data
  const { loading, userData } = useUserData();

  // Fetch custom link settings
  useEffect(() => {
    const fetchCustomSettings = async () => {
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

      const { data: customLinks, error: fetchError } = await supabase
        .from("profileCustom")
        .select("*")
        .eq("uid", uid);

      if (fetchError) {
        console.error("Error fetching existing settings:", fetchError.message);
        return;
      }

      // Sort custom links alphabetically
      const sortedLinks = customLinks.sort((a, b) => 
        a.title.localeCompare(b.title)
      );

      // Update state with existing settings
      setExistingSettings(sortedLinks);
    };

    fetchCustomSettings();
  }, [loading, userData]);

  const handleAddCustomLink = async () => {
    if (loading || !userData || !linkTitle || !linkValue || !linkIcon) {
      console.error("User Custom Link not ready, Title, Link, or Icon missing.");
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
      .from("profileCustom")
      .insert([
        {
          uid,
          title: linkTitle,
          value: linkValue,
          icon: linkIcon,
          updated_at: new Date().toISOString(),
        }
      ]);

    if (insertError) {
      console.error("Error inserting new custom link:", insertError.message);
      setSaveStatus("Error adding custom link");
      return;
    }

    // Fetch updated custom links
    const { data: updatedLinks, error: fetchError } = await supabase
      .from("profileCustom")
      .select("*")
      .eq("uid", uid);

    if (fetchError) {
      console.error("Error fetching updated custom links:", fetchError.message);
      setSaveStatus("Error fetching updated links");
      return;
    }

    setExistingSettings(updatedLinks);
    setSaveStatus("Custom link added successfully");
    setLinkTitle("");
    setLinkValue("");
    setLinkIcon("fa-link");
    setTimeout(() => setSaveStatus(""), 3000);
  };

  const handleDeleteCustomLink = async (linkId: string | number) => {
    const { error } = await supabase
      .from("profileCustom")
      .delete()
      .eq("id", linkId);

    if (error) {
      console.error("Error deleting custom link:", error.message);
      setSaveStatus("Error deleting custom link");
      return;
    }

    // Refresh custom links
    const { data: updatedLinks, error: fetchError } = await supabase
      .from("profileCustom")
      .select("*")
      .eq("uid", userData.uid);

    if (!fetchError) {
      setExistingSettings(updatedLinks);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col flex-1">
          <label className="font-bold">Title</label>
          <input
            className="bg-zinc-900 border border-[3px] rounded-lg border-white/20 p-2"
            placeholder="Personal Website"
            value={linkTitle}
            onChange={(e) => setLinkTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-col flex-1">
          <label className="font-bold">Link/Value</label>
          <input
            className="bg-zinc-900 border border-[3px] rounded-lg border-white/20 p-2"
            placeholder="https://komako.pw"
            value={linkValue}
            onChange={(e) => setLinkValue(e.target.value)}
          />
        </div>
        <div className="flex flex-col flex-1">
          <label className="font-bold">Icon</label>
          <select
            className="bg-zinc-900 border border-[3px] rounded-lg border-white/20 p-2"
            value={linkIcon}
            onChange={(e) => setLinkIcon(e.target.value)}
          >
            <option value="">Select an icon...</option>
            <option value="fa-link">Link</option>
            <option value="fa-user">User</option>
            <option value="fa-crown">Crown</option>
          </select>
        </div>
      </div>
      <div
        className="border border-[3px] border-white/60 p-2 font-bold cursor-pointer rounded-lg hover:scale-[1.05] transition w-fit mt-4"
        onClick={handleAddCustomLink}
      >
        Save Link Settings
      </div>
      {saveStatus && (
        <p className={saveStatus.includes("Error") ? "text-red-500" : "text-green-500"}>
          {saveStatus}
        </p>
      )}

      {/* Existing Custom Links Section */}
      <div className="py-2">
        <h3 className="text-white font-bold mt-2">Existing Custom Links</h3>
        <p className="text-sm mb-2">(will be displayed in alphabetical order)</p>
        <div className="bg-zinc-900 border border-[3px] border-white/20 rounded-lg p-4">
          {existingSettings.length > 0 && (
            <div className="">
              <ul className="flex gap-2 flex-wrap">
                {existingSettings.map((link) => (
                  <div
                    key={link.id}
                    className="border border-[3px] items-center flex justify-center border-white/40 p-1 items-center rounded-lg flex-1 text-center min-w-[150px] hover:scale-[1.05] transition cursor-pointer select-none"
                  >
                    <li
                      className="text-white flex items-center justify-center"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this custom link?")) {
                          handleDeleteCustomLink(link.id);
                        }
                      }}
                    >
                      <i className={`fas ${link.icon} fa-xl mr-2`}></i>
                      <span className="font-bold text-sm">{link.title}</span>
                      <div
                        className="ml-2 rounded-xl border-2 border-red-600 p-1 cursor-pointer hover:scale-[1.05] transition"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the li click
                          if (window.confirm("Are you sure you want to delete this custom link?")) {
                            handleDeleteCustomLink(link.id);
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