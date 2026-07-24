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
      alert("강사 이름 입력해라");
      return;
    }

    try {
      const prev = JSON.parse(localStorage.getItem("formData") || "{}");

      localStorage.setItem(
        "formData",
        JSON.stringify({
          ...prev,
          trainerName: name,
        })
      );

      // 🔥 여기 중요 (강제 이동)
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

        <h2 className="text-xl font-semibold">
          설문이 완료되었습니다
        </h2>

        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-blue-600 text-white py-4 rounded-xl"
        >
          강사에게 전달하기
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-80 space-y-4">

            <div className="text-center font-semibold">
              강사 이름 입력
            </div>

            <input
              value={trainerName}
              onChange={(e) => setTrainerName(e.target.value)}
              className="w-full border px-4 py-2 rounded"
            />

            <button
              onClick={handleConfirm}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              확인
            </button>

          </div>
        </div>
      )}
    </QuestionLayout>
  );
}