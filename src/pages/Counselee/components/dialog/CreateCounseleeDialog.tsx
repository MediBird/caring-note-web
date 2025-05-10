import { AddCounseleeReqGenderTypeEnum } from '@/api';
import personAddIcon from '@/assets/icon/20/personadd.svg';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FormInput } from '@/components/ui/form-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  validateDateOfBirth,
  validateName,
  validatePhoneNumber,
} from '@/utils/inputValidations';
import { AsYouType } from 'libphonenumber-js';
import { XIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useCreateCounseleeInfo } from '../../hooks/query/useCounseleeQuery';

export interface AddCounseleeFormData {
  id?: string;
  name: string;
  dateOfBirth: string;
  genderType: AddCounseleeReqGenderTypeEnum;
  phoneNumber: string;
  address: string;
  careManagerName: string;
  affiliatedWelfareInstitution: string;
  isDisability: boolean;
  note: string;
}

export const CreateCounseleeDialog = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<AddCounseleeFormData>(() => {
    return {
      name: '',
      dateOfBirth: '',
      genderType: AddCounseleeReqGenderTypeEnum.Female,
      phoneNumber: '',
      address: '',
      careManagerName: '',
      affiliatedWelfareInstitution: '',
      isDisability: false,
      note: '',
    };
  });

  const { mutate: createCounselee, isPending: isCreating } =
    useCreateCounseleeInfo();

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const handleSubmit = () => {
    createCounselee(formData, {
      onSuccess: () => {
        handleOpenChange(false);
        // Reset form after submission
        setFormData({
          name: '',
          dateOfBirth: '',
          genderType: AddCounseleeReqGenderTypeEnum.Female,
          phoneNumber: '',
          address: '',
          careManagerName: '',
          affiliatedWelfareInstitution: '',
          isDisability: false,
          note: '',
        });
      },
    });
  };

  const isSubmitDisabled = useMemo(() => {
    const isNameValid = validateName(formData.name);
    const isDateOfBirthValid = validateDateOfBirth(formData.dateOfBirth);
    const isPhoneNumberValid = validatePhoneNumber(formData.phoneNumber);
    const isCareManagerNameValid = validateName(formData.careManagerName);

    if (
      !formData.name ||
      !formData.dateOfBirth ||
      !formData.phoneNumber ||
      isNameValid !== null ||
      isDateOfBirthValid !== null ||
      isPhoneNumberValid !== null ||
      (formData.careManagerName && isCareManagerNameValid !== null) ||
      isCreating
    ) {
      return true;
    }

    return false;
  }, [
    formData.name,
    formData.dateOfBirth,
    formData.phoneNumber,
    formData.careManagerName,
    isCreating,
  ]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="lg">
          <img src={personAddIcon} alt="내담자 추가" className="h-5 w-5" />
          내담자 등록
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[500px]">
        <DialogHeader>
          <DialogTitle>신규 내담자 등록</DialogTitle>
          <DialogDescription className="text-sm text-grayscale-60"></DialogDescription>
          <DialogClose
            asChild
            className="!mt-0 h-6 w-6 cursor-pointer border-none bg-transparent !p-0 text-grayscale-100">
            <XIcon />
          </DialogClose>
        </DialogHeader>
        <div className="h-[1px] bg-grayscale-20" />
        <div className="grid gap-5 px-5 py-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>
                성명<span className="text-red-500">*</span>
              </Label>
              <FormInput
                placeholder="성명"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                maxLength={30}
                validation={validateName}
              />
            </div>
            <div className="space-y-2">
              <Label>
                생년월일<span className="text-red-500">*</span>
              </Label>
              <FormInput
                placeholder="YYYY-MM-DD"
                value={formData.dateOfBirth}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  let formattedDate = '';

                  if (value.length <= 4) {
                    formattedDate = value;
                  } else if (value.length <= 6) {
                    formattedDate = value.slice(0, 4) + '-' + value.slice(4);
                  } else {
                    formattedDate =
                      value.slice(0, 4) +
                      '-' +
                      value.slice(4, 6) +
                      '-' +
                      value.slice(6, 8);
                  }

                  setFormData({ ...formData, dateOfBirth: formattedDate });
                }}
                maxLength={10}
                validation={validateDateOfBirth}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>
              성별<span className="text-red-500">*</span>
            </Label>
            <ButtonGroup
              options={[
                {
                  value: AddCounseleeReqGenderTypeEnum.Female,
                  label: '여성',
                },
                {
                  value: AddCounseleeReqGenderTypeEnum.Male,
                  label: '남성',
                },
              ]}
              value={formData.genderType}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  genderType: value as AddCounseleeReqGenderTypeEnum,
                })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                전화번호<span className="text-red-500">*</span>
              </Label>
              <FormInput
                placeholder="000-0000-0000"
                value={formData.phoneNumber}
                onChange={(e) => {
                  const formatter = new AsYouType('KR');
                  const formattedNumber = formatter.input(
                    e.target.value.replace(/[^0-9]/g, ''),
                  );

                  setFormData({ ...formData, phoneNumber: formattedNumber });
                }}
                maxLength={13}
                validation={validatePhoneNumber}
              />
            </div>
            <div className="space-y-2">
              <Label>행정동</Label>
              <FormInput
                placeholder="OO동"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 items-end gap-4">
            <div className="space-y-2">
              <Label>생활지원사</Label>
              <FormInput
                placeholder="성명"
                value={formData.careManagerName}
                onChange={(e) =>
                  setFormData({ ...formData, careManagerName: e.target.value })
                }
                validation={(value) => (value ? validateName(value) : null)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label>연계 기관</Label>
              </div>
              <FormInput
                placeholder="기관명 (띄어쓰기 생략)"
                value={formData.affiliatedWelfareInstitution}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    affiliatedWelfareInstitution: e.target.value,
                  })
                }
                maxLength={50}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>
              장애 여부<span className="text-red-500">*</span>
            </Label>
            <ButtonGroup
              options={[
                { value: 'false', label: '비장애인' },
                { value: 'true', label: '장애인' },
              ]}
              value={formData.isDisability ? 'true' : 'false'}
              onChange={(value) =>
                setFormData({ ...formData, isDisability: value === 'true' })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>비고</Label>
            <Textarea
              placeholder="케어링 노트 서비스 이전의 상담 기록을 남기면 유용합니다."
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
              maxLength={300}
              className="h-[5rem] resize-none overflow-y-auto"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-end">
          <Button
            onClick={() => {
              if (isSubmitDisabled) {
                return;
              }
              handleSubmit();
            }}
            variant={isSubmitDisabled ? 'primaryError' : 'primary'}
            disabled={isCreating}>
            {isCreating ? '등록 중...' : '완료'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
