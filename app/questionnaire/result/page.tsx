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
  }
}

import { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import { supabase } from "@/lib/supabase";

export default function ResultPage() {
  const [data, setData] = useState<any>(null);

  // 🔥 카카오 SDK 초기화
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.async = true;
    script.onload = () => {
      if (window.Kakao) {
        window.Kakao.init("3a42cb3b12adc32a28996b96446e95d9");
        console.log("✅ 카카오 SDK 초기화 완료");
      }
    };
    script.onerror = () => {
      console.error("❌ 카카오 SDK 로드 실패");
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("formData") || "{}");
      setData(stored);
    } catch {
      setData({});
    }
  }, []);

  if (!data) return null;

  const e = data.evaluation || {};
  const posture = e.posture || {};
  const func = e.function || {};

  const safeJoin = (val: any) => {
    if (Array.isArray(val)) return val.join(", ");
    if (typeof val === "string") return val;
    return "-";
  };

  const safeVal = (v: any) => (v ? v : "-");

  const getPostureValue = (v: string, etc: string) => {
    if (!v) return "-";
    if (v === "기타") return etc || "기타";
    return v;
  };

  const getRomValue = () => {
    if (!e.rom?.level) return "-";

    if (e.rom.level === "제한 있음" || e.rom.level === "심한 제한") {
      const parts = (e.rom.parts || []).join(", ");
      return parts ? `${e.rom.level} (${parts})` : e.rom.level;
    }

    return e.rom.level;
  };

  const getStrengthValue = () => {
    if (!e.strength?.level) return "-";

    if (e.strength.level !== "정상") {
      const parts = (e.strength.parts || []).join(", ");
      return parts ? `${e.strength.level} (${parts})` : e.strength.level;
    }

    return e.strength.level;
  };

  const labelMap: any = {
    sitStand: "앉기↔서기",
    gait: "보행",
    balance: "균형 유지",
    standAlone: "지지 없이 서기",
    turn: "방향 전환",
    neckMove: "고개 움직이기",
    armLift: "팔 올리기",
    singleLeg: "한발 서기",
    stairs: "계단 오르기",
    squat: "쪼그려 앉기",
  };

  const generate = () => {
    const used = new Set<string>();

    const pick = (arr: string[]) => {
      const result: string[] = [];

      for (const item of arr) {
        if (!used.has(item)) {
          result.push(item);
          used.add(item);
        }
        if (result.length === 3) break;
      }

      const fallback = ["기능 유지", "운동 수행 가능", "기본 체력 유지"];

      let i = 0;
      while (result.length < 3) {
        const next = fallback[i++];
        if (!result.includes(next)) {
          result.push(next);
        }
      }

      return result;
    };

    const strengthCandidates: string[] = [];
    const improveCandidates: string[] = [];
    const riskCandidates: string[] = [];
    const exerciseCandidates: string[] = [];

    if (e.rom?.level === "정상") strengthCandidates.push("움직임 정상 범위");
    if (e.strength?.level === "정상") strengthCandidates.push("근력 상태 양호");
    if (e.fallRisk === "없음") strengthCandidates.push("보행 안정성 확보");

    if (e.rom?.level !== "정상") improveCandidates.push("움직임 제한");
    if (e.strength?.level !== "정상") improveCandidates.push("근력 저하");
    if (e.pain?.level >= 3) improveCandidates.push("통증 관리");

    Object.values(func.neuro || {}).forEach((v: any) => {
      if (v !== "정상") improveCandidates.push("신경계 기능 저하");
    });

    Object.values(func.ortho || {}).forEach((v: any) => {
      if (v !== "정상") improveCandidates.push("근골격 기능 저하");
    });

    if (e.pain?.level >= 3) riskCandidates.push("통증 악화 가능성");
    if (e.fallRisk !== "없음") riskCandidates.push("낙상 위험 증가");
    riskCandidates.push("기능 저하 지속");
    riskCandidates.push("일상생활 제한 증가");

    if (e.rom?.level !== "정상") exerciseCandidates.push("관절 가동성 회복 운동");
    if (e.strength?.level !== "정상") exerciseCandidates.push("근력 강화 운동");
    if (e.fallRisk !== "없음") exerciseCandidates.push("균형 및 보행 훈련");
    if (e.pain?.level >= 3) exerciseCandidates.push("통증 완화 운동");

    exerciseCandidates.push("자세 정렬 운동");
    exerciseCandidates.push("코어 안정화 운동");

    return {
      strength: pick(strengthCandidates),
      improve: pick(improveCandidates),
      risk: pick(riskCandidates),
      exercise: pick(exerciseCandidates),
    };
  };

  const a = generate();

  const handleShare = async () => {
    try {
      console.log("공유 시작...");
      
      // 1단계: Google Apps Script 호출
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbzllPME_q7mE9LrDtdh-9wuutLpnniWsyerD5BDfKeRQHXBfkOJYOlgVlZAmEFBJMlQ/exec",
        {
          method: "POST",
          body: JSON.stringify({ ...data, action: "share" }),
        }
      );

      const result = await res.json();
      console.log("Google Apps Script 결과:", result);

      if (!result.success) {
        alert("저장 실패: " + (result.error || "알 수 없는 오류"));
        return;
      }

      const pdfUrl = result.url;
      console.log("PDF URL:", pdfUrl);

      // 2단계: 카카오 SDK 확인
      if (!window.Kakao) {
        alert("카카오톡 SDK가 로드되지 않았습니다. 페이지를 새로고침하고 다시 시도해주세요.");
        return;
      }

      if (!window.Kakao.isInitialized()) {
        alert("카카오톡이 아직 초기화 중입니다. 잠시 후 다시 시도해주세요.");
        return;
      }

      // 3단계: 카카오 공유
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: `${data.name}님의 재활 평가 결과`,
          description: "평가 결과를 확인해주세요",
          imageUrl: `${window.location.origin}/logo.png`,
          link: {
            mobileWebUrl: pdfUrl,
            webUrl: pdfUrl,
          },
        },
        buttons: [
          {
            title: "결과 보기",
            link: {
              mobileWebUrl: pdfUrl,
              webUrl: pdfUrl,
            },
          },
        ],
      });

    } catch (e) {
      console.error("에러:", e);
      alert("에러 발생: " + (e as Error).message);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbzllPME_q7mE9LrDtdh-9wuutLpnniWsyerD5BDfKeRQHXBfkOJYOlgVlZAmEFBJMlQ/exec",
        {
          method: "POST",
          body: JSON.stringify({ ...data, action: "download" }),
        }
      );

      const result = await res.json();

      if (!result.success) {
        alert("저장 실패");
        return;
      }

      alert("구글 드라이브에 저장되었습니다!");
      window.open(result.url, "_blank");

    } catch (e) {
      alert("에러 발생");
      console.error(e);
    }
  };

  const handlePrint = () => {
    const el = document.getElementById("result");
    if (!el) return;

    const commentEl = el.querySelector('[dangerouslySetInnerHTML]');
    const commentHTML = commentEl?.innerHTML || '';

    const printWindow = window.open("", "", "width=1024,height=1400");
    if (printWindow) {
      const styles = `
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 13px;
            line-height: 1.6;
            color: #333;
            padding: 15mm;
            background: white;
          }
          
          @page { size: A4; margin: 15mm; }
          @media print { body { padding: 15mm; margin: 0; } }
          
          .max-w-\\[800px\\] { max-width: 800px; }
          .mx-auto { margin-left: auto; margin-right: auto; }
          .text-sm { font-size: 13px; }
          .leading-relaxed { line-height: 1.625; }
          
          .flex { display: flex; }
          .justify-between { justify-content: space-between; }
          .items-center { align-items: center; }
          .mb-4 { margin-bottom: 12px; }
          .border-b { border-bottom: 1px solid #ddd; }
          .pb-2 { padding-bottom: 8px; }
          .h-10 { height: 35px; }
          
          .font-bold { font-weight: 700; }
          .text-lg { font-size: 16px; }
          
          .grid { display: grid; gap: 10px; margin-bottom: 10px; }
          .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
          .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
          .gap-3 { gap: 10px; }
          .mb-3 { margin-bottom: 10px; }
          
          .p-3 { padding: 10px; }
          .border { border: 1px solid #ddd; }
          .rounded-xl { border-radius: 8px; }
          
          .font-semibold { font-weight: 600; }
          .mb-2 { margin-bottom: 6px; }
          
          .text-xs { font-size: 11px; }
          .text-gray-400 { color: #9ca3af; }
          
          .flex-wrap { flex-wrap: wrap; }
          .gap-2 { gap: 6px; }
          
          .px-2 { padding-left: 6px; padding-right: 6px; }
          .py-1 { padding-top: 3px; padding-bottom: 3px; }
          .rounded-md { border-radius: 4px; }
          .border-gray-300 { border-color: #d1d5db; }
          .text-gray-700 { color: #374151; }
          
          .text-red-600 { color: #dc2626; }
          .border-red-500 { border-color: #ef4444; }
          
          .border-t { border-top: 1px solid #ddd; }
          .my-2 { margin-top: 6px; margin-bottom: 6px; }
          
          .text-gray-500 { color: #6b7280; }
          .mb-1 { margin-bottom: 3px; }
          
          .text-center { text-align: center; }
          .mt-4 { margin-top: 10px; }
          .bg-gray-50 { background-color: #f9fafb; }
          .whitespace-pre-line { white-space: pre-line; }
          
          b { font-weight: 700; }
          
          .page-1 { page-break-after: always; }
          .page-2 { page-break-before: always; }
          
          .comment-section {
            margin-top: 0;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background: #f9fafb;
            font-size: 12px;
            line-height: 1.8;
          }
          
          .comment-title {
            font-weight: 700;
            margin-bottom: 10px;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 6px;
          }
        </style>
      `;

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          ${styles}
        </head>
        <body>
          <div class="page-1" style="page-break-after: always;">
            ${el.innerHTML.replace(/<div[\s\S]*?dangerouslySetInnerHTML[\s\S]*?<\/div>/, '')}
          </div>
          
          <div class="page-2" style="page-break-before: always;">
            <div class="comment-section">
              <div class="comment-title">💭 전문가 코멘트</div>
              ${commentHTML}
            </div>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();

      setTimeout(() => {
        printWindow.print();
      }, 1000);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto p-6 bg-white text-sm leading-relaxed print:p-0">
      <div id="result" className="max-w-[800px] mx-auto p-6 bg-white text-sm leading-relaxed print:p-0">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <img src="/logo.png" className="h-10" />
          <div className="font-bold text-lg">
            {data.name || "고객"}님 평가 리포트
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <Card title="👤 고객 정보">
            <InfoBlock label="재활 목적" items={data.reason} />
            <InfoBlock label="불편" items={data.discomfort} />
            <InfoBlock label="목표" items={data.goal} />
            <InfoBlock label="아픈 부위" items={data.body} />
          </Card>

          <Card title="🧍 신체 상태 요약">
            <div className="mb-2 text-xs text-gray-400">자세</div>
            <div className="flex flex-wrap gap-2 mb-2">
              <Tag type="posture" label="목" value={getPostureValue(posture.neck, posture.neckEtc)} />
              <Tag type="posture" label="어깨" value={getPostureValue(posture.shoulder, posture.shoulderEtc)} />
              <Tag type="posture" label="골반" value={getPostureValue(posture.pelvis, posture.pelvisEtc)} />
              <Tag type="posture" label="무릎" value={getPostureValue(posture.knee, posture.kneeEtc)} />
              <Tag type="posture" label="발목" value={getPostureValue(posture.ankle, posture.ankleEtc)} />
            </div>

            <div className="border-t my-2"></div>

            <div className="mb-2 text-xs text-gray-400">기능</div>
            <div className="flex flex-wrap gap-2">
              <Tag type="function" label="움직임" value={getRomValue()} />
              <Tag type="function" label="낙상 위험" value={safeVal(e.fallRisk)} />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <Card title="⚙ 기능 평가 (신경계)">
            {Object.entries(func.neuro || {}).map(([k, v]: any) => (
              <Row key={k} label={labelMap[k]} value={safeVal(v)} />
            ))}
          </Card>

          <Card title="⚙ 기능 평가 (근골격)">
            {Object.entries(func.ortho || {}).map(([k, v]: any) => (
              <Row key={k} label={labelMap[k]} value={safeVal(v)} />
            ))}
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-3">
          <Card title="⚡ 신경">
            <Row label="상태" value={safeVal(e.neuro)} />
          </Card>

          <Card title="💪 근력">
            <Row label="수준" value={getStrengthValue()} />
          </Card>

          <Card title="🔥 통증">
            <div className="text-center font-bold text-lg">
              {e.pain?.level ?? 0} / 10
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card title="✅ 강점">
            {a.strength.map((v, i) => <Bullet key={i} text={v} />)}
          </Card>

          <Card title="⚠ 개선 필요">
            {a.improve.map((v, i) => <Bullet key={i} text={v} />)}
          </Card>

          <Card title="🚨 방치 시 문제">
            {a.risk.map((v, i) => <Bullet key={i} text={v} />)}
          </Card>

          <Card title="💡 추천 운동">
            {a.exercise.map((v, i) => <Bullet key={i} text={v} />)}
          </Card>
        </div>

        <div
          className="mt-4 p-3 border rounded-xl bg-gray-50 text-[13px] leading-relaxed whitespace-pre-line"
          dangerouslySetInnerHTML={{
            __html: (() => {
              const pain = e.pain?.level ?? 0;
              const fall = e.fallRisk !== "없음";
              let text = `<b>${data.name || "고객"}님</b>의 현재 상태를 보면 `;
              const issues = [];
              if (pain >= 3) issues.push("통증");
              if (e.rom?.level !== "정상") issues.push("가동성");
              if (e.strength?.level !== "정상") issues.push("근력");
              if (fall) issues.push("균형");
              if (issues.length > 0) {
                text += `단순히 한 가지 문제가 아니라 <b>${issues.join(", ")}</b>이 서로 영향을 주면서 `;
                text += `움직임 자체가 무너진 상태에 가깝습니다.<br/><br/>`;
              } else {
                text += `전반적인 기능은 유지되고 있지만, 움직임을 사용하는 방식에서 비효율이 일부 나타나고 있습니다.<br/><br/>`;
              }
              text += `이런 상태는 보통 통증 자체보다 `;
              text += `<b>몸을 쓰는 방식과 패턴의 문제</b>에서 시작되는 경우가 많습니다.<br/><br/>`;
              if (pain >= 5 || fall) {
                text += `그래서 지금처럼 불편함이 반복되고 있는 것이고, `;
                text += `이 상태를 그대로 두면 같은 패턴이 계속 이어질 가능성이 높습니다.<br/><br/>`;
              } else {
                text += `지금 단계에서는 방향만 제대로 잡아주면 `;
                text += `충분히 빠르게 변화가 나타날 수 있는 상태입니다.<br/><br/>`;
              }
              text += `결국 중요한 건 단순히 운동량을 늘리는 것이 아니라 `;
              text += `<b>현재 상태에 맞게 움직임을 다시 정리하는 것</b>입니다.<br/><br/>`;
              text += `그래서 지금 단계에서는 `;
              text += `<b>일반적인 운동이 아니라, ${data.name || "고객"}님 상태에 맞춘 맞춤형 재활 접근</b>이 필요합니다.<br/><br/>`;
              text += `이 과정을 제대로 진행하면 `;
              text += `통증 감소뿐 아니라 움직임 자체가 훨씬 편해지는 변화를 느끼게 될 가능성이 높습니다.`;
              return text;
            })()
          }}
        />
      </div>

      <button
        onClick={handleShare}
        className="mt-6 w-full bg-yellow-400 py-3 rounded-xl font-semibold hover:bg-yellow-500 transition"
      >
        공유
      </button>

      <button
        onClick={handleDownload}
        className="mt-3 w-full bg-blue-400 py-3 rounded-xl font-semibold hover:bg-blue-500 transition"
      >
        다운로드
      </button>

      <button
        onClick={handlePrint}
        className="mt-3 w-full bg-gray-400 py-3 rounded-xl font-semibold hover:bg-gray-500 transition"
      >
        인쇄
      </button>
    </div>
  );
}

function Card({ title, children }: any) {
  return (
    <div className="p-3 border rounded-xl">
      <div className="font-semibold mb-2">{title}</div>
      {children}
    </div>
  );
}

function Row({ label, value }: any) {
  return (
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-500">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Bullet({ text }: any) {
  return <div>✔ {text}</div>;
}

function InfoBlock({ label, items }: any) {
  if (!items) return null;

  const list = Array.isArray(items) ? items : [items];

  return (
    <div className="mb-3">
      <div className="text-gray-400 text-xs mb-1">{label}</div>
      <div className="flex flex-wrap gap-2">
        {list.map((item: string, i: number) => (
          <span
            key={i}
            className="px-2 py-1 text-xs rounded-md border border-gray-300 text-gray-700"
          >
            {item.replace(/[^\w\s가-힣]/g, "")}
          </span>
        ))}
      </div>
    </div>
  );
}

function Tag({ type, label, value }: any) {
  const isNormal = value === "정상";

  return (
    <div
      className={`
        px-2 py-1 text-xs rounded-md border
        ${isNormal 
          ? "border-gray-300 text-gray-700" 
          : "border-red-500 text-red-600 font-semibold"}
      `}
    >
      <b>{label}</b> {value}
    </div>
  );
}
