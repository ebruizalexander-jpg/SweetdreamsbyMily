# SweetdreamsbyMily
Balloon decoration/ event coordinator 

## Booking inquiries (GitHub Pages)

Recommended service: Formspree. Its public form endpoint accepts HTML POST and AJAX submissions without a server or private credentials in this repository.

1. Create a form in your own Formspree account and configure the business notification email there.
2. Copy its public endpoint from the dashboard Integration section.
3. In index.html, replace the bookingForm's empty action="" with action="https://formspree.io/f/YOUR_ACTUAL_FORM_ID". Use only the actual endpoint; do not commit API keys, passwords, email-service credentials, or account tokens.
4. Deploy and send a test inquiry; verify receipt in the Formspree dashboard and business inbox before advertising online submissions.

Until that action is configured, the form prepares a copyable inquiry and explicitly says it has not been sent. The existing business-card.png provides the direct contact fallback; keep that card's details current. With JavaScript disabled, the contact fallback remains available and the helper button is disabled, avoiding accidental submission to GitHub Pages. The live path validates required fields, email format, and non-past dates, prevents duplicate clicks, times out after 20 seconds, and preserves fields on failure. Success is shown only after a successful service response; it confirms an inquiry, not a reserved booking. Client validation is a convenience; use Formspree's spam protection and service-side controls as well.

No inquiries are saved in browser storage, logged to the console, or added to the URL.

Manual verification: required/blank fields, invalid email, past date, unconfigured draft, successful response, HTTP error, offline/timeout, repeated submit clicks, and JavaScript disabled. Never send mock test data to a real customer inbox.
