import type { Metadata } from "next";
import { LegalShell } from "../(legal)/legal-content";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing your use of CvCRAFT.",
};

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Service" updated="June 2026">
      <p>
        By using CvCRAFT you agree to these terms. Please read them carefully.
      </p>

      <h2>Using the service</h2>
      <p>
        CvCRAFT provides tools to build, optimise, and export CVs and cover letters. You are responsible for the
        accuracy of the information you enter and for how you use the documents you create.
      </p>

      <h2>Accounts</h2>
      <p>
        You must provide accurate details when creating an account and keep your password secure. You are responsible
        for activity that occurs under your account.
      </p>

      <h2>Payments</h2>
      <p>
        The Premium upgrade is a one-time payment that unlocks unlimited AI features and removes export limits.
        Payments are processed securely by Stripe. As Premium grants immediate access to digital features, payments
        are generally non-refundable except where required by law.
      </p>

      <h2>Acceptable use</h2>
      <p>
        You agree not to misuse the service, attempt to disrupt it, or use it to create misleading or fraudulent
        documents.
      </p>

      <h2>Liability</h2>
      <p>
        CvCRAFT is provided &ldquo;as is&rdquo;. We do not guarantee that using the service will result in a job
        offer or interview. To the extent permitted by law, our liability is limited to the amount you paid us.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Email{" "}
        <a href="mailto:hello@cvcraft.uk" className="text-royal-gold font-semibold">hello@cvcraft.uk</a>.
      </p>
    </LegalShell>
  );
}
