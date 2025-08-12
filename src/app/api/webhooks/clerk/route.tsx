import { prisma } from "@/prisma";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data;
    const eventType = evt.type;
    console.log(
      `Received webhook with ID ${id} and event type of ${eventType}`
    );
    console.log("Webhook payload:", evt.data);

    if (eventType === "user.created") {
      try {

        const existingUser = await prisma.user.findUnique({
            where: { email: evt.data.email_addresses[0].email_address },
        });

        if(existingUser) {
            return new Response("User already exists, treated as sign-in", { status: 200 });
        }
        await prisma.user.create({
          data: {
            id: evt.data.id,
            username: evt.data.username || "null",
            email: evt.data.email_addresses[0].email_address,
            img: evt.data.image_url || null,
          },
        });
        return new Response("User created", { status: 200 });
      } catch (err) {
        console.log(err);
        return new Response("Error: Failed to create a user!", {
          status: 500,
        });
      }
    }
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
