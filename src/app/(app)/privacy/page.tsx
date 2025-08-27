
export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="prose prose-lg max-w-4xl mx-auto">
                <h1 className="font-headline">Privacy Policy</h1>
                <p className="text-sm text-muted-foreground">Last Updated: 25 Aug 2025</p>

                <h2>1. Overview</h2>
                <p>
                    This Privacy Policy explains how Culture Kerala Pty Ltd (<strong>“Culture Kerala,” “we,” “us,” “our”</strong>) collects, uses, shares, and protects personal information when you use our Service. We comply with applicable privacy laws, including the <strong>Australian Privacy Act 1988 (Cth)</strong> and Australian Privacy Principles (APPs). For users in the <strong>EEA/UK</strong>, we act as a <strong>controller</strong> under the GDPR/UK GDPR. For California residents, we provide disclosures required by the <strong>CCPA/CPRA</strong>.
                </p>

                <h2>2. What We Collect</h2>
                <h3>Information you provide:</h3>
                <ul>
                    <li><strong>Account data:</strong> name, email, password, profile photo, username, bio, languages, location (city/country), website.</li>
                    <li><strong>Content:</strong> events, communities, business listings, deals, movies, posts, comments, photos, logos, tickets/RSVPs.</li>
                    <li><strong>Communications:</strong> messages to us, reports, verification/KYB/KYC docs (if applicable).</li>
                </ul>

                <h3>Information we collect automatically:</h3>
                <ul>
                    <li><strong>Device &amp; usage:</strong> IP address, device identifiers, browser/app version, OS, pages viewed, referring URLs, timestamps, crash logs.</li>
                    <li><strong>Location:</strong> <strong>approximate</strong> location from IP; <strong>precise</strong> location <strong>only</strong> with your granular consent (for maps, nearby deals/events).</li>
                    <li><strong>Cookies/SDKs:</strong> analytics and functionality cookies/identifiers (see “Cookies & Tracking”).</li>
                </ul>

                <h3>Information from third parties:</h3>
                <ul>
                    <li><strong>Sign‑in providers</strong> (e.g., Google/Apple): basic profile and email.</li>
                    <li><strong>Payment providers</strong> (Stripe): transaction metadata (no full card details).</li>
                    <li><strong>Maps/Places</strong> (Google): geocoding and place information.</li>
                    <li><strong>Search providers</strong> (Algolia): search queries and ranking signals.</li>
                </ul>

                <h2>3. How We Use Information (Purposes & Legal Bases)</h2>
                <ul>
                    <li><strong>Provide &amp; operate the Service</strong> (contract): account creation, listings, search, sharing, tickets, notifications.</li>
                    <li><strong>Safety &amp; moderation</strong> (legitimate interests/legal obligation): detect abuse, verify accounts, handle reports, enforce policies.</li>
                    <li><strong>Improve &amp; analytics</strong> (legitimate interests/consent where required): measure usage, debug, develop features.</li>
                    <li><strong>Communications</strong> (contract/legitimate interests/consent): service announcements, reminders, marketing (opt‑in where required).</li>
                    <li><strong>Personalization</strong> (legitimate interests/consent): location‑based or profile‑based recommendations.</li>
                    <li><strong>Legal compliance</strong> (legal obligation): respond to requests, record‑keeping, fraud prevention.</li>
                </ul>

                <h2>4. Sharing & Disclosure</h2>
                <p>We share personal information with:</p>
                <ul>
                    <li><strong>Service providers/processors:</strong> Firebase (Auth, Firestore, Storage, FCM), Google Analytics, Google Maps/Places, Algolia (search), Stripe (payments), SendGrid (email), hosting/CDN, customer support tools.</li>
                    <li><strong>Organizers/Businesses</strong> when you interact with their listings (e.g., RSVP, ticket purchase, lead forms).</li>
                    <li><strong>Authorities</strong> if required by law or to protect rights, safety, and security.</li>
                    <li><strong>Corporate transactions:</strong> During/after a merger, acquisition, or asset sale.</li>
                </ul>
                <p>
                    We do <strong>not</strong> sell personal information. Under CPRA, we may <strong>“share”</strong> limited identifiers for cross‑context behavioral advertising <strong>only with your consent</strong>, and you can opt‑out at any time.
                </p>

                <h2>5. International Transfers</h2>
                <p>
                    We may process data in Australia, the United States, the EU, India, or other countries where we or our providers operate. Where required, we use appropriate safeguards (e.g., Standard Contractual Clauses) and ensure providers maintain adequate protections.
                </p>

                <h2>6. Retention</h2>
                <p>We keep personal information only as long as needed for the purposes above:</p>
                <ul>
                    <li><strong>Account data:</strong> for the life of the account + up to 24 months after closure.</li>
                    <li><strong>Content/listings:</strong> while published + reasonable archive period.</li>
                    <li><strong>Transaction metadata:</strong> per tax/accounting laws (typically 7 years in AU).</li>
                    <li><strong>Logs/analytics:</strong> typically 12–24 months (aggregated/anonymized afterward).</li>
                </ul>
                <p>We may retain data to comply with legal obligations, resolve disputes, and enforce agreements.</p>

                <h2>7. Your Rights</h2>
                <p>Depending on your region, you may have the right to <strong>access</strong>, <strong>correct</strong>, <strong>delete</strong>, <strong>restrict</strong>, <strong>object</strong>, or <strong>port</strong> your data, and to <strong>withdraw consent</strong>.</p>
                <ul>
                    <li><strong>AU (APPs):</strong> Access and correction rights.</li>
                    <li><strong>EEA/UK (GDPR):</strong> Rights above + to lodge a complaint with a supervisory authority.</li>
                    <li><strong>California (CCPA/CPRA):</strong> Right to know, delete, correct, opt‑out of sale/share, limit use of sensitive data, non‑discrimination.</li>
                </ul>
                <p>
                    To exercise rights, email <a href="mailto:privacy@culturekerala.com">privacy@culturekerala.com</a> or use in‑app controls where available. We may verify your request and respond within statutory timelines.
                </p>

                <h2>8. Cookies & Tracking</h2>
                <p>We use cookies/SDKs for:</p>
                <ul>
                    <li><strong>Essential</strong> (auth, security, preferences).</li>
                    <li><strong>Analytics</strong> (GA4, Firebase Analytics) – consent where required.</li>
                    <li><strong>Functionality</strong> (search, maps).</li>
                    <li><strong>Advertising</strong> (only if/when enabled; opt‑in and opt‑out options provided).</li>
                </ul>
                <p>
                    Manage preferences via our <strong>Cookie Settings</strong> and your browser/device settings. You can opt‑out of non‑essential cookies and withdraw consent at any time.
                </p>

                <h2>9. Children</h2>
                <p>
                    The Service is not directed to children under <strong>13</strong>. We do not knowingly collect personal information from children under 13. If you believe a child has provided us data, contact <a href="mailto:privacy@culturekerala.com">privacy@culturekerala.com</a> and we will take appropriate action. For EEA/UK users under 16, parental consent is required.
                </p>

                <h2>10. Security</h2>
                <p>
                    We implement administrative, technical, and physical safeguards appropriate to the risks (e.g., encryption in transit, access controls, least privilege, logging). No system is 100% secure. Report concerns to <a href="mailto:security@culturekerala.com">security@culturekerala.com</a>.
                </p>

                <h2>11. Third‑Party Links & Social Sharing</h2>
                <p>
                    Our Service may include links to third‑party sites/apps and social media features. Their privacy practices are governed by their own policies.
                </p>

                <h2>12. Do Not Track</h2>
                <p>
                    We currently do not respond to browser <strong>Do Not Track</strong> signals. We honor opt‑out/consent choices under applicable law.
                </p>
                
                <h2>13. Changes to This Policy</h2>
                <p>
                    We may update this Policy. We will post the new version with an updated “Last Updated” date and, where required, provide additional notice or obtain consent.
                </p>
                
                <h2>14. Contact Us</h2>
                <ul>
                    <li><strong>Email:</strong> <a href="mailto:privacy@culturekerala.com">privacy@culturekerala.com</a></li>
                    <li><strong>Postal (placeholder):</strong> Culture Kerala Pty Ltd, Level X, 123 Example St, Sydney NSW 2000, Australia</li>
                </ul>

                <hr />

                <h3>REGION-SPECIFIC DISCLOSURES</h3>
                
                <h4>Australia (APPs)</h4>
                <p>We comply with the Australian Privacy Principles. You may contact the <strong>OAIC</strong> if concerns are not resolved: oaic.gov.au.</p>
                
                <h4>EEA/UK (GDPR/UK GDPR)</h4>
                <ul>
                    <li><strong>Controller:</strong> Culture Kerala Pty Ltd (contact above).</li>
                    <li><strong>Data Protection Officer (placeholder):</strong> <a href="mailto:dpo@culturekerala.com">dpo@culturekerala.com</a>.</li>
                    <li><strong>Legal bases:</strong> contract, legitimate interests, consent, legal obligation.</li>
                    <li><strong>Supervisory authority:</strong> You have the right to lodge a complaint in your member state.</li>
                </ul>

                <h4>California (CCPA/CPRA)</h4>
                <ul>
                    <li>We do not sell personal information. If we engage in cross‑context behavioral advertising, it will be with notice and the ability to <strong>opt‑out</strong> via <strong>“Do Not Sell or Share My Personal Information.”</strong></li>
                    <li><strong>Categories collected:</strong> identifiers, commercial information (limited), internet activity, geolocation (approximate/precise with consent), user‑generated content, inferences (limited personalization).</li>
                    <li><strong>Sources:</strong> you, your devices, integrated partners.</li>
                    <li><strong>Purposes:</strong> as listed above.</li>
                    <li><strong>Retention:</strong> per Section 6.</li>
                    <li><strong>Sensitive information:</strong> we do not seek to collect; if provided for verification, we use it only for that purpose.</li>
                </ul>
            </div>
        </div>
    );
}
