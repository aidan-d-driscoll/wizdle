import clientPromise from "@/lib/mongodb";
import { toBinaryId } from "@/lib/api_functions/utils";

// Always run this on each request instead of caching the result at build time
export const dynamic = "force-dynamic";
 
// GET /api/skills  -> list all skills, newest first
export async function GET() {
  try {
    const client = await clientPromise;
    const skills = await client
      .db("wizdle")
      .collection("skills")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
 
    return Response.json(skills);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}
 
// POST /api/skills  with JSON body { "cooldown":1, ... } -> create a skill
export async function POST(request) {
  try {
    // The body arrives as a stream; .json() reads it and parses it
    const body = await request.json();
    const { id } = body;

    if (!id){
      return NextResponse.json({ error: "Missing required ID" }, { status: 400 });
    }

    const { _id, ...fields } = {
      _id: toBinaryId(id),
      createdAt: new Date(),
      // Add more fields here if needed, UserID...
    };
 
    const client = await clientPromise;
    const result = await client.db("wizdle").collection("skills").findOneAndUpdate(
      { _id },
      { $setOnInsert: fields },
      { upsert: true, returnDocument: "after", includeResultMetadata: true }
    )
 
    return Response.json({ _id: result.insertedId, ...fields }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to create skill" }, { status: 500 });
  }
}
