"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function WriterPage() {
  const router = useRouter();

  const [selected, setSelected] = useState("");
  const [etcText, setEtcText] = useState("");

  const options = ["본인", "보호자", "가족", "기타"];

  const handleClick = (item: string) => {
    if (item === "기타") {
      setSelected("기타");
      return;
    }

    const prev = JSON.parse(localStorage.getItem("formData") || "{}");

    localStorage.setItem(
      "formData",
      JSON.stringify({
        ...prev,
        writer: item,
      })
    );

    router.push("/questionnaire/info");
  };

  const handleEtcSubmit = () => {
    if (!etcText) return;

    const prev = JSON.parse(localStorage.getItem("formData") || "{}");

    localStorage.setItem(
      "formData",
      JSON.stringify({
        ...prev,
        writer: etcText,
      })
    );

    router.push("/questionnaire/info");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F5F7FA] p-5">
      <div className="w-full max-w-[420px] bg-white rounded-2xl p-8 shadow-md">
        
        <h2 className="text-xl font-semibold text-center mb-6">
          평가를 작성하시는 분은 누구신가요?
        </h2>

        <div className="space-y-4">
          {options.map((item) => (
            <button
              key={item}
              onClick={() => handleClick(item)}
              className="w-full rounded-xl border-2 border-gray-200 py-4 text-lg transition hover:border-blue-400 hover:bg-blue-50"
            >
              {item}
            </button>
          ))}
        </div>

        {/* 🔥 기타 입력창 */}
        {selected === "기타" && (
          <div className="mt-4 space-y-3">
            <input
              type="text"
              value={etcText}
              onChange={(e) => setEtcText(e.target.value)}
              placeholder="작성자를 입력해주세요"
              className="w-full rounded-xl border px-4 py-3"
            />

            <button
              onClick={handleEtcSubmit}
              disabled={!etcText}
              className={`w-full rounded-xl py-3 text-white
              ${
                etcText
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-300"
              }`}
            >
              입력하고 다음
            </button>
          </div>
        )}

      </div>
    </main>
  );
}