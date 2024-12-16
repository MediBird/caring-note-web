import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../hooks";
import { changeActiveTab } from "../../reducers/tabReducer";
import Badge from "@components/common/Badge";
import CardContainer from "../../components/common/CardContainer";
import InputLayout from "../../components/layout/input/InputLayout";
import InfoBlueIcon from "@icon/24/info.filled.blue.svg";
type option = {
  val: string;
  name: string;
};
type element = {
  type: string;
  name: string;
  label: string;
  options?: option[];
  value: string;
  placeholder?: string;
};

const AssistantBasicInfo = () => {
  // 새로고침이 되었을 때도 active tab 을 잃지 않도록 컴포넌트 load 시 dispatch
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(changeActiveTab("/assistant/basicInfo")); // 해당 tab의 url
  }, []);
  const [assistantBasicInfo, setAssistantBasicInfo] = useState({
    name: "",
    birthDate: "",
    medicalWarantType: "",
    caringNumber: "",
    latestCaringDate: "",
  });

  const inputsRef: element[] = [
    {
      // 성명
      type: "text",
      name: "name",
      label: "성명",
      value: assistantBasicInfo.name,
      placeholder: "이름을 입력해주세요",
    },
    {
      // 생년월일
      type: "text",
      name: "birthDate",
      label: "생년월일",
      value: assistantBasicInfo.birthDate,
      placeholder: "생년월일을 입력해주세요",
    },
    {
      // 의료보장형태
      type: "select",
      name: "medicalWarantType",
      label: "의료보장형태",
      options: [
        {
          val: "medicalfee1",
          name: "의료급여1",
        },
        {
          val: "medicalfee2",
          name: "의료급여2",
        },
      ],
      value: assistantBasicInfo.medicalWarantType,
    },
    {
      // 상담차수
      type: "select",
      name: "caringNumber",
      label: "상담차수",
      options: [
        {
          val: "1",
          name: "1차",
        },
        {
          val: "2",
          name: "2차",
        },
      ],
      value: assistantBasicInfo.caringNumber,
    },
    {
      // 최근 상담일
      type: "text",
      name: "latestCaringDate",
      label: "최근 상담일",
      value: assistantBasicInfo.latestCaringDate,
      placeholder: "최근 상담일을 입력해주세요",
    },
  ];
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAssistantBasicInfo({ ...assistantBasicInfo, [name]: value });
  };
  const onSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAssistantBasicInfo({ ...assistantBasicInfo, [name]: value });
  };
  return (
    <div className="w-full h-auto px-10 pt-8">
      <Badge
        variant="outline"
        color="primary"
        customIcon={<img src={InfoBlueIcon} />}>
        이전 상담 노트에서 불러온 정보를 토대로 손쉽게 작성해보세요.
      </Badge>
      {/* 박진완 : CardContainer 리팩토링 완료! 사용법은 ConsultCard.tsx 를 참고하시면 편해용 */}
      <CardContainer title={"기본정보"} variant="grayscale">
        <div className="px-5">
          <InputLayout
            inputsRef={inputsRef}
            onChange={onChange}
            onSelect={onSelect}
          />
        </div>
      </CardContainer>
    </div>
  );
};
export default AssistantBasicInfo;
