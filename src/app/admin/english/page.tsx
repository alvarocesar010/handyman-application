import QuizQuestion, { Question } from "./QuizQuestion";
import Link from "next/link";
import { getDb } from "@/lib/mongodb";

async function getQuestions(): Promise<Question[]> {
  const db = await getDb();

  const questions = await db
    .collection<Question>("english")
    .aggregate([
      { $sample: { size: 10 } }, // ✅ only this
    ])
    .toArray();

  return questions.map((q) => ({
    questions: q.questions,
    explanation: q.explanation,
    pattern: q.pattern,
    type: q.type,
    _id: q._id?.toString(),
  }));
}

export default async function Page() {
  const questions = await getQuestions();

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <div>
        <Link
          className="rounded-full bg-amber-200 p-2"
          href="/admin/english/add-questions"
        >
          Add questions
        </Link>
      </div>

      {questions.length > 0 ? (
        <QuizQuestion data={questions} />
      ) : (
        <p>No questions found</p>
      )}
    </div>
  );
}
