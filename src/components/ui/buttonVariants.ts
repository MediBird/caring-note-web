import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1 whitespace-nowrap font-bold ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300',
  {
    variants: {
      size: {
        sm: 'h-6 rounded-md px-3 py-[10px] text-caption1 font-medium',
        md: 'h-8 rounded-md px-2 text-body2 font-bold',
        lg: 'h-10 rounded-md px-3 py-3 text-body1 font-bold',
        xl: 'h-12 rounded-md px-4 text-body1 font-bold',
        icon: 'h-5 w-5',
      },
      variant: {
        primary:
          'text-white border-[1.5px] bg-primary-50 hover:bg-primary-60 active:bg-primary-70 disabled:bg-grayscale-20 disabled:text-grayscale-40 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90',
        destructive:
          'bg-red-500 border-[1.5px]  text-neutral-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/90',
        outline:
          'border border-neutral-200 bg-white hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50',
        secondary:
          'bg-white border-[1.5px] border-primary-50  text-primary-50 hover:bg-primary-10 active:bg-primary-20 active:border-primary-60 disabled:bg-grayscale-10 disabled:border-grayscale-40 disabled:text-grayscale-30 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80',
        ghost:
          'hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50',
        link: 'text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-50',
        secondaryError:
          'bg-white border-[1.5px] border-error-50 text-error-50 hover:bg-error-10 active:bg-error-20 active:border-error-60 disabled:bg-grayscale-10 disabled:border-grayscale-40 disabled:text-grayscale-30 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80',
        pressed:
          'bg-primary-20 border-primary-40 text-primary-60 hover:bg-primary-10 active:bg-primary-20 active:border-primary-60 disabled:bg-grayscale-10 disabled:border-grayscale-40 disabled:text-grayscale-30 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80',
        nonpressed:
          'border border-grayscale-30 bg-grayscale-03 text-grayscale-60 hover:border-grayscale-50 hover:bg-grayscale-10 hover:text-grayscale-70',
        tertiary:
          'bg-primary-10 border border-primary-40 text-primary-60 hover:bg-primary-30 hover:border-primary-50',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export { buttonVariants };
