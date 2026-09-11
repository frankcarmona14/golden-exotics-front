import type { Metadata } from "next"
import Link from "next/link"

import {
  LegalCallout,
  LegalList,
  LegalPage,
  LegalSection,
} from "../_components/legal-page"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Carhive collects, uses, shares and protects your personal information when you rent a car through our platform in Miami, Florida.",
}

const lastUpdated = new Date("2026-04-01")

const toc = [
  { id: "overview", label: "1. Overview" },
  { id: "information-we-collect", label: "2. Information we collect" },
  { id: "how-we-use", label: "3. How we use information" },
  { id: "sharing", label: "4. Sharing with third parties" },
  { id: "payment-data", label: "5. Payment data" },
  { id: "retention", label: "6. Data retention" },
  { id: "rights", label: "7. Your rights" },
  { id: "children", label: "8. Children's privacy" },
  { id: "security", label: "9. Security" },
  { id: "changes", label: "10. Changes to this policy" },
  { id: "contact", label: "11. Contact" },
]

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      subtitle="Carhive (“we”, “us” or “our”) respects your privacy. This Policy describes how we collect, use, disclose and protect personal information when you interact with our website, mobile application and rental services."
      lastUpdated={lastUpdated}
      toc={toc}
    >
      <LegalCallout variant="info">
        <p>
          <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
            Plain-English summary
          </strong>
          — We collect the minimum information needed to process your rental,
          verify your identity and comply with the law. We never sell your
          personal information. Payment details are handled by Stripe, a{" "}
          <abbr title="Payment Card Industry Data Security Standard">
            PCI-DSS
          </abbr>{" "}
          Level 1 provider, and are never stored on our servers.
        </p>
      </LegalCallout>

      <LegalSection id="overview" title="1. Overview">
        <p>
          This Privacy Policy applies to information collected through{" "}
          <Link href="/">carhive.com</Link>, our mobile applications and
          any related services that link to this Policy (collectively, the
          “Services”). It is designed to comply with applicable U.S. federal
          and Florida state privacy laws, including the Florida Digital Bill of
          Rights (FDBR).
        </p>
      </LegalSection>

      <LegalSection id="information-we-collect" title="2. Information we collect">
        <p>We collect the following categories of personal information:</p>
        <LegalList>
          <li>
            <strong>Identifiers:</strong> full name, email address, telephone
            number, mailing address, driver&apos;s license number and photograph.
          </li>
          <li>
            <strong>Payment information:</strong> tokenized card details,
            billing address and transaction history (processed by Stripe; see
            Section 5).
          </li>
          <li>
            <strong>Reservation data:</strong> pick-up and return dates, chosen
            vehicle, additional drivers, protection plans and add-ons.
          </li>
          <li>
            <strong>Vehicle and telematics data:</strong> odometer, fuel level,
            GPS location and driving events for the vehicle during the rental
            period, where the vehicle is equipped with a telematics device.
          </li>
          <li>
            <strong>Device data:</strong> IP address, browser type, operating
            system, cookies and similar technologies.
          </li>
          <li>
            <strong>Communications:</strong> messages, support tickets and
            recordings of customer-service calls (with notice).
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection id="how-we-use" title="3. How we use information">
        <p>We use personal information to:</p>
        <LegalList>
          <li>Create and manage your Carhive account;</li>
          <li>Process reservations, payments, deposits and refunds;</li>
          <li>
            Verify identity, driver&apos;s license validity and eligibility under
            Fla. Stat. § 322.04;
          </li>
          <li>
            Investigate accidents, damage, traffic citations and fraud;
          </li>
          <li>Provide customer support and service notifications;</li>
          <li>
            Comply with legal obligations, including tax reporting and requests
            from law-enforcement agencies;
          </li>
          <li>
            Improve the Services and develop new features, using aggregated or
            de-identified information whenever possible.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection id="sharing" title="4. Sharing with third parties">
        <p>We share personal information only with:</p>
        <LegalList>
          <li>
            <strong>Service providers</strong> acting on our behalf (payment
            processors, cloud hosting, analytics, customer support, telematics
            providers);
          </li>
          <li>
            <strong>Hosts</strong> of the vehicle you reserve, limited to the
            information they need to deliver the rental;
          </li>
          <li>
            <strong>Insurance partners</strong> if you purchase a protection
            plan or if an incident triggers a claim;
          </li>
          <li>
            <strong>Authorities</strong> in response to valid legal process or
            when necessary to protect the rights, property or safety of Carhive,
            our users or the public;
          </li>
          <li>
            <strong>Successors</strong> in a merger, acquisition or sale of
            assets, subject to confidentiality.
          </li>
        </LegalList>
        <p>
          <strong>
            We do not sell or share personal information for cross-context
            behavioral advertising.
          </strong>
        </p>
      </LegalSection>

      <LegalSection id="payment-data" title="5. Payment data">
        <p>
          Card details are collected directly in Stripe&apos;s secure elements and
          are never stored, processed or transmitted through Carhive&apos;s servers.
          Stripe is a PCI-DSS Level 1 certified provider. You can review{" "}
          <a
            href="https://stripe.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Stripe&apos;s privacy notice
          </a>{" "}
          for additional detail.
        </p>
      </LegalSection>

      <LegalSection id="retention" title="6. Data retention">
        <p>
          We retain personal information only for as long as needed to provide
          the Services, comply with legal obligations (typically seven years
          for tax records under IRS guidance), resolve disputes and enforce our
          agreements. Account data is deleted within 30 days of a verified
          deletion request, except for data we must retain by law.
        </p>
      </LegalSection>

      <LegalSection id="rights" title="7. Your rights">
        <p>
          Subject to applicable law, you may have the right to access, correct,
          delete, port or restrict the processing of your personal information,
          and to opt out of certain uses. To exercise these rights, email{" "}
          <a href="mailto:privacy@carhive.com">privacy@carhive.com</a>. We will
          respond within 45 days.
        </p>
      </LegalSection>

      <LegalSection id="children" title="8. Children's privacy">
        <p>
          The Services are not directed to individuals under 18, and we do not
          knowingly collect personal information from children. If you believe
          a child has provided us with personal information, contact us and we
          will delete it promptly.
        </p>
      </LegalSection>

      <LegalSection id="security" title="9. Security">
        <p>
          We use industry-standard administrative, technical and physical
          safeguards — including encryption in transit (TLS 1.2+) and at rest,
          role-based access controls and regular security reviews — to protect
          personal information. No method of transmission or storage is 100%
          secure, however, and we cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="10. Changes to this policy">
        <p>
          We may update this Policy from time to time. Material changes will be
          announced on the Services and, where required by law, communicated to
          you by email. The effective date at the top indicates when the Policy
          was last revised.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="11. Contact">
        <p>
          For any privacy-related inquiry, contact our Data Protection Officer
          at <a href="mailto:privacy@carhive.com">privacy@carhive.com</a>, or by
          mail to Carhive — Attn: DPO, 1 SE 3rd Ave, Miami, FL 33131, United
          States.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
