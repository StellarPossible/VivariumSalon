# Email Configuration Setup

The booking form currently logs requests to the console. To enable actual email sending, you need to:

## Option 1: Using Nodemailer with SMTP

1. Install nodemailer:
```bash
npm install nodemailer
```

2. Create a `.env` file in the root directory:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@vivariumsalon.com
```

3. Uncomment the nodemailer code in `server/api/booking.post.ts`

## Option 2: Using Resend (Recommended)

1. Sign up at https://resend.com
2. Install resend:
```bash
npm install resend
```

3. Add to `.env`:
```env
RESEND_API_KEY=your-api-key
```

4. Update the booking endpoint to use Resend

## Option 3: Using SendGrid

1. Sign up at https://sendgrid.com
2. Install @sendgrid/mail:
```bash
npm install @sendgrid/mail
```

3. Add to `.env`:
```env
SENDGRID_API_KEY=your-api-key
```

## Gmail Setup (If using Gmail SMTP)

If using Gmail, you need to:
1. Enable 2-factor authentication on your Google account
2. Generate an App Password (not your regular password)
3. Use that App Password in the SMTP_PASS variable

## Testing

The current implementation will log booking requests to the server console. Check your terminal/logs to see the booking data.
