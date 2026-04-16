import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

type Question = {
  questions: string[];
  explanation: string;
  pattern: string;
  type: string;
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

    // basic validation
    for (const item of body) {
      if (!item.questions || !item.explanation || !item.pattern || !item.type) {
        return NextResponse.json(
          { error: "Invalid question format" },
          { status: 400 },
        );
      }
    }

    const result = await db.collection("english").insertMany(body);

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
