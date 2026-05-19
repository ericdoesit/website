const sgMail = require('@sendgrid/mail');

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  const name    = (req.body.name    || '').trim();
  const email   = (req.body.email   || '').trim();
  const subject = (req.body.subject || '').trim();
  const message = (req.body.message || '').trim();
  const _honey  =  req.body._honey  || '';

  if (_honey) return res.status(200).json({ ok: true });

  if (!name || !email || !subject || !message)
    return res.status(400).json({ ok: false, error: 'All fields are required' });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ ok: false, error: 'Invalid email address' });

  if (name.length > 200 || subject.length > 300 || message.length > 5000)
    return res.status(400).json({ ok: false, error: 'Input too long' });

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: 'ericzunkley@gmail.com',
    from: 'noreply@ericzunkley.com',
    replyTo: { email, name },
    subject: `[Portfolio Contact] ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><hr><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`
  };

  try {
    await sgMail.send(msg);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('SendGrid error:', err?.response?.body || err.message);
    return res.status(500).json({ ok: false, error: 'Failed to send email' });
  }
};
