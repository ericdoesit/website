const sgMail = require('@sendgrid/mail');

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message)
    return res.status(400).json({ ok: false, error: 'All fields are required' });

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: 'ericzunkley@gmail.com',
    from: 'noreply@ericzunkley.com',
    replyTo: { email, name },
    subject: `[Portfolio Contact] ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><hr><p>${message.replace(/\n/g, '<br>')}</p>`
  };

  try {
    await sgMail.send(msg);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('SendGrid error:', err?.response?.body || err.message);
    return res.status(500).json({ ok: false, error: 'Failed to send email' });
  }
};
