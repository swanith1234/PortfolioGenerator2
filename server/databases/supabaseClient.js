import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://itwooxmgrukwxkfdykwq.supabase.co";
console.log("Supabase URL:", supabaseUrl);
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0d29veG1ncnVrd3hrZmR5a3dxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjkyOTcwMCwiZXhwIjoyMDY4NTA1NzAwfQ.TfGdgDHQZpDTV91ZeOfmia7ntldWZpP13kPMgR8fcWM";

export const supabase = createClient(supabaseUrl, supabaseKey);
