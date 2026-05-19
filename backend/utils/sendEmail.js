// utils/sendEmail.js — Gmail SMTP Email Sender
// Uses nodemailer with Google App Password
// Called by: applicationController, interviewController

const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS   // Google App Password, not real password
    }
  });

  const mailOptions = {
    from: `"ATS System" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  };

  await transporter.sendMail(mailOptions);
};

// ── Pre-built email templates ────────────────────────────────

const emailTemplates = {

  // Sent when application is shortlisted
  shortlisted: (candidateName, jobTitle) => ({
    subject: `Congratulations! You've been Shortlisted — ${jobTitle}`,
    html: `
      <h2>Congratulations, ${candidateName}!</h2>
      <p>We are pleased to inform you that your application for
      <strong>${jobTitle}</strong> has been shortlisted.</p>
      <p>Our HR team will contact you soon with further details.</p>
      <br/><p>Best regards,<br/>HR Team</p>
    `
  }),

  // Sent when interview is scheduled
  interviewScheduled: (candidateName, jobTitle, date, time, type, location, message) => ({
    subject: `Interview Scheduled — ${jobTitle}`,
    html: `
      <h2>Interview Invitation</h2>
      <p>Dear ${candidateName},</p>
      <p>Your interview for <strong>${jobTitle}</strong> has been scheduled.</p>
      <table border="0" cellpadding="8">
        <tr><td><strong>Date:</strong></td><td>${date}</td></tr>
        <tr><td><strong>Time:</strong></td><td>${time}</td></tr>
        <tr><td><strong>Type:</strong></td><td>${type}</td></tr>
        <tr><td><strong>Location/Link:</strong></td><td>${location}</td></tr>
      </table>
      ${message ? `<p><strong>Note from HR:</strong> ${message}</p>` : ''}
      <br/><p>Best regards,<br/>HR Team</p>
    `
  }),

  // Sent when application is rejected
  rejected: (candidateName, jobTitle) => ({
    subject: `Application Update — ${jobTitle}`,
    html: `
      <h2>Application Status Update</h2>
      <p>Dear ${candidateName},</p>
      <p>Thank you for applying for <strong>${jobTitle}</strong>.</p>
      <p>After careful consideration, we regret to inform you that
      we will not be moving forward with your application at this time.</p>
      <p>We encourage you to apply for future openings.</p>
      <br/><p>Best regards,<br/>HR Team</p>
    `
  }),

  // Sent when candidate is selected
  selected: (candidateName, jobTitle) => ({
    subject: `Offer Letter — ${jobTitle}`,
    html: `
      <h2>Congratulations, ${candidateName}!</h2>
      <p>We are thrilled to inform you that you have been
      <strong>selected</strong> for the position of <strong>${jobTitle}</strong>.</p>
      <p>Our HR team will reach out to you shortly with the offer details
      and onboarding information.</p>
      <br/><p>Best regards,<br/>HR Team</p>
    `
  }),

  // Custom message from HR
  custom: (candidateName, subject, message) => ({
    subject,
    html: `
      <p>Dear ${candidateName},</p>
      <p>${message}</p>
      <br/><p>Best regards,<br/>HR Team</p>
    `
  })
};

module.exports = { sendEmail, emailTemplates };
