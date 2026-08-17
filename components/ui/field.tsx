import * as React from "react"

import { cn } from "@/lib/utils"

function Field({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="field" className={cn("flex flex-col gap-2", className)} {...props} />
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="field-group" className={cn("flex flex-col gap-5", className)} {...props} />
}

function FieldLabel({ className, ...props }: React.ComponentProps<"label">) {
  return <label data-slot="field-label" className={cn("text-sm font-medium text-foreground", className)} {...props} />
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="field-description" className={cn("text-xs text-muted-foreground", className)} {...props} />
}

function FieldError({ className, children, ...props }: React.ComponentProps<"p">) {
  if (!children) return null
  return <p role="alert" data-slot="field-error" className={cn("text-xs text-destructive", className)} {...props}>{children}</p>
}

export { Field, FieldGroup, FieldLabel, FieldDescription, FieldError }
