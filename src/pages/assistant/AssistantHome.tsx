import arrowHeadLeftGray from "@icon/arrowHeadLeftGray.png";
import { changeActiveTab } from "../../reducers/tabReducer";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import Button from "../../components/Button";

const tabTitle = (text: string, goPage: string) => {
  const navigate = useNavigate();
  const activeTab = useAppSelector((state) => state.tab.activeTab);
  const dispatch = useAppDispatch();
  return (
    <p
      className={`${
        activeTab === goPage
          ? "text-md font-extrabold text-blue-500 border-b-2 border-blue-500"
          : "text-md font-extrabold text-gray-600"
      } mr-10 hover:text-blue-500 hover:border-b-2 border-blue-500 cursor-pointer`}
      onClick={() => {
        dispatch(changeActiveTab(goPage));
        navigate(goPage);
      }}>
      {text}
    </p>
  );
};
const AssistantHome = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-start w-full px-8 py-4 h-fit bg-gray-0">
        <div className="flex flex-row justify-start w-full h-8 mt-4">
          <img
            src={arrowHeadLeftGray}
            alt="arrowHeadLeftGray"
            className="w-6 h-6"
          />
        </div>
        <div className="flex flex-row items-center justify-start w-full h-8 pl-6 mt-4">
          <p className="text-4xl font-black text-black">상담 카드 작성</p>
          <Button _class="ml-6" variant="secondary" onClick={() => {}}>
            임시저장
          </Button>
          <Button _class="ml-4" variant="primary" onClick={() => {}}>
            기록완료
          </Button>
        </div>
      </div>
      <div className="flex flex-row items-center justify-start w-full my-0 border-t-2 border-b-2 border-gray-200 h-14 pl-14 border-b-gray-300">
        {tabTitle("기본 정보", "/assistant/basicInfo")}
        {tabTitle("건강 정보", "/assistant/healthInfo")}
        {tabTitle("생활 정보", "/assistant/lifeInfo")}
      </div>
      <Outlet />
    </div>
  );
};

export default AssistantHome;
