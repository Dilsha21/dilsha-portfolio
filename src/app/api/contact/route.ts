import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("messages")
      .insert({ name, email, message });

    if (error) throw error;

    if (RESEND_API_KEY && CONTACT_EMAIL) {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "onboarding@resend.dev",
          to: CONTACT_EMAIL,
          subject: `New contact request from ${name}`,
          html: `
            <h1>New Contact Request</h1>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, "<br />")}</p>
          `,
        }),
      });

      if (!emailResponse.ok) {
        const text = await emailResponse.text();
        console.error("Resend email error:", emailResponse.status, text);
        return NextResponse.json({ error: "Could not send notification email" }, { status: 500 });
      }
    } else {
      console.warn("Resend email not sent: missing RESEND_API_KEY or CONTACT_EMAIL");
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
