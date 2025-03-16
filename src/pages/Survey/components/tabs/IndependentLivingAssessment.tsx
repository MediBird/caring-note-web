import {
  CommunicationDTOCommunicationsEnum,
  CommunicationDTOHearingsEnum,
  CommunicationDTOSightsEnum,
  CommunicationDTOUsingKoreansEnum,
  CounselCardIndependentLifeInformationRes,
  EvacuationDTOEvacuationsEnum,
  WalkingDTOWalkingEquipmentsEnum,
  WalkingDTOWalkingMethodsEnum,
} from '@/api/api';
import { ButtonGroup } from '@/components/ui/button-group';
import { Card } from '@/components/ui/card';
import CardSection from '@/components/ui/cardSection';
import { Textarea } from '@/components/ui/textarea';
import { useCounselCardIndependentLifeInfoStore } from '../../hooks/counselCardStore';
import { useCounselCardIndependentLifeInfoQuery } from '../../hooks/useCounselCardQuery';

interface IndependentLivingAssessmentProps {
  counselSessionId: string;
}

export default function IndependentLivingAssessment({
  counselSessionId,
}: IndependentLivingAssessmentProps) {
  const { independentLifeInfo, setIndependentLifeInfo } =
    useCounselCardIndependentLifeInfoStore();
  const { isLoading } =
    useCounselCardIndependentLifeInfoQuery(counselSessionId);

  const handleUpdateIndependentLifeInfo = (
    field: string,
    value: string | string[],
  ) => {
    const [section, key] = field.split('.');
    const updatedSection = {
      ...independentLifeInfo?.[
        section as keyof CounselCardIndependentLifeInformationRes
      ],
      [key]: Array.isArray(value) ? new Set(value) : value,
    };

    setIndependentLifeInfo({
      ...independentLifeInfo,
      [section]: updatedSection,
    } as CounselCardIndependentLifeInformationRes);
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <Card>
      <CardSection
        title="보행"
        variant="error"
        items={[
          {
            label: '보행 방법',
            subLabel: '여러 개를 동시에 선택할 수 있어요.',
            value: (
              <ButtonGroup
                options={[
                  {
                    label: '와상 및 보행불가',
                    value: WalkingDTOWalkingMethodsEnum.Bedridden,
                  },
                  {
                    label: '자립보행 가능',
                    value: WalkingDTOWalkingMethodsEnum.IndependentWalk,
                  },
                  {
                    label: '보조기구 필요',
                    value: WalkingDTOWalkingMethodsEnum.NeedsMobilityAid,
                  },
                ]}
                value={Array.from(
                  independentLifeInfo?.walking?.walkingMethods || [],
                )}
                onChange={(value) =>
                  handleUpdateIndependentLifeInfo(
                    'walking.walkingMethods',
                    value.split(','),
                  )
                }
                multiple={true}
              />
            ),
          },
          {
            label: '이동 보조 장비',
            subLabel: '여러 개를 동시에 선택할 수 있어요.',
            value: (
              <ButtonGroup
                options={[
                  {
                    label: '지팡이',
                    value: WalkingDTOWalkingEquipmentsEnum.Cane,
                  },
                  {
                    label: '워커',
                    value: WalkingDTOWalkingEquipmentsEnum.Walker,
                  },
                  {
                    label: '휠체어',
                    value: WalkingDTOWalkingEquipmentsEnum.Wheelchair,
                  },
                  {
                    label: '기타',
                    value: WalkingDTOWalkingEquipmentsEnum.Other,
                  },
                ]}
                value={Array.from(
                  independentLifeInfo?.walking?.walkingEquipments || [],
                )}
                onChange={(value) =>
                  handleUpdateIndependentLifeInfo(
                    'walking.walkingEquipments',
                    value.split(','),
                  )
                }
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
                  handleUpdateIndependentLifeInfo(
                    'walking.walkingNote',
                    e.target.value,
                  )
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
                options={[
                  {
                    label: '자립 화장실 사용',
                    value: EvacuationDTOEvacuationsEnum.Independent,
                  },
                  {
                    label: '화장실 유도',
                    value: EvacuationDTOEvacuationsEnum.Guided,
                  },
                  {
                    label: '이동식 변기 사용',
                    value: EvacuationDTOEvacuationsEnum.PortableToilet,
                  },
                  {
                    label: '기저귀 사용',
                    value: EvacuationDTOEvacuationsEnum.Diaper,
                  },
                  {
                    label: '소변통 사용',
                    value: EvacuationDTOEvacuationsEnum.Urinal,
                  },
                  { label: '기타', value: EvacuationDTOEvacuationsEnum.Other },
                ]}
                value={Array.from(
                  independentLifeInfo?.evacuation?.evacuations || [],
                )}
                onChange={(value) =>
                  handleUpdateIndependentLifeInfo(
                    'evacuation.evacuations',
                    value.split(','),
                  )
                }
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
                  handleUpdateIndependentLifeInfo(
                    'evacuation.evacuationNote',
                    e.target.value,
                  )
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
                options={[
                  {
                    label: '잘 보임',
                    value: CommunicationDTOSightsEnum.WellSeen,
                  },
                  {
                    label: '잘 안보임',
                    value: CommunicationDTOSightsEnum.PoorlySeen,
                  },
                  {
                    label: '전혀 안보임',
                    value: CommunicationDTOSightsEnum.NotSeen,
                  },
                  {
                    label: '안경 사용',
                    value: CommunicationDTOSightsEnum.UsingGlasses,
                  },
                ]}
                value={Array.from(
                  independentLifeInfo?.communication?.sights || [],
                )}
                onChange={(value) =>
                  handleUpdateIndependentLifeInfo(
                    'communication.sights',
                    value.split(','),
                  )
                }
                multiple={true}
              />
            ),
          },
          {
            label: '청력',
            subLabel: '여러 개를 동시에 선택할 수 있어요.',
            value: (
              <ButtonGroup
                options={[
                  {
                    label: '잘 들림',
                    value: CommunicationDTOHearingsEnum.WellHeard,
                  },
                  {
                    label: '잘 안들림',
                    value: CommunicationDTOHearingsEnum.PoorlyHeard,
                  },
                  {
                    label: '전혀 안들림',
                    value: CommunicationDTOHearingsEnum.NotHeard,
                  },
                  {
                    label: '보청기 사용',
                    value: CommunicationDTOHearingsEnum.UsingHearingAid,
                  },
                ]}
                value={Array.from(
                  independentLifeInfo?.communication?.hearings || [],
                )}
                onChange={(value) =>
                  handleUpdateIndependentLifeInfo(
                    'communication.hearings',
                    value.split(','),
                  )
                }
                multiple={true}
              />
            ),
          },
          {
            label: '언어 소통',
            value: (
              <ButtonGroup
                options={[
                  {
                    label: '소통 가능함',
                    value: CommunicationDTOCommunicationsEnum.WellCommunicate,
                  },
                  {
                    label: '대강 가능함',
                    value: CommunicationDTOCommunicationsEnum.SemiCommunicate,
                  },
                  {
                    label: '불가능',
                    value: CommunicationDTOCommunicationsEnum.NotCommunicate,
                  },
                ]}
                value={Array.from(
                  independentLifeInfo?.communication?.communications || [],
                )}
                onChange={(value) =>
                  handleUpdateIndependentLifeInfo(
                    'communication.usingKoreans',
                    value.split(','),
                  )
                }
                multiple={true}
              />
            ),
          },
          {
            label: '한글 사용',
            subLabel: '여러 개를 동시에 선택할 수 있어요.',
            value: (
              <ButtonGroup
                options={[
                  {
                    label: '읽기 가능',
                    value: CommunicationDTOUsingKoreansEnum.Read,
                  },
                  {
                    label: '쓰기 가능',
                    value: CommunicationDTOUsingKoreansEnum.Write,
                  },
                ]}
                value={Array.from(
                  independentLifeInfo?.communication?.usingKoreans || [],
                )}
                onChange={(value) =>
                  handleUpdateIndependentLifeInfo(
                    'communication.usingKoreans',
                    value.split(','),
                  )
                }
                multiple={true}
              />
            ),
          },
        ]}
      />
    </Card>
  );
}
