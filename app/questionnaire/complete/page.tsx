"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import QuestionLayout from "@/components/QuestionLayout";

export default function CompletePage() {
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [trainerName, setTrainerName] = useState("");

  const handleConfirm = () => {
    const name = trainerName.trim();

    if (!name) {
      alert("강사님의 이름을 입력해주세요.");
      return;
    }

    try {
      // 강사 이름을 따로 저장
      localStorage.setItem("therapistName", name);

      const prev = JSON.parse(localStorage.getItem("formData") || "{}");

      localStorage.setItem(
        "formData",
        JSON.stringify({
          ...prev,
          trainerName: name,
        })
      );

      window.location.href = "/questionnaire/therapist";

    } catch (e) {
      console.error(e);
      alert("데이터 오류");
    }
  };

  return (
    <QuestionLayout title="설문 완료">
      <div className="flex flex-col items-center text-center py-12 space-y-8">

        <div className="text-6xl">✅</div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">
            설문이 완료되었습니다.
          </h2>

          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 space-y-3">
            <p className="text-gray-700 leading-relaxed">
              <span className="font-semibold text-gray-800">고객님을 위한 전문적인 기능평가</span>를 실시하기 위해
            </p>
            <p className="text-gray-700 leading-relaxed">
              작성하신 설문지를 <span className="font-semibold text-gray-800">담당 재활 전문강사</span>에게 전달해주세요.
            </p>
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex gap-3 w-full mt-4">
          {/* 이전 버튼 */}
          <button
            onClick={() => router.push("/questionnaire/body")}
            className="flex-1 rounded-xl py-4 text-lg font-semibold text-blue-600 bg-white border-2 border-blue-600 hover:bg-blue-50 transition"
          >
            이전
          </button>

          {/* 강사에게 전달하기 버튼 */}
          <button
            onClick={() => setShowModal(true)}
            className="flex-1 rounded-xl py-4 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
          >
            강사에게 전달하기
          </button>
        </div>
      </div>

      {showModal && (
        <div 
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white p-6 rounded-xl w-80 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="text-center font-semibold text-lg">
              강사 이름 입력
            </div>

            <input
              autoFocus
              type="text"
              value={trainerName}
              onChange={(e) => setTrainerName(e.target.value)}
              placeholder="강사님의 이름을 입력해주세요."
              className="w-full border-2 border-gray-300 px-4 py-3 rounded focus:border-blue-500 focus:outline-none text-base"
            />

            <button
              onClick={handleConfirm}
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition font-semibold"
            >
              확인
            </button>

          </div>
        </div>
      )}
    </QuestionLayout>
  );
}
