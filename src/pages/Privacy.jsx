import { ContentPage } from "../components/layout/ContentPage";

export function Privacy() {
  return (
    <ContentPage
      title="Privacy Policy"
      subtitle="Your privacy is central to how we build Waypoint. This policy explains what we collect, why we need it, and your rights."
      className="max-w-3xl"
    >
      <article className="prose max-w-none">
        <p className="coord">Last updated: September 2026</p>

        <h2>1. Overview</h2>
        <p>
          Waypoint is a travel-discovery web application. We believe in a field-atlas approach: lightweight,
          curated, and transparent. This policy describes how we collect, use, and protect your information
          when you visit <span className="coord">waypoint.travel</span> or use the app.
        </p>

        <h2>2. Information we collect</h2>
        <p>
          We collect only what we need to function — and we try hard to need very little.
        </p>
        <ul>
          <li>
            <strong>Location data.</strong> Only if you grant permission. We use your browser's Geolocation
            API to show nearby weather. We never store your precise location between sessions — it lives in
            memory for as long as the tab is open, then it's gone. You can always type a city name instead.
          </li>
          <li>
            <strong>Search queries and form inputs.</strong> Destination searches, itinerary parameters
            (days, budget, interests), and AI prompts are processed in your browser to generate responses.
            We do not retain them on our servers or associate them with a persistent profile.
          </li>
          <li>
            <strong>Technical metadata.</strong> Like most web apps, our hosting provider logs standard
            access information — IP address, browser type, timestamp — for security and debugging. These logs
            are not used for profiling.
          </li>
          <li>
            <strong>Contact form submissions.</strong> If you email us through the Contact page, we keep
            your message and email address solely to respond and resolve your inquiry.
          </li>
        </ul>

        <h2>3. How we use your information</h2>
        <p>We use data only to:</p>
        <ul>
          <li>Show you destination details, live weather, and generated itineraries.</li>
          <li>Improve performance and fix bugs — using anonymized, aggregated metrics.</li>
          <li>Respond to support requests you initiate.</li>
        </ul>

        <h2>4. Third-party services</h2>
        <p>
          Waypoint integrates a few external providers so we don't have to rebuild everything from scratch:
        </p>
        <ul>
          <li>
            <strong>OpenWeather.</strong> Supplies real-time weather. We send only the city or
            coordinates you choose — never a persistent identifier.
          </li>
          <li>
            <strong>Unsplash &amp; Pexels.</strong> Serve destination imagery at render time. No
            personal data is sent with image requests.
          </li>
          <li>
            <strong>Google Gemini.</strong> Powers the AI assistant. Only your scoped question is
            forwarded. See section 5 for key security.
          </li>
        </ul>

        <h2>5. API keys and security</h2>
        <p>
          Weather, image, and AI API keys are required for full functionality. When running locally you
          provide <span className="coord">VITE_</span>-prefixed keys in your <span className="coord">.env</span>
          file. When deployed to Vercel, the Gemini key is proxied server-side via the included{" "}
          <span className="coord">api/gemini</span> serverless function — it never reaches your browser.
          All keys are excluded from version control via <span className="coord">.gitignore</span>.
        </p>

        <h2>6. Cookies and tracking</h2>
        <p>
          We don't use advertising or behavioural-tracking cookies. The only cookies are functional ones
          needed by TanStack Query to cache weather and image responses during your session. Clear your
          browser data at any time to start fresh.
        </p>

        <h2>7. Your rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Deny or revoke location permissions — the app keeps working with manual city search.</li>
          <li>Stop using the AI assistant at any time — your prompts are not logged or shared.</li>
          <li>Request deletion of any contact-form correspondence.</li>
        </ul>

        <h2>8. Data retention</h2>
        <p>
          We retain technical logs for no more than 30 days and contact submissions only as long as
          needed to resolve your request. Location data and AI prompts are ephemeral — they don't persist
          beyond your browsing session.
        </p>

        <h2>9. Children's privacy</h2>
        <p>
          Waypoint is not directed at children under 13. We do not knowingly collect information from
          anyone under 13. If you believe we have, please contact us and we'll delete it promptly.
        </p>

        <h2>10. Changes to this policy</h2>
        <p>
          We'll post any material changes here with a revised "Last updated" date. For substantive
          changes we'll also link to them from the footer across the site.
        </p>

        <h2>11. Contact</h2>
        <p>
          Questions about this policy? Email <a href="mailto:privacy@waypoint.travel">privacy@waypoint.travel</a>
          .
        </p>
      </article>
    </ContentPage>
  );
}

