import AuthForm from "@/components/AuthForm";

const ContractorAuth = () => {
  return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#D9D9D9]/10 to-[#4A637D]/5 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234A637D' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="container relative mx-auto px-4 py-8 sm:py-12 lg:py-20">
          <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
            <div className="w-full max-w-md">
              <AuthForm type="contractorsignup" />
            </div>
          </div>
        </div>
      </div>
  )
}

export default ContractorAuth;