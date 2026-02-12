import MarketingPageWrapper from "@/modules/shared/components/MarketingPageWrapper"

export default function CookiesPage() {
  return (
    <MarketingPageWrapper
      title="Cookies Policy"
      description="How Smart Bookmark uses cookies and similar technologies."
    >
      <div className="space-y-12 text-muted-foreground leading-relaxed">

        {/* Last Updated */}
        <section>
          <p className="text-sm">
            <strong>Last Updated:</strong> January 2026
          </p>
        </section>

        {/* Introduction */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            1. What Are Cookies?
          </h2>
          <p>
            Cookies are small text files stored on your device when you visit
            a website. They help websites remember information about your
            visit, such as authentication state, preferences, and usage data.
          </p>
          <p>
            Cookies allow applications like Smart Bookmark to deliver secure,
            reliable, and personalized experiences.
          </p>
        </section>

        {/* How We Use Cookies */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            2. How We Use Cookies
          </h2>

          <p>
            Smart Bookmark uses cookies strictly for functional and security
            purposes. We do not use invasive tracking cookies or sell user data.
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Maintaining secure authentication sessions</li>
            <li>Preventing unauthorized access</li>
            <li>Improving performance and reliability</li>
            <li>Ensuring smooth real-time synchronization</li>
          </ul>
        </section>

        {/* Types of Cookies */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">
            3. Types of Cookies We Use
          </h2>

          <div className="space-y-6">

            <div>
              <h3 className="font-semibold text-foreground">
                Essential Cookies
              </h3>
              <p>
                These cookies are necessary for the platform to function.
                Without them, authentication and session management would not
                work properly.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground">
                Authentication Cookies
              </h3>
              <p>
                We use secure, HttpOnly cookies to manage login sessions via
                Google OAuth. These cookies are encrypted and cannot be accessed
                by client-side scripts.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground">
                Performance Cookies
              </h3>
              <p>
                Limited analytics may be used to monitor application health and
                system performance, but we do not use third-party advertising
                trackers.
              </p>
            </div>

          </div>
        </section>

        {/* Third-Party Services */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            4. Third-Party Services
          </h2>

          <p>
            Smart Bookmark integrates with trusted third-party services such as:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Google OAuth for secure authentication</li>
            <li>Supabase for database and real-time infrastructure</li>
          </ul>

          <p>
            These services may use their own cookies in accordance with their
            respective privacy policies.
          </p>
        </section>

        {/* User Control */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            5. Managing Cookies
          </h2>

          <p>
            You can control or disable cookies through your browser settings.
            However, disabling essential cookies may prevent Smart Bookmark
            from functioning correctly.
          </p>

          <p>
            Most modern browsers allow you to:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>View stored cookies</li>
            <li>Delete cookies</li>
            <li>Block cookies from specific sites</li>
            <li>Block all cookies entirely</li>
          </ul>
        </section>

        {/* Data Protection */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            6. Data Protection & Security
          </h2>

          <p>
            All authentication cookies are transmitted securely over HTTPS.
            We implement industry-standard security practices to ensure that
            session cookies are protected against unauthorized access.
          </p>

          <p>
            We do not use cookies for targeted advertising, behavioral profiling,
            or selling personal information.
          </p>
        </section>

        {/* Updates */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            7. Updates to This Policy
          </h2>

          <p>
            We may update this Cookies Policy periodically to reflect changes
            in technology, regulation, or our services. The "Last Updated"
            date at the top of this page will indicate when revisions occur.
          </p>
        </section>

        {/* Contact */}
        <section className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-semibold text-foreground">
            8. Contact Us
          </h2>

          <p>
            If you have any questions about our use of cookies or data
            protection practices, please contact us at:
          </p>

          <p>
            <strong>Email:</strong> support@smartbookmark.app
          </p>
        </section>

      </div>
    </MarketingPageWrapper>
  )
}
