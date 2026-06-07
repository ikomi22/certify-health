import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

type Profile = { full_name: string; email: string }
type Competency = { title: string }

export async function sendOverdueReminder(
  profile: Profile,
  overdueCompetencies: Competency[],
  facilityName: string
) {
  if (!resend) {
    console.log("RESEND_API_KEY not set — skipping email send")
    return
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  const count = overdueCompetencies.length
  const subject = `Action required: ${count} competenc${count === 1 ? "y" : "ies"} overdue`

  const listItems = overdueCompetencies
    .map((c) => `<li style="margin-bottom:8px;">${c.title}</li>`)
    .join("")

  // In demo/dev, redirect all emails to a single inbox so fictional addresses don't swallow them
  const to = process.env.DEMO_EMAIL_OVERRIDE ?? profile.email

  await resend.emails.send({
    from: "Certify Health <onboarding@resend.dev>",
    to,
    subject,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#111;">
        <div style="background:#052e16;padding:20px 24px;border-radius:12px 12px 0 0;">
          <h1 style="color:#fff;font-size:18px;margin:0;">Certify Health</h1>
          <p style="color:#4ade80;font-size:13px;margin:4px 0 0;">${facilityName}</p>
        </div>
        <div style="background:#f9fafb;padding:24px;border-radius:0 0 12px 12px;">
          <p style="margin:0 0 16px;">Hi ${profile.full_name},</p>
          <p style="margin:0 0 16px;">
            The following competenc${count === 1 ? "y" : "ies"} ${count === 1 ? "is" : "are"} overdue and need to be renewed:
          </p>
          <ul style="margin:0 0 24px;padding-left:20px;">${listItems}</ul>
          <a href="${appUrl}/dashboard"
             style="display:inline-block;background:#16a34a;color:#fff;font-weight:600;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;">
            Go to dashboard
          </a>
          <p style="margin:24px 0 0;font-size:12px;color:#6b7280;">
            ${facilityName} · Certify Health
          </p>
        </div>
      </div>
    `,
  })
}
