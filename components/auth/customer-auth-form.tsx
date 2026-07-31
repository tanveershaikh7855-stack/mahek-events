"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2, Mail, Lock, User, Phone } from "lucide-react";
import { registerCustomer } from "@/lib/actions";

const field =
  "w-full rounded-xl border border-border bg-white pl-10 pr-3 py-2.5 text-sm text-ink placeholder-secondary-text focus:outline-none focus:border-forest";
const labelCls = "text-xs font-medium text-ink block mb-1";

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text">
      {children}
    </span>
  );
}

export function CustomerAuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/account";

  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function doLogin(email: string, password: string) {
    const res = await signIn("customer", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      setError("Wrong email or password.");
      return false;
    }
    router.push(callbackUrl);
    router.refresh();
    return true;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setNotice("");
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    start(async () => {
      if (mode === "login") {
        await doLogin(email, password);
        return;
      }

      const result = await registerCustomer(null, formData);
      if (!result.success) {
        setError(Object.values(result.errors).flat()[0] ?? "Could not register.");
        return;
      }
      setNotice("Account created — signing you in…");
      await doLogin(email, password);
    });
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="mx-auto w-full max-w-md px-5">
        <div className="rounded-3xl border border-border bg-white p-6 md:p-8 shadow-sm">
          <h1 className="font-heading text-2xl font-bold text-ink">
            {mode === "login" ? "Sign in" : "Create your account"}
          </h1>
          <p className="text-sm text-secondary-text mt-1 mb-6">
            {mode === "login"
              ? "Access your orders, bookings and wishlist."
              : "Track orders and book decorations faster."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <div>
                  <label className={labelCls} htmlFor="name">
                    Full name
                  </label>
                  <div className="relative">
                    <Icon>
                      <User className="w-4 h-4" />
                    </Icon>
                    <input id="name" name="name" required className={field} placeholder="Your name" />
                  </div>
                </div>
                <div>
                  <label className={labelCls} htmlFor="phone">
                    Phone
                  </label>
                  <div className="relative">
                    <Icon>
                      <Phone className="w-4 h-4" />
                    </Icon>
                    <input
                      id="phone"
                      name="phone"
                      required
                      inputMode="numeric"
                      maxLength={10}
                      className={field}
                      placeholder="10-digit number"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className={labelCls} htmlFor="email">
                Email
              </label>
              <div className="relative">
                <Icon>
                  <Mail className="w-4 h-4" />
                </Icon>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={field}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className={labelCls} htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Icon>
                  <Lock className="w-4 h-4" />
                </Icon>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  className={field}
                  placeholder={mode === "login" ? "Your password" : "At least 8 characters"}
                />
              </div>
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}
            {notice && (
              <p className="rounded-xl bg-forest-light border border-forest/20 px-3 py-2 text-sm text-forest">
                {notice}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-4 py-3 text-sm font-semibold text-white hover:bg-forest-hover disabled:opacity-60"
            >
              {pending && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="text-sm text-secondary-text text-center mt-5">
            {mode === "login" ? (
              <>
                New here?{" "}
                <Link href="/register" className="text-forest font-medium underline">
                  Create an account
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link href="/login" className="text-forest font-medium underline">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
