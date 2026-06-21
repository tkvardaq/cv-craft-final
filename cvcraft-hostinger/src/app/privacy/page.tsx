import type { Metadata } from "next";
import { LegalShell } from "../(legal)/legal-content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How CvCRAFT collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updated="June 2026">
      <p>
        CvCRAFT (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is committed to protecting your privacy. This policy explains what
        data we collect when you use our CV-building service and how we handle it.
      </p>

      <h2>Data we collect</h2>
      <p>
        We collect the account details you provide (name, email), the CV content you create, and basic usage data
        needed to run the service. We do not sell your personal data to third parties.
      </p>

      <h2>How we use your data</h2>
      <p>
        Your data is used solely to provide the CV-building service: storing your CVs, generating AI suggestions,
        and producing PDF exports. AI processing is performed through our model provider and is not used to train
        third-party models.
      </p>

      <h2>Data storage &amp; security</h2>
      <p>
        Your data is stored on secure, access-controlled infrastructure with row-level security so that only you can
        access your own CVs. All traffic is encrypted in transit (TLS).
      </p>

      <h2>Your rights</h2>
      <p>
        Under UK GDPR you can request access to, correction of, or deletion of your personal data at any time. To
        exercise these rights, email{" "}
        <a href="mailto:hello@cvcraft.uk" className="text-royal-gold font-semibold">hello@cvcraft.uk</a>.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy? Email{" "}
        <a href="mailto:hello@cvcraft.uk" className="text-royal-gold font-semibold">hello@cvcraft.uk</a>.
      </p>
    </LegalShell>
  );
}
