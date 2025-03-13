interface ConsultCountProps {
  count: number;
  title: string;
  unit: string;
  image: string;
  backgroundColor: string;
}

function ConsultCount({
  count,
  title,
  unit,
  image,
  backgroundColor,
}: ConsultCountProps) {
  return (
    <div
      className="flex w-full rounded-xl border border-grayscale-5 p-3 text-primary-50"
      style={{ background: backgroundColor }}>
      <div className="flex h-full w-full flex-row-reverse items-center justify-center gap-2 hd:flex-col">
        <img src={image} alt="theme" width={80} height={80} />
        <div className="flex h-full w-full flex-col items-center justify-start gap-1 hd:justify-center">
          <p className="w-full text-start text-xl font-bold leading-6">
            {count.toLocaleString()}
            {unit}
          </p>
          <p
            className="w-full text-start text-xs leading-[14px]"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </div>
      </div>
    </div>
  );
}

export default ConsultCount;
