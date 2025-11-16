import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recipientEmail, registrationType, registrationData } = body

    if (!recipientEmail || !registrationType || !registrationData) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: recipientEmail, registrationType, and registrationData',
        },
        { status: 400 }
      )
    }

    // Get Gmail credentials from environment variables
    const gmailUser = process.env.GMAIL_USER
    const gmailPassword = process.env.GMAIL_PASSWORD

    if (!gmailUser || !gmailPassword) {
      return NextResponse.json(
        {
          success: false,
          error: 'Gmail credentials not configured in .env.local',
        },
        { status: 500 }
      )
    }

    // Create transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPassword,
      },
    })

    // Generate email content based on registration type
    let emailSubject = ''
    let emailHtml = ''

    if (registrationType === 'attendee') {
      emailSubject = `Your Event Ticket - Registration #${registrationData.registrationId}`
      emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
              .content { background-color: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0; }
              .ticket-box { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb; }
              .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
              .detail-label { font-weight: bold; color: #475569; }
              .detail-value { color: #1e293b; }
              .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Event Registration Confirmed</h1>
                <p>Your personalized ticket is ready</p>
              </div>
              <div class="content">
                <p>Hi <strong>${registrationData.fullName}</strong>,</p>
                <p>Thank you for registering for our event! Your registration has been successfully processed.</p>

                <div class="ticket-box">
                  <h2 style="color: #2563eb; margin-top: 0;">Your Event Ticket</h2>
                  <div class="detail-row">
                    <span class="detail-label">Registration ID:</span>
                    <span class="detail-value">${registrationData.registrationId}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Attendee Name:</span>
                    <span class="detail-value">${registrationData.fullName}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${registrationData.email}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Contact Number:</span>
                    <span class="detail-value">${registrationData.contactNumber}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Emergency Contact:</span>
                    <span class="detail-value">${registrationData.emergencyContact}</span>
                  </div>
                </div>

                <p style="background-color: #dbeafe; padding: 15px; border-radius: 6px; border-left: 4px solid #2563eb;">
                  <strong>Important:</strong> Please save this registration ID as it may be required for event check-in and any future correspondence about the event.
                </p>

                <p>If you have any questions or need to update your registration details, please don't hesitate to contact us.</p>

                <p>We look forward to seeing you at the event!</p>

                <div class="footer">
                  <p>This is an automated message. Please do not reply to this email.</p>
                  <p>Event Registration System &copy; 2025</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `
    } else if (registrationType === 'business') {
      emailSubject = `Business Registration Confirmed - Stall Information & Guidelines #${registrationData.registrationId}`
      emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #7c3aed; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
              .content { background-color: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0; }
              .info-box { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7c3aed; }
              .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
              .detail-label { font-weight: bold; color: #475569; }
              .detail-value { color: #1e293b; }
              .section-title { color: #7c3aed; font-weight: bold; font-size: 16px; margin-top: 20px; margin-bottom: 10px; }
              .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Business Registration Confirmed</h1>
                <p>Welcome as an Event Vendor</p>
              </div>
              <div class="content">
                <p>Hi <strong>${registrationData.contactPerson}</strong>,</p>
                <p>Thank you for registering your business for our event! We're excited to have <strong>${registrationData.businessName}</strong> as a vendor.</p>

                <div class="info-box">
                  <h2 style="color: #7c3aed; margin-top: 0;">Business Registration Details</h2>
                  <div class="detail-row">
                    <span class="detail-label">Registration ID:</span>
                    <span class="detail-value">${registrationData.registrationId}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Business Name:</span>
                    <span class="detail-value">${registrationData.businessName}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Contact Person:</span>
                    <span class="detail-value">${registrationData.contactPerson}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${registrationData.email}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value">${registrationData.phone}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Business Category:</span>
                    <span class="detail-value">${registrationData.businessCategory}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Expected Staff Count:</span>
                    <span class="detail-value">${registrationData.staffCount}</span>
                  </div>
                </div>

                <div class="section-title">Next Steps</div>
                <p>Please follow these steps to prepare for the event:</p>
                <ol>
                  <li><strong>Confirm Your Participation:</strong> Reply to this email to confirm your attendance.</li>
                  <li><strong>Setup Guidelines:</strong> Stall setup will begin on the day of the event. Please arrive 30 minutes early for optimal setup time.</li>
                  <li><strong>Documentation:</strong> Keep your Registration ID handy for event check-in and reference.</li>
                  <li><strong>Contact Information:</strong> Save our event coordinator details for any urgent queries.</li>
                </ol>

                <div class="section-title">Stall Information</div>
                <p>Detailed stall allocation and dimensions will be sent separately. Please ensure you have:</p>
                <ul>
                  <li>All required business licenses and documentation</li>
                  <li>Insurance coverage if applicable</li>
                  <li>Product samples or promotional materials ready</li>
                  <li>Staff trained on event procedures</li>
                </ul>

                <p style="background-color: #dbeafe; padding: 15px; border-radius: 6px; border-left: 4px solid #7c3aed;">
                  <strong>Important:</strong> If you have any questions or need to make changes to your registration, please contact us as soon as possible using your Registration ID: <strong>${registrationData.registrationId}</strong>
                </p>

                <p>We look forward to your participation and making this event a great success!</p>

                <div class="footer">
                  <p>This is an automated message. Please do not reply to this email for support.</p>
                  <p>Event Registration System &copy; 2025</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `
    }

    // Send email
    const mailOptions = {
      from: gmailUser,
      to: recipientEmail,
      subject: emailSubject,
      html: emailHtml,
    }

    const info = await transporter.sendMail(mailOptions)

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId,
      recipientEmail,
    })
  } catch (error) {
    console.error('Email sending error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
