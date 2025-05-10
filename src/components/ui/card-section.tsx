interface CardSectionProps {
  title: React.ReactNode;
  items: Array<{
    label: string | React.ReactNode;
    subLabel?: string | null;
    value: React.ReactNode | undefined;
  }>;
  variant?: 'primary' | 'secondary' | 'grayscale' | 'error';
}

const CardSection = ({ title, items, variant }: CardSectionProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          border: '',
          line: 'bg-primary-30',
        };
      case 'secondary':
        return {
          border: '',
          line: 'bg-secondary-30',
        };
      case 'error':
        return {
          border: 'border-error bg-error-50',
          line: 'bg-error-30',
        };
      case 'grayscale':
        return {
          border: '',
          line: 'bg-grayscale-30',
        };
      default:
        return {
          border: 'border-grayscale-3',
          line: 'bg-grayscale-3',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`rounded-t-[4px] ${styles.border} bg-grayscale-3`}>
      <div className={`h-[6px] w-full ${styles.line} rounded-t-[4px]`} />
      <div className="px-5 pb-[1.875rem] pt-[1.375rem]">
        <h3 className="mb-6 text-subtitle2 font-bold text-grayscale-90">
          {title}
        </h3>
        <div className="space-y-6">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col space-y-2">
              <span className="text-grascale-90 text-body1 font-semibold">
                {item.label}
              </span>
              {item.subLabel && (
                <span className="text-body2 font-medium text-grayscale-50">
                  {item.subLabel}
                </span>
              )}
              <span className="text-body2 font-medium text-grayscale-70">
                {item.value || '정보 없음'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardSection;
