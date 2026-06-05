"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { TreePine, Mail, ArrowLeft } from "lucide-react";
import { requestOtp, verifyOtp } from "@/lib/api/corporate";
import { setAuth } from "@/lib/auth";

type Step = "email" | "otp";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await requestOtp(email);
      setStep("otp");
      startResendCooldown();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length < 5) {
      setError("Please enter the full 5-digit code.");
      return;
    }
    await doVerify(fullCode);
  }

  async function doVerify(fullCode: string) {
    setError(null);
    setLoading(true);
    try {
      const data = await verifyOtp(email, fullCode);
      if (data.user.role !== "corporate_user") {
        setError("This portal is for corporate users only.");
        setLoading(false);
        return;
      }
      setAuth(data.accessToken, {
        id: data.user.id,
        role: "corporate_user",
        fullName: data.user.fullName,
        email: data.user.email,
        phoneNumber: data.user.phoneNumber,
        avatarUrl: data.user.avatarUrl,
      });
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code. Please try again.");
      setLoading(false);
    }
  }

  function handleDigitChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
    if (digit && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
    if (next.every(Boolean)) {
      doVerify(next.join(""));
    }
  }

  function handleDigitKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handleDigitPaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 5);
    if (pasted.length === 5) {
      e.preventDefault();
      const digits = pasted.split("");
      setCode(digits);
      inputRefs.current[4]?.focus();
      doVerify(pasted);
    }
  }

  function startResendCooldown() {
    setResendCooldown(60);
    const timer = setInterval(() => {
      setResendCooldown((v) => {
        if (v <= 1) { clearInterval(timer); return 0; }
        return v - 1;
      });
    }, 1000);
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    setError(null);
    setCode(["", "", "", "", ""]);
    setLoading(true);
    try {
      await requestOtp(email);
      startResendCooldown();
    } catch {
      setError("Failed to resend code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#d5e3dd] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full bg-gradient-to-b from-[#3a6351] to-[#1f4037] flex items-center justify-center mb-4 shadow-lg">
            <TreePine className="w-7 h-7 text-[#95bd91]" />
          </div>
          <h1 className="text-3xl font-bold text-[#1f4037] font-serif">Panda Tree</h1>
          <p className="text-[#3a6351] text-sm mt-1 font-medium tracking-wide uppercase">
            Corporate Portal
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#e2e2e2] p-8">
          {step === "email" && (
            <>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#eaf4f3] mx-auto mb-4">
                <Mail className="w-6 h-6 text-[#3a6351]" />
              </div>
              <h2 className="text-xl font-semibold text-[#1f4037] text-center mb-1">Sign in</h2>
              <p className="text-sm text-[#6c8784] text-center mb-6">
                Enter your email and we&apos;ll send you a one-time login code.
              </p>

              {error && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1f4037] mb-1.5">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    disabled={loading}
                    className="w-full border border-[#e5e5e5] rounded-lg px-4 py-3 text-[#1f4037] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#3a6351] focus:ring-1 focus:ring-[#3a6351] disabled:opacity-60"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-b from-[#3a6351] to-[#1f4037] text-[#95bd91] py-3 rounded-full font-semibold hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending code…" : "Send login code"}
                </button>
              </form>
            </>
          )}

          {step === "otp" && (
            <>
              <button
                onClick={() => { setStep("email"); setError(null); setCode(["","","","",""]); }}
                className="flex items-center gap-1.5 text-sm text-[#3a6351] hover:text-[#1f4037] mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#eaf4f3] mx-auto mb-4">
                <Mail className="w-6 h-6 text-[#3a6351]" />
              </div>
              <h2 className="text-xl font-semibold text-[#1f4037] text-center mb-1">Check your email</h2>
              <p className="text-sm text-[#6c8784] text-center mb-1">We sent a 5-digit code to</p>
              <p className="text-sm font-semibold text-[#1f4037] text-center mb-6">{email}</p>

              {error && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleVerifyOtp}>
                <div className="flex gap-2 justify-center mb-6" onPaste={handleDigitPaste}>
                  {code.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(i, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(i, e)}
                      disabled={loading}
                      className="w-11 text-center text-xl font-bold border-2 border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#3a6351] disabled:opacity-60 text-[#1f4037] bg-[#fafafa] transition-colors"
                      style={{ height: "52px" }}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading || code.some((d) => !d)}
                  className="w-full bg-gradient-to-b from-[#3a6351] to-[#1f4037] text-[#95bd91] py-3 rounded-full font-semibold hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Verifying…" : "Verify & Sign in"}
                </button>
              </form>

              <div className="mt-5 text-center">
                <span className="text-sm text-[#6c8784]">Didn&apos;t receive a code? </span>
                <button
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || loading}
                  className="text-sm font-medium text-[#3a6351] hover:text-[#1f4037] disabled:text-[#9ca3af] disabled:cursor-not-allowed transition-colors"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                </button>
              </div>

              <p className="text-xs text-[#9ca3af] text-center mt-4">Code expires in 10 minutes</p>
            </>
          )}
        </div>

        <p className="text-center text-xs text-[#6c8784] mt-6">
          Access restricted to corporate accounts only.
        </p>
      </div>
    </div>
  );
}
