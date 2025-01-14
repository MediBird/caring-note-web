import arrowHeadLeftGray from '@/assets/icon/arrowHeadLeftGray.png';
import Button from '@/components/Button';
import BasicInfo from '@/pages/assistant/tabs/BasicInfo';
import HealthInfo from '@/pages/assistant/tabs/HealthInfo';
import IndependentInfo from '@/pages/assistant/tabs/IndependentInfo';
import LifeInfo from '@/pages/assistant/tabs/LifeInfo';
import useAssistantInfoTabStore, {
  AssistantInfoTab,
} from '@/store/assistantTabStore';
import { useState } from 'react';

const TabTitle = ({
  text,
  goPage,
  isHidden,
}: {
  text: string;
  goPage: AssistantInfoTab;
  isHidden?: boolean;
}) => {
  const { activeTab, setActiveTab } = useAssistantInfoTabStore();

  return (
    <p
      className={`${
        activeTab === goPage
          ? 'text-body2 font-bold text-primary-50 border-b-2 border-primary-50'
          : 'text-body2 font-medium text-grayscale-50'
      } ${
        isHidden ? 'hidden' : ''
      } mr-10 py-3 h-full flex items-center hover:text-primary-50 hover:border-b-2 border-primary-50 cursor-pointer`}
      onClick={() => {
        setActiveTab(goPage);
      }}>
      {text}
    </p>
  );
};

const TabContent = ({
  activeTab,
  hideIndependentInfoTab,
}: {
  activeTab: AssistantInfoTab;
  hideIndependentInfoTab: boolean;
}) => {
  const defaultTab = hideIndependentInfoTab ? (
    <BasicInfo />
  ) : (
    <IndependentInfo />
  );

  switch (activeTab) {
    case AssistantInfoTab.basicInfo:
      return <BasicInfo />;
    case AssistantInfoTab.healthInfo:
      return <HealthInfo />;
    case AssistantInfoTab.lifeInfo:
      return <LifeInfo />;
    case AssistantInfoTab.independentInfo:
      return <IndependentInfo />;
    default:
      return defaultTab;
  }
};

const AssistantInfo = () => {
  const { activeTab } = useAssistantInfoTabStore();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hideIndependentInfoTab, setHideIndependentInfoTab] = useState(true);
  return (
    <div>
      <div className="flex flex-col items-center justify-start w-full px-8 py-4 h-fit bg-gray-0">
        <div className="flex flex-row items-center justify-start w-full h-8 pl-6 mt-4">
          <img
            src={arrowHeadLeftGray}
            onClick={() => {
              history.back();
            }}
            alt="arrowHeadLeftGray"
            className="w-6 h-6 cursor-pointer"
          />
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
        <TabTitle text="기본 정보" goPage={AssistantInfoTab.basicInfo} />
        <TabTitle text="건강 정보" goPage={AssistantInfoTab.healthInfo} />
        <TabTitle text="생활 정보" goPage={AssistantInfoTab.lifeInfo} />
        <TabTitle
          text="자립생활 역량"
          goPage={AssistantInfoTab.independentInfo}
        />
      </div>
      <TabContent
        activeTab={activeTab}
        hideIndependentInfoTab={hideIndependentInfoTab}
      />
    </div>
  );
};

export default AssistantInfo;
