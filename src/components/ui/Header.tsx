interface HeaderProps {
  title: string | React.ReactNode;
  description: string;
}

export const Header = ({ title, description }: HeaderProps) => {
  return (
    <div className="sticky top-0 z-10 w-full">
      <div className="border-grayscale-05 h-fit w-full border-b bg-white">
        <div className="mx-auto flex w-full max-w-layout justify-between px-layout pb-1 pt-10 [&>*]:max-w-content">
          <div className="w-full">
            <div className="w-full text-h3 font-bold">{title}</div>
            <div className="mb-5 mt-1 flex items-center text-body2 font-medium text-grayscale-60">
              {description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
