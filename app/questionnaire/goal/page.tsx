"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QuestionLayout from "@/components/QuestionLayout";

export default function GoalPage() {
  const router = useRouter();

  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [etcText, setEtcText] = useState("");

  const options = [
    "🏃 통증 없이 일상생활 하고 싶어요",
    "💪 근력을 키우고 싶어요",
    "🧘 자세를 교정하고 싶어요",
    "🚶 걸음을 안정적으로 하고 싶어요",
    "🪜 계단을 편하게 오르고 싶어요",
    "⚽ 운동/스포츠 복귀하고 싶어요",
    "🩺 수술 후 회복하고 싶어요",
    "✨ 전반적인 몸 상태를 개선하고 싶어요",
    "📝 기타",
  ];

  const handleCheck = (item: string) => {
    if (selectedGoals.includes(item)) {
      setSelectedGoals(selectedGoals.filter((v) => v !== item));
    } else {
      setSelectedGoals([...selectedGoals, item]);
    }
  };

  // 🔥 자동 저장
  useEffect(() => {
    if (selectedGoals.length === 0) return;

    const value = selectedGoals.map((item) =>
      item === "📝 기타" ? etcText : item
    );

    const prev = JSON.parse(localStorage.getItem("formData") || "{}");

    localStorage.setItem(
      "formData",
      JSON.stringify({
        ...prev,
        goal: value,
      })
    );
  }, [selectedGoals, etcText]);

  const isValid =
    selectedGoals.length > 0 &&
    (!selectedGoals.includes("📝 기타") || etcText);

  const handleNext = () => {
    router.push("/questionnaire/body");
  };

  const handlePrev = () => {
    router.push("/questionnaire/discomfort");
  };

  return (
    <QuestionLayout title="재활운동을 통해 이루고 싶은 목표는 무엇인가요?">
      <p className="mb-6 text-gray-500">
        해당되는 항목을 모두 선택해주세요.
      </p>

      <div className="space-y-4">
        {options.map((item) => {
          const selected = selectedGoals.includes(item);

          return (
            <div key={item}>
              <button
                type="button"
                onClick={() => handleCheck(item)}
                className={`w-full rounded-2xl border-2 p-5 text-left transition-all ${
                  selected
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium">{item}</span>

                  {selected && (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-sm">
                      ✓
                    </div>
                  )}
                </div>
              </button>

              {/* 🔥 기타 입력 */}
              {item === "📝 기타" && selected && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={etcText}
                    onChange={(e) => setEtcText(e.target.value)}
                    placeholder="기타 목표를 입력해주세요."
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* 버튼 그룹 */}
        <div className="flex gap-3 mt-8">
          {/* 이전 버튼 */}
          <button
            onClick={handlePrev}
            className="flex-1 rounded-xl py-4 text-lg font-semibold text-blue-600 bg-white border-2 border-blue-600 hover:bg-blue-50 transition"
          >
            이전
          </button>

          {/* 다음 버튼 */}
          <button
            onClick={handleNext}
            disabled={!isValid}
            className={`flex-1 rounded-xl py-4 text-lg font-semibold text-white transition
            ${
              isValid
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            다음
          </button>
        </div>
      </div>
    </QuestionLayout>
  );
}
