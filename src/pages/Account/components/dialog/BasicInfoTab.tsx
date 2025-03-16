import { CounselorListItem, CounselorListItemRoleTypeEnum } from '@/api/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BasicInfoTabProps {
  editedCounselor: CounselorListItem;
  setEditedCounselor: React.Dispatch<
    React.SetStateAction<CounselorListItem | null>
  >;
  handleSave: () => void;
  handleDelete: () => void;
  handleClose: () => void;
  isPendingUpdate: boolean;
  isPendingDelete: boolean;
}

export default function BasicInfoTab({
  editedCounselor,
  setEditedCounselor,
  handleSave,
  handleDelete,
  handleClose,
  isPendingUpdate,
  isPendingDelete,
}: BasicInfoTabProps) {
  return (
    <div className="mb-5 space-y-5 px-5">
      <div className="mb-4">
        <Label className="block font-bold leading-6">이메일 계정</Label>
        <div className="font-medium leading-9">
          {editedCounselor.username || ''}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <Label className="block font-medium">이름</Label>
          <div className="font-medium leading-10">{editedCounselor.name}</div>
        </div>
        <div>
          <Label className="block font-medium">가입일</Label>
          <div className="font-medium leading-10">
            {editedCounselor.registrationDate || '2024-10-18'}
          </div>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-3 block font-medium">휴대폰</Label>
          <Input
            placeholder="000-0000-0000"
            className="py-2"
            value={editedCounselor.phoneNumber || ''}
            onChange={(e) => {
              const value = e.target.value?.replace(/[^0-9]/g, '') || '';
              let formattedNumber = '';

              if (value.length <= 3) {
                formattedNumber = value;
              } else if (value.length <= 7) {
                formattedNumber = `${value.slice(0, 3)}-${value.slice(3)}`;
              } else {
                formattedNumber = `${value.slice(0, 3)}-${value.slice(
                  3,
                  7,
                )}-${value.slice(7, 11)}`;
              }

              setEditedCounselor({
                ...editedCounselor,
                phoneNumber: formattedNumber,
              });
            }}
            maxLength={13}
          />
        </div>

        <div>
          <Label className="mb-3 block font-medium">권한</Label>
          <Select
            value={editedCounselor.roleType}
            onValueChange={(value) =>
              setEditedCounselor({
                ...editedCounselor,
                roleType: value as CounselorListItemRoleTypeEnum,
              })
            }>
            <SelectTrigger className="w-full text-base">
              <SelectValue placeholder="권한 미등록" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={CounselorListItemRoleTypeEnum.Admin}>
                관리자
              </SelectItem>
              <SelectItem value={CounselorListItemRoleTypeEnum.User}>
                사용자
              </SelectItem>
              <SelectItem value={CounselorListItemRoleTypeEnum.Assistant}>
                보조 상담사
              </SelectItem>
              <SelectItem value={CounselorListItemRoleTypeEnum.None}>
                권한 없음
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-4">
        <Label htmlFor="description" className="mb-2 block font-medium">
          비고
        </Label>
        <textarea
          id="description"
          className="min-h-[100px] w-full rounded border p-2"
          value={editedCounselor.description || ''}
          onChange={(e) =>
            setEditedCounselor({
              ...editedCounselor,
              description: e.target.value,
            })
          }
          placeholder="비고입력"
        />
      </div>

      <div className="mt-4 flex justify-between">
        <Button
          variant="outline"
          className="border-red-500 text-red-500"
          onClick={handleDelete}
          disabled={isPendingDelete}>
          {isPendingDelete ? '처리 중...' : '계정 탈퇴처리'}
        </Button>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleClose}>
            취소
          </Button>
          <Button onClick={handleSave} disabled={isPendingUpdate}>
            {isPendingUpdate ? '저장 중...' : '저장 변경'}
          </Button>
        </div>
      </div>
    </div>
  );
}
