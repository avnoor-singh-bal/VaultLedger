import client from "@/lib/mongo";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const category = req.nextUrl.searchParams.get("pn");
    const database = client.db(category);
    const collection = database.collection("Inventory");
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
    const document = await req.json();
    const database = client.db(document.category);
    const collection = database.collection("Inventory");
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
    const document = await req.json();
    const database = client.db(document.category);
    const collection = database.collection("Inventory");
    if (document.task === 0) {
      const usageId = new ObjectId();
      await collection.updateOne(
        { _id: new ObjectId(document._id) },
        {
          $set: {
            inUse: document.quantity,
          },
          $push: {
            usedWhere: {
              _id: usageId,
              project: document.project,
              name: document.name,
              email: document.email,
              phone: document.phone,
              quantity: document.reqQuantity,
              reqId: document.reqId,
            },
          },
        }
      );
    } else if (document.task === 1) {
      await collection.updateOne(
        { _id: new ObjectId(document._id) },
        {
          $set: {
            component: document.component,
            inStock: document.inStock,
            link: document.link
          },
        }
      );
    } else if (document.task === 2) {
      await collection.updateOne(
        { _id: new ObjectId(document._id) },
        {
          $inc: {
            inUse: -document.quantity,
          },
          $pull: { usedWhere: { reqId: { $in: [document.reqId] } } },
        }
      );
    } else if (document.task === 3) {
      await collection.updateOne(
        {
          _id: new ObjectId(document._id),
          "usedWhere.reqId": document.reqId,
        },
        {
          $set: {
            "usedWhere.$.project": true,
            "usedWhere.$.projectName": document.project,
          },
        }
      );
    }

    return NextResponse.json({ Result: document._id }, { status: 200 });
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
    const document = await req.json();
    const database = client.db(document.category);
    const collection = database.collection("Inventory");
    // Deleting Inventory
    await collection.deleteOne({ _id: new ObjectId(document._id) });
    return NextResponse.json({ Result: "Success" });
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
