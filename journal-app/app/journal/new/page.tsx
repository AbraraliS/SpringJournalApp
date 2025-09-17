"use client"

import Protected from "@/components/protected"
import { JournalForm } from "@/components/journal-form"
import { createJournal } from "@/services/api"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { useState } from "react"

export default function NewJournalPage() {
  return (
    <Protected>
      <NewJournalInner />
    </Protected>
  )
}

function NewJournalInner() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const onSubmit = async (values: { title: string; content: string }) => {
    setSaving(true)
    try {
      const res = await createJournal(values)
      if (res.status === 201 || res.status === 200) {
        toast({ title: "Entry created" })
        router.push("/journal")
      }
    } catch (e: any) {
      toast({ title: "Failed to create entry", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">New Entry</h1>
      <JournalForm onSubmit={onSubmit} submitting={saving} submitLabel="Create" />
    </div>
  )
}
