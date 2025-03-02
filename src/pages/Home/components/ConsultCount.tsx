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
      className="flex w-full text-primary-50 p-3 border border-grayscale-5 rounded-xl"
      style={{ background: backgroundColor }}>
      <div className="flex  hd:flex-col w-full h-full items-center justify-center gap-2 flex-row-reverse ">
        <img src={image} alt="theme" />
        <div className="flex flex-col w-full h-full items-center justify-start hd:justify-center gap-1">
          <p className="font-bold text-xl w-full text-start leading-6">
            {count.toLocaleString()}
            {unit}
          </p>
          <p
            className="text-xs w-full text-start"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </div>
      </div>
    </div>
  );
}

export default ConsultCount;
