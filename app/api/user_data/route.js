import client from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const id = req.nextUrl.searchParams.get("pn");
    const database = client.db(id);
    const collection = database.collection("My-Inventory");
    const inventory = await collection.find({}).toArray();
    return NextResponse.json({ inventory: inventory });
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
    const id = req.nextUrl.searchParams.get("pn");
    const document = await req.json();
    const database = client.db(id);
    const collection = database.collection("My-Inventory");
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

export async function PUT(req) {
  try {
    const id = req.nextUrl.searchParams.get("pn");
    const document = await req.json();
    const database = client.db(id);
    const collection = database.collection("My-Inventory");
    if (document.task === 0)
    {
      await collection.updateOne(
        { reqId: document.reqId },
        {
          $set: {
            status: document.status,
          },
        }
      );
    }
    else if (document.task === 1)
    {
      await collection.updateOne(
        { reqId: document.reqId },
        {
          $set: {
            returned: true,
          },
        }
      );
    }
    return NextResponse.json({ Result: "Success" });
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
