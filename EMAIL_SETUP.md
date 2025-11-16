# Email Configuration Setup Guide

## Overview
The Event Registration System sends real confirmation emails to your inbox for both attendees and business registrations. This guide explains how to set up Gmail credentials.

## Step-by-Step Setup

### Option 1: Gmail Account WITHOUT 2FA Enabled

1. Create or use your existing Gmail account
2. Create a `.env.local` file in the project root (if it doesn't exist)
3. Add these lines:
   ```
   GMAIL_USER=your-email@gmail.com
   GMAIL_PASSWORD=your-gmail-password
   ```
4. Replace with your actual Gmail email and password
5. Restart the development server

### Option 2: Gmail Account WITH 2FA Enabled (Recommended)

**This is the secure approach. Follow these steps:**

1. Go to https://myaccount.google.com/apppasswords
2. Sign in to your Google Account (if prompted)
3. Select app: Choose **Mail**
4. Select device: Choose **Windows Computer** (or your device type)
5. Google will generate a **16-character password**
6. Copy this password (it will have spaces - keep them or remove, both work)
7. Create a `.env.local` file in the project root
8. Add these lines:
   ```
   GMAIL_USER=your-email@gmail.com
   GMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   ```
9. Replace `your-email@gmail.com` with your Gmail address
10. Paste the 16-character password (you can remove spaces if you prefer)
11. Restart the development server

## Verification

After setup, test the email functionality:

1. Go to http://localhost:3333
2. You'll see a yellow alert box with setup instructions (this confirms the feature is active)
3. Select "Individual Attendee" or "Business Vendor"
4. Fill in the form with **your test email address**
5. Click "Complete Registration"
6. Check your inbox for the confirmation email

The email should arrive within 1-2 minutes.

## Email Templates

### Attendee Email
Recipients receive:
- Personalized event ticket
- Registration ID (for check-in)
- Full registration details
- Contact information

### Business Email
Recipients receive:
- Business registration confirmation
- Stall allocation details (for future setup)
- Setup guidelines and timeline
- Vendor policies and requirements
- Important instructions for participation

## Troubleshooting

### Email not arriving

1. **Check environment variables:**
   - Make sure `.env.local` is in the project root (not in any subdirectories)
   - Verify variable names are exactly: `GMAIL_USER` and `GMAIL_PASSWORD`
   - Check there are no extra spaces or quotes

2. **Gmail account issues:**
   - If using 2FA, ensure you're using an App Password, not your regular password
   - If not using 2FA, ensure your account allows "Less secure app access"
   - Try creating a new App Password from https://myaccount.google.com/apppasswords

3. **Server logs:**
   - Check the development server console for error messages
   - Look for "Email sending error" messages with details

4. **Spam folder:**
   - Check your Spam or Promotions folder
   - Some Gmail accounts may filter automated emails

### Dashboard shows "pending" or "failed" status

- Check server console for error messages
- Verify environment variables are set correctly
- Ensure the recipient email address is valid
- Try clicking "Resend" button to retry

## Email Content Customization

To customize email templates, edit `/app/project/app/api/send-email/route.ts`:

- Lines 51-100: Attendee email template (HTML)
- Lines 101-180: Business email template (HTML)

## Security Notes

- Gmail credentials are stored ONLY in `.env.local` (never committed to git)
- The `.env.local` file is already in `.gitignore`
- API calls to send emails are made server-side only
- User email addresses are only used for sending, never stored elsewhere

## Disable Email Sending

If you want to disable email sending temporarily:

1. Remove or comment out the lines in `.env.local`
2. The system will show an error in the console but won't crash
3. The "Setup Instructions" alert will still display

## Support

If you encounter issues:
1. Check the server console for detailed error messages
2. Verify your Gmail account settings
3. Ensure `.env.local` is in the correct location and format
4. Try creating a new App Password
