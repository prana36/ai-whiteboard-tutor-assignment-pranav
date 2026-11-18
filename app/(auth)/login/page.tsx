import { LoginView } from "@/components/LoginView";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-10 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-6%] top-[-8%] h-80 w-80 rounded-full bg-violet-500/18 blur-3xl" />
        <div className="absolute right-[-8%] top-[12%] h-96 w-96 rounded-full bg-teal-500/16 blur-3xl" />
        <div className="absolute bottom-[-12%] left-[20%] h-96 w-96 rounded-full bg-amber-500/12 blur-3xl" />
      </div>
      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-7xl items-center">
        <LoginView />
      </div>
    </main>
  );
}
