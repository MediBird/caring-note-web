import CloseBlackIcon from '@/assets/icon/24/close.outlined.black.svg?react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as React from 'react';

import { cn } from '@/lib/utils';
import clsx from 'clsx';

const Dialog = DialogPrimitive.Root;

const DialogPortal = DialogPrimitive.Portal;

// DialogTrigger 컴포넌트
const DialogTrigger = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Trigger ref={ref} {...props} />
));
DialogTrigger.displayName = DialogPrimitive.Trigger.displayName;

// DialogOverlay 컴포넌트
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 bg-grayscale-100 bg-opacity-30', className)}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

// DialogClose 컴포넌트
const DialogClose = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    className={cn(
      'px-3 py-1 text-primary-50 border-2 border-primary-50 rounded font-bold hover:bg-blue-100 w-14 h-8 text-sm',
      className,
    )}
    {...props}
  />
));
DialogClose.displayName = DialogPrimitive.Close.displayName;

// DialogContent 컴포넌트
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={clsx(
        'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
        'bg-white rounded-xl shadow-md w-[400px] max-w-full p-4',
        'focus:outline-none',
        className,
      )}
      {...props}>
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

// DialogHeader 컴포넌트
const DialogHeader = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-row space-y-1.5 text-center sm:text-left border-b-2',
      className,
    )}
    {...props}>
    {children}
  </div>
);
DialogHeader.displayName = 'DialogHeader';

// DialogCloseButton 컴포넌트
const DialogCloseButton: React.FC = () => {
  return (
    <DialogPrimitive.Close className="absolute w-5 h-5 pb-2 right-5">
      <CloseBlackIcon width={24} height={24} />
    </DialogPrimitive.Close>
  );
};
DialogCloseButton.displayName = 'DialogCloseButton';

// DialogTitle 컴포넌트
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg pb-2 font-bold text-grayscale-90', className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

// DialogDescription 컴포넌트
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm mt-2 mb-4 text-grayscale-80', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// DialogFooter 컴포넌트
const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex justify-end space-x-2', className)} {...props} />
);
DialogFooter.displayName = 'DialogFooter';

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
};
