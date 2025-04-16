interface CardContentProps {
  className?: string;
  item: string;
  value: string;
}

const CardContent = ({ item, value }: CardContentProps) => {
  return (
    <div className="mb-2 mt-8 w-full px-6">
      <p className="mb-1 text-body1 font-bold text-grayscale-90">{item}</p>
      <span className="text-body2 font-medium text-grayscale-70">{value}</span>
    </div>
  );
};

export default CardContent;
