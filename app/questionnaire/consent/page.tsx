"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import QuestionLayout from "@/components/QuestionLayout";

export default function ConsentPage() {
  const router = useRouter();

  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [check3, setCheck3] = useState(false);
  const [check4, setCheck4] = useState(false);

  const allChecked = check1 && check2 && check3;

  const handleNext = () => {
    if (!allChecked) return;

    const prev = JSON.parse(localStorage.getItem("formData") || "{}");

    localStorage.setItem(
      "formData",
      JSON.stringify({
        ...prev,
        consent: true,
        marketingConsent: check4,
      })
    );

    router.push("/questionnaire/info");
  };

  return (
    <QuestionLayout title="평가 동의서">
      <div className="space-y-8">

        {/* 안내 */}
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-sm text-slate-700">
          안녕하세요.<br />
          연세재활운동센터는 고객님의 안전한 재활운동과 정확한 평가를 위해
          아래 내용을 안내드립니다.<br /><br />
          내용을 확인하신 후 동의해 주세요.
        </div>

        {/* 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            ① 평가 및 재활운동 안내 <span className="text-red-500">(필수)</span>
          </h2>

          <div className="rounded-xl border p-4 text-sm leading-7 text-gray-700">
            평가 과정에서는 담당 재활운동강사가 고객님의 신체 기능과
            움직임을 확인하기 위해 신체 접촉이 있을 수 있습니다.
            <br /><br />
            또한 평가 및 운동기록 관리를 위해 사진 또는 영상을
            촬영할 수 있으며, 해당 자료는 운동 평가 및 기록 관리
            목적으로만 사용됩니다.
          </div>

          <label className="flex items-center gap-4 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition">
            <input 
              type="checkbox" 
              checked={check1}
              onChange={() => setCheck1(!check1)}
              className="w-6 h-6"
            />
            <span className="text-base">위 내용을 확인하였으며 동의합니다.</span>
          </label>
        </section>

        {/* 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            ② 비의료건강관리서비스 안내 <span className="text-red-500">(필수)</span>
          </h2>

          <div className="rounded-xl border p-4 text-sm leading-7 text-gray-700">
            연세재활운동센터는 의료기관이 아니며,
            치료·진단·처방 등 의료행위를 제공하지 않습니다.
            <br /><br />
            본 평가는 재활운동 프로그램 설계를 위한 기능평가이며,
            의료적 진단을 대신하지 않습니다.
          </div>

          <label className="flex items-center gap-4 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition">
            <input 
              type="checkbox" 
              checked={check2}
              onChange={() => setCheck2(!check2)}
              className="w-6 h-6"
            />
            <span className="text-base">위 내용을 확인하였으며 동의합니다.</span>
          </label>
        </section>

        {/* 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            ③ 개인정보 수집 및 이용 동의 <span className="text-red-500">(필수)</span>
          </h2>

          <div className="rounded-xl border p-4 text-sm leading-7 text-gray-700">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <strong>수집 항목</strong>
                <ul className="list-disc ml-6 mt-2">
                  <li>이름</li>
                  <li>연락처</li>
                  <li>평가기록</li>
                  <li>사진 및 영상(촬영 시)</li>
                </ul>
              </div>

              <div>
                <strong>이용 목적</strong>
                <ul className="list-disc ml-6 mt-2">
                  <li>회원 관리</li>
                  <li>재활운동 프로그램 제공</li>
                  <li>평가 리포트 작성</li>
                  <li>운동기록 관리</li>
                </ul>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-4 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition">
            <input 
              type="checkbox" 
              checked={check3}
              onChange={() => setCheck3(!check3)}
              className="w-6 h-6"
            />
            <span className="text-base">개인정보 수집 및 이용에 동의합니다.</span>
          </label>
        </section>

        {/* 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            ④ 마케팅 정보 수신 동의 <span className="text-gray-400">(선택)</span>
          </h2>

          <div className="rounded-xl border p-4 text-sm leading-7 text-gray-700">
            최신 프로그램, 이벤트, 건강정보 등 마케팅 목적의 정보를 
            이메일, 문자, 전화 등을 통해 수신할 수 있습니다.
            <br /><br />
            언제든지 수신 거부 가능하며, 동의 여부와 관계없이 
            서비스 운영에 필요한 필수 안내 사항은 발송될 수 있습니다.
          </div>

          <label className="flex items-center gap-4 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition">
            <input 
              type="checkbox" 
              checked={check4}
              onChange={() => setCheck4(!check4)}
              className="w-6 h-6"
            />
            <span className="text-base">마케팅 정보 수신에 동의합니다.</span>
          </label>

          {/* 안내 문구 */}
          <div className="mt-4 rounded-lg bg-gray-50 p-3 text-xs text-gray-600 border border-gray-200">
            <p>
              ※ 마케팅 정보 수신에 동의하지 않더라도 서비스 운영에 필요한 필수 안내 사항은 발송될 수 있습니다. 
              이는 계약 이행 및 서비스 제공을 위한 공지로, 관련 법령에 따라 별도 동의 없이 제공될 수 있습니다.
            </p>
          </div>
        </section>

        {/* 버튼 */}
        <button
          onClick={handleNext}
          disabled={!allChecked}
          className={`w-full rounded-xl py-4 text-lg font-semibold text-white transition
          ${
            allChecked
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          동의하고 다음
        </button>

      </div>
    </QuestionLayout>
  );
}
