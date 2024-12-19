import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import CloseBlackIcon from "@icon/24/close.outlined.black.svg?react";
import { cn } from "@components/lib/utils";
import clsx from "clsx";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Trigger
    ref={ref}
    className={cn(
      "px-3 py-1 text-white border-2 bg-blue-500 border-blue-500 rounded font-bold hover:bg-opacity-80",
      className,
    )}
    {...props}
  />
));
DialogTrigger.displayName = DialogPrimitive.Trigger.displayName;

const DialogPortal = DialogPrimitive.Portal;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 bg-black bg-opacity-30", className)}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogClose = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    className={cn(
      "px-3 py-1 text-blue-500 border-2 border-blue-500 rounded font-bold hover:bg-blue-100",
      className,
    )}
    {...props}
  />
));
DialogClose.displayName = DialogPrimitive.Close.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogPrimitive.Content
      ref={ref}
      className={clsx(
        "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
        "bg-white rounded-xl shadow-md w-[400px] max-w-full p-4",
        "focus:outline-none",
        className,
      )}
      {...props}>
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className,
    )}
    {...props}>
    {children}
    <DialogPrimitive.Close className="absolute w-5 h-5 right-5 top-3">
      <CloseBlackIcon width={24} height={24} />
    </DialogPrimitive.Close>
  </div>
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex justify-end space-x-2", className)} {...props} />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg pb-3 font-bold border-b-2", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm mt-2 mb-4 text-gray-600", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
