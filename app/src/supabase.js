import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://hpsywxjwwiayupwlqnzn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwc3l3eGp3d2lheXVwd2xxbnpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyODkyMTIsImV4cCI6MjA5NTg2NTIxMn0.Zo8HTyAVV588l9Drt2LkEHTaJ84LNM14LrFDb2USmp8"
);
