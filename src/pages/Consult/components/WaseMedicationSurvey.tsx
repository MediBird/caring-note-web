import {
  WasteMedicationDisposalDrugRemainActionTypeEnum,
  WasteMedicationDisposalRecoveryAgreementTypeEnum,
  WasteMedicationDisposalReqUnusedReasonTypesEnum,
} from '@/api';
import InputContainer from '@/components/common/InputContainer';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  AddAndUpdateWasteMedicationDisposalDTO,
  WasteMedicationDisposalDrugRemainActionDetailEnum,
} from '@/pages/Consult/types/WasteMedicationDTO';
import { CheckedState } from '@radix-ui/react-checkbox';

interface WasteMedicationSurveyProps {
  wasteMedicationDisposal: AddAndUpdateWasteMedicationDisposalDTO;
  setWasteMedicationDisposal: (
    value: AddAndUpdateWasteMedicationDisposalDTO,
  ) => void;
  handleUnusedReasonTypesChange: (
    type: WasteMedicationDisposalReqUnusedReasonTypesEnum,
    checked: CheckedState,
  ) => void;
}

const WasteMedicationSurvey = ({
  wasteMedicationDisposal,
  setWasteMedicationDisposal,
  handleUnusedReasonTypesChange,
}: WasteMedicationSurveyProps) => {
  return (
    <>
      <div className="rounded-lg bg-grayscale-3 p-4">
        <p className="mb-4 text-body1 font-semibold">
          사용하지 않고 약이 남는 경우에 누구의 판단으로 사용하지 않게 되었나요?
        </p>
        <RadioGroup
          id="drugRemainActionType"
          className="flex flex-row"
          onValueChange={(value) => {
            setWasteMedicationDisposal({
              ...wasteMedicationDisposal,
              drugRemainActionType:
                value as WasteMedicationDisposalDrugRemainActionTypeEnum,
            });
          }}
          value={wasteMedicationDisposal.drugRemainActionType}>
          <InputContainer>
            <RadioGroupItem
              value={
                WasteMedicationDisposalDrugRemainActionTypeEnum.DoctorOrPharmacist
              }
              id={
                WasteMedicationDisposalDrugRemainActionTypeEnum.DoctorOrPharmacist
              }
            />
            <Label
              htmlFor={
                WasteMedicationDisposalDrugRemainActionTypeEnum.DoctorOrPharmacist
              }>
              의/약사 지시
            </Label>
          </InputContainer>
          <InputContainer>
            <RadioGroupItem
              value={
                WasteMedicationDisposalDrugRemainActionTypeEnum.SelfDecision
              }
              id={WasteMedicationDisposalDrugRemainActionTypeEnum.SelfDecision}
            />
            <Label
              htmlFor={
                WasteMedicationDisposalDrugRemainActionTypeEnum.SelfDecision
              }>
              본인 판단
            </Label>
          </InputContainer>
          <InputContainer>
            <RadioGroupItem
              value={WasteMedicationDisposalDrugRemainActionTypeEnum.None}
              id={WasteMedicationDisposalDrugRemainActionTypeEnum.None}
            />
            <Label
              htmlFor={WasteMedicationDisposalDrugRemainActionTypeEnum.None}>
              폐의약품 없음
            </Label>
          </InputContainer>
        </RadioGroup>
      </div>
      {wasteMedicationDisposal.drugRemainActionType &&
        wasteMedicationDisposal.drugRemainActionType !==
          WasteMedicationDisposalDrugRemainActionTypeEnum.None && (
          <div className="mt-4 flex flex-col gap-6 rounded-lg bg-grayscale-3 p-4">
            <div>
              <p className="mb-4 text-body1 font-semibold">
                사용하지 않은 주된 이유
              </p>
              <form className="flex flex-row">
                <div className="w-1/3 space-y-4">
                  <InputContainer>
                    <Checkbox
                      id={
                        WasteMedicationDisposalReqUnusedReasonTypesEnum.Recovered
                      }
                      checked={wasteMedicationDisposal.unusedReasonTypes?.includes(
                        WasteMedicationDisposalReqUnusedReasonTypesEnum.Recovered,
                      )}
                      value={
                        WasteMedicationDisposalReqUnusedReasonTypesEnum.Recovered
                      }
                      onCheckedChange={(value) => {
                        handleUnusedReasonTypesChange(
                          WasteMedicationDisposalReqUnusedReasonTypesEnum.Recovered,
                          value,
                        );
                      }}
                    />
                    <Label
                      htmlFor={
                        WasteMedicationDisposalReqUnusedReasonTypesEnum.Recovered
                      }>
                      상태가 호전되어 먹을 필요가 없어짐
                    </Label>
                  </InputContainer>
                  <InputContainer>
                    <Checkbox
                      id={
                        WasteMedicationDisposalReqUnusedReasonTypesEnum.SideEffect
                      }
                      checked={wasteMedicationDisposal.unusedReasonTypes?.includes(
                        WasteMedicationDisposalReqUnusedReasonTypesEnum.SideEffect,
                      )}
                      value={
                        WasteMedicationDisposalReqUnusedReasonTypesEnum.SideEffect
                      }
                      onCheckedChange={(value) => {
                        handleUnusedReasonTypesChange(
                          WasteMedicationDisposalReqUnusedReasonTypesEnum.SideEffect,
                          value,
                        );
                      }}
                    />
                    <Label
                      htmlFor={
                        WasteMedicationDisposalReqUnusedReasonTypesEnum.SideEffect
                      }>
                      부작용이 나타나 사용 중단함
                    </Label>
                  </InputContainer>

                  <InputContainer>
                    <Checkbox
                      id={
                        WasteMedicationDisposalReqUnusedReasonTypesEnum.Retreated
                      }
                      checked={wasteMedicationDisposal.unusedReasonTypes?.includes(
                        WasteMedicationDisposalReqUnusedReasonTypesEnum.Retreated,
                      )}
                      onCheckedChange={(value) => {
                        handleUnusedReasonTypesChange(
                          WasteMedicationDisposalReqUnusedReasonTypesEnum.Retreated,
                          value,
                        );
                      }}
                    />
                    <Label
                      htmlFor={
                        WasteMedicationDisposalReqUnusedReasonTypesEnum.Retreated
                      }>
                      재처방 받음
                    </Label>
                  </InputContainer>
                  <div className="flex flex-col gap-2">
                    <InputContainer>
                      <Checkbox
                        id={WasteMedicationDisposalReqUnusedReasonTypesEnum.Etc}
                        checked={wasteMedicationDisposal.unusedReasonTypes?.includes(
                          WasteMedicationDisposalReqUnusedReasonTypesEnum.Etc,
                        )}
                        onCheckedChange={(value) => {
                          handleUnusedReasonTypesChange(
                            WasteMedicationDisposalReqUnusedReasonTypesEnum.Etc,
                            value,
                          );
                        }}
                      />
                      <Label
                        htmlFor={
                          WasteMedicationDisposalReqUnusedReasonTypesEnum.Etc
                        }>
                        기타
                      </Label>
                    </InputContainer>
                    {wasteMedicationDisposal.unusedReasonTypes?.includes(
                      WasteMedicationDisposalReqUnusedReasonTypesEnum.Etc,
                    ) && (
                      <Input
                        className="ml-6 w-[540px]"
                        placeholder="내용을 작성해 주세요."
                        value={wasteMedicationDisposal.unusedReasonDetail}
                        onChange={(e) => {
                          setWasteMedicationDisposal({
                            ...wasteMedicationDisposal,
                            unusedReasonDetail: e.target.value,
                          });
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <InputContainer>
                    <Checkbox
                      id={
                        WasteMedicationDisposalReqUnusedReasonTypesEnum.Replaced
                      }
                      checked={wasteMedicationDisposal.unusedReasonTypes?.includes(
                        WasteMedicationDisposalReqUnusedReasonTypesEnum.Replaced,
                      )}
                      onCheckedChange={(value) => {
                        handleUnusedReasonTypesChange(
                          WasteMedicationDisposalReqUnusedReasonTypesEnum.Replaced,
                          value,
                        );
                      }}
                    />
                    <Label
                      htmlFor={
                        WasteMedicationDisposalReqUnusedReasonTypesEnum.Replaced
                      }>
                      다른 약으로 대체함
                    </Label>
                  </InputContainer>

                  <InputContainer>
                    <Checkbox
                      id={
                        WasteMedicationDisposalReqUnusedReasonTypesEnum.Forgotten
                      }
                      checked={wasteMedicationDisposal.unusedReasonTypes?.includes(
                        WasteMedicationDisposalReqUnusedReasonTypesEnum.Forgotten,
                      )}
                      onCheckedChange={(value) => {
                        handleUnusedReasonTypesChange(
                          WasteMedicationDisposalReqUnusedReasonTypesEnum.Forgotten,
                          value,
                        );
                      }}
                    />
                    <Label
                      htmlFor={
                        WasteMedicationDisposalReqUnusedReasonTypesEnum.Forgotten
                      }>
                      약 먹는 것을 잊어버림
                    </Label>
                  </InputContainer>

                  <InputContainer>
                    <Checkbox
                      id={
                        WasteMedicationDisposalReqUnusedReasonTypesEnum.Reserved
                      }
                      checked={wasteMedicationDisposal.unusedReasonTypes?.includes(
                        WasteMedicationDisposalReqUnusedReasonTypesEnum.Reserved,
                      )}
                      onCheckedChange={(value) => {
                        handleUnusedReasonTypesChange(
                          WasteMedicationDisposalReqUnusedReasonTypesEnum.Reserved,
                          value,
                        );
                      }}
                    />
                    <Label
                      htmlFor={
                        WasteMedicationDisposalReqUnusedReasonTypesEnum.Reserved
                      }>
                      필요시 복용하려고 남겨둠
                    </Label>
                  </InputContainer>
                </div>
              </form>
            </div>
            <div>
              <p className="mb-4 text-body1 font-semibold">주된 처리 방법</p>

              <RadioGroup
                id="whos-decision"
                className="flex flex-row"
                onValueChange={(value) => {
                  setWasteMedicationDisposal({
                    ...wasteMedicationDisposal,
                    drugRemainActionDetail: value as string,
                  });
                }}>
                <div className="w-1/3 space-y-4">
                  <InputContainer>
                    <RadioGroupItem
                      id="way-to-discard-1"
                      value={
                        WasteMedicationDisposalDrugRemainActionDetailEnum.Stacked
                      }
                      checked={
                        wasteMedicationDisposal.drugRemainActionDetail ===
                        WasteMedicationDisposalDrugRemainActionDetailEnum.Stacked
                      }
                    />
                    <Label htmlFor="way-to-discard-1">쌓아둠</Label>
                  </InputContainer>
                  <InputContainer>
                    <RadioGroupItem
                      id="way-to-discard-2"
                      value={
                        WasteMedicationDisposalDrugRemainActionDetailEnum.Shared
                      }
                      checked={
                        wasteMedicationDisposal.drugRemainActionDetail ===
                        WasteMedicationDisposalDrugRemainActionDetailEnum.Shared
                      }
                    />
                    <Label htmlFor="way-to-discard-2">지인에게 나눠줌</Label>
                  </InputContainer>
                  <InputContainer>
                    <RadioGroupItem
                      id="way-to-discard-3"
                      value={
                        WasteMedicationDisposalDrugRemainActionDetailEnum.Etc
                      }
                      checked={
                        wasteMedicationDisposal.drugRemainActionDetail ===
                        WasteMedicationDisposalDrugRemainActionDetailEnum.Etc
                      }
                    />
                    <Label htmlFor="way-to-discard-3">기타</Label>
                  </InputContainer>
                </div>
                <div className="space-y-4">
                  <InputContainer>
                    <RadioGroupItem
                      id="way-to-discard-4"
                      value={
                        WasteMedicationDisposalDrugRemainActionDetailEnum.Trash
                      }
                      checked={
                        wasteMedicationDisposal.drugRemainActionDetail ===
                        WasteMedicationDisposalDrugRemainActionDetailEnum.Trash
                      }
                    />
                    <Label htmlFor="way-to-discard-4">쓰레기통에 버림</Label>
                  </InputContainer>
                  <InputContainer>
                    <RadioGroupItem
                      id="way-to-discard-5"
                      value={
                        WasteMedicationDisposalDrugRemainActionDetailEnum.Designated
                      }
                      checked={
                        wasteMedicationDisposal.drugRemainActionDetail ===
                        WasteMedicationDisposalDrugRemainActionDetailEnum.Designated
                      }
                    />
                    <Label htmlFor="way-to-discard-5">
                      폐의약품 수거함 등 지정된 폐기 장소에 버림
                    </Label>
                  </InputContainer>
                </div>
              </RadioGroup>
            </div>
            <div>
              <p className="mb-4 text-body1 font-semibold">폐의약품 회수</p>
              <RadioGroup
                id="medicine-collection"
                className="flex flex-row"
                onValueChange={(value) => {
                  setWasteMedicationDisposal({
                    ...wasteMedicationDisposal,
                    recoveryAgreementType:
                      value as WasteMedicationDisposalRecoveryAgreementTypeEnum,
                  });
                }}>
                <div className="w-1/3 space-y-4">
                  <InputContainer>
                    <RadioGroupItem
                      id="collection-agree"
                      value={
                        WasteMedicationDisposalRecoveryAgreementTypeEnum.Agree
                      }
                      checked={
                        wasteMedicationDisposal.recoveryAgreementType ===
                        WasteMedicationDisposalRecoveryAgreementTypeEnum.Agree
                      }
                    />
                    <Label htmlFor="collection-agree">회수 동의</Label>
                  </InputContainer>
                </div>
                <div className="space-y-4">
                  <InputContainer>
                    <RadioGroupItem
                      id="collection-disagree"
                      value={
                        WasteMedicationDisposalRecoveryAgreementTypeEnum.Disagree
                      }
                      checked={
                        wasteMedicationDisposal.recoveryAgreementType ===
                        WasteMedicationDisposalRecoveryAgreementTypeEnum.Disagree
                      }
                    />
                    <Label htmlFor="collection-disagree">회수 미동의</Label>
                  </InputContainer>
                </div>
              </RadioGroup>
            </div>
            <div>
              <p className="mb-4 text-body1 font-semibold">폐의약품 무게</p>
              <span className="flex flex-row items-center justify-start gap-1">
                <Input
                  placeholder="00"
                  className="h-[26px] w-24 rounded-none !border-0 !border-b !border-grayscale-30 bg-transparent p-0 pr-[2px] text-right"
                  value={
                    wasteMedicationDisposal.wasteMedicationGram
                      ? wasteMedicationDisposal.wasteMedicationGram
                      : ''
                  }
                  onChange={(e) => {
                    setWasteMedicationDisposal({
                      ...wasteMedicationDisposal,
                      wasteMedicationGram: Number(e.target.value),
                    });
                  }}
                />
                <span className="text-body1">g</span>
              </span>
            </div>
          </div>
        )}
    </>
  );
};

export default WasteMedicationSurvey;
