"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QuestionLayout from "@/components/QuestionLayout";

export default function BodyPage() {
  const router = useRouter();

  const [selectedParts, setSelectedParts] = useState<string[]>([]);

  const options = [
    "목",
    "어깨",
    "허리",
    "골반",
    "무릎",
    "발목",
    "팔",
    "손목",
  ];

  // ✅ 선택 토글
  const togglePart = (part: string) => {
    if (selectedParts.includes(part)) {
      setSelectedParts(selectedParts.filter((v) => v !== part));
    } else {
      setSelectedParts([...selectedParts, part]);
    }
  };

  // ✅ 자동 저장 (STEP4 핵심)
  useEffect(() => {
    const prev = JSON.parse(localStorage.getItem("formData") || "{}");

    localStorage.setItem(
      "formData",
      JSON.stringify({
        ...prev,
        body: selectedParts,
      })
    );
  }, [selectedParts]);

  return (
    <QuestionLayout title="불편한 부위를 선택해주세요">
      <p className="mb-6 text-gray-500">
        해당되는 부위를 모두 선택해주세요.
      </p>

      {/* 🔥 버튼 UI */}
      <div className="grid grid-cols-2 gap-4">
        {options.map((part) => {
          const selected = selectedParts.includes(part);

          return (
            <button
              key={part}
              onClick={() => togglePart(part)}
              className={`rounded-xl border-2 py-4 text-lg transition
              ${
                selected
                  ? "border-blue-600 bg-blue-50 font-semibold"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              {part}
            </button>
          );
        })}
      </div>

      {/* 선택 표시 */}
      {selectedParts.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-600">
          선택: {selectedParts.join(", ")}
        </div>
      )}

      {/* 버튼 그룹 */}
      <div className="flex gap-3 mt-8">
        {/* 이전 버튼 */}
        <button
          onClick={() => router.push("/questionnaire/goal")}
          className="flex-1 rounded-xl py-4 text-lg font-semibold text-blue-600 bg-white border-2 border-blue-600 hover:bg-blue-50 transition"
        >
          이전
        </button>

        {/* 다음 버튼 */}
        <button
          disabled={selectedParts.length === 0}
          onClick={() => router.push("/questionnaire/complete")}
          className={`flex-1 rounded-xl py-4 text-lg font-semibold text-white transition
          ${
            selectedParts.length > 0
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
