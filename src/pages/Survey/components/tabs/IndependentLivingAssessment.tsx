import {
  CommunicationDTOCommunicationsEnum,
  CommunicationDTOHearingsEnum,
  CommunicationDTOSightsEnum,
  CommunicationDTOUsingKoreansEnum,
  EvacuationDTOEvacuationsEnum,
  WalkingDTOWalkingEquipmentsEnum,
  WalkingDTOWalkingMethodsEnum,
} from '@/api';
import { ButtonGroup } from '@/components/ui/button-group';
import { Card } from '@/components/ui/card';
import CardSection from '@/components/ui/card-section';
import { Textarea } from '@/components/ui/textarea';
import {
  COMMUNICATIONS_OPTIONS,
  EVACUATIONS_OPTIONS,
  HEARINGS_OPTIONS,
  SIGHTS_OPTIONS,
  USING_KOREANS_OPTIONS,
  WALKING_EQUIPMENTS_OPTIONS,
  WALKING_METHODS_OPTIONS,
} from '@/utils/constants';
import { useCounselCardStore } from '../../hooks/counselCardStore';
import { useCounselCardIndependentLifeInfoQuery } from '../../hooks/useCounselCardQuery';

interface IndependentLivingAssessmentProps {
  counselSessionId: string;
}

export default function IndependentLivingAssessment({
  counselSessionId,
}: IndependentLivingAssessmentProps) {
  const { independentLifeInfo, setIndependentLifeInfo } = useCounselCardStore();
  const { isLoading } =
    useCounselCardIndependentLifeInfoQuery(counselSessionId);

  const handleWalkingMethodsChange = (value: string) => {
    const enumValue = value as WalkingDTOWalkingMethodsEnum;
    const currentMethods = new Set(
      independentLifeInfo?.walking?.walkingMethods || [],
    );

    if (currentMethods.has(enumValue)) {
      currentMethods.delete(enumValue);
    } else {
      currentMethods.add(enumValue);
    }

    setIndependentLifeInfo({
      ...independentLifeInfo,
      walking: {
        ...independentLifeInfo?.walking,
        walkingMethods: Array.from(currentMethods),
      },
    });
  };

  const handleWalkingEquipmentsChange = (value: string) => {
    const enumValue = value as WalkingDTOWalkingEquipmentsEnum;
    const currentEquipments = new Set(
      independentLifeInfo?.walking?.walkingEquipments || [],
    );

    if (currentEquipments.has(enumValue)) {
      currentEquipments.delete(enumValue);
    } else {
      currentEquipments.add(enumValue);
    }

    setIndependentLifeInfo({
      ...independentLifeInfo,
      walking: {
        ...independentLifeInfo?.walking,
        walkingEquipments: Array.from(currentEquipments),
      },
    });
  };

  const handleEvacuationsChange = (value: string) => {
    const enumValue = value as EvacuationDTOEvacuationsEnum;
    const currentEvacuations = new Set(
      independentLifeInfo?.evacuation?.evacuations || [],
    );

    if (currentEvacuations.has(enumValue)) {
      currentEvacuations.delete(enumValue);
    } else {
      currentEvacuations.add(enumValue);
    }

    setIndependentLifeInfo({
      ...independentLifeInfo,
      evacuation: {
        ...independentLifeInfo?.evacuation,
        evacuations: Array.from(currentEvacuations),
      },
    });
  };

  const handleSightsChange = (value: string) => {
    const enumValue = value as CommunicationDTOSightsEnum;
    const currentSights = independentLifeInfo?.communication?.sights || [];

    if (currentSights.includes(enumValue)) {
      currentSights.splice(currentSights.indexOf(enumValue), 1);
    } else {
      currentSights.push(enumValue);
    }

    setIndependentLifeInfo({
      ...independentLifeInfo,
      communication: {
        ...independentLifeInfo?.communication,
        sights: currentSights,
      },
    });
  };

  const handleHearingsChange = (value: string) => {
    const enumValue = value as CommunicationDTOHearingsEnum;
    const currentHearings = independentLifeInfo?.communication?.hearings || [];

    if (currentHearings.includes(enumValue)) {
      currentHearings.splice(currentHearings.indexOf(enumValue), 1);
    } else {
      currentHearings.push(enumValue);
    }

    setIndependentLifeInfo({
      ...independentLifeInfo,
      communication: {
        ...independentLifeInfo?.communication,
        hearings: currentHearings,
      },
    });
  };

  const handleCommunicationsChange = (value: string) => {
    const enumValue = value as CommunicationDTOCommunicationsEnum;
    setIndependentLifeInfo({
      ...independentLifeInfo,
      communication: {
        ...independentLifeInfo?.communication,
        communications: enumValue,
      },
    });
  };

  const handleUsingKoreansChange = (value: string) => {
    const enumValue = value as CommunicationDTOUsingKoreansEnum;
    const currentUsingKoreans =
      independentLifeInfo?.communication?.usingKoreans || [];

    if (currentUsingKoreans.includes(enumValue)) {
      currentUsingKoreans.splice(currentUsingKoreans.indexOf(enumValue), 1);
    } else {
      currentUsingKoreans.push(enumValue);
    }

    setIndependentLifeInfo({
      ...independentLifeInfo,
      communication: {
        ...independentLifeInfo?.communication,
        usingKoreans: currentUsingKoreans,
      },
    });
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <Card className="flex w-full flex-col gap-5">
      <CardSection
        title="보행"
        variant="error"
        items={[
          {
            label: '보행 방법',
            subLabel: '여러 개를 동시에 선택할 수 있어요.',
            value: (
              <ButtonGroup
                options={WALKING_METHODS_OPTIONS}
                value={Array.from(
                  independentLifeInfo?.walking?.walkingMethods || [],
                )}
                onChange={handleWalkingMethodsChange}
                multiple={true}
              />
            ),
          },
          {
            label: '이동 보조 장비',
            subLabel: '여러 개를 동시에 선택할 수 있어요.',
            value: (
              <ButtonGroup
                options={WALKING_EQUIPMENTS_OPTIONS}
                value={Array.from(
                  independentLifeInfo?.walking?.walkingEquipments || [],
                )}
                onChange={handleWalkingEquipmentsChange}
                multiple={true}
              />
            ),
          },
          {
            label: '기타',
            value: (
              <Textarea
                placeholder="'기타' 선택시, 이동 보조 장비를 작성해주세요."
                className="w-full rounded border p-2"
                value={independentLifeInfo?.walking?.walkingNote || ''}
                onChange={(e) =>
                  setIndependentLifeInfo({
                    ...independentLifeInfo,
                    walking: {
                      ...independentLifeInfo?.walking,
                      walkingNote: e.target.value,
                    },
                  })
                }
              />
            ),
          },
        ]}
      />
      <CardSection
        title="배변"
        items={[
          {
            label: '배변 처리 방식',
            subLabel: '여러 개를 동시에 선택할 수 있어요.',
            value: (
              <ButtonGroup
                options={EVACUATIONS_OPTIONS}
                value={Array.from(
                  independentLifeInfo?.evacuation?.evacuations || [],
                )}
                onChange={handleEvacuationsChange}
                multiple={true}
              />
            ),
          },
          {
            label: '기타',
            value: (
              <Textarea
                placeholder="'기타' 선택시, 배변 처리 방식을 작성해주세요."
                className="w-full rounded border p-2"
                value={independentLifeInfo?.evacuation?.evacuationNote || ''}
                onChange={(e) =>
                  setIndependentLifeInfo({
                    ...independentLifeInfo,
                    evacuation: {
                      ...independentLifeInfo?.evacuation,
                      evacuationNote: e.target.value,
                    },
                  })
                }
              />
            ),
          },
        ]}
      />
      <CardSection
        title="의사소통 정도"
        items={[
          {
            label: '시력',
            subLabel: '여러 개를 동시에 선택할 수 있어요.',
            value: (
              <ButtonGroup
                options={SIGHTS_OPTIONS}
                value={Array.from(
                  independentLifeInfo?.communication?.sights || [],
                )}
                onChange={handleSightsChange}
                multiple={true}
              />
            ),
          },
          {
            label: '청력',
            subLabel: '여러 개를 동시에 선택할 수 있어요.',
            value: (
              <ButtonGroup
                options={HEARINGS_OPTIONS}
                value={Array.from(
                  independentLifeInfo?.communication?.hearings || [],
                )}
                onChange={handleHearingsChange}
                multiple={true}
              />
            ),
          },
          {
            label: '언어 소통',
            value: (
              <ButtonGroup
                options={COMMUNICATIONS_OPTIONS}
                value={independentLifeInfo?.communication?.communications || ''}
                onChange={handleCommunicationsChange}
                multiple={false}
              />
            ),
          },
          {
            label: '한글 사용',
            subLabel: '여러 개를 동시에 선택할 수 있어요.',
            value: (
              <ButtonGroup
                options={USING_KOREANS_OPTIONS}
                value={Array.from(
                  independentLifeInfo?.communication?.usingKoreans || [],
                )}
                onChange={handleUsingKoreansChange}
                multiple={true}
              />
            ),
          },
        ]}
      />
    </Card>
  );
}
