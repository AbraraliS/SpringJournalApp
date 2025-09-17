"use client"

import Protected from "@/components/protected"
import { useParams, useRouter } from "next/navigation"
import useSWR from "swr"
import { swrFetcher, deleteJournal } from "@/services/api"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"

type Journal = {
  id: string
  title: string
  content: string
  createdAt?: string
}

export default function JournalDetailPage() {
  return (
    <Protected>
      <JournalDetailInner />
    </Protected>
  )
}

function JournalDetailInner() {
  const params = useParams<{ id: string }>()
  const id = params.id
  const router = useRouter()
  const { data, isLoading, error } = useSWR<Journal>(id ? `/journal/id/${id}` : null, swrFetcher)

  const onDelete = async () => {
    const ok = confirm("Delete this entry?")
    if (!ok) return
    try {
      await deleteJournal(id)
      toast({ title: "Entry deleted" })
      router.push("/journal")
    } catch (e: any) {
      toast({ title: "Failed to delete", variant: "destructive" })
    }
  }

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>
  if (error) return <p className="text-destructive">Failed to load entry.</p>
  if (!data) return null

  return (
    <article className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{data.title}</h1>
        <div className="flex gap-2">
          <Link href={`/journal/${id}/edit`}>
            <Button variant="outline">Edit</Button>
          </Link>
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
      <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">{data.content}</div>
    </article>
  )
}
