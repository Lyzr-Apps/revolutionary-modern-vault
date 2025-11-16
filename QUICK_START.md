# Event Registration System - Quick Start Guide

## What's Built

A complete event registration system that sends **real confirmation emails** to your inbox:

- **Attendee Registration**: Personal event tickets with registration ID
- **Business Registration**: Complete business participation packages with stall details
- **Admin Dashboard**: View all registrations, email statuses, and resend emails
- **Real Email Delivery**: Uses Gmail to send personalized emails

## How to Enable Email Sending

### 1. Open `.env.local` file
The file is already created in the project root at `/app/project/.env.local`

### 2. For Gmail WITHOUT 2FA
Add these two lines:
```
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=your-password
```

### 3. For Gmail WITH 2FA (Recommended)
1. Go to https://myaccount.google.com/apppasswords
2. Sign in to your Google Account
3. Select "Mail" as the app
4. Select your device type (usually "Windows Computer")
5. Google will generate a 16-character password
6. Add to `.env.local`:
```
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

### 4. Restart the Development Server
```bash
npm run dev
```

## Test the System

1. Visit http://localhost:3333
2. You'll see a yellow alert with setup instructions (confirms the feature is ready)
3. Select **"Individual Attendee"** or **"Business Vendor"**
4. Fill the form with **your own email address** for testing
5. Click **"Complete Registration"**
6. Check your inbox for the confirmation email (1-2 minutes)

## What Happens When You Register

### If you register as an Attendee:
1. Form shows: Full Name, Email, Contact Number, Emergency Contact
2. Click "Complete Registration"
3. Agent processes your ticket
4. Confirmation email sent with:
   - Personalized ticket
   - Registration ID (required for check-in)
   - Your contact details

### If you register as a Business:
1. Form shows: Business Name, Contact Person, Email, Phone, Category, Staff Count
2. Click "Complete Registration"
3. Agent compiles business package
4. Confirmation email sent with:
   - Business registration details
   - Stall information and setup guidelines
   - Participation requirements
   - Next steps for setup

## Dashboard Features

Click "Dashboard" tab to see:
- **Statistics Cards**: Total registrations, attendees count, businesses count, email success rate
- **Registrations Table**: All registrations with email status badges
- **Resend Feature**: Manually resend failed emails
- **Sample Data**: Pre-loaded with 4 test registrations (2 attendees, 2 businesses)

Email status badges:
- Green "sent" = Email delivered successfully
- Yellow "pending" = Email being sent
- Red "failed" = Email delivery failed

## File Structure

```
/app/project/
├── app/
│   ├── page.tsx           ← Main registration page (all UI)
│   └── api/
│       ├── send-email/    ← Email sending API
│       └── agent/         ← AI agent integration
├── .env.local             ← Your Gmail credentials (CREATE THIS)
├── EMAIL_SETUP.md         ← Detailed setup guide
├── QUICK_START.md         ← This file
└── .env.local.example     ← Template for credentials
```

## Email Templates

### Attendee Email Design
- Professional blue color scheme
- Contains: Registration ID, Name, Email, Contact Number, Emergency Contact
- Important notice about saving Registration ID

### Business Email Design
- Professional purple color scheme
- Contains: Business details, staff count, category
- Includes: Setup guidelines, next steps, stall information
- Lists: Required documentation and business preparation tips

## Troubleshooting

### Email not arriving?

**Check 1: Environment Variables**
- Make sure `.env.local` is in project root
- Variable names must be: `GMAIL_USER` and `GMAIL_PASSWORD` (exact case)
- No extra spaces or quotes

**Check 2: Gmail Settings**
- Using 2FA? Use App Password, not regular password
- Not using 2FA? Check if account allows "Less secure app access"
- Try creating a new App Password

**Check 3: Server Console**
- Look for error messages in the terminal
- Search for "Email sending error"

**Check 4: Spam Folder**
- Check Spam or Promotions folders
- Automated emails may be filtered

### Dashboard shows "pending" or "failed"?
- Check server console for error messages
- Click "Resend" button to retry
- Verify recipient email is correct

### Server won't start?
- Check `.env.local` format (no quotes needed)
- Make sure file is in project root, not subdirectories
- Restart with `npm run dev`

## Features Included

- Form validation with real-time error messages
- Type-safe TypeScript implementation
- Responsive design for mobile/tablet/desktop
- Professional UI with shadcn/ui components
- Real email delivery via Gmail
- Agent integration for ticket/package generation
- Sample data pre-loaded in dashboard
- Email status tracking and resend capability
- Automatic form clearing on successful submission

## Environment Variables Reference

```bash
# Required for email sending
GMAIL_USER=your-email@gmail.com         # Your Gmail address
GMAIL_PASSWORD=your-16-char-password    # Gmail App Password (if 2FA) or password

# Optional - for AI agent features
LYZR_API_KEY=your-api-key              # Lyzr agent API key (already integrated)
```

## No Authentication Required

As specified:
- No sign-in required
- No OAuth flows needed (agent handles OAuth automatically)
- No user accounts necessary
- Direct registration without friction

## Next Steps

1. Add Gmail credentials to `.env.local`
2. Restart development server
3. Visit http://localhost:3333
4. Test with your own email address
5. Check inbox for confirmation emails

That's it! Your event registration system with real email delivery is ready to use.
