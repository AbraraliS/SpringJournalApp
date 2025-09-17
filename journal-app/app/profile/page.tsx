"use client"

import type React from "react"

import Protected from "@/components/protected"
import { useAuth } from "@/context/auth-context"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  return (
    <Protected>
      <ProfileInner />
    </Protected>
  )
}

function ProfileInner() {
  const { username, updateUser, deleteUser } = useAuth()
  const [newUsername, setNewUsername] = useState(username ?? "")
  const [password, setPassword] = useState("")
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateUser({
        username: newUsername !== username ? newUsername : undefined,
        password: password || undefined,
      })
      setPassword("")
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete your account? This cannot be undone.")
    if (!ok) return
    setDeleting(true)
    try {
      await deleteUser()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      <form onSubmit={onSave} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Username</label>
          <Input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">New Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current password"
          />
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </form>

      <div className="border-t pt-4">
        <Button variant="destructive" onClick={onDelete} disabled={deleting}>
          {deleting ? "Deleting..." : "Delete account"}
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          This will permanently delete your account and all journal entries.
        </p>
      </div>
    </div>
  )
}
