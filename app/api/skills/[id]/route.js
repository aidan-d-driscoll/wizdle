import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { toBinaryId } from "@/lib/api_functions/utils";
 
export const dynamic = "force-dynamic";
 
export async function GET(request, { params }) {
  try {
    const { id } = await params; 
    const _id = toBinaryId(id);
 
    const client = await clientPromise;
    const skill = await client
      .db("wizdle")
      .collection("skills")
      .findOne({ _id });
 
    if (!skill) {
      return Response.json({ error: "skill not found" }, { status: 404 });
    }
    return Response.json(skill);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to fetch skill" }, { status: 500 });
  }
}
 
export async function DELETE(request, { params }) {
  try {
    const { id } = await params; 
    const _id = toBinaryId(id);
 
    const client = await clientPromise;
    const result = await client
      .db("wizdle")
      .collection("skills")
      .deleteOne({ _id });
 
    if (result.deletedCount === 0) {
      return Response.json({ error: "skill not found" }, { status: 404 });
    }
    return Response.json({ deleted: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
