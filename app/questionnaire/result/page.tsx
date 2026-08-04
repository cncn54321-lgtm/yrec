"use client";

declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (config: any) => void;
      };
    };
    html2canvas: any;
  }
}

import { useEffect, useState } from "react";

const GAS_URL = 'https://script.google.com/macros/s/AKfycbwujKqwxdcBRQelLnD9E9DWZN-MOwWApzY8OBOAyv6kfYDrIYLhcvoviC8fsovuOWu1Cw/exec';

export default function ResultPage() {
  const [data, setData] = useState<any>(null);
  const [therapistName, setTherapistName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // 🔥 카카오 SDK 초기화
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.async = true;
    script.onload = () => {
      console.log("🔍 Kakao SDK 로드됨");
      if (window.Kakao) {
        window.Kakao.init("90e16e526ed3e925c9822acccf936f62");
        console.log("✅ 카카오 SDK 초기화 완료");
      }
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("formData") || "{}");
      
      // data가 비어있으면 기본값 설정
      if (!stored || Object.keys(stored).length === 0) {
        setData({
          name: "김철수",
          reason: ["자세 교정"],
          discomfort: ["목 통증", "허리 불편"],
          goal: ["자세 개선", "통증 감소"],
          body: ["목", "허리"],
          evaluation: {
            posture: {
              neck: "정상",
              neckEtc: "",
              shoulder: "부정상",
              shoulderEtc: "",
              pelvis: "정상",
              pelvisEtc: "",
              knee: "정상",
              kneeEtc: "",
              ankle: "정상",
              ankleEtc: ""
            },
            pain: {
              level: 5,
              parts: ["목", "허리"]
            },
            strength: {
              level: "부분 약화",
              parts: ["허리"]
            },
            rom: {
              level: "정상"
            },
            function: {
              neuro: {
                sitStand: "정상",
                gait: "정상",
                balance: "부분 제한",
                standAlone: "정상",
                turn: "정상"
              },
              ortho: {
                neckMove: "부분 제한",
                armLift: "정상",
                singleLeg: "정상",
                stairs: "정상",
                squat: "정상"
              }
            }
          },
          expertOpinion: "고객님의 상태를 종합적으로 평가한 결과, 목과 허리 부분에서 제한이 있으며, 특히 자세 교정이 필요합니다. 규칙적인 재활운동을 통해 개선 가능합니다."
        });
        localStorage.setItem("therapistName", "박물리치료사");
        setTherapistName("박물리치료사");
        return;
      }
      
      setData(stored);
      
      const therapist = localStorage.getItem("therapistName") || "";
      setTherapistName(therapist);
    } catch (e) {
      console.error("localStorage 에러:", e);
      // 예외 발생 시에도 기본값 세팅 (위와 동일)
      setData({
        name: "김철수",
        reason: ["자세 교정"],
        discomfort: ["목 통증", "허리 불편"],
        goal: ["자세 개선", "통증 감소"],
        body: ["목", "허리"],
        evaluation: {
          posture: {
            neck: "정상",
            neckEtc: "",
            shoulder: "부정상",
            shoulderEtc: "",
            pelvis: "정상",
            pelvisEtc: "",
            knee: "정상",
            kneeEtc: "",
            ankle: "정상",
            ankleEtc: ""
          },
          pain: {
            level: 5,
            parts: ["목", "허리"]
          },
          strength: {
            level: "부분 약화",
            parts: ["허리"]
          },
          rom: {
            level: "정상"
          },
          function: {
            neuro: {
              sitStand: "정상",
              gait: "정상",
              balance: "부분 제한",
              standAlone: "정상",
              turn: "정상"
            },
            ortho: {
              neckMove: "부분 제한",
              armLift: "정상",
              singleLeg: "정상",
              stairs: "정상",
              squat: "정상"
            }
          }
        },
        expertOpinion: "고객님의 상태를 종합적으로 평가한 결과, 목과 허리 부분에서 제한이 있으며, 특히 자세 교정이 필요합니다. 규칙적인 재활운동을 통해 개선 가능합니다."
      });
      localStorage.setItem("therapistName", "박물리치료사");
      setTherapistName("박물리치료사");
    }
  }, []);

  // ===== 10개 기능을 ABC 등급으로 변환 =====
  const getDetailedFunctionScores = () => {
    const e = data.evaluation || {};
    const func = e.function || {};
    const neuro = func.neuro || {};
    const ortho = func.ortho || {};

    const normalizeFunction = (value: string): string => {
      if (!value) return "미평가";
      if (value === "정상") return "A";
      if (value === "부분 제한" || value === "통증 있음") return "B";
      if (value === "보조 필요" || value === "제한 있음") return "C";
      if (value === "수행 어려움") return "D";
      return "미평가";
    };

    const neuroList = [
      { key: "sitStand", label: "앉기↔서기", value: neuro.sitStand },
      { key: "gait", label: "보행", value: neuro.gait },
      { key: "balance", label: "균형 유지", value: neuro.balance },
      { key: "standAlone", label: "지지 없이 서기", value: neuro.standAlone },
      { key: "turn", label: "방향 전환", value: neuro.turn },
    ];

    const orthoList = [
      { key: "neckMove", label: "고개 움직이기", value: ortho.neckMove },
      { key: "armLift", label: "팔 올리기", value: ortho.armLift },
      { key: "singleLeg", label: "한발 서기", value: ortho.singleLeg },
      { key: "stairs", label: "계단 오르기", value: ortho.stairs },
      { key: "squat", label: "쪼그려 앉기", value: ortho.squat },
    ];

    const allFunctions = [
      ...neuroList.map(item => ({
        ...item,
        grade: normalizeFunction(item.value),
        category: "신경계"
      })),
      ...orthoList.map(item => ({
        ...item,
        grade: normalizeFunction(item.value),
        category: "근골격계"
      }))
    ];

    const gradeValues: any = { "A": 4, "B": 3, "C": 2, "D": 1, "미평가": 0 };
    const validGrades = allFunctions.filter(f => f.grade !== "미평가").map(f => gradeValues[f.grade]);
    const avgGradeValue = validGrades.length > 0 ? validGrades.reduce((a, b) => a + b, 0) / validGrades.length : 0;
    
    let overallGrade = "미평가";
    if (avgGradeValue >= 3.5) overallGrade = "A";
    else if (avgGradeValue >= 2.5) overallGrade = "B";
    else if (avgGradeValue >= 1.5) overallGrade = "C";
    else if (avgGradeValue > 0) overallGrade = "D";

    return { allFunctions, overallGrade };
  };

  const removeEmoji = (text: string) => {
    return String(text)
      .replace(/[\p{Emoji}\p{Emoji_Component}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const getGradeColor = (grade: string) => {
    switch(grade) {
      case "A": return "bg-green-100 border-green-400 text-green-900";
      case "B": return "bg-yellow-100 border-yellow-400 text-yellow-900";
      case "C": return "bg-orange-100 border-orange-400 text-orange-900";
      case "D": return "bg-red-100 border-red-400 text-red-900";
      default: return "bg-gray-100 border-gray-400 text-gray-900";
    }
  };

  const getGradeBadgeColor = (grade: string) => {
    switch(grade) {
      case "A": return "bg-green-500";
      case "B": return "bg-yellow-500";
      case "C": return "bg-orange-500";
      case "D": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getGradeLabel = (grade: string) => {
    switch(grade) {
      case "A": return "양호";
      case "B": return "약간 저하";
      case "C": return "저하";
      case "D": return "심한 저하";
      default: return "미평가";
    }
  };

  const getPostureColor = (value: string) => {
    if (!value || value === "-") return "#d1d5db";
    if (value === "정상") return "#10b981";
    return "#ef4444";
  };

  const getPostureValue = (v: string, etc: string) => {
    if (!v) return "-";
    if (v === "기타") return etc || "기타";
    return v;
  };

  const getPainText = (level: number) => {
    if (level === 0) return "없음";
    if (level <= 3) return "경미";
    if (level <= 6) return "중등도";
    return "심함";
  };

  // PDF로 변환 후 저장
  const handleDownload = async () => {
    setIsLoading(true);
    
    try {
      const element = document.getElementById("result");
      
      if (!element) {
        alert("저장할 내용이 없습니다.");
        setIsLoading(false);
        return;
      }

      // html2pdf 동적 로드
      const html2pdf = (await import('html2pdf.js')).default;

      const options = {
        margin: 10,
        filename: `${data.name || '평가결과'}_${new Date().toLocaleDateString("ko-KR").replace(/\./g, "")}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
      };

      // PDF 생성
      html2pdf().set(options).from(element).save();
      
      alert('✅ PDF가 다운로드되었습니다!');
      setIsLoading(false);
    } catch (error) {
      console.error('오류:', error);
      alert('❌ PDF 생성 중 오류가 발생했습니다: ' + error);
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      const currentUrl = window.location.href;
      
      if (window.Kakao && window.Kakao.isInitialized()) {
        try {
          window.Kakao.Share.sendDefault({
            objectType: "feed",
            content: {
              title: `${data.name}님의 재활 평가 결과`,
              description: "평가 결과를 확인해주세요",
              imageUrl: `${window.location.origin}/logo.png`,
              link: {
                mobileWebUrl: currentUrl,
                webUrl: currentUrl,
              },
            },
            buttons: [
              {
                title: "결과 보기",
                link: {
                  mobileWebUrl: currentUrl,
                  webUrl: currentUrl,
                },
              },
            ],
          });
        } catch (error) {
          console.error("카카오 공유 실패:", error);
          await navigator.clipboard.writeText(currentUrl);
          alert("📋 링크가 클립보드에 복사되었습니다!");
        }
      }
    } catch (e) {
      console.error("❌ 에러:", e);
      alert("에러 발생");
    }
  };

  if (!data) return null;

  const e = data.evaluation || {};
  const posture = e.posture || {};
  const { allFunctions, overallGrade } = getDetailedFunctionScores();

  return (
    <div className="min-h-screen bg-white p-6">
      <div id="result" className="max-w-[900px] mx-auto bg-white">
        {/* 헤더 */}
        <div className="mb-8 flex justify-between items-center">
          <img src="/logo.png" className="h-12" />
          <div className="text-right">
            <div className="text-sm text-gray-500">재활 평가 결과</div>
            <div className="text-2xl font-bold text-blue-600">
              {data.name || "고객"}님
            </div>
          </div>
        </div>

        {/* 1️⃣ 고객 정보 */}
        <div className="mb-6 bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
          <div className="font-bold text-lg text-gray-900 mb-4">👤 고객 정보</div>
          
          {/* 재활 목적 */}
          <div className="mb-4 pb-4 border-b border-gray-200">
            <div className="text-sm text-gray-500 font-semibold mb-2">재활 목적</div>
            <div className="text-base font-semibold text-gray-900">
              {Array.isArray(data.reason) 
                ? removeEmoji(String(data.reason[0]))
                : removeEmoji(String(data.reason || ""))}
            </div>
          </div>

          {/* 불편한 부분 */}
          <div className="mb-4 pb-4 border-b border-gray-200">
            <div className="text-sm text-gray-500 font-semibold mb-2">불편한 부분</div>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(data.discomfort) && data.discomfort.length > 0 ? (
                data.discomfort
                  .map((item: any) => removeEmoji(String(item)))
                  .filter(Boolean)
                  .map((item: string, idx: number) => (
                    <span key={idx} className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {item}
                    </span>
                  ))
              ) : (
                <span className="text-gray-500 text-sm">선택 안함</span>
              )}
            </div>
          </div>

          {/* 목표 */}
          <div className="mb-4 pb-4 border-b border-gray-200">
            <div className="text-sm text-gray-500 font-semibold mb-2">재활 목표</div>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(data.goal) && data.goal.length > 0 ? (
                data.goal
                  .map((item: any) => removeEmoji(item))
                  .filter(Boolean)
                  .map((item: string, idx: number) => (
                    <span key={idx} className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {item}
                    </span>
                  ))
              ) : (
                <span className="text-gray-500 text-sm">선택 안함</span>
              )}
            </div>
          </div>

          {/* 아픈 부위 */}
          <div>
            <div className="text-sm text-gray-500 font-semibold mb-2">아픈 부위</div>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(data.body) && data.body.length > 0 ? (
                data.body
                  .map((item: any) => removeEmoji(item))
                  .filter(Boolean)
                  .map((item: string, idx: number) => (
                    <span key={idx} className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {item}
                    </span>
                  ))
              ) : (
                <span className="text-gray-500 text-sm">선택 안함</span>
              )}
            </div>
          </div>
        </div>

        {/* 🎯 세부 치료 목표 (단기/장기) - 새로 추가된 부분 */}
        {data.goals && (
          <div className="mb-6 bg-white rounded-2xl p-6 shadow-lg border-l-4 border-teal-500">
            <div className="font-bold text-lg text-gray-900 mb-4">🎯 세부 치료 목표</div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 단기 목표 */}
              <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
                <h3 className="font-bold text-sm text-teal-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-teal-600 rounded-full"></span>
                  단기 목표 (Short-term)
                </h3>
                <div className="space-y-2">
                  {data.goals.shortTerm1 && <div className="text-sm text-gray-800 font-medium bg-white p-2 rounded shadow-sm">1. {data.goals.shortTerm1}</div>}
                  {data.goals.shortTerm2 && <div className="text-sm text-gray-800 font-medium bg-white p-2 rounded shadow-sm">2. {data.goals.shortTerm2}</div>}
                  {data.goals.shortTerm3 && <div className="text-sm text-gray-800 font-medium bg-white p-2 rounded shadow-sm">3. {data.goals.shortTerm3}</div>}
                  {(!data.goals.shortTerm1 && !data.goals.shortTerm2 && !data.goals.shortTerm3) && (
                    <div className="text-sm text-gray-500">설정된 단기 목표가 없습니다.</div>
                  )}
                </div>
              </div>

              {/* 장기 목표 */}
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                <h3 className="font-bold text-sm text-emerald-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                  장기 목표 (Long-term)
                </h3>
                <div className="space-y-2">
                  {data.goals.longTerm1 && <div className="text-sm text-gray-800 font-medium bg-white p-2 rounded shadow-sm">1. {data.goals.longTerm1}</div>}
                  {data.goals.longTerm2 && <div className="text-sm text-gray-800 font-medium bg-white p-2 rounded shadow-sm">2. {data.goals.longTerm2}</div>}
                  {data.goals.longTerm3 && <div className="text-sm text-gray-800 font-medium bg-white p-2 rounded shadow-sm">3. {data.goals.longTerm3}</div>}
                  {(!data.goals.longTerm1 && !data.goals.longTerm2 && !data.goals.longTerm3) && (
                    <div className="text-sm text-gray-500">설정된 장기 목표가 없습니다.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2️⃣ 신체 상태 평가 */}
        <div className="mb-6 bg-white rounded-2xl p-6 shadow-lg">
          <div className="mb-6 pb-4 border-b-2 border-gray-400">
            <div className="font-bold text-base text-gray-900">신체 상태 평가</div>
            <div className="text-xs text-gray-500 mt-1">Physical Posture Assessment</div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* 정면도 */}
            <div className="relative flex flex-col items-center">
              <div className="relative inline-block">
                <img 
                  src="/anatomy-front.png" 
                  alt="정면도" 
                  className="w-full h-auto"
                  style={{ maxWidth: "200px" }}
                />
                <svg
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ maxWidth: "200px" }}
                  viewBox="0 0 400 600"
                >
                  <circle cx={200} cy={70} r="20" fill={getPostureColor(getPostureValue(posture.neck, posture.neckEtc))} opacity="0.7" stroke="#fff" strokeWidth="2" />
                  <circle cx={140} cy={115} r="20" fill={getPostureColor(getPostureValue(posture.shoulder, posture.shoulderEtc))} opacity="0.7" stroke="#fff" strokeWidth="2" />
                  <circle cx={260} cy={115} r="20" fill={getPostureColor(getPostureValue(posture.shoulder, posture.shoulderEtc))} opacity="0.7" stroke="#fff" strokeWidth="2" />
                  <circle cx={140} cy={260} r="20" fill={getPostureColor(getPostureValue(posture.pelvis, posture.pelvisEtc))} opacity="0.7" stroke="#fff" strokeWidth="2" />
                  <circle cx={260} cy={260} r="20" fill={getPostureColor(getPostureValue(posture.pelvis, posture.pelvisEtc))} opacity="0.7" stroke="#fff" strokeWidth="2" />
                  <circle cx={160} cy={400} r="20" fill={getPostureColor(getPostureValue(posture.knee, posture.kneeEtc))} opacity="0.7" stroke="#fff" strokeWidth="2" />
                  <circle cx={240} cy={400} r="20" fill={getPostureColor(getPostureValue(posture.knee, posture.kneeEtc))} opacity="0.7" stroke="#fff" strokeWidth="2" />
                  <circle cx={160} cy={540} r="20" fill={getPostureColor(getPostureValue(posture.ankle, posture.ankleEtc))} opacity="0.7" stroke="#fff" strokeWidth="2" />
                  <circle cx={240} cy={540} r="20" fill={getPostureColor(getPostureValue(posture.ankle, posture.ankleEtc))} opacity="0.7" stroke="#fff" strokeWidth="2" />
                </svg>
              </div>
              <div className="text-xs font-bold text-gray-700 mt-2">정면도</div>
            </div>

            {/* 측면도 */}
            <div className="relative flex flex-col items-center">
              <div className="relative inline-block">
                <img 
                  src="/anatomy-side.png" 
                  alt="측면도" 
                  className="w-full h-auto"
                  style={{ maxWidth: "200px" }}
                />
                <svg
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ maxWidth: "200px" }}
                  viewBox="0 0 400 600"
                >
                  <circle cx={180} cy={70} r="20" fill={getPostureColor(getPostureValue(posture.neck, posture.neckEtc))} opacity="0.7" stroke="#fff" strokeWidth="2" />
                  <circle cx={200} cy={115} r="20" fill={getPostureColor(getPostureValue(posture.shoulder, posture.shoulderEtc))} opacity="0.7" stroke="#fff" strokeWidth="2" />
                  <circle cx={200} cy={260} r="20" fill={getPostureColor(getPostureValue(posture.pelvis, posture.pelvisEtc))} opacity="0.7" stroke="#fff" strokeWidth="2" />
                  <circle cx={200} cy={400} r="20" fill={getPostureColor(getPostureValue(posture.knee, posture.kneeEtc))} opacity="0.7" stroke="#fff" strokeWidth="2" />
                  <circle cx={180} cy={540} r="20" fill={getPostureColor(getPostureValue(posture.ankle, posture.ankleEtc))} opacity="0.7" stroke="#fff" strokeWidth="2" />
                </svg>
              </div>
              <div className="text-xs font-bold text-gray-700 mt-2">측면도</div>
            </div>

            {/* 상세 평가 */}
            <div className="space-y-2">
              {[
                { label: "목", value: getPostureValue(posture.neck, posture.neckEtc) },
                { label: "어깨", value: getPostureValue(posture.shoulder, posture.shoulderEtc) },
                { label: "골반", value: getPostureValue(posture.pelvis, posture.pelvisEtc) },
                { label: "무릎", value: getPostureValue(posture.knee, posture.kneeEtc) },
                { label: "발목", value: getPostureValue(posture.ankle, posture.ankleEtc) },
              ].map((item, i) => {
                const bgColor = item.value === "정상" ? "bg-green-50" : item.value === "-" ? "bg-gray-100" : "bg-red-50";
                const borderColor = item.value === "정상" ? "border-green-300" : item.value === "-" ? "border-gray-300" : "border-red-300";
                const textColor = item.value === "정상" ? "text-green-700" : item.value === "-" ? "text-gray-700" : "text-red-700";

                return (
                  <div key={i} className={`p-3 rounded-lg border-2 ${bgColor} ${borderColor}`}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-700">{item.label}</span>
                      <span className={`text-xs font-bold ${textColor}`}>{item.value}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 통증 정도 + 근력 정도 */}
          {(e.pain && typeof e.pain.level === 'number') || (e.strength?.level && e.strength?.level !== "정상") ? (
            <div className="mt-6 pt-4 border-t border-gray-300 space-y-3">
              {e.pain && typeof e.pain.level === 'number' && (
                <div>
                  <div className="text-sm font-bold text-gray-900 mb-2">🔥 통증 정도</div>
                  <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-3">
                    <div className="text-sm text-gray-800">
                      <span className="font-bold text-red-700">{getPainText(e.pain.level)}</span>
                      <span className="text-gray-600"> ({e.pain.level}/10)</span>
                      {e.pain.parts && e.pain.parts.length > 0 && (
                        <span className="text-gray-600"> - {e.pain.parts.join(", ")}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {e.strength?.level && e.strength?.level !== "정상" && (
                <div>
                  <div className="text-sm font-bold text-gray-900 mb-2">💪 근력 정도</div>
                  <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-3">
                    <div className="text-sm text-gray-800">
                      <span className="font-bold text-orange-700">{e.strength?.level}</span>
                      {e.strength?.parts && e.strength?.parts.length > 0 && (
                        <span className="text-gray-600"> - {e.strength?.parts.join(", ")}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* 3️⃣ 신체 기능 종합 분석 */}
        <div className="mb-6 bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-400">
          <div className="mb-4 pb-3 border-b-2 border-gray-300">
            <div className="font-bold text-base text-gray-900">신체 기능 종합 분석</div>
            <div className="text-xs text-gray-500 mt-1">⚠️ 평가 결과를 바탕으로 제시된 것이며, 개인의 신체 상태에 따라 적합하지 않을 수 있습니다.</div>
          </div>

          <div className={`mb-6 p-6 border-2 rounded-lg ${
            overallGrade === "A" ? "bg-green-100 border-green-400" :
            overallGrade === "B" ? "bg-yellow-100 border-yellow-400" :
            overallGrade === "C" ? "bg-orange-100 border-orange-400" :
            "bg-red-100 border-red-400"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm text-gray-600 font-semibold">종합 기능 등급</div>
              </div>
              <div className={`text-6xl font-bold ${
                overallGrade === "A" ? "text-green-700" :
                overallGrade === "B" ? "text-yellow-700" :
                overallGrade === "C" ? "text-orange-700" :
                "text-red-700"
              }`}>{overallGrade}</div>
              <div className="text-base text-gray-600 font-semibold ml-2">{getGradeLabel(overallGrade)}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
            <div>
              <div className="text-xs font-bold text-purple-700 mb-3 flex items-center gap-1">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                신경계 (5개)
              </div>
              <div className="space-y-2">
                {allFunctions.filter(f => f.category === "신경계").map((item, i) => (
                  <div key={i} className={`p-2 rounded-lg border-2 ${getGradeColor(item.grade)}`}>
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold flex-1">{item.label}</div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm ${getGradeBadgeColor(item.grade)}`}>
                        {item.grade}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-orange-700 mb-3 flex items-center gap-1">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                근골격계 (5개)
              </div>
              <div className="space-y-2">
                {allFunctions.filter(f => f.category === "근골격계").map((item, i) => (
                  <div key={i} className={`p-2 rounded-lg border-2 ${getGradeColor(item.grade)}`}>
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold flex-1">{item.label}</div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm ${getGradeBadgeColor(item.grade)}`}>
                        {item.grade}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="text-xs font-bold text-green-700 mb-2">✅ 강점</div>
              <div className="space-y-1">
                {(() => {
                  const strengths = allFunctions.filter(f => f.grade === "A").map(f => f.label);
                  const displayItems = strengths.length > 0 ? strengths.slice(0, 3) : ["기능 유지", "운동 수행 가능", "기본 체력 유지"];
                  return displayItems.map((v, i) => (
                    <div key={i} className="text-xs text-gray-700">• {v}</div>
                  ));
                })()}
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="text-xs font-bold text-orange-700 mb-2">⚠️ 개선필요</div>
              <div className="space-y-1">
                {(() => {
                  const improvements = allFunctions.filter(f => f.grade !== "A" && f.grade !== "미평가").map(f => f.label);
                  const displayItems = improvements.length > 0 ? improvements.slice(0, 3) : ["기능 개선", "근력 강화", "유연성 증진"];
                  return displayItems.map((v, i) => (
                    <div key={i} className="text-xs text-gray-700">• {v}</div>
                  ));
                })()}
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="text-xs font-bold text-red-700 mb-2">🚨 방치시 문제</div>
              <div className="space-y-1">
                {(() => {
                  const dFunctions = allFunctions.filter(f => f.grade === "D");
                  const cFunctions = allFunctions.filter(f => f.grade === "C");
                  const problems = [];
                  if (dFunctions.length > 0) {
                    problems.push("낙상 위험 증가", "신체 기능 악화", "일상생활 제약");
                  } else if (cFunctions.length > 0) {
                    problems.push("활동량 지속 감소", "근력 및 체력 저하", "신체 의존도 증가");
                  } else {
                    problems.push("현재 상태 악화", "기능 제한 확대", "만성질환 위험");
                  }
                  return problems.slice(0, 3).map((v, i) => (
                    <div key={i} className="text-xs text-gray-700">• {v}</div>
                  ));
                })()}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-xs font-semibold text-gray-700 mb-2">등급 기준</div>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>A: 양호</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>B: 약간 저하</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>C: 저하</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>D: 심한 저하</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4️⃣ 추천 운동 */}
        <div className="mb-6 bg-purple-50 rounded-xl p-5 shadow-lg border-l-4 border-purple-500">
          <div className="text-base font-bold text-purple-900 mb-3">💡 추천 운동</div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div className="text-xs text-yellow-900">
              ⚠️ 추천 운동은 평가 결과를 바탕으로 제시된 것이며, 개인의 신체 상태에 따라 적합하지 않을 수 있습니다.
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {(() => {
              const planMap: any = {
                뇌졸중: [
                  { name: "신경 재교육 운동", purpose: "신경계 재학습 및 신체 제어 능력 회복" },
                  { name: "보행 재활 훈련", purpose: "안정적인 보행 능력 복귀" },
                  { name: "균형 및 안정성 훈련", purpose: "일상생활 안전성 확보" },
                ],
                파킨슨병: [
                  { name: "대동작 훈련", purpose: "움직임 크기와 속도 개선" },
                  { name: "보행 및 균형 훈련", purpose: "보행 능력 강화 및 낙상 예방" },
                  { name: "유연성 운동", purpose: "근경직 완화 및 움직임 범위 개선" },
                ],
                "자세 교정": [
                  { name: "척추 정렬 운동", purpose: "전신 자세 기초 교정" },
                  { name: "유연성 운동", purpose: "근육 길이 정상화" },
                  { name: "코어 강화", purpose: "자세 유지 능력 강화" },
                ],
              };

              const reason = Array.isArray(data.reason) ? data.reason[0] : data.reason || "자세 교정";
              const recommended = planMap[reason] || planMap["자세 교정"];

              return recommended.slice(0, 3).map((v: any, i: number) => (
                <div key={i} className="bg-white bg-opacity-70 rounded-lg p-2 border border-purple-200">
                  <div className="font-semibold text-purple-900 text-xs">{v.name}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{v.purpose}</div>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* 5️⃣ 전문가 의견 */}
        <div className="mb-8 bg-white rounded-xl p-5 shadow-lg border-t-4 border-blue-500">
          <div className="text-base font-bold text-gray-900 mb-3">💭 전문가 의견</div>
          
          {data.expertOpinion && (
            <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4 mb-4">
              <h4 className="text-xs font-bold text-blue-900 mb-2">📝 선생님 개인 노트</h4>
              <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
                {data.expertOpinion}
              </div>
            </div>
          )}

          <div className="bg-indigo-50 border-l-4 border-indigo-400 rounded-lg p-4">
            <h4 className="text-xs font-bold text-indigo-900 mb-2">💬 전문가 코멘트</h4>
            <div
              className="text-xs text-gray-700 leading-relaxed space-y-2"
              dangerouslySetInnerHTML={{
                __html: (() => {
                  const customerName = data.name || "고객";
                  const pain = e.pain?.level ?? 0;
                  const rom = e.rom?.level;
                  const strength = e.strength?.level;
                  
                  const problems = [];
                  if (rom !== "정상") problems.push("움직임 제한");
                  if (strength && strength !== "정상") problems.push("근력 감소");
                  if (pain >= 3) problems.push("통증");
                  
                  const problem1 = problems[0] || "신체 불균형";
                  const problem2 = problems[1] || "기능 제한";

                  const dFunctions = allFunctions.filter(f => f.grade === "D");
                  const risks = [];
                  if (pain >= 6) risks.push("급성 통증 악화");
                  if (rom === "심각" || strength === "심각") risks.push("낙상 위험");
                  if (dFunctions.length > 0) risks.push("일상생활 불능");
                  
                  const risk1 = risks[0] || "신체 기능 악화";
                  const risk2 = risks[1] || "의존도 증가";
                  
                  let comment = `<p><b>${customerName}님</b>의 평가를 통해 확인된 주요 문제는 <b>${problem1}</b>과 <b>${problem2}</b>입니다. 이 두 가지 문제가 함께 작용하면서 ${customerName}님의 신체 기능이 제대로 작동하지 못하고 있는 상태입니다. 단순히 한 부분의 불편함이 아니라 여러 영역이 연쇄적으로 영향을 미치고 있다는 뜻이며, 이는 현재의 불편함이 앞으로 더욱 악화될 수 있음을 의미합니다.</p>`;

                  comment += `<p>방치했을 때 가장 우려되는 부분은 <b>${risk1}</b>과 <b>${risk2}</b>입니다. 현재의 패턴이 고착되면 이러한 위험들이 현실이 될 가능성이 매우 높습니다. ${customerName}님의 상태는 시간이 지날수록 회복이 더 어려워질 것입니다.</p>`;

                  comment += `<p>${customerName}님이 설문한 목표를 실제로 달성하기 위해서는 현재의 문제들을 정확히 파악하고 체계적으로 해결해야 합니다. ${problem1}과 ${problem2}가 복합적으로 나타나고 있는 ${customerName}님의 임상적 상황에서는 일반적인 운동 프로그램으로는 한계가 있습니다. 따라서 ${customerName}님의 개별적인 신체 상태를 정밀하게 분석하여 설계된 전문적인 맞춤형 재활이 반드시 필요합니다.</p>`;

                  comment += `<p>목표 달성과 관리를 위해서는 ${customerName}님의 상태에 맞춘 재활운동이 필수적이라고 사료됩니다.</p>`;

                  return comment;
                })()
              }}
            />

            <div className="pt-3 border-t border-indigo-200 text-right mt-3">
              <div className="text-xs font-semibold text-gray-700">
                재활운동 전문강사 <span className="text-indigo-600">{therapistName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={handleShare}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-xl transition shadow-lg text-sm"
          >
            📱 공유
          </button>

          <button
            onClick={handleDownload}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition shadow-lg text-sm disabled:opacity-50"
          >
            {isLoading ? "⏳ 저장 중..." : "📥 구글드라이브 저장"}
          </button>
        </div>
      </div>
    </div>
  );
}