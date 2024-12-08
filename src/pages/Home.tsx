import DatePickerComponent from "@components/common/DatePickerComponent";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col items-center justify-center pt-20 bg-blue-100">
        <p className="w-full pl-28 text-4xl font-bold text-blue-600">
          박진완님, <br />
          오늘도 힘찬 하루를 보내세요!{" "}
        </p>
        <div className="flex flex-row w-full items-center justify-center mt-10 px-24 space-x-5">
          <div className="w-1/2 h-32 rounded-xl bg-gray-100 border-4 border-white">
            <div className="flex flex-row w-full h-full">
              <div className="flex flex-col items-start justify-center space-y-2 w-1/2 pl-5">
                <p>올해 케어링 메세지 공유 수</p>
                <p className="text-3xl font-bold text-blue-500">{"1,234"}회</p>
              </div>
              <div className="flex flex-col items-start justify-center space-y-2 w-1/2 pl-5">
                <p>올해 상담한 내담자 수</p>
                <p className="text-3xl font-bold text-blue-500">{"201"}명</p>
              </div>
            </div>
          </div>
          <div className="w-1/2 h-32 rounded-xl bg-gray-100 border-4 border-white">
            <div className="flex flex-row w-full h-full">
              <div className="flex flex-col items-start justify-center space-y-2 w-1/2 pl-5">
                <p>올해 케어링 메세지 공유 수</p>
                <p className="text-3xl font-bold text-yellow-500">
                  {"1,234"}회
                </p>
              </div>
              <div className="flex flex-col items-start justify-center space-y-2 w-1/2 pl-5">
                <p>올해 상담한 내담자 수</p>
                <p className="text-3xl font-bold text-yellow-500">{"201"}명</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center bg-blue-300 w-full px-20 pt-10">
          <DatePickerComponent></DatePickerComponent>
          <div className="bg-gray-100 w-full h-screen rounded-xl cursor-pointer">
            <p
              className="text-3xl text-center mt-10"
              onClick={() => {
                navigate("/consult");
              }}>
              박진완 : 본상담 화면으로 이동 (임시){" "}
            </p>
            <p
              className="text-3xl text-center mt-10"
              onClick={() => {
                navigate("/assistant");
              }}>
              조영호 : 기초상담 화면으로 이동 (임시){" "}
            </p>
            <DatePickerComponent></DatePickerComponent>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
