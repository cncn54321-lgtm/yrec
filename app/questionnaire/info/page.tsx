"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QuestionLayout from "@/components/QuestionLayout";

export default function InfoPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");

  // 🔥 자동 저장
  useEffect(() => {
    const prev = JSON.parse(localStorage.getItem("formData") || "{}");

    localStorage.setItem(
      "formData",
      JSON.stringify({
        ...prev,
        name,
        gender,
        age,
        phone,
        region,
      })
    );
  }, [name, gender, age, phone, region]);

  const isValid = name && gender && age && phone;

  return (
    <QuestionLayout title="고객 정보 입력">
      <div className="space-y-6">

        {/* 이름 */}
        <div>
          <p className="mb-2 font-medium">이름</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력해주세요."
            className="w-full rounded-xl border px-4 py-3"
          />
        </div>

        {/* 성별 */}
        <div>
          <p className="mb-2 font-medium">성별</p>

          <div className="flex gap-4">
            <button
              onClick={() => setGender("남성")}
              className={`flex-1 rounded-xl border-2 py-4 text-lg transition
              ${
                gender === "남성"
                  ? "border-blue-600 bg-blue-50 font-semibold"
                  : "border-gray-200"
              }`}
            >
              남성
            </button>

            <button
              onClick={() => setGender("여성")}
              className={`flex-1 rounded-xl border-2 py-4 text-lg transition
              ${
                gender === "여성"
                  ? "border-blue-600 bg-blue-50 font-semibold"
                  : "border-gray-200"
              }`}
            >
              여성
            </button>
          </div>
        </div>

        {/* 나이 */}
        <div>
          <p className="mb-2 font-medium">나이</p>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="나이를 입력해주세요."
            className="w-full rounded-xl border px-4 py-3"
          />
        </div>

        {/* 연락처 */}
        <div>
          <p className="mb-2 font-medium">연락처</p>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="010-0000-0000"
            className="w-full rounded-xl border px-4 py-3"
          />
        </div>

        {/* 거주지역 */}
        <div>
          <p className="mb-2 font-medium">거주지역</p>
          <input
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="예: 청담동, 역삼동"
            className="w-full rounded-xl border px-4 py-3"
          />
        </div>

        {/* 다음 버튼 */}
<button
  disabled={!isValid}
  onClick={() => router.push("/questionnaire/medical")}
  className={`mt-4 w-full rounded-xl py-4 text-lg font-semibold text-white
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