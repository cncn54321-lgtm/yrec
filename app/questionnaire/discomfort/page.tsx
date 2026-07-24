"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QuestionLayout from "@/components/QuestionLayout";

export default function DiscomfortPage() {
  const router = useRouter();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [etcText, setEtcText] = useState("");

  const options = [
    "🚶 걷기가 어렵습니다.",
    "🪑 앉거나 일어나기가 어렵습니다.",
    "🪜 계단 이용이 어렵습니다.",
    "🤲 손을 사용하는 것이 어렵습니다.",
    "⚖️ 균형 잡기가 어렵습니다.",
    "💪 힘이 잘 들어가지 않습니다.",
    "😣 통증이 있습니다.",
    "🏠 일상생활이 어렵습니다.",
    "📝 기타",
  ];

  const handleCheck = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((v) => v !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  // 🔥 자동 저장
  useEffect(() => {
    if (selectedItems.length === 0) return;

    const value = selectedItems.map((item) =>
      item === "📝 기타" ? etcText : item
    );

    const prev = JSON.parse(localStorage.getItem("formData") || "{}");

    localStorage.setItem(
      "formData",
      JSON.stringify({
        ...prev,
        discomfort: value,
      })
    );
  }, [selectedItems, etcText]);

  const isValid =
    selectedItems.length > 0 &&
    (!selectedItems.includes("📝 기타") || etcText);

  const handleNext = () => {
    router.push("/questionnaire/goal"); // 🔥 여기 핵심
  };

  return (
    <QuestionLayout title="현재 가장 불편한 점은 무엇인가요?">
      <p className="mb-6 text-gray-500">
        해당되는 항목을 모두 선택해주세요.
      </p>

      <div className="space-y-4">
        {options.map((item) => {
          const selected = selectedItems.includes(item);

          return (
            <div key={item}>
              <button
                type="button"
                onClick={() => handleCheck(item)}
                className={`w-full rounded-2xl border-2 p-5 text-left transition ${
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
                    placeholder="기타 내용을 입력해주세요."
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* 🔥 다음 버튼 */}
        <button
          onClick={handleNext}
          disabled={!isValid}
          className={`mt-8 w-full rounded-xl py-4 text-lg font-semibold text-white ${
            isValid
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          다음
        </button>
      </div>
    </QuestionLayout>
  );
}