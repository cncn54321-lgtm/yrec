import QuestionCard from "../../components/QuestionCard";
import { questions } from "../../data/questions";

export default function QuestionnairePage() {
  const firstQuestion = questions[0];

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
      <QuestionCard
        title={firstQuestion.title}
        options={firstQuestion.options}
      />
    </main>
  );
}