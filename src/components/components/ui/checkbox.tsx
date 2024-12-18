import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "@components/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-5 w-5 shrink-0 rounded-sm border-[2.5px] border-neutral-200 ring-offset-white hover:border-grayscale-50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-neutral-900 data-[state=checked]:text-neutral-50 dark:border-neutral-800 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300 dark:data-[state=checked]:bg-neutral-50 dark:data-[state=checked]:text-neutral-900",
      className,
    )}
    {...props}>
    <CheckboxPrimitive.Indicator
      className={cn(
        "flex items-center justify-center text-current bg-primary-50 fill-white",
      )}>
      <Check className="w-4 h-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
