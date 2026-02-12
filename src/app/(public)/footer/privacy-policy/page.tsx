import MarketingPageWrapper from "@/modules/shared/components/MarketingPageWrapper"

export default function PrivacyPolicyPage() {
  return (
    <MarketingPageWrapper
      title="Privacy Policy"
    >
      <p>
        We respect your privacy. Smart Bookmark does not sell
        your data or use invasive tracking.
      </p>

      <h2>Data Collection</h2>
      <p>
        We only store necessary bookmark data linked to your
        authenticated account.
      </p>

      <h2>Authentication</h2>
      <p>
        Authentication is securely handled via Google OAuth.
      </p>
    </MarketingPageWrapper>
  )
}
