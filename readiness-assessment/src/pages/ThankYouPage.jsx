export default function ThankYouPage() {
  return (
    <div className="thank-you">
      <p className="hero-eyebrow">Assessment completed</p>
      <h1>Thank you for participating</h1>
      <p style={{ color: 'var(--gray)' }}>
        Your responses have been received. They will help us develop future learning sessions, case
        studies, and advanced training for advisors interested in Business Insurance, Succession
        Planning, and Executive Benefits.
      </p>
      <p style={{ color: 'var(--gray)', marginTop: '1rem' }}>As a bonus, you will receive:</p>
      <ul className="bonus-list">
        <li>Keyman Discovery Framework</li>
        <li>Business Insurance Conversation Guide</li>
        <li>Future Master Class invitations</li>
      </ul>
      <p className="legacy">
        Save the Business.
        <br />
        Protect the Family.
        <br />
        Preserve the Legacy.
      </p>
      <a href="/" className="btn btn-secondary" style={{ marginTop: '2rem', display: 'inline-flex' }}>
        Return to joingiya.com
      </a>
    </div>
  );
}
