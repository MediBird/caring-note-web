import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-body1 font-bold ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300',
  {
    variants: {
      variant: {
        primary:
          'text-white bg-primary-50 hover:bg-primary-60 active:bg-primary-70 disabled:bg-grayscale-20 disabled:text-grayscale-40 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90',
        destructive:
          'bg-red-500 text-neutral-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/90',
        outline:
          'border border-neutral-200 bg-white hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50',
        secondary:
          'bg-white border-primary-50 border-[1.5px] text-primary-50 hover:bg-primary-10 active:bg-primary-20 active:border-primary-60 disabled:bg-grayscale-10 disabled:border-grayscale-40 disabled:text-grayscale-30 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80',
        ghost:
          'hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50',
        link: 'text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-50',
        secondaryError:
          'bg-white border-error-50 border-[1.5px] text-error-50 hover:bg-error-10 active:bg-error-20 active:border-error-60 disabled:bg-grayscale-10 disabled:border-grayscale-40 disabled:text-grayscale-30 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80',
        pressed:
          'bg-primary-20 border-primary-40 border-[1px] text-primary-60 hover:bg-primary-10 active:bg-primary-20 active:border-primary-60 disabled:bg-grayscale-10 disabled:border-grayscale-40 disabled:text-grayscale-30 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80',
        nonpressed:
          'border border-grayscale-30 bg-grayscale-03 hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50',

        tertiary: 'bg-primary-10 text-primary-50',
      },
      size: {
        sm: 'h-4 rouned-md px-2',
        md: 'h-8 rounded-sm px-3',
        lg: 'h-10 rounded-sm px-4.5 w-23',
        xl: 'h-12 rounded-sm px-5',
        icon: 'h-5 w-5',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export { buttonVariants };
