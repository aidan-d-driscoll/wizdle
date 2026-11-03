import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
 
export const dynamic = "force-dynamic";
 
// GET /api/skills/:id  -> one skill
export async function GET(request, { params }) {
  try {
    const { id } = await params; // the [id] part of the URL
 
    // MongoDB ids are ObjectId objects, so validate before converting
    if (!ObjectId.isValid(id)) {
      return Response.json({ error: "Invalid id" }, { status: 400 });
    }
 
    const client = await clientPromise;
    const skill = await client
      .db("wizdle")
      .collection("skills")
      .findOne({ _id: new ObjectId(id) });
 
    if (!skill) {
      return Response.json({ error: "skill not found" }, { status: 404 });
    }
    return Response.json(skill);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to fetch skill" }, { status: 500 });
  }
}
 
// DELETE /api/skills/:id  -> delete one skill
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
 
    if (!ObjectId.isValid(id)) {
      return Response.json({ error: "Invalid id" }, { status: 400 });
    }
 
    const client = await clientPromise;
    const result = await client
      .db("wizdle")
      .collection("skills")
      .deleteOne({ _id: new ObjectId(id) });
 
    if (result.deletedCount === 0) {
      return Response.json({ error: "skill not found" }, { status: 404 });
    }
    return Response.json({ deleted: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
