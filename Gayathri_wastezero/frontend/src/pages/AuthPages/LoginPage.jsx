import BrandPanel from "@/components/Login/BrandPanel"
import LoginForm from "@/components/Login/LoginForm"

export default function LoginPage() {
  return (
    <div className="min-h-dvh flex items-center justify-center p-4">
      <section className="mx-auto grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg md:grid-cols-2">
        <BrandPanel />
        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-6 shadow-md sm:p-8">
            <h1 className="text-center text-2xl font-semibold text-primary">Login</h1>
            <p className="mt-2 text-center text-sm text-neutral-600">Enter your credentials to access your account</p>

            <div className="mt-6">
              <LoginForm />
            </div>

            <p className="mt-6 text-center text-sm text-neutral-600">
              {"Don't have an account? "}
              <a href="#" className="font-medium text-primary hover:underline">
                Create one here
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
