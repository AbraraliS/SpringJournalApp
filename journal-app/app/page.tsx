export default function HomePage() {
  return (
    <section className="max-w-2xl space-y-4">
      <h1 className="text-3xl font-bold text-balance">Welcome to JournalApp</h1>
      <p className="text-muted-foreground">
        Capture your thoughts, track your progress, and reflect—all in one place. Secure and simple, powered by a Spring
        Boot backend.
      </p>
      <div className="flex gap-3">
        <a href="/login" className="underline underline-offset-4">
          Login
        </a>
        <a href="/register" className="underline underline-offset-4">
          Create an account
        </a>
        <a href="/journal" className="underline underline-offset-4">
          View your journal
        </a>
      </div>
    </section>
  )
}
