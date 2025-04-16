import BookmarkBlueIcon from '@/assets/icon/20/bookmark.blue.svg?react';
import BookmarkRedIcon from '@/assets/icon/20/bookmark.red.svg?react';
import BookmarkWhiteIcon from '@/assets/icon/20/bookmark.white.svg?react';
import classNames from 'classnames';
import React from 'react';

type BadgeVariant = 'filled' | 'tint' | 'outline' | 'ghost';
type BadgeSize = 'extra-large' | 'large' | 'medium' | 'small';
type BadgeColor = 'primary' | 'error';

interface BadgeProps {
  className?: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  color?: BadgeColor;
  children: React.ReactNode;
  customIcon?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  className = '',
  variant = 'filled',
  size = 'medium',
  color = 'primary',
  customIcon = null,
  children,
}) => {
  const baseClasses = 'inline-flex items-center gap-2 rounded-full font-medium';
  const sizeClasses = {
    'extra-large': 'px-4 py-2 text-subtitle1',
    large: 'px-4 py-2 text-body1',
    medium: 'px-3 py-1.5 text-body2',
    small: 'px-3 py-1.5 text-caption1',
  };

  const variantClasses = {
    filled: `bg-${color}-50 text-white`,
    tint: `bg-${color}-10 text-${color}-50 border border-${color}-30`,
    outline: `border-2 border-${color}-60 text-${color}-50`,
    ghost: `text-${color}-50`,
  };

  const iconSize = {
    'extra-large': 20,
    large: 16,
    medium: 12,
    small: 12,
  };

  const icon = () => {
    const defaultIcon =
      variant === 'filled' ? (
        <BookmarkWhiteIcon width={iconSize[size]} height={iconSize[size]} />
      ) : color === 'primary' ? (
        <BookmarkBlueIcon width={iconSize[size]} height={iconSize[size]} />
      ) : (
        <BookmarkRedIcon width={iconSize[size]} height={iconSize[size]} />
      );

    return customIcon ?? defaultIcon;
  };

  return (
    <span
      className={classNames(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}>
      {icon()}
      <span className="text-inherit">{children}</span>
    </span>
  );
};

export default Badge;
