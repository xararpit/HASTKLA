import nodemailer from 'nodemailer'

let transporter = null

const getTransporter = () => {
  if (transporter) return transporter

  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD

  if (!user || !pass) {
    console.warn('⚠️  Gmail credentials not configured — OTP emails disabled')
    return null
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })

  return transporter
}

export const sendOtpEmail = async (to, otp) => {
  const t = getTransporter()
  if (!t) throw new Error('Email service not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD in .env')

  await t.sendMail({
    from:    `"HASTKLA" <${process.env.GMAIL_USER}>`,
    to,
    subject: `🔐 Your HASTKLA Login OTP: ${otp}`,
    html: `
      <div style="font-family:'Nunito',Arial,sans-serif;max-width:450px;margin:0 auto;padding:2rem;background:#faf8f5;border-radius:16px">
        <div style="text-align:center;margin-bottom:1.5rem">
          <h1 style="font-family:'Cormorant Garamond',serif;font-size:2rem;margin:0;color:#1a1613">
            HAST<span style="color:#C4622D">KLA</span>
          </h1>
          <p style="color:#8a8478;font-size:0.85rem;margin-top:0.3rem">Indian Artisan Marketplace</p>
        </div>
        <div style="background:#fff;border:1px solid #e8e4dd;border-radius:12px;padding:1.5rem;text-align:center">
          <p style="color:#1a1613;font-size:0.95rem;margin-bottom:1rem">Your one-time verification code is:</p>
          <div style="font-size:2.5rem;font-weight:700;letter-spacing:0.4em;color:#C4622D;padding:0.8rem;background:#faf3ee;border-radius:10px;margin-bottom:1rem">
            ${otp}
          </div>
          <p style="color:#8a8478;font-size:0.78rem;line-height:1.6">
            This code expires in <strong>5 minutes</strong>.<br>
            If you did not request this, please ignore this email.
          </p>
        </div>
        <p style="text-align:center;color:#b5b0a7;font-size:0.7rem;margin-top:1.2rem">
          © HASTKLA · Handmade with ❤️ in India
        </p>
      </div>
    `,
  })
}

export default getTransporter
