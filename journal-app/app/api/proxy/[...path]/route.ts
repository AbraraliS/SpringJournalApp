import { NextResponse } from "next/server"

// Prefer server-only env var. Falls back to NEXT_PUBLIC for convenience during setup.
// Example value: http://localhost:8081 (no trailing slash)
const BACKEND_API_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081"

function joinUrl(base: string, path: string, search: string) {
  const cleanBase = base.replace(/\/+$/, "")
  const cleanPath = path ? `/${path.replace(/^\/+/, "")}` : ""
  const qs = search || ""
  return `${cleanBase}${cleanPath}${qs}`
}

async function forward(request: Request, { params }: { params: { path?: string[] } }) {
  if (!BACKEND_API_URL) {
    return NextResponse.json({ message: "Backend URL not configured" }, { status: 500 })
  }

  const url = new URL(request.url)
  // Await params if it's a Promise (per Next.js dynamic API requirements)
  const awaitedParams = typeof params?.then === "function" ? await params : params;
  const path = Array.isArray(awaitedParams?.path) ? awaitedParams.path.join("/") : ""
  const targetUrl = joinUrl(BACKEND_API_URL, path, url.search)

  // Copy headers but strip hop-by-hop/unsafe ones
  const headers = new Headers(request.headers)
  headers.delete("host")
  headers.delete("connection")
  headers.delete("content-length")
  headers.delete("accept-encoding")

  const method = request.method
  let body: ArrayBuffer | undefined = undefined
  if (!["GET", "HEAD"].includes(method)) {
    try {
      body = await request.arrayBuffer()
    } catch {
      // Ignore if no body present
    }
  }

  try {
    const resp = await fetch(targetUrl, {
      method,
      headers,
      body,
      redirect: "manual",
    })

    // Pass through response headers/status/body
    const respHeaders = new Headers(resp.headers)
    // Optionally, you can filter headers if needed
    return new NextResponse(resp.body, {
      status: resp.status,
      headers: respHeaders,
    })
  } catch (err: any) {
    return NextResponse.json(
      { message: "Upstream request failed", detail: err?.message ?? "Unknown error" },
      { status: 502 },
    )
  }
}

export const GET = forward
export const POST = forward
export const PUT = forward
export const DELETE = forward
export const PATCH = forward
export const OPTIONS = forward
