"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Toast from "@/components/toast";

function toKoreanErrorMessage(message: string) {
  if (message.includes("should be at least")) {
    return "비밀번호는 6자 이상이어야 해요.";
  }
  if (message.includes("should be different")) {
    return "이전과 다른 비밀번호를 입력해주세요.";
  }
  return "비밀번호 변경에 실패했어요. 다시 시도해주세요.";
}

export default function ResetPasswordPage() {
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "ready" | "invalid">(
    "loading",
  );
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          setStatus("ready");
        } else if (event === "INITIAL_SESSION") {
          setStatus(session ? "ready" : "invalid");
        }
      },
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  const canSubmit = Boolean(password && passwordConfirm);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    if (password !== passwordConfirm) {
      setToastMessage("비밀번호가 일치하지 않아요.");
      return;
    }

    setIsSubmitting(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

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
          비밀번호 재설정
        </h1>

        {status === "loading" && (
          <p className="text-center text-sm text-[var(--text-sub)]">
            링크를 확인하는 중이에요...
          </p>
        )}

        {status === "invalid" && (
          <div className="flex flex-col gap-4">
            <p className="text-center text-sm text-[var(--text-sub)]">
              유효하지 않거나 만료된 링크예요. 비밀번호 재설정을 다시
              요청해주세요.
            </p>
            <Link
              href="/forgot-password"
              className="btn-primary px-4 py-2 text-center text-sm font-medium"
            >
              비밀번호 찾기로 이동
            </Link>
          </div>
        )}

        {status === "ready" && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-[var(--text)]"
              >
                새 비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                disabled={isSubmitting}
                placeholder="새 비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field px-3 py-2 text-base"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password-confirm"
                className="text-sm font-medium text-[var(--text)]"
              >
                새 비밀번호 확인
              </label>
              <input
                id="password-confirm"
                name="password-confirm"
                type="password"
                required
                disabled={isSubmitting}
                placeholder="새 비밀번호를 다시 입력하세요"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="field px-3 py-2 text-base"
              />
            </div>

            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="btn-primary mt-2 px-4 py-2 text-sm font-medium"
            >
              {isSubmitting ? "변경 중..." : "비밀번호 변경"}
            </button>
          </form>
        )}
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}
