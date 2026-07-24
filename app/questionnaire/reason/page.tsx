"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QuestionLayout from "@/components/QuestionLayout";

export default function ReasonPage() {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [etcText, setEtcText] = useState("");

  const options = [
    {
      title: "🧠 신경계 질환",
      value: "신경계 질환",
      description: "뇌졸중, 파킨슨병, 척수손상, 뇌성마비 등",
      children: ["뇌졸중", "파킨슨병", "척수손상", "뇌성마비", "기타"],
    },
    {
      title: "🦴 근골격계 질환",
      value: "근골격계 질환",
      description: "목, 허리, 어깨, 무릎, 발목 등",
      children: ["목", "허리", "어깨", "팔꿈치", "손목", "무릎", "발목", "기타"],
    },
    {
      title: "🏥 수술 후 재활",
      value: "수술 후 재활",
    },
    {
      title: "🏃 스포츠 손상",
      value: "스포츠 손상",
    },
    {
      title: "😊 자세 교정",
      value: "자세 교정",
    },
    {
      title: "📝 기타",
      value: "기타",
    },
  ];

  // 🔥 자동 저장
  useEffect(() => {
    if (!selectedReason && !etcText) return;

    const value =
      selectedReason === "기타" ? etcText : selectedReason;

    const prev = JSON.parse(localStorage.getItem("formData") || "{}");

    localStorage.setItem(
      "formData",
      JSON.stringify({
        ...prev,
        reason: value,
      })
    );
  }, [selectedReason, etcText]);

  const handleNext = () => {
    router.push("/questionnaire/discomfort");
  };

  const isValid =
    selectedReason &&
    (selectedReason !== "기타" || etcText);

  return (
    <QuestionLayout title="어떤 이유로 재활운동이 필요하신가요?">
      <p className="mb-6 text-gray-500">
        해당되는 항목을 선택해주세요.
      </p>

      <div className="space-y-4">
        {options.map((option) => {
          const selected = selectedReason === option.value;

          return (
            <div key={option.value}>
              {/* 상위 카드 */}
              <button
                type="button"
                onClick={() => {
                  if ("children" in option && option.children) {
                    setSelectedCategory(
                      selectedCategory === option.value ? "" : option.value
                    );
                    setSelectedReason("");
                  } else {
                    setSelectedCategory("");
                    setSelectedReason(option.value);
                  }
                }}
                className={`w-full rounded-2xl border-2 p-5 text-left transition
                ${
                  selected
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold">
                      {option.title}
                    </div>

                    {option.description && (
                      <div className="mt-1 text-sm text-gray-500">
                        {option.description}
                      </div>
                    )}
                  </div>

                  {selected && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                      ✓
                    </div>
                  )}
                </div>
              </button>

              {/* 하위 항목 */}
              {selectedCategory === option.value &&
                "children" in option &&
                option.children && (
                  <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">

                    <div className="space-y-2">
                      {option.children.map((child) => (
                        <button
                          key={child}
                          type="button"
                          onClick={() => setSelectedReason(child)}
                          className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                            selectedReason === child
                              ? "border-blue-600 bg-white"
                              : "border-gray-200 bg-white hover:border-blue-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                                selectedReason === child
                                  ? "border-blue-600 bg-blue-600 text-white"
                                  : "border-gray-300"
                              }`}
                            >
                              {selectedReason === child ? "✓" : ""}
                            </div>

                            <span>{child}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* 🔥 기타 입력 */}
                    {selectedReason === "기타" && (
                      <input
                        type="text"
                        value={etcText}
                        onChange={(e) => setEtcText(e.target.value)}
                        placeholder="기타 내용을 입력해주세요."
                        className="mt-4 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none"
                      />
                    )}
                  </div>
                )}

              {/* 🔥 최하단 기타 */}
              {option.value === "기타" && selectedReason === "기타" && (
                <input
                  type="text"
                  value={etcText}
                  onChange={(e) => setEtcText(e.target.value)}
                  placeholder="기타 내용을 입력해주세요."
                  className="mt-4 w-full rounded-xl border border-gray-300 px-4 py-3"
                />
              )}
            </div>
          );
        })}

        {/* 다음 버튼 */}
        <button
          onClick={handleNext}
          disabled={!isValid}
          className={`mt-8 w-full rounded-xl py-4 text-lg font-semibold text-white
          ${
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