"use client"

import Protected from "@/components/protected"
import useSWR from "swr"
import { swrFetcher, updateJournal } from "@/services/api"
import { useParams, useRouter } from "next/navigation"
import { JournalForm } from "@/components/journal-form"
import { toast } from "@/hooks/use-toast"
import { useState } from "react"

type Journal = {
  id: string
  title: string
  content: string
}

export default function EditJournalPage() {
  return (
    <Protected>
      <EditJournalInner />
    </Protected>
  )
}

function EditJournalInner() {
  const params = useParams<{ id: string }>()
  const id = params.id
  const router = useRouter()
  const { data, isLoading, error } = useSWR<Journal>(id ? `/journal/id/${id}` : null, swrFetcher)
  const [saving, setSaving] = useState(false)

  const onSubmit = async (values: { title: string; content: string }) => {
    setSaving(true)
    try {
      const res = await updateJournal(id, values)
      if (res.status === 204 || res.status === 200) {
        toast({ title: "Entry updated" })
        router.push(`/journal/${id}`)
      }
    } catch (e: any) {
      toast({ title: "Failed to update entry", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>
  if (error) return <p className="text-destructive">Failed to load entry.</p>
  if (!data) return null

  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-2xl font-semibold">Edit Entry</h1>
      <JournalForm initial={{ title: data.title, content: data.content }} onSubmit={onSubmit} submitting={saving} />
    </div>
  )
}
