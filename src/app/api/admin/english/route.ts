import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

type Question = {
  questions: string[];
  explanation: string;
  type: string;
  correctIndex: number;
};

// ✅ GET → fetch all questions
export async function GET() {
  try {
    const db = await getDb();

    const questions = await db
      .collection<Question>("english")
      .find({})
      .toArray();

    return NextResponse.json(questions);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 },
    );
  }
}

// ✅ POST → insert questions (array)
export async function POST(req: Request) {
  try {
    const db = await getDb();

    const body = await req.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Body must be an array of questions" },
        { status: 400 },
      );
    }

    const cleaned: Question[] = [];

    for (const item of body) {
      // ✅ validation
      if (
        !Array.isArray(item.questions) ||
        item.questions.length < 2 ||
        typeof item.explanation !== "string" ||
        typeof item.type !== "string" ||
        typeof item.correctIndex !== "number"
      ) {
        return NextResponse.json(
          { error: "Invalid question format" },
          { status: 400 },
        );
      }

      // ✅ validate correctIndex range
      if (item.correctIndex < 0 || item.correctIndex >= item.questions.length) {
        return NextResponse.json(
          { error: "correctIndex out of range" },
          { status: 400 },
        );
      }

      cleaned.push({
        questions: item.questions,
        explanation: item.explanation,
        type: item.type,
        correctIndex: item.correctIndex,
      });
    }

    const result = await db.collection<Question>("english").insertMany(cleaned);

    return NextResponse.json({
      insertedCount: result.insertedCount,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to save questions" },
      { status: 500 },
    );
  }
}
