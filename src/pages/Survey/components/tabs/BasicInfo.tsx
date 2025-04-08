import {
  BaseInfoDTOHealthInsuranceTypeEnum,
  CounselPurposeAndNoteDTOCounselPurposeEnum,
} from '@/api';
import { ButtonGroup } from '@/components/ui/button-group';
import { Card } from '@/components/ui/card';
import CardSection from '@/components/ui/card-section';
import { FormInput } from '@/components/ui/form-input';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  COUNSEL_PURPOSE_OPTIONS,
  HEALTH_INSURANCE_TYPE_OPTIONS,
} from '@/utils/constants';
import { validateDateOfBirth } from '@/utils/inputValidations';
import { useCounselCardStore } from '../../hooks/counselCardStore';

export default function BasicInfo() {
  const { infoData, setInfoData } = useCounselCardStore();
  const baseInfo = infoData.base;

  const handleUpdateBaseInfo = (
    field: 'healthInsuranceType' | 'significantNote' | 'medicationNote',
    value: string,
  ) => {
    setInfoData('base', {
      ...baseInfo,
      counselPurposeAndNote: {
        ...baseInfo?.counselPurposeAndNote,
        [field]: value,
      },
    });
  };

  return (
    <Card className="flex w-full flex-col gap-5">
      <CardSection
        title="기본 정보"
        variant="grayscale"
        items={[
          {
            label: '성명',
            value: (
              <Input
                value={baseInfo?.baseInfo?.counseleeName || ''}
                onChange={(e) =>
                  setInfoData('base', {
                    ...baseInfo,
                    baseInfo: {
                      ...baseInfo?.baseInfo,
                      counseleeName: e.target.value,
                    },
                  })
                }
                className="max-w-[200px]"
              />
            ),
          },
          {
            label: '생년월일',
            value: (
              <FormInput
                placeholder="YYYY-MM-DD"
                value={baseInfo?.baseInfo?.birthDate || ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  let formattedDate = '';

                  if (value.length <= 4) {
                    formattedDate = value;
                  } else if (value.length <= 6) {
                    formattedDate = `${value.slice(0, 4)}-${value.slice(4)}`;
                  } else {
                    formattedDate = `${value.slice(0, 4)}-${value.slice(
                      4,
                      6,
                    )}-${value.slice(6, 8)}`;
                  }

                  setInfoData('base', {
                    ...baseInfo,
                    baseInfo: {
                      ...baseInfo?.baseInfo,
                      birthDate: formattedDate,
                    },
                  });
                }}
                maxLength={10}
                validation={validateDateOfBirth}
                className="max-w-[200px]"
              />
            ),
          },
          {
            label: '의료보장형태',
            value: (
              <ButtonGroup
                options={HEALTH_INSURANCE_TYPE_OPTIONS}
                value={baseInfo?.baseInfo?.healthInsuranceType || ''}
                onChange={(value) => {
                  setInfoData('base', {
                    ...baseInfo,
                    baseInfo: {
                      ...baseInfo?.baseInfo,
                      healthInsuranceType:
                        value as BaseInfoDTOHealthInsuranceTypeEnum,
                    },
                  });
                }}
              />
            ),
          },
          {
            label: '최근 상담일',
            value: baseInfo?.baseInfo?.lastCounselDate || '',
          },
        ]}
      />
      <CardSection
        title="상담 목적 및 특이사항"
        items={[
          {
            label: (
              <>
                상담 목적<span className="text-red-500">*</span>
              </>
            ),
            subLabel: '여러 개를 동시에 선택할 수 있어요',
            value: (
              <ButtonGroup
                options={COUNSEL_PURPOSE_OPTIONS}
                value={Array.from(
                  baseInfo?.counselPurposeAndNote?.counselPurpose || [],
                )}
                onChange={(value) => {
                  const currentPurposes =
                    baseInfo?.counselPurposeAndNote?.counselPurpose || [];
                  const valueAsEnum =
                    value as CounselPurposeAndNoteDTOCounselPurposeEnum;

                  const updatedPurposes = currentPurposes.includes(valueAsEnum)
                    ? currentPurposes.filter(
                        (purpose: CounselPurposeAndNoteDTOCounselPurposeEnum) =>
                          purpose !== valueAsEnum,
                      )
                    : [...currentPurposes, valueAsEnum];

                  setInfoData('base', {
                    ...baseInfo,
                    counselPurposeAndNote: {
                      ...baseInfo?.counselPurposeAndNote,
                      counselPurpose: updatedPurposes,
                    },
                  });
                }}
                className="flex-wrap"
                multiple
              />
            ),
          },
          {
            label: '특이사항',
            subLabel: '',
            value: (
              <Textarea
                id="significantNote"
                className="min-h-[100px] w-full rounded border p-2"
                value={baseInfo?.counselPurposeAndNote?.significantNote || ''}
                onChange={(e) =>
                  handleUpdateBaseInfo('significantNote', e.target.value)
                }
                placeholder="특이사항 혹은 약사에게 궁금한 점을 작성해주세요."
              />
            ),
          },
          {
            label: '의약물',
            subLabel: '',
            value: (
              <Textarea
                id="medicationNote"
                className="min-h-[100px] w-full rounded border p-2"
                value={baseInfo?.counselPurposeAndNote?.medicationNote || ''}
                onChange={(e) =>
                  handleUpdateBaseInfo('medicationNote', e.target.value)
                }
                placeholder="약사님께 전달해 드릴 의약물을 작성해 주세요."
              />
            ),
          },
        ]}
      />
    </Card>
  );
}
