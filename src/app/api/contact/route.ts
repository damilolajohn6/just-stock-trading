import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, type, details } = body;

    // Validate
    if (!name || !email || !details) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Since we don't have SMTP credentials set up yet, we will log the inquiry
    // and mock a successful email send so the frontend works.
    // To actually send emails, configure the transporter below with real SMTP details:
    /*
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: "info@juststocktrading.com", 
      subject: `New Inquiry from ${name} - Just Stock Trading`,
      text: `
        Name: ${name}
        Email: ${email}
        Type/Weight: ${type || 'General Inquiry'}
        
        Details:
        ${details}
      `,
    });
    */

    console.log("========== NEW INQUIRY RECEIVED ==========");
    console.log(`Name:    ${name}`);
    console.log(`Email:   ${email}`);
    console.log(`Type:    ${type || "General Inquiry"}`);
    console.log(`Details: ${details}`);
    console.log("==========================================");

    // Return success
    return NextResponse.json(
      { message: "Inquiry received successfully!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing inquiry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
