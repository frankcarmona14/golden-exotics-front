"use server"

import { cookies } from "next/headers"
import { revalidateTag, unstable_noStore as noStore } from "next/cache"
import { redirect } from "next/navigation"

import { CONTACT_PHONE_ERROR, isValidContactPhone } from "@/lib/phone"
import { sdk } from "./sdk"

const AUTH_COOKIE_NAME = "_medusa_jwt"
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

// ---------------------------------------------------------------------------
// Get current customer
// ---------------------------------------------------------------------------

export async function getCustomer() {
  noStore()
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value

  if (!token) return null

  try {
    const { customer } = await sdk.store.customer.retrieve(
      {},
      { authorization: `Bearer ${token}` }
    )
    return customer
  } catch {
    return null
  }
}

/**
 * Returns the auth token from the cookie (for custom fetch calls).
 */
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------

export async function login(
  _currentState: { error: string | null; success: boolean },
  formData: FormData
): Promise<{ error: string | null; success: boolean }> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required.", success: false }
  }

  try {
    const token = await sdk.auth.login("customer", "emailpass", {
      email,
      password,
    })

    if (typeof token === "object" && "location" in token) {
      return { error: "Additional authentication is required.", success: false }
    }

    const cookieStore = await cookies()
    cookieStore.set(AUTH_COOKIE_NAME, token as string, {
      maxAge: AUTH_COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })

    // Verify the customer record actually exists
    try {
      await sdk.store.customer.retrieve(
        {},
        { authorization: `Bearer ${token}` }
      )
    } catch {
      cookieStore.delete(AUTH_COOKIE_NAME)
      return { error: "Your account is incomplete. Please sign up again.", success: false }
    }

    revalidateTag("customer")
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : String(error)
    if (message.includes("Unauthorized") || message.includes("401")) {
      return { error: "Incorrect email or password.", success: false }
    }
    return { error: `Login error: ${message}`, success: false }
  }

  return { error: null, success: true }
}

// ---------------------------------------------------------------------------
// Sign up
// ---------------------------------------------------------------------------

export async function signup(
  _currentState: { error: string | null; success: boolean },
  formData: FormData
): Promise<{ error: string | null; success: boolean }> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const firstName = formData.get("first_name") as string
  const lastName = formData.get("last_name") as string
  const phone = ((formData.get("phone") as string) || "").trim()

  if (!email || !password || !firstName || !lastName || !phone) {
    return { error: "All required fields must be filled in.", success: false }
  }
  // Required to book (the team reaches renters on WhatsApp), so it's asked
  // once here instead of at every checkout.
  if (!isValidContactPhone(phone)) {
    return { error: CONTACT_PHONE_ERROR, success: false }
  }

  try {
    const token = await sdk.auth.register("customer", "emailpass", {
      email,
      password,
    })

    const cookieStore = await cookies()
    cookieStore.set(AUTH_COOKIE_NAME, token as string, {
      maxAge: AUTH_COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })

    const tokenValue = cookieStore.get(AUTH_COOKIE_NAME)?.value

    await sdk.store.customer.create(
      {
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
      },
      {},
      tokenValue ? { authorization: `Bearer ${tokenValue}` } : undefined
    )

    const loginToken = await sdk.auth.login("customer", "emailpass", {
      email,
      password,
    })

    cookieStore.set(AUTH_COOKIE_NAME, loginToken as string, {
      maxAge: AUTH_COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })

    revalidateTag("customer")
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : String(error)
    if (message.includes("already exists") || message.includes("Identity")) {
      return { error: "An account already exists with that email.", success: false }
    }
    return { error: `Sign-up error: ${message}`, success: false }
  }

  return { error: null, success: true }
}

// ---------------------------------------------------------------------------
// Update profile (name + phone)
// ---------------------------------------------------------------------------

export async function updateCustomer(
  _currentState: { error: string | null; success: boolean },
  formData: FormData
): Promise<{ error: string | null; success: boolean }> {
  const token = await getAuthToken()
  if (!token) {
    return { error: "Please log in to update your profile.", success: false }
  }

  const firstName = (formData.get("first_name") as string)?.trim()
  const lastName = (formData.get("last_name") as string)?.trim()
  const phone = ((formData.get("phone") as string) || "").trim()

  if (!firstName || !lastName) {
    return { error: "First and last name are required.", success: false }
  }
  if (!isValidContactPhone(phone)) {
    return { error: CONTACT_PHONE_ERROR, success: false }
  }

  try {
    await sdk.store.customer.update(
      {
        first_name: firstName,
        last_name: lastName,
        phone,
      },
      {},
      { authorization: `Bearer ${token}` }
    )
    revalidateTag("customer")
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return { error: `Could not update profile: ${message}`, success: false }
  }

  return { error: null, success: true }
}

// ---------------------------------------------------------------------------
// Add the phone at checkout (accounts created when it was optional)
// ---------------------------------------------------------------------------

export async function saveCustomerPhone(
  phone: string
): Promise<{ error: string | null }> {
  const token = await getAuthToken()
  if (!token) return { error: "Please log in again." }

  const value = phone.trim()
  if (!isValidContactPhone(value)) return { error: CONTACT_PHONE_ERROR }

  try {
    await sdk.store.customer.update(
      { phone: value },
      {},
      { authorization: `Bearer ${token}` }
    )
    revalidateTag("customer")
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return { error: `Could not save your number: ${message}` }
  }
  return { error: null }
}

// ---------------------------------------------------------------------------
// Logout
// ---------------------------------------------------------------------------

export async function logout(): Promise<void> {
  try {
    await sdk.auth.logout()
  } catch {
    // Si falla el logout remoto, igual limpiamos la cookie local
  }

  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE_NAME, "", { maxAge: -1 })

  revalidateTag("customer")
  redirect("/")
}
