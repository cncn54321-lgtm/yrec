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
  const [source, setSource] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [etcText, setEtcText] = useState("");

  // 🔥 마운트될 때만 localStorage에서 데이터 로드
  useEffect(() => {
    const prev = JSON.parse(localStorage.getItem("formData") || "{}");
    setName(prev.name || "");
    setGender(prev.gender || "");
    setAge(prev.age || "");
    setPhone(prev.phone || "");
    setRegion(prev.region || "");
    setSource(prev.source || "");
  }, []);

  // 🔥 값이 변경될 때만 localStorage에 저장
  useEffect(() => {
    const prev = JSON.parse(localStorage.getItem("formData") || "{}");

    const sourceValue = source === "기타" ? etcText : source;

    localStorage.setItem(
      "formData",
      JSON.stringify({
        ...prev,
        name,
        gender,
        age,
        phone,
        region,
        source: sourceValue,
      })
    );
  }, [name, gender, age, phone, region, source, etcText]);

  const isValid = name && gender && age && phone && source && (source !== "기타" || etcText);

  // 이름: 한글, 영문만 (숫자 제외)
  const handleNameChange = (e) => {
    const value = e.target.value;
    const filteredValue = value.replace(/[0-9]/g, "");
    setName(filteredValue);
  };

  // 나이: 숫자만
  const handleAgeChange = (e) => {
    const value = e.target.value;
    const filteredValue = value.replace(/[^0-9]/g, "");
    setAge(filteredValue);
  };

  // 연락처: 숫자만 + 자동 포매팅 (010-0000-0000)
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    
    if (value.length > 11) {
      value = value.slice(0, 11);
    }
    
    let formattedValue = value;
    if (value.length > 3 && value.length <= 7) {
      formattedValue = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length > 7) {
      formattedValue = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7)}`;
    }
    
    setPhone(formattedValue);
  };

  // 거주지역: 글씨만 (숫자, 특수문자 제외)
  const handleRegionChange = (e) => {
    const value = e.target.value;
    const filteredValue = value.replace(/[0-9]/g, "");
    setRegion(filteredValue);
  };

  const sources = [
    {
      title: "🌐 인터넷검색",
      value: "인터넷검색",
      description: "네이버, 다음, 구글 등",
      children: ["네이버 홈페이지", "네이버 블로그", "네이버 스마트플레이스", "네이버 밴드", "네이버 카페", "네이버 지식인", "네이버TV", "다음 홈페이지", "다음 블로그", "구글 홈페이지"],
    },
    {
      title: "📱 SNS",
      value: "SNS",
      description: "유튜브, 인스타그램, 페이스북 등",
      children: ["유튜브", "인스타그램", "페이스북", "틱톡", "당근", "기타"],
    },
    {
      title: "기타",
      value: "기타",
      children: ["아파트 게시대", "지하철/버스광고", "지인소개", "기타"],
    },
  ];

  const handleSourceSelect = (option) => {
    setSource(source === option ? "" : option);
    if (option !== "기타") {
      setEtcText("");
    }
  };

  return (
    <QuestionLayout title="고객 정보 입력">
      <div className="space-y-6">

        {/* 이름 */}
        <div>
          <p className="mb-2 font-medium">이름</p>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="이름을 입력해주세요."
            className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* 성별 */}
        <div>
          <p className="mb-2 font-medium">성별</p>

          <div className="flex gap-4">
            <button
              onClick={() => setGender("남성")}
              className={`flex-1 rounded-xl border-2 py-4 text-lg transition ${
                gender === "남성"
                  ? "border-blue-600 bg-blue-50 font-semibold"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              남성
            </button>

            <button
              onClick={() => setGender("여성")}
              className={`flex-1 rounded-xl border-2 py-4 text-lg transition ${
                gender === "여성"
                  ? "border-blue-600 bg-blue-50 font-semibold"
                  : "border-gray-200 hover:border-blue-300"
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
            type="text"
            inputMode="numeric"
            value={age}
            onChange={handleAgeChange}
            placeholder="나이를 입력해주세요."
            className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* 연락처 */}
        <div>
          <p className="mb-2 font-medium">연락처</p>
          <input
            type="text"
            inputMode="numeric"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="010-0000-0000"
            className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* 거주지역 */}
        <div>
          <p className="mb-2 font-medium">거주지역</p>
          <input
            type="text"
            value={region}
            onChange={handleRegionChange}
            placeholder="예: 강남구 역삼동, 서초구 반포동"
            className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* 경로 선택 - 아코디언 형식 */}
        <div>
          <p className="mb-4 font-medium">어떤 경로로 본 센터를 알게 되셨습니까?</p>
          
          <div className="space-y-3">
            {sources.map((category) => {
              const isExpanded = selectedCategory === category.value;

              return (
                <div key={category.value}>
                  {/* 카테고리 버튼 */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(
                        isExpanded ? "" : category.value
                      );
                    }}
                    className={`w-full rounded-2xl border-2 p-4 text-left transition ${
                      isExpanded
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-semibold">
                          {category.title}
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          {category.description}
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                          ✓
                        </div>
                      )}
                    </div>
                  </button>

                  {/* 하위 항목 */}
                  {isExpanded && (
                    <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
                      <div className="space-y-2">
                        {category.children.map((child) => (
                          <button
                            key={child}
                            type="button"
                            onClick={() => handleSourceSelect(child)}
                            className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                              source === child
                                ? "border-blue-600 bg-white"
                                : "border-gray-200 bg-white hover:border-blue-300"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                                  source === child
                                    ? "border-blue-600 bg-blue-600 text-white"
                                    : "border-gray-300"
                                }`}
                              >
                                {source === child ? "✓" : ""}
                              </div>

                              <span className="text-sm">{child}</span>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* 기타 입력 */}
                      {source === "기타" && (
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
                </div>
              );
            })}
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex gap-3 mt-8">
          {/* 이전 버튼 */}
          <button
            onClick={() => router.push("/writer")}
            className="flex-1 rounded-xl py-4 text-lg font-semibold text-blue-600 bg-white border-2 border-blue-600 hover:bg-blue-50 transition"
          >
            이전
          </button>

          {/* 다음 버튼 */}
          <button
            disabled={!isValid}
            onClick={() => router.push("/questionnaire/medical")}
            className={`flex-1 rounded-xl py-4 text-lg font-semibold text-white transition ${
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
