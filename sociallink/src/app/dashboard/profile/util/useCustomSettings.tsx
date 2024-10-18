import { useEffect, useState, useRef } from "react";
import { supabase } from "../../../supabase";
import { useUserData } from "./useUserData";

export default function CustomSettings() {
  return (
    <>
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col flex-1">
            <label className="font-bold">Title</label>
            <input className="bg-zinc-900 border border-[3px] rounded-lg border-white/20 p-2"
              placeholder="Personal Website"
            ></input>
        </div>
        <div className="flex flex-col flex-1">
            <label className="font-bold">Link/Value</label>
            <input className="bg-zinc-900 border border-[3px] rounded-lg border-white/20 p-2"
              placeholder="https://komako.pw"
            ></input>
        </div>
        <div className="flex flex-col flex-1">
          <label className="font-bold">Icon</label>
          <select className="bg-zinc-900 border border-[3px] rounded-lg border-white/20 p-2">
            <option value="">Select an icon...</option>
            <option value="fa-link">Link</option>
            <option value="fa-user">User</option>
            <option value="fa-crown">Crown</option>
          </select>
        </div>
      </div>
      <div className="border border-[3px] border-white/60 p-2 font-bold cursor-pointer rounded-lg hover:scale-[1.05] transition w-fit mt-4">Save Link Settings</div> 
    </>
  );
}