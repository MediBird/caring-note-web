import { AssistantInfoTab } from '@/pages/Survey/{counselsession_id}/store/surveyTabStore';
import BaseInfo from '@/pages/Survey/{counselsession_id}/tabs/BaseInfo';
import IndependentInfo from '@/pages/Survey/{counselsession_id}/tabs/IndependentInfo';
import HealthInfo from '@/pages/Survey/{counselsession_id}/tabs/HealthInfo';
import LivingInfo from '@/pages/Survey/{counselsession_id}/tabs/LivingInfo';

const TabContent = ({
  activeTab,
  openIndependentInfoTab,
}: {
  activeTab: AssistantInfoTab;
  openIndependentInfoTab: boolean;
}) => {
  const defaultTab = openIndependentInfoTab ? (
    <BaseInfo />
  ) : (
    <IndependentInfo />
  );

  switch (activeTab) {
    case AssistantInfoTab.basicInfo:
      return <BaseInfo />;
    case AssistantInfoTab.healthInfo:
      return <HealthInfo />;
    case AssistantInfoTab.lifeInfo:
      return <LivingInfo />;
    case AssistantInfoTab.independentInfo:
      return <IndependentInfo />;
    default:
      return defaultTab;
  }
};
export default TabContent;
