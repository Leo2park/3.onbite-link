"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import Toast from "@/components/toast";

function toKoreanErrorMessage(message: string) {
  if (message.includes("rate limit")) {
    return "잠시 후 다시 시도해주세요.";
  }
  if (message.includes("Unable to validate email address")) {
    return "이메일 형식이 올바르지 않아요.";
  }
  return "리셋 링크 발송에 실패했어요. 다시 시도해주세요.";
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const canSubmit = Boolean(email);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setIsSubmitting(false);

    if (error) {
      setToastMessage(toKoreanErrorMessage(error.message));
      return;
    }

    setIsSent(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card w-full max-w-sm p-8">
        <h1 className="mb-8 text-center text-xl font-semibold text-[var(--text)]">
          비밀번호 찾기
        </h1>

        {isSent ? (
          <p className="text-center text-sm text-[var(--text-sub)]">
            <span className="font-medium text-[var(--text)]">{email}</span>
            으로 비밀번호 재설정 링크를 보냈어요. 이메일을 확인해주세요.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-[var(--text)]"
              >
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={isSubmitting}
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field px-3 py-2 text-base"
              />
            </div>

            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="btn-primary mt-2 px-4 py-2 text-sm font-medium"
            >
              {isSubmitting ? "발송 중..." : "비밀번호 리셋 링크 발송"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-[var(--text-sub)]">
          <Link
            href="/login"
            className="font-medium text-[var(--accent)] hover:underline"
          >
            로그인으로 돌아가기
          </Link>
        </p>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}
