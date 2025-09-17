"use client"

import Protected from "@/components/protected"
import useSWR from "swr"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { swrFetcher } from "@/services/api"

type Journal = {
  id: string
  title: string
  content: string
  createdAt?: string
}

export default function JournalListPage() {
  return (
    <Protected>
      <JournalListInner />
    </Protected>
  )
}

function JournalListInner() {
  const { data, isLoading, error } = useSWR<Journal[]>("/journal", swrFetcher)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Your Journal</h1>
          <p className="text-muted-foreground">All entries are private to your account.</p>
        </div>
        <Link href="/journal/new">
          <Button>New Entry</Button>
        </Link>
      </div>

      {isLoading && <p className="text-muted-foreground">Loading entries...</p>}
      {error && <p className="text-destructive">Failed to load entries.</p>}

      {!isLoading && !error && (
        <div className="grid gap-4 md:grid-cols-2">
          {data?.length ? (
            data.map((j) => (
              <Link key={j.id} href={`/journal/${j.id}`} className="border rounded-lg p-4 hover:bg-muted transition">
                <h3 className="font-semibold">{j.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3 mt-1">{j.content}</p>
              </Link>
            ))
          ) : (
            <p className="text-muted-foreground">No entries yet. Create your first one!</p>
          )}
        </div>
      )}
    </div>
  )
}
