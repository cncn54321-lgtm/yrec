"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QuestionLayout from "@/components/QuestionLayout";

export default function TherapistPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<any>(null);

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

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("formData") || "{}");
    setFormData(data);
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
    Object.keys(orthoFunc).length === 5;

  // ===== 저장 =====
  const handleNext = () => {
    if (!isValid) {
      alert("모든 항목 입력해라");
      return;
    }

    const prev = JSON.parse(localStorage.getItem("formData") || "{}");

    localStorage.setItem(
      "formData",
      JSON.stringify({
        ...prev,
        evaluation: {
          posture,
          rom: { level: rom, parts: romParts, etc: romEtc },
          function: { neuro: neuroFunc, ortho: orthoFunc },
          neuro,
          strength: { level: strength, parts: strengthParts, etc: strengthEtc },
          pain: { level: painLevel },
          fallRisk,
        },
      })
    );

    router.push("/questionnaire/result");
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
          onEtcChange={(v)=>setPosture({...posture, neckEtc:v})}
          onChange={(v)=>setPosture({...posture, neck:v})}
        />

        <PostureBlock
          label="어깨"
          options={["정상","라운드숄더","기타"]}
          value={posture.shoulder}
          etcValue={posture.shoulderEtc}
          onEtcChange={(v)=>setPosture({...posture, shoulderEtc:v})}
          onChange={(v)=>setPosture({...posture, shoulder:v})}
        />

        <PostureBlock
          label="골반"
          options={["정상","전방경사","후방경사","기타"]}
          value={posture.pelvis}
          etcValue={posture.pelvisEtc}
          onEtcChange={(v)=>setPosture({...posture, pelvisEtc:v})}
          onChange={(v)=>setPosture({...posture, pelvis:v})}
        />

        <PostureBlock
          label="무릎"
          options={["정상","X다리","O다리","기타"]}
          value={posture.knee}
          etcValue={posture.kneeEtc}
          onEtcChange={(v)=>setPosture({...posture, kneeEtc:v})}
          onChange={(v)=>setPosture({...posture, knee:v})}
        />

        <PostureBlock
          label="발목"
          options={["정상","평발","요족","기타"]}
          value={posture.ankle}
          etcValue={posture.ankleEtc}
          onEtcChange={(v)=>setPosture({...posture, ankleEtc:v})}
          onChange={(v)=>setPosture({...posture, ankle:v})}
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

  {/* 🔥 감소 선택했을 때만 표시 */}
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

      {/* 기타 입력 */}
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

      <button
        onClick={handleNext}
        disabled={!isValid}
        className={`mt-6 w-full py-4 rounded-xl text-white ${
          isValid ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        리포트 생성
      </button>

    </QuestionLayout>
  );
}

/* ===== UI ===== */

function Section({title,children}:any){
  return <div className="mb-10 p-5 border rounded-xl">
    <h2 className="font-semibold mb-4">{title}</h2>
    {children}
  </div>;
}

function Btn({children,active,onClick}:any){
  return <button onClick={onClick}
    className={`mr-2 mb-2 px-3 py-1 border rounded-lg ${active?"bg-blue-600 text-white":""}`}>
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