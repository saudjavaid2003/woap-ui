"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

function Dialog(
  props: React.ComponentProps<typeof DialogPrimitive.Root>
) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger(
  props: React.ComponentProps<typeof DialogPrimitive.Trigger>
) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal(
  props: React.ComponentProps<typeof DialogPrimitive.Portal>
) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose(
  props: React.ComponentProps<typeof DialogPrimitive.Close>
) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal>
      <DialogOverlay />

      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl bg-background p-5 shadow-lg",
          className
        )}
        {...props}
      >
        {children}

        {showCloseButton && (
          <DialogPrimitive.Close asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-3 h-8 w-8"
            >
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader(props: React.ComponentProps<"div">) {
  return <div className="flex flex-col gap-2" {...props} />
}

function DialogFooter(props: React.ComponentProps<"div">) {
  return (
    <div
      className="flex justify-end gap-2 border-t pt-4 mt-4"
      {...props}
    />
  )
}

function DialogTitle(
  props: React.ComponentProps<typeof DialogPrimitive.Title>
) {
  return (
    <DialogPrimitive.Title
      className="text-lg font-semibold"
      {...props}
    />
  )
}

function DialogDescription(
  props: React.ComponentProps<typeof DialogPrimitive.Description>
) {
  return (
    <DialogPrimitive.Description
      className="text-sm text-muted-foreground"
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}