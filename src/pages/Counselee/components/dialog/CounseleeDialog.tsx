import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { AddCounseleeReqGenderTypeEnum } from '@/api/api';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { XIcon } from 'lucide-react';
import { InfoIcon } from '@/components/icon/InfoIcon';
import { SelectCounseleeRes } from '@/api/api';
import { ButtonGroup } from '@/components/ui/button-group';
import personAddIcon from '@/assets/icon/20/personadd.svg';

interface AddCounseleeDialogProps {
  onSubmit: (data: AddCounseleeFormData) => void;
  initialData?: SelectCounseleeRes;
  mode?: 'add' | 'edit';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface AddCounseleeFormData {
  id?: string;
  name: string;
  dateOfBirth: string;
  genderType: AddCounseleeReqGenderTypeEnum;
  phoneNumber: string;
  address: string;
  careManagerName: string;
  affiliatedWelfareInstitution: string;
  disability: boolean;
  note: string;
}

export const CounseleeDialog = ({
  onSubmit,
  initialData,
  mode = 'add',
  open: controlledOpen,
  onOpenChange,
}: AddCounseleeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<AddCounseleeFormData>(() => {
    if (initialData) {
      return {
        id: initialData.id ?? '',
        name: initialData.name || '',
        dateOfBirth: initialData.dateOfBirth || '',
        genderType: initialData.gender || AddCounseleeReqGenderTypeEnum.Female,
        phoneNumber: initialData.phoneNumber || '',
        address: initialData.address || '',
        careManagerName: initialData.careManagerName || '',
        affiliatedWelfareInstitution:
          initialData.affiliatedWelfareInstitution || '',
        disability: initialData.disability || false,
        note: initialData.note || '',
      };
    }
    return {
      name: '',
      dateOfBirth: '',
      genderType: AddCounseleeReqGenderTypeEnum.Female,
      phoneNumber: '',
      address: '',
      careManagerName: '',
      affiliatedWelfareInstitution: '',
      disability: false,
      note: '',
    };
  });

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setOpen(newOpen);
    }
  };

  const isOpen = mode === 'edit' ? controlledOpen : open;

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {mode === 'add' && (
        <DialogTrigger asChild>
          <Button variant="secondary" size="lg">
            <img src={personAddIcon} alt="내담자 추가" className="h-5 w-5" />
            내담자 등록
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="w-[31.25rem]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? '신규 내담자 등록' : '내담자 정보 수정'}
          </DialogTitle>
          <DialogClose
            asChild
            className="cursor-pointer border-none bg-transparent text-grayscale-100 !mt-0 !p-0 w-6 h-6">
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
              <Input
                placeholder="성명"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>
                생년월일<span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="YYYY-MM-DD"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
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
              <Input
                placeholder="000-0000-0000"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>행정동</Label>
              <Input
                placeholder="행정동"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>생활지원사</Label>
              <Input
                placeholder="성명"
                value={formData.careManagerName}
                onChange={(e) =>
                  setFormData({ ...formData, careManagerName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>연계 기관</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-5 w-5 text-grayscale-50" />
                    </TooltipTrigger>
                    <TooltipContent>
                      • 사회복지관: 신림, 강감찬
                      <br />
                      • 의료기관: 한울
                      <br />• 연계기관이 없을 경우: 공란으로 처리
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                placeholder="기관명 (띄어쓰기 생략)"
                value={formData.affiliatedWelfareInstitution}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    affiliatedWelfareInstitution: e.target.value,
                  })
                }
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
              value={formData.disability ? 'true' : 'false'}
              onChange={(value) =>
                setFormData({ ...formData, disability: value === 'true' })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>비고</Label>
            <Textarea
              placeholder="비고 사항을 입력하세요"
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
              className="overflow-hidden text-ellipsis"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
              }}
            />
          </div>
        </div>
        <DialogFooter className="flex justify-end">
          <Button onClick={handleSubmit}>
            {mode === 'add' ? '완료' : '수정'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
