import { GoogleLoginButton } from "@/modules/auth/components/GoogleLoginButton"
import { Card, CardContent } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-8 space-y-6 text-center">
          <h1 className="text-2xl font-bold">
            Smart Bookmark
          </h1>

          <p className="text-muted-foreground">
            Sign in using your Google account
          </p>

          <GoogleLoginButton />
        </CardContent>
      </Card>
    </div>
  )
}
