"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QuestionLayout from "@/components/QuestionLayout";

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwej0GVwjCC1ixPqj-6759eMK3jZNrpjL0GoYo0LhBQfNQ_hX8MOw7aZu0mGcRtsMU/exec';
const MIN_GOAL_LENGTH = 10; // 💡 10글자로 수정

export default function TherapistPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // ===== 자세 =====
  const [posture, setPosture] = useState({
    neck: "", neckEtc: "",
    shoulder: "", shoulderEtc: "",
    pelvis: "", pelvisEtc: "",
    knee: "", kneeEtc: "",
    ankle: "", ankleEtc: "",
  });

  // ===== ROM =====
  const [rom, setRom] = useState("");
  const [romParts, setRomParts] = useState<string[]>([]);
  const [romEtc, setRomEtc] = useState("");

  // ===== 기능 =====
  const neuroOptions = ["정상", "부분 제한", "보조 필요", "수행 어려움"];
  const orthoOptions = ["정상", "통증 있음", "제한 있음", "수행 어려움"];

  const [neuroFunc, setNeuroFunc] = useState<any>({});
  const [orthoFunc, setOrthoFunc] = useState<any>({});

  const neuroList = [
    { key: "sitStand", label: "앉기↔서기" },
    { key: "gait", label: "보행" },
    { key: "balance", label: "균형 유지" },
    { key: "standAlone", label: "지지 없이 서기" },
    { key: "turn", label: "방향 전환 / 회전" },
  ];

  const orthoList = [
    { key: "neckMove", label: "고개 움직이기" },
    { key: "armLift", label: "팔 올리기" },
    { key: "singleLeg", label: "한발 서기" },
    { key: "stairs", label: "계단 오르기" },
    { key: "squat", label: "쪼그려 앉기" },
  ];

  // ===== 기타 =====
  const [neuro, setNeuro] = useState("");
  const [strength, setStrength] = useState("");
  const [strengthParts, setStrengthParts] = useState<string[]>([]);
  const [strengthEtc, setStrengthEtc] = useState("");
  const [painLevel, setPainLevel] = useState<number>(0);
  const [fallRisk, setFallRisk] = useState("");

  // ===== 전문가 의견 & 치료 목표 (STG / LTG) - 각각 독립적 =====
  const [expertOpinion, setExpertOpinion] = useState("");
  const [shortTermGoal1, setShortTermGoal1] = useState("");
  const [shortTermGoal2, setShortTermGoal2] = useState("");
  const [shortTermGoal3, setShortTermGoal3] = useState("");
  const [longTermGoal1, setLongTermGoal1] = useState("");
  const [longTermGoal2, setLongTermGoal2] = useState("");
  const [longTermGoal3, setLongTermGoal3] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("formData") || "{}");
    setFormData(data);
    console.log("📊 formData 로드됨:", data);

    if (data.expertOpinion) setExpertOpinion(data.expertOpinion);
    if (data.goals) {
      setShortTermGoal1(data.goals.shortTerm1 || "");
      setShortTermGoal2(data.goals.shortTerm2 || "");
      setShortTermGoal3(data.goals.shortTerm3 || "");
      setLongTermGoal1(data.goals.longTerm1 || "");
      setLongTermGoal2(data.goals.longTerm2 || "");
      setLongTermGoal3(data.goals.longTerm3 || "");
    }
  }, []);

  // ===== 토글 =====
  const toggleRomPart = (part: string) => {
    setRomParts(prev =>
      prev.includes(part) ? prev.filter(v => v !== part) : [...prev, part]
    );
  };

  const toggleStrengthPart = (part: string) => {
    setStrengthParts(prev =>
      prev.includes(part) ? prev.filter(v => v !== part) : [...prev, part]
    );
  };

  // ===== 검증 =====
  const isGoalsValid =
    shortTermGoal1.trim().length >= MIN_GOAL_LENGTH &&
    shortTermGoal2.trim().length >= MIN_GOAL_LENGTH &&
    shortTermGoal3.trim().length >= MIN_GOAL_LENGTH &&
    longTermGoal1.trim().length >= MIN_GOAL_LENGTH &&
    longTermGoal2.trim().length >= MIN_GOAL_LENGTH &&
    longTermGoal3.trim().length >= MIN_GOAL_LENGTH;

  const isValid =
    posture.neck &&
    posture.shoulder &&
    posture.pelvis &&
    posture.knee &&
    posture.ankle &&
    rom &&
    neuro &&
    strength &&
    fallRisk &&
    Object.keys(neuroFunc).length === 5 &&
    Object.keys(orthoFunc).length === 5 &&
    isGoalsValid;

  // ===== 저장 로직 =====
  const saveToGoogleSheet = async (evaluationData: any, latestFormData: any) => {
    try {
      const timestamp = new Date().toLocaleString('ko-KR', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      const payload = {
        timestamp: timestamp,
        therapistName: localStorage.getItem("therapistName") || '',
        name: latestFormData.name || '',
        gender: latestFormData.gender || '',
        age: latestFormData.age || '',
        phone: latestFormData.phone || '',
        region: latestFormData.region || '',
        source: latestFormData.source || '',
        medication: latestFormData.medication || '',
        medicationName: latestFormData.medicationName || '',
        diseases: latestFormData.diseases || '',
        surgery: latestFormData.surgery || '',
        shortTermGoal1: shortTermGoal1,
        shortTermGoal2: shortTermGoal2,
        shortTermGoal3: shortTermGoal3,
        longTermGoal1: longTermGoal1,
        longTermGoal2: longTermGoal2,
        longTermGoal3: longTermGoal3,
      };

      console.log("📤 전송할 데이터:", payload);

      const res = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log("✅ Google Apps Script 응답:", result);

      if (result.status === 'success') {
        console.log("✅ 저장 완료");
        return true;
      } else {
        console.error("❌ 저장 실패:", result);
        alert("❌ 저장 실패: " + (result.error || "알 수 없는 오류"));
        return false;
      }
    } catch (e) {
      console.error("❌ 저장 중 에러:", e);
      alert("❌ 에러 발생: " + (e as Error).message);
      return false;
    }
  };

  const handleNext = async () => {
    if (!isValid) {
      alert("모든 항목을 입력해 주세요.");
      return;
    }

    setIsSaving(true);

    const latestFormData = JSON.parse(localStorage.getItem("formData") || "{}");
    console.log("📊 최신 formData:", latestFormData);

    const evaluationData = {
      ...latestFormData,
      expertOpinion: expertOpinion,
      goals: {
        shortTerm1: shortTermGoal1,
        shortTerm2: shortTermGoal2,
        shortTerm3: shortTermGoal3,
        longTerm1: longTermGoal1,
        longTerm2: longTermGoal2,
        longTerm3: longTermGoal3,
      },
      evaluation: {
        posture,
        rom: { level: rom, parts: romParts, etc: romEtc },
        function: { neuro: neuroFunc, ortho: orthoFunc },
        neuro,
        strength: { level: strength, parts: strengthParts, etc: strengthEtc },
        pain: { level: painLevel },
        fallRisk,
      },
    };

    localStorage.setItem("formData", JSON.stringify(evaluationData));

    const saved = await saveToGoogleSheet(evaluationData, latestFormData);
    
    setIsSaving(false);

    if (saved) {
      router.push("/questionnaire/result");
    }
  };

  const handlePrev = () => {
    router.push("/questionnaire/complete");
  };

  if (!formData) return null;

  return (
    <QuestionLayout title="강사 평가">

      {/* ===== 자세 ===== */}
      <Section title="🧍 자세 평가">
        <PostureBlock
          label="목"
          options={["정상","거북목","일자목","기타"]}
          value={posture.neck}
          etcValue={posture.neckEtc}
          onEtcChange={(v: string)=>setPosture({...posture, neckEtc: v})}
          onChange={(v: string)=>setPosture({...posture, neck:v})}
        />

        <PostureBlock
          label="어깨"
          options={["정상","라운드숄더","기타"]}
          value={posture.shoulder}
          etcValue={posture.shoulderEtc}
          onEtcChange={(v)=>setPosture({...posture, shoulderEtc:v})}
          onChange={(v: string)=>setPosture({...posture, shoulder:v})}
        />

        <PostureBlock
          label="골반"
          options={["정상","전방경사","후방경사","기타"]}
          value={posture.pelvis}
          etcValue={posture.pelvisEtc}
          onEtcChange={(v)=>setPosture({...posture, pelvisEtc:v})}
          onChange={(v: string)=>setPosture({...posture, pelvis:v})}
        />

        <PostureBlock
          label="무릎"
          options={["정상","X다리","O다리","기타"]}
          value={posture.knee}
          etcValue={posture.kneeEtc}
          onEtcChange={(v)=>setPosture({...posture, kneeEtc:v})}
          onChange={(v: string)=>setPosture({...posture, knee:v})}
        />

        <PostureBlock
          label="발목"
          options={["정상","평발","요족","기타"]}
          value={posture.ankle}
          etcValue={posture.ankleEtc}
          onEtcChange={(v)=>setPosture({...posture, ankleEtc:v})}
          onChange={(v: string)=>setPosture({...posture, ankle:v})}
        />
      </Section>

      {/* ===== 움직임 ===== */}
      <Section title="🤸 움직임">
        {["정상","제한 있음","심한 제한"].map(val=>(
          <Btn key={val} active={rom===val} onClick={()=>setRom(val)}>
            {val}
          </Btn>
        ))}

        {(rom==="제한 있음"||rom==="심한 제한") && (
          <div className="mt-3">
            {["어깨","엉덩관절","무릎","발목","기타"].map(p=>(
              <Btn key={p} active={romParts.includes(p)} onClick={()=>toggleRomPart(p)}>
                {p}
              </Btn>
            ))}

            {romParts.includes("기타") && (
              <input
                value={romEtc}
                onChange={(e)=>setRomEtc(e.target.value)}
                className="mt-2 w-full border px-3 py-2 rounded-lg"
              />
            )}
          </div>
        )}
      </Section>

      {/* ===== 낙상 ===== */}
      <Section title="⚠️ 낙상 위험">
        {["없음","약간 있음","높음"].map(val=>(
          <Btn key={val} active={fallRisk===val} onClick={()=>setFallRisk(val)}>
            {val}
          </Btn>
        ))}
      </Section>

      {/* ===== 기능 ===== */}
      <Section title="⚙️ 기능 평가">
        <div className="mb-6">
          <div className="font-semibold mb-2">신경계</div>
          {neuroList.map(item => (
            <div key={item.key} className="mb-3">
              <div className="text-sm">{item.label}</div>
              {neuroOptions.map(opt => (
                <Btn key={opt}
                  active={neuroFunc[item.key] === opt}
                  onClick={()=>setNeuroFunc({...neuroFunc,[item.key]:opt})}>
                  {opt}
                </Btn>
              ))}
            </div>
          ))}
        </div>

        <div>
          <div className="font-semibold mb-2">근골격계</div>
          {orthoList.map(item => (
            <div key={item.key} className="mb-3">
              <div className="text-sm">{item.label}</div>
              {orthoOptions.map(opt => (
                <Btn key={opt}
                  active={orthoFunc[item.key] === opt}
                  onClick={()=>setOrthoFunc({...orthoFunc,[item.key]:opt})}>
                  {opt}
                </Btn>
              ))}
            </div>
          ))}
        </div>
      </Section>

      {/* ===== 신경 ===== */}
      <Section title="⚡ 신경">
        {["없음","저림","방사통","감각저하"].map(val=>(
          <Btn key={val} active={neuro===val} onClick={()=>setNeuro(val)}>
            {val}
          </Btn>
        ))}
      </Section>

      {/* ===== 근력 ===== */}
      <Section title="💪 근력">
        {["정상","경미 감소","중등도 감소","심한 감소"].map(val=>(
          <Btn key={val} active={strength===val} onClick={()=>setStrength(val)}>
            {val}
          </Btn>
        ))}

        {(strength === "경미 감소" || strength === "중등도 감소" || strength === "심한 감소") && (
          <div className="mt-3">
            {["어깨","팔","손목","엉덩관절","무릎","발목","기타"].map(p=>(
              <Btn
                key={p}
                active={strengthParts.includes(p)}
                onClick={()=>toggleStrengthPart(p)}
              >
                {p}
              </Btn>
            ))}

            {strengthParts.includes("기타") && (
              <input
                value={strengthEtc}
                onChange={(e)=>setStrengthEtc(e.target.value)}
                className="mt-2 w-full border px-3 py-2 rounded-lg"
                placeholder="기타 부위 입력"
              />
            )}
          </div>
        )}
      </Section>

      {/* ===== 통증 ===== */}
      <Section title="🔥 통증">
        <input type="range" min="0" max="10"
          value={painLevel}
          onChange={(e)=>setPainLevel(Number(e.target.value))}
          className="w-full"/>
        <div className="text-center">{painLevel}</div>
      </Section>

      {/* 🎯 치료 목표 (Short-term & Long-term Goals) */}
      <Section title="🎯 치료 목표 설정">
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            📌 단기 목표 1 (최소 10글자)
          </label>
          <textarea
            value={shortTermGoal1}
            onChange={(e) => setShortTermGoal1(e.target.value)}
            placeholder="예: 2주 내 무릎 통증 VAS 5에서 2로 감소, 계단 오르기 보조 없이 수행"
            className="w-full border px-3 py-2 rounded-lg focus:outline-blue-500"
            rows={3}
          />
          <div className={`text-xs mt-1 ${
            shortTermGoal1.trim().length >= MIN_GOAL_LENGTH 
              ? "text-green-600" 
              : "text-red-600"
          }`}>
            {shortTermGoal1.trim().length}/10글자
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            📌 단기 목표 2 (최소 10글자)
          </label>
          <textarea
            value={shortTermGoal2}
            onChange={(e) => setShortTermGoal2(e.target.value)}
            placeholder="예: 균형 능력 향상으로 낙상 위험 감소, 기본 근력 5단계 달성"
            className="w-full border px-3 py-2 rounded-lg focus:outline-blue-500"
            rows={3}
          />
          <div className={`text-xs mt-1 ${
            shortTermGoal2.trim().length >= MIN_GOAL_LENGTH 
              ? "text-green-600" 
              : "text-red-600"
          }`}>
            {shortTermGoal2.trim().length}/10글자
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            📌 단기 목표 3 (최소 10글자)
          </label>
          <textarea
            value={shortTermGoal3}
            onChange={(e) => setShortTermGoal3(e.target.value)}
            placeholder="예: 바른 자세 유지 시간 증가, 일상생활 동작의 독립성 향상"
            className="w-full border px-3 py-2 rounded-lg focus:outline-blue-500"
            rows={3}
          />
          <div className={`text-xs mt-1 ${
            shortTermGoal3.trim().length >= MIN_GOAL_LENGTH 
              ? "text-green-600" 
              : "text-red-600"
          }`}>
            {shortTermGoal3.trim().length}/10글자
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            🏆 장기 목표 1 (최소 10글자)
          </label>
          <textarea
            value={longTermGoal1}
            onChange={(e) => setLongTermGoal1(e.target.value)}
            placeholder="예: 3개월 내 통증 없이 30분 이상 독립 보행 및 정상 일상생활 복귀"
            className="w-full border px-3 py-2 rounded-lg focus:outline-blue-500"
            rows={3}
          />
          <div className={`text-xs mt-1 ${
            longTermGoal1.trim().length >= MIN_GOAL_LENGTH 
              ? "text-green-600" 
              : "text-red-600"
          }`}>
            {longTermGoal1.trim().length}/10글자
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            🏆 장기 목표 2 (최소 10글자)
          </label>
          <textarea
            value={longTermGoal2}
            onChange={(e) => setLongTermGoal2(e.target.value)}
            placeholder="예: 근력과 지구력 회복으로 사회 활동 및 취미 활동 복귀"
            className="w-full border px-3 py-2 rounded-lg focus:outline-blue-500"
            rows={3}
          />
          <div className={`text-xs mt-1 ${
            longTermGoal2.trim().length >= MIN_GOAL_LENGTH 
              ? "text-green-600" 
              : "text-red-600"
          }`}>
            {longTermGoal2.trim().length}/10글자
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            🏆 장기 목표 3 (최소 10글자)
          </label>
          <textarea
            value={longTermGoal3}
            onChange={(e) => setLongTermGoal3(e.target.value)}
            placeholder="예: 정상적인 자세 유지와 기능적 독립성 달성으로 삶의 질 향상"
            className="w-full border px-3 py-2 rounded-lg focus:outline-blue-500"
            rows={3}
          />
          <div className={`text-xs mt-1 ${
            longTermGoal3.trim().length >= MIN_GOAL_LENGTH 
              ? "text-green-600" 
              : "text-red-600"
          }`}>
            {longTermGoal3.trim().length}/10글자
          </div>
        </div>
      </Section>

      {/* ===== 전문가 의견 ===== */}
      <Section title="💭 담당 강사 노트">
        <textarea
          value={expertOpinion}
          onChange={(e) => setExpertOpinion(e.target.value)}
          placeholder="평가에 대한 선생님의 내용을 입력하세요..."
          className="w-full border px-3 py-2 rounded-lg focus:outline-blue-500"
          rows={5}
        />
      </Section>

      {/* 버튼 그룹 */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={handlePrev}
          className="flex-1 rounded-xl py-4 text-lg font-semibold text-blue-600 bg-white border-2 border-blue-600 hover:bg-blue-50 transition"
        >
          이전
        </button>

        <button
          onClick={handleNext}
          disabled={!isValid || isSaving}
          className={`flex-1 rounded-xl py-4 text-lg font-semibold text-white transition ${
            isValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {isSaving ? "저장 중..." : "리포트 생성"}
        </button>
      </div>

    </QuestionLayout>
  );
}

/* ===== UI Components ===== */

function Section({title,children}:any){
  return <div className="mb-10 p-5 border rounded-xl bg-white shadow-sm">
    <h2 className="font-semibold mb-4 text-lg">{title}</h2>
    {children}
  </div>;
}

function Btn({children,active,onClick}:any){
  return <button onClick={onClick}
    className={`mr-2 mb-2 px-3 py-1 border rounded-lg transition ${active?"bg-blue-600 text-white border-blue-600":"bg-gray-50 border-gray-200"}`}>
    {children}
  </button>;
}

function PostureBlock({label,options,value,onChange,etcValue,onEtcChange}:any){
  return <div className="mb-4">
    <div className="text-sm mb-1">{label}</div>

    {options.map((val:string)=>(
      <Btn key={val} active={value===val} onClick={()=>onChange(val)}>
        {val}
      </Btn>
    ))}

    {value==="기타" && (
      <input
        value={etcValue}
        onChange={(e)=>onEtcChange(e.target.value)}
        className="mt-2 w-full border px-3 py-2 rounded-lg"
      />
    )}
  </div>;
}