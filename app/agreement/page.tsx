import Link from "next/link";
export default function AgreementPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#F5F7FA",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          background: "white",
          padding: "40px",
          borderRadius: "20px",
        }}
      >
        <h1>평가 시작 전 확인사항</h1>

        <p>
          본 평가는 고객님의 현재 상태를 파악하기 위한 기초 문진입니다.
        </p>

        <br />

        <p>
          입력하신 개인정보는 평가 및 상담 목적으로만 사용됩니다.
        </p>

        <br />

        <label>
          <input type="checkbox" /> 위 내용을 확인했습니다.
        </label>

        <br />
        <br />

        <Link href="/questionnaire/consent">
  <button
    style={{
      width: "100%",
      height: "56px",
      background: "#0057B8",
      color: "white",
      border: "none",
      borderRadius: "14px",
      fontSize: "18px",
      cursor: "pointer",
    }}
  >
    다음
  </button>
</Link>
      </div>
    </main>
  );
}