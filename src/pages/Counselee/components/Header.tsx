interface HeaderProps {
  title: string;
  description: string;
}

export const Header = ({ title, description }: HeaderProps) => {
  return (
    <div className="sticky top-0 z-10">
      <div className="bg-white h-fit border-b border-grayscale-05">
        <div className="pt-10 pb-1 max-w-layout [&>*]:max-w-content px-layout flex justify-between mx-auto">
          <div>
            <div className="text-h3 font-bold">{title}</div>
            <div className="mt-1 mb-5 flex items-center text-body2 font-medium text-grayscale-60">
              {description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
