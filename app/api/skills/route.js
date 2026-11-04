import clientPromise from "@/lib/mongodb";
 
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
    const cooldown = body.cooldown;
    const on_activate = body.on_activate;
 
    // Store only the fields we expect, never the raw request body
    const doc = { cooldown, on_activate, createdAt: new Date() };
 
    const client = await clientPromise;
    const result = await client.db("wizdle").collection("skills").insertOne(doc);
 
    return Response.json({ _id: result.insertedId, ...doc }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to create skill" }, { status: 500 });
  }
}
