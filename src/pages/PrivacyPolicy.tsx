import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-100">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-slate-400 mb-8">Last updated: November 2, 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">1. Introduction</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Welcome to Gigabase ("we," "us," "our," or "Company"). We are committed to protecting your privacy
              and ensuring you have a positive experience on our website and application. This Privacy Policy
              explains our data handling practices, including what information we collect, how we use it, and your
              rights regarding your data.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Please read this Privacy Policy carefully. By accessing or using Gigabase, you acknowledge that you
              have read, understood, and agree to be bound by all the terms of this Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-slate-200 mb-3">2.1 Information You Provide Directly</h3>
            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
              <li>
                <strong>Search Queries:</strong> We collect the search terms and topics you query within the
                application to provide search results and improve our services.
              </li>
              <li>
                <strong>User Interactions:</strong> We track which articles you view, how long you spend on pages,
                and which features you use.
              </li>
              <li>
                <strong>Technical Information:</strong> Browser type, operating system, IP address, device type,
                and referral source.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-200 mb-3">2.2 Information Collected Automatically</h3>
            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
              <li>
                <strong>Cookies and Local Storage:</strong> We use cookies and browser local storage to remember
                your preferences, theme settings, and search history.
              </li>
              <li>
                <strong>Analytics Data:</strong> We collect analytics data including page views, click patterns,
                session duration, and user flow through our application.
              </li>
              <li>
                <strong>Performance Data:</strong> We monitor application performance metrics and error logs to
                improve functionality and user experience.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-200 mb-3">2.3 Third-Party API Data</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              Gigabase aggregates content from multiple third-party sources including:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li><strong>Wikipedia API:</strong> Public encyclopedia content and images</li>
              <li><strong>ArXiv API:</strong> Academic research papers and preprints</li>
              <li><strong>GitHub API:</strong> Public repository information and code (optional)</li>
              <li><strong>Stack Exchange API:</strong> Q&A content and technical information (optional)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>To provide, maintain, and improve the Gigabase service</li>
              <li>To personalize your experience and deliver relevant content recommendations</li>
              <li>To understand how users interact with our application and optimize features</li>
              <li>To detect, prevent, and address technical issues and fraudulent activity</li>
              <li>To analyze usage patterns and trends to enhance user experience</li>
              <li>To comply with legal obligations and enforce our terms of service</li>
              <li>To send notifications about updates, new features, or important changes to our service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">4. Data Sharing and Disclosure</h2>

            <h3 className="text-xl font-semibold text-slate-200 mb-3">4.1 Third-Party Service Providers</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              We may share information with third-party service providers who assist us in operating our website,
              conducting our business, and servicing you, including:
            </p>
            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
              <li>Hosting providers and CDN services</li>
              <li>Analytics platforms</li>
              <li>API providers and content aggregation services</li>
              <li>Error tracking and monitoring services</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-200 mb-3">4.2 Legal Requirements</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              We may disclose your information when required by law, such as in response to a subpoena, court
              order, or other legal process, or when we believe in good faith that such disclosure is necessary to
              protect our rights, your safety, or the safety of others.
            </p>

            <h3 className="text-xl font-semibold text-slate-200 mb-3">4.3 Business Transfers</h3>
            <p className="text-slate-300 leading-relaxed">
              If Gigabase is involved in a merger, acquisition, bankruptcy, or sale of assets, your information may
              be transferred as part of that transaction. We will provide notice before your information becomes
              subject to a different privacy policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">5. Data Retention</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              We retain your information for as long as necessary to provide our services and fulfill the purposes
              outlined in this Privacy Policy. The retention period may vary depending on the type of information:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>
                <strong>Search History:</strong> Retained locally on your device until you clear your browser cache
                or disable local storage.
              </li>
              <li>
                <strong>Analytics Data:</strong> Typically retained for 12 months and then anonymized or deleted.
              </li>
              <li>
                <strong>Cookies:</strong> Session cookies are deleted when you close your browser; persistent
                cookies are retained for up to 2 years.
              </li>
              <li>
                <strong>Legal Obligations:</strong> We may retain information longer if required by law or for
                legitimate business purposes.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">6. Your Privacy Rights and Choices</h2>

            <h3 className="text-xl font-semibold text-slate-200 mb-3">6.1 Access and Control</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              You have the right to access, review, and control your personal information. You can:
            </p>
            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
              <li>Clear your search history and locally stored data through browser settings</li>
              <li>Disable cookies in your browser preferences</li>
              <li>Opt out of analytics tracking (some features may be limited)</li>
              <li>Request information about what data we hold about you</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-200 mb-3">6.2 Cookies and Tracking</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              Most browsers allow you to refuse cookies or alert you when a cookie is being sent. You can also
              disable cookies through your browser settings. Note that disabling cookies may impact the functionality
              of certain features.
            </p>

            <h3 className="text-xl font-semibold text-slate-200 mb-3">6.3 Do Not Track Signals</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              Some browsers include a "Do Not Track" feature. Our website does not currently respond to Do Not Track
              signals, but you can disable cookies and local storage to limit tracking.
            </p>

            <h3 className="text-xl font-semibold text-slate-200 mb-3">6.4 Deletion Requests</h3>
            <p className="text-slate-300 leading-relaxed">
              You can request deletion of your data stored locally by clearing your browser cache. For data stored
              on our servers, please contact us at the email address provided below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">7. Data Security</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to protect your information against
              unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over
              the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means
              to protect your data, we cannot guarantee its absolute security.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Our security measures include:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>HTTPS encryption for data in transit</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Data minimization practices</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">8. Children's Privacy</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Gigabase is not directed to children under the age of 13. We do not knowingly collect personal
              information from children under 13. If we become aware that we have collected personal information from
              a child under 13, we will take steps to delete such information and terminate the child's account.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Parents or guardians who believe their child has provided information to Gigabase should contact us
              immediately at the email address provided below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">9. International Data Transfers</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Your information may be transferred to, stored in, and processed in countries other than your country
              of residence, which may have different data protection laws than your home country. By using Gigabase,
              you consent to the transfer of your information to countries outside your country of residence.
            </p>
            <p className="text-slate-300 leading-relaxed">
              We implement appropriate safeguards, including standard contractual clauses and adequacy decisions
              where applicable, to protect your information during international transfers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">10. Third-Party Links</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Gigabase may contain links to third-party websites, including Wikipedia, ArXiv, GitHub, and Stack
              Exchange. This Privacy Policy applies only to Gigabase and does not cover the practices of these
              third-party sites. We encourage you to review the privacy policies of any third-party sites before
              providing your information or using their services.
            </p>
            <p className="text-slate-300 leading-relaxed">
              We are not responsible for the privacy practices or content of third-party websites, and your use of
              such sites is at your own risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">11. California Privacy Rights</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              If you are a California resident, you have additional rights under the California Consumer Privacy Act
              (CCPA) and California Privacy Rights Act (CPRA), including:
            </p>
            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
              <li>The right to know what personal information we collect, use, and share</li>
              <li>The right to delete personal information collected from you</li>
              <li>The right to opt-out of the sale or sharing of your personal information</li>
              <li>The right to correct inaccurate personal information</li>
              <li>The right to non-discrimination for exercising your privacy rights</li>
            </ul>
            <p className="text-slate-300 leading-relaxed">
              To exercise these rights, please contact us using the information provided in Section 13.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">12. Changes to This Privacy Policy</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology,
              legal requirements, or other factors. We will notify you of material changes by posting the updated
              Privacy Policy on our website and updating the "Last updated" date at the top of this page.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Your continued use of Gigabase after any modifications constitutes your acceptance of the updated
              Privacy Policy. We encourage you to review this Privacy Policy periodically to stay informed about how
              we protect your information.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">13. Contact Us</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices,
              please contact us at:
            </p>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-2">
              <p className="text-slate-100">
                <strong>Gigabase - Privacy Team</strong>
              </p>
              <p className="text-slate-300">
                Email: <a href="mailto:thotakurayaswanth104@gmail.com" className="text-blue-400 hover:text-blue-300">
                  thotakurayaswanth104@gmail.com
                </a>
              </p>
              <p className="text-slate-300">
                GitHub: <a href="https://github.com/yesh00008" className="text-blue-400 hover:text-blue-300" target="_blank" rel="noopener noreferrer">
                  @yesh00008
                </a>
              </p>
              <p className="text-slate-300">
                Repository: <a href="https://github.com/yesh00008/gigabase.in" className="text-blue-400 hover:text-blue-300" target="_blank" rel="noopener noreferrer">
                  gigabase.in
                </a>
              </p>
            </div>
            <p className="text-slate-400 text-sm mt-4">
              We will respond to your inquiry within 30 days of receipt.
            </p>
          </section>

          <div className="border-t border-slate-700 pt-8 mt-12 text-center text-slate-400">
            <p className="text-sm">
              © 2025 Gigabase. All rights reserved. | Made with care by the Gigabase Team
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
