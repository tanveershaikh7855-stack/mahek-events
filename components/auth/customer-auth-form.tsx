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

export function CustomerAuthForm({
  mode,
  googleEnabled = false,
}: {
  mode: "login" | "register";
  googleEnabled?: boolean;
}) {
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

          {googleEnabled && (
            <>
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl })}
                disabled={pending}
                className="w-full inline-flex items-center justify-center gap-3 rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-ink hover:bg-secondary/60 disabled:opacity-60"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
                  />
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-3 my-5">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs text-secondary-text">or</span>
                <span className="h-px flex-1 bg-border" />
              </div>
            </>
          )}

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