export function Terms() {
  return (
    <ContentPage title="Terms of Service" subtitle="These terms govern your use of Waypoint." className="max-w-3xl">
      <article className="prose max-w-none">
        <p className="coord">Last updated: September 2026</p>

        <h2>1. Acceptance</h2>
        <p>
          By accessing or using the Waypoint application, website, and related services (collectively, the
          "Service"), you agree to be bound by these Terms of Service. If you don't agree, please don't use
          the Service. We're a small project, not a corporate SaaS — these terms are straightforward.
        </p>

        <h2>2. The service</h2>
        <p>
          Waypoint helps you discover travel destinations, view live weather, and generate day-by-day
          itinerary plans using AI assistance. The destination data is curated by hand from open sources.
          Weather, imagery, and AI responses are fetched from third-party providers and may be temporarily
          unavailable. We're not obligated to maintain the Service, but we'll try.
        </p>

        <h2>3. Your responsibilities</h2>
        <ul>
          <li>Be honest. Don't impersonate anyone or submit false information through the contact form.</li>
          <li>Don't abuse the AI assistant. Spam, harassment, or prompt-injection attempts will get you
            blocked.</li>
          <li>Don't scrape or overload our APIs. We're running on free tiers — be kind to the server.</li>
          <li>You're responsible for verifying AI-generated itineraries against local conditions, opening
            hours, and travel advisories before you travel.</li>
        </ul>

        <h2>4. Third-party providers</h2>
        <p>
          The Service relies on external providers — OpenWeather, Unsplash, Pexels, and Google Gemini,
          each with their own terms and privacy policies. Your use of their services is subject to their
          respective terms. We're not liable for their availability, accuracy, or uptime.
        </p>

        <h2>5. AI-generated content</h2>
        <p>
          Itinerary plans and assistant responses are AI-generated. While we validate structured output
          with Zod schemas, AI can make mistakes. Always cross-check recommendations — especially opening
          hours, prices, local laws, and safety conditions — with authoritative sources before acting on
          them. Waypoint is a planning aid, not a guaranteed booking service.
        </p>

        <h2>6. Intellectual property</h2>
        <p>
          The Waypoint name, logo, design language ("field atlas" style), and codebase are owned by the
          project maintainers. Destination text and descriptions in our curated dataset are original
          writing, shared freely for non-commercial reuse with attribution. Third-party imagery remains the
          property of its creators under their respective licenses.
        </p>

        <h2>7. Disclaimer</h2>
        <p>
          THE SERVICE IS PROVIDED "AS IS," WITHOUT WARRANTIES OF ANY KIND. WE DON'T GUARANTEE THAT THE
          SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE, OR THAT DEFECTS WILL BE CORRECTED. YOU
          TRAVEL AT YOUR OWN RISK.
        </p>

        <h2>8. Limitation of liability</h2>
        <p>
          TO THE FULLEST EXTENT PERMITTED BY LAW, WAYPOINT'S TOTAL LIABILITY FOR ANY CLAIM RELATING TO
          THESE TERMS OR THE SERVICE — WHETHER IN CONTRACT, TORT, OR OTHERWISE — IS LIMITED TO THE GREATER
          OF WHAT YOU PAID US (ZERO) AND $10. THIS LIMIT APPLIES TO ALL CLAIMS, EVEN IF WE'VE BEEN ADVISED
          OF THE POSSIBILITY OF SUCH DAMAGE.
        </p>

        <h2>9. Indemnification</h2>
        <p>
          You agree to defend, indemnify, and hold harmless Waypoint and its maintainers from any claim,
          demand, or cause of action arising out of your breach of these Terms or your violation of any
          law.
        </p>

        <h2>10. Governing law</h2>
        <p>
          These Terms are governed by the laws of India, without regard to conflict-of-law principles.
          Any dispute will be resolved in the courts of Maharashtra, India.
        </p>

        <h2>11. Changes to these terms</h2>
        <p>
          We may update these Terms from time to time. When we do, we'll post the revised version here
          with a new "Last updated" date. Your continued use of the Service after changes constitutes
          acceptance of the new terms.
        </p>

        <h2>12. Contact</h2>
        <p>
          Questions? Reach out at <a href="mailto:hello@waypoint.travel">hello@waypoint.travel</a>.
        </p>
      </article>
    </ContentPage>
  );
}
