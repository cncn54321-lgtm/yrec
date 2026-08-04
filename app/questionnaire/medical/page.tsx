"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QuestionLayout from "@/components/QuestionLayout";

export default function MedicalPage() {
  const router = useRouter();

  // 상태
  const [hasMedication, setHasMedication] = useState("");
  const [medicationText, setMedicationText] = useState("");

  const [diseases, setDiseases] = useState<string[]>([]);
  const [etcDisease, setEtcDisease] = useState("");

  const [hasSurgery, setHasSurgery] = useState("");
  const [surgeryText, setSurgeryText] = useState("");

  const diseaseOptions = [
    "고혈압",
    "당뇨",
    "심장질환",
    "신경계질환",
    "없음",
    "기타",
  ];

  // 질환 선택
  const toggleDisease = (item: string) => {
    if (diseases.includes(item)) {
      setDiseases(diseases.filter((v) => v !== item));
    } else {
      setDiseases([...diseases, item]);
    }
  };

  // 유효성
  const isValid =
    hasMedication &&
    hasSurgery &&
    diseases.length > 0 &&
    (!hasMedication || hasMedication === "없음" || medicationText) &&
    (!hasSurgery || hasSurgery === "없음" || surgeryText);

  // 🔥 다음 버튼 클릭 시 저장
  const handleNext = () => {
    const prev = JSON.parse(localStorage.getItem("formData") || "{}");

    localStorage.setItem(
      "formData",
      JSON.stringify({
        ...prev,
        medication: hasMedication === "있음" ? "있음" : "없음",
        medicationName: hasMedication === "있음" ? medicationText : "",
        diseases: diseases.includes("기타")
          ? [...diseases.filter((d) => d !== "기타"), etcDisease].join(", ")
          : diseases.join(", "),
        surgery: hasSurgery === "있음" ? surgeryText : "없음",
      })
    );

    router.push("/questionnaire/reason");
  };

  return (
    <QuestionLayout title="건강 상태 확인">
      <p className="mb-6 text-gray-500">
        보다 정확한 평가와 안전한 운동을 위해<br />
        건강 상태를 간단히 확인합니다.
      </p>

      {/* 1️⃣ 약 복용 */}
      <div className="mb-8">
        <div className="mb-2 font-semibold">
          현재 복용 중인 약이 있으신가요?
        </div>

        <div className="flex gap-3">
          {["없음", "있음"].map((val) => (
            <button
              key={val}
              onClick={() => setHasMedication(val)}
              className={`flex-1 py-3 rounded-xl border-2 transition ${
                hasMedication === val
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              {val}
            </button>
          ))}
        </div>

        {hasMedication === "있음" && (
          <input
            type="text"
            value={medicationText}
            onChange={(e) => setMedicationText(e.target.value)}
            placeholder="복용 중인 약을 입력해주세요"
            className="mt-3 w-full rounded-xl border px-4 py-3"
          />
        )}
      </div>

      {/* 2️⃣ 만성질환 */}
      <div className="mb-8">
        <div className="mb-2 font-semibold">
          해당되는 질환을 선택해주세요
        </div>

        <div className="grid grid-cols-2 gap-3">
          {diseaseOptions.map((item) => {
            const selected = diseases.includes(item);

            return (
              <button
                key={item}
                onClick={() => toggleDisease(item)}
                className={`py-3 rounded-xl border-2 transition ${
                  selected
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {diseases.includes("기타") && (
          <input
            type="text"
            value={etcDisease}
            onChange={(e) => setEtcDisease(e.target.value)}
            placeholder="기타 질환을 입력해주세요"
            className="mt-3 w-full rounded-xl border px-4 py-3"
          />
        )}
      </div>

      {/* 3️⃣ 수술 경험 */}
      <div className="mb-8">
        <div className="mb-2 font-semibold">
          수술 경험이 있으신가요?
        </div>

        <div className="flex gap-3">
          {["없음", "있음"].map((val) => (
            <button
              key={val}
              onClick={() => setHasSurgery(val)}
              className={`flex-1 py-3 rounded-xl border-2 transition ${
                hasSurgery === val
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              {val}
            </button>
          ))}
        </div>

        {hasSurgery === "있음" && (
          <input
            type="text"
            value={surgeryText}
            onChange={(e) => setSurgeryText(e.target.value)}
            placeholder="수술 부위 및 시기를 입력해주세요"
            className="mt-3 w-full rounded-xl border px-4 py-3"
          />
        )}
      </div>

      {/* 버튼 그룹 */}
      <div className="flex gap-3 mt-8">
        {/* 이전 버튼 */}
        <button
          onClick={() => router.push("/questionnaire/info")}
          className="flex-1 rounded-xl py-4 text-lg font-semibold text-blue-600 bg-white border-2 border-blue-600 hover:bg-blue-50 transition"
        >
          이전
        </button>

        {/* 다음 버튼 */}
        <button
          disabled={!isValid}
          onClick={handleNext}
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
    </QuestionLayout>
  );
}
