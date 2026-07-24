type Props = {
  title: string;
  options: string[];
};

export default function QuestionCard({
  title,
  options,
}: Props) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "600px",
        background: "white",
        borderRadius: "20px",
        padding: "40px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      }}
    >
      <h2
        style={{
          marginBottom: "30px",
          color: "#003366",
        }}
      >
        {title}
      </h2>

      {options.map((option) => (
        <button
          key={option}
          style={{
            width: "100%",
            height: "56px",
            marginBottom: "15px",
            borderRadius: "12px",
            border: "1px solid #ddd",
            background: "white",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
}