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
    className={cn(
      'fixed inset-0 z-50 bg-grayscale-100 bg-opacity-30',
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface DialogCloseProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close> {
  asChild?: boolean;
  /**
   * 기본 크기 클래스를 오버라이드할 수 있는 props
   * 아무 값도 지정하지 않으면 asChild가 false인 경우 기본값 'w-14 h-8 rounded' 적용
   * asChild를 사용하는 경우에는 Button의 스타일에 맡기고 싶다면 빈 문자열('') 또는 원하는 값을 전달
   */
  sizeClasses?: string;
}

// DialogClose 컴포넌트
const DialogClose = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  DialogCloseProps
>(({ asChild, sizeClasses, className, ...props }, ref) => {
  const defaultSizeClasses = asChild ? '' : 'w-14 h-8 rounded';
  return (
    <DialogPrimitive.Close
      asChild={asChild}
      ref={ref}
      className={cn(sizeClasses ?? defaultSizeClasses, className)}
      {...props}
    />
  );
});
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
        'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform sm:max-w-lg',
        'z-50 w-[400px] max-w-full rounded-[1rem] bg-white shadow-md',
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
      'mx-[1.25rem] flex h-[3.625rem] flex-row items-center justify-between space-y-1.5 pb-[0.75rem] pt-[1.25rem] text-center sm:text-left',
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
    <DialogPrimitive.Close className="absolute right-5 h-5 w-5 pb-2">
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
    className={'text-subtitle2 font-bold text-grayscale-90' + className}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

// DialogDescriptionProps 인터페이스
interface DialogDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> {
  asChild?: boolean;
}

// DialogDescription 컴포넌트
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  DialogDescriptionProps
>(({ asChild, className, ...props }, ref) => (
  <DialogPrimitive.Description
    asChild={asChild}
    ref={ref}
    className={cn(
      'mx-[1.25rem] mb-[1.75rem] mt-[0.75rem] text-body1 font-medium text-grayscale-80',
      className,
    )}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// DialogFooter 컴포넌트
const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'mx-[1.25rem] mb-[1rem] flex justify-end space-x-2',
      className,
    )}
    {...props}
  />
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
