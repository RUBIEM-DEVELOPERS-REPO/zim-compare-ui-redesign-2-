"use client"

const BASE_URL = "/api"

export async function apiGet(endpoint: string, tags?: string[]) {
  const token = typeof window !== 'undefined' ? localStorage.getItem("zim_auth_token") : null

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "GET",
    headers,
    next: { tags }
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || `Error fetching ${endpoint}`)
  }

  return response.json()
}

export async function apiPost(endpoint: string, body: any) {
  const token = typeof window !== 'undefined' ? localStorage.getItem("zim_auth_token") : null

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || `Error posting to ${endpoint}`)
  }

  return response.json()
}

export async function apiDelete(endpoint: string) {
  const token = typeof window !== 'undefined' ? localStorage.getItem("zim_auth_token") : null

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || `Error deleting ${endpoint}`)
  }

  return response.json()
}

export async function apiPatch(endpoint: string, body?: any) {
  const token = typeof window !== 'undefined' ? localStorage.getItem("zim_auth_token") : null

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const options: RequestInit = {
    method: "PATCH",
    headers,
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options)

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || `Error patching ${endpoint}`)
  }

  return response.json()
}
