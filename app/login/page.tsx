"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Toast from "@/components/toast";

function toKoreanErrorMessage(message: string) {
  if (message.includes("Invalid login credentials")) {
    return "이메일 또는 비밀번호가 올바르지 않아요.";
  }
  if (message.includes("Email not confirmed")) {
    return "이메일 인증이 필요해요.";
  }
  if (message.includes("rate limit")) {
    return "잠시 후 다시 시도해주세요.";
  }
  return "로그인에 실패했어요. 다시 시도해주세요.";
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const canSubmit = Boolean(email && password);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setToastMessage(toKoreanErrorMessage(error.message));
      setIsSubmitting(false);
      return;
    }

    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card w-full max-w-sm p-8">
        <h1 className="mb-8 text-center text-xl font-semibold text-[var(--text)]">
          한입 링크
        </h1>

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

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-[var(--text)]"
            >
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              disabled={isSubmitting}
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field px-3 py-2 text-base"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="btn-primary mt-2 px-4 py-2 text-sm font-medium"
          >
            {isSubmitting ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--text-sub)]">
          비밀번호를 잊으셨나요?{" "}
          <Link
            href="/forgot-password"
            className="font-medium text-[var(--accent)] hover:underline"
          >
            비밀번호 찾기
          </Link>
        </p>

        <p className="mt-2 text-center text-sm text-[var(--text-sub)]">
          아직 계정이 없으신가요?{" "}
          <Link
            href="/signup"
            className="font-medium text-[var(--accent)] hover:underline"
          >
            회원가입
          </Link>
        </p>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}
