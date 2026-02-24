/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { useSupabaseClient } from "../components/SupabaseProvider";

type Mode = "signin" | "signup";

export default function Home() {
  const supabase = useSupabaseClient();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    void (async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
    })();
  }, [supabase]);

  async function handleAuthSubmit() {
    setLoading(true);
    setError(null);

    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;
      } else {
        const { error: signInError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (signInError) throw signInError;
      }

      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
      setPassword("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Une erreur est survenue.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setLoading(true);
    setError(null);
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      setUser(null);
      setEmail("");
      setPassword("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Une erreur est survenue.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-pink-200 px-4 py-8 text-zinc-950">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl shadow-black/40 backdrop-blur">
        <div className="mb-8 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Mon App
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {user ? "Bienvenue 👋" : "Connexion à votre compte"}
          </h1>
          <p className="text-sm text-zinc-400">
            {user
              ? "Vous êtes connecté avec Supabase. Vous pouvez maintenant protéger vos routes et utiliser la base de données."
              : "Utilisez votre email et un mot de passe. Si le compte n’existe pas, créez-le en mode inscription."}
          </p>
        </div>

        {user ? (
          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 text-sm">
              <p className="text-zinc-300">
                Connecté en tant que{" "}
                <span className="font-medium text-emerald-400">
                  {user.email}
                </span>
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                UID : <span className="font-mono">{user.id}</span>
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/40 bg-red-950/40 px-3 py-2 text-xs text-red-100">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleLogout}
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-full bg-zinc-50 px-4 py-2.5 text-sm font-medium text-zinc-950 shadow-sm transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Déconnexion..." : "Se déconnecter"}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="inline-flex rounded-full bg-zinc-800/80 p-1 text-xs font-medium text-zinc-300">
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={`inline-flex w-24 items-center justify-center rounded-full px-3 py-1 transition ${
                  mode === "signin"
                    ? "bg-zinc-50 text-zinc-950"
                    : "text-zinc-400 hover:text-zinc-100"
                }`}
              >
                Connexion
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`inline-flex w-24 items-center justify-center rounded-full px-3 py-1 transition ${
                  mode === "signup"
                    ? "bg-zinc-50 text-zinc-950"
                    : "text-zinc-400 hover:text-zinc-100"
                }`}
              >
                Inscription
              </button>
            </div>

            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                void handleAuthSubmit();
              }}
            >
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-200"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-50 outline-none ring-0 transition placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
                  placeholder="vous@example.com"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-zinc-200"
                >
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete={
                    mode === "signup" ? "new-password" : "current-password"
                  }
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-50 outline-none ring-0 transition placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/40 bg-red-950/40 px-3 py-2 text-xs text-red-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-medium text-emerald-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? mode === "signup"
                    ? "Création du compte..."
                    : "Connexion..."
                  : mode === "signup"
                    ? "Créer un compte"
                    : "Se connecter"}
              </button>
            </form>

            <p className="text-xs text-zinc-500">
              Pour la prod, pense à activer l&apos;auth email dans Supabase et à
              configurer les templates d&apos;emails (ou à utiliser la
              connexion magique par lien).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
