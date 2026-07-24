import Link from "next/link";
export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#F5F7FA",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "white",
          borderRadius: "20px",
          padding: "40px 30px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <img
          src="/logo.png"
          alt="연세재활운동센터"
          style={{
            width: "90px",
            marginBottom: "20px",
          }}
        />

        <h1
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#003366",
            marginBottom: "10px",
          }}
        >
          연세재활운동센터
        </h1>

        <p
          style={{
            color: "#666",
            marginBottom: "40px",
            lineHeight: 1.6,
          }}
        >
          평가를 시작합니다.
          <br />
          아래 버튼을 눌러 진행해주세요.
        </p>

        <Link href="/agreement">
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
    시작하기
  </button>
</Link>
      </div>
    </main>
  );
}