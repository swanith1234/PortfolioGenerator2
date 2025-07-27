import { supabase } from "../databases/supabaseClient.js"; // Import your Supabase client
import fs from "fs-extra";

export async function uploadToSupabase(zipFilePath, fileName) {
  const fileBuffer = await fs.readFile(zipFilePath);
  console.log("File buffer size:", fileBuffer.length);

  console.log("Uploading file to Supabase:", fileName);
  const { data, error } = await supabase.storage
    .from("portfolios") // <-- your bucket name
    .upload(`generated/${fileName}`, fileBuffer, {
      contentType: "application/zip",
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload: ${error.message}`);
  }

  return data.path; // returns the storage path
}
