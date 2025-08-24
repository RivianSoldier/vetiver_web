"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function SignOut() {
  const router = useRouter();
  const supabase = createClient();

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    } else {
      router.push("/login");
    }
  }

  return (
    <div>
      <p
        className="text-white font-nunito text-sm p-0 m-0 text-center cursor-pointer"
        onClick={signOut}
      >
        Sair
      </p>
    </div>
  );
}
