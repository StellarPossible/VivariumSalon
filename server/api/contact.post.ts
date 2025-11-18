import { sendContactEmail } from "~/server/utils/email"

export default defineEventHandler(async (event) => {
  const body = await readBody<{ name?: string; email?: string; subject?: string; message?: string }>(event)

  const name = (body.name || '').trim()
  const email = (body.email || '').trim()
  const subject = (body.subject || '').trim()
  const message = (body.message || '').trim()

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!name || !emailRegex.test(email) || !message) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid form data' })
  }

  // Send via email provider (Resend) or simulate if not configured
  await sendContactEmail({ name, email, subject, message })

  return { success: true }
})
