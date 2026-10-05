"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"

import { Input, type InputProps } from "./input"

export function PasswordInput({ className, ...props }: InputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Input
        {...props}
        type={visible ? "text" : "password"}
        className={cn("pr-12", className)}
      />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        className="absolute inset-y-0 right-0 flex h-full min-w-11 items-center justify-center px-3 text-caption font-semibold text-muted-foreground hover:text-foreground"
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  )
}
