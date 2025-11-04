import client from "@/lib/mongo";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const database = client.db("SuperAdminData");
    const collection = database.collection("Admins");
    const admins = await collection.find({}).toArray();
    return NextResponse.json({ admins: admins });
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const database = client.db("SuperAdminData");
    const collection = database.collection("Admins");
    const document = await req.json();
    await collection.insertOne(document);

    return NextResponse.json({ Result: "Success" });
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const database = client.db("SuperAdminData");
    const collection = database.collection("Admins");
    const document = await req.json();
    await collection.deleteOne({
      _id: new ObjectId(document._id),
    });

    return NextResponse.json({ Result: "Success" });
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
