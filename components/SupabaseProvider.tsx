"use client";

import { createContext, useContext, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "../lib/supabase/browser-client";

type SupabaseContextType = {
  supabase: SupabaseClient;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined
);

type SupabaseProviderProps = {
  children: React.ReactNode;
};

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  const [supabase] = useState<SupabaseClient>(() =>
    createSupabaseBrowserClient()
  );

  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabaseClient(): SupabaseClient {
  const ctx = useContext(SupabaseContext);

  if (!ctx) {
    throw new Error(
      "useSupabaseClient doit être utilisé à l'intérieur de SupabaseProvider"
    );
  }

  return ctx.supabase;
}

