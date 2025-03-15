import { CounselorListItem, CounselorListItemRoleTypeEnum } from '@/api/api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { XIcon } from 'lucide-react';
interface AccountDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  counselor: CounselorListItem | null;
  onCounselorChange: (counselor: CounselorListItem) => void;
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
}

export function AccountDetailDialog({
  isOpen,
  onOpenChange,
  counselor,
  onCounselorChange,
  onClose,
  onSave,
  onDelete,
}: AccountDetailDialogProps) {
  if (!counselor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>계정 정보</DialogTitle>
          <DialogClose
            asChild
            className="!mt-0 h-6 w-6 cursor-pointer border-none bg-transparent !p-0 text-grayscale-100">
            <XIcon />
          </DialogClose>
        </DialogHeader>
        <div className="h-[1px] bg-grayscale-20" />

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="basic">기본 정보</TabsTrigger>
            <TabsTrigger value="password">비밀번호 변경</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mb-5 space-y-4 px-5">
            {/* 이메일 계정 */}
            <div className="mb-4">
              <label className="mb-2 block font-medium">사용자 ID</label>
              <div className="py-2">{counselor.username || ''}</div>
            </div>

            {/* 이름과 권한을 가로로 배치 */}
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block font-medium">이름</label>
                <div className="py-2">{counselor.name || '김푸름'}</div>
              </div>

              <div>
                <label className="mb-2 block font-medium">권한</label>
                <Select
                  value={counselor.roleType}
                  onValueChange={(value) =>
                    onCounselorChange({
                      ...counselor,
                      roleType: value as CounselorListItemRoleTypeEnum,
                    })
                  }>
                  <SelectTrigger className="w-full">
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

            {/* 휴대폰/가입일 */}
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block font-medium">휴대폰</label>
                <div className="py-2">{counselor.phoneNumber}</div>
              </div>

              <div>
                <label className="mb-2 block font-medium">가입일</label>
                <div className="py-2">
                  {counselor.registrationDate || '2024-10-18'}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="mb-2 block font-medium">
                비고
              </label>
              <textarea
                id="description"
                className="min-h-[100px] w-full rounded border p-2"
                value={counselor.description || ''}
                onChange={(e) =>
                  onCounselorChange({
                    ...counselor,
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
                onClick={onDelete}>
                계정 탈퇴처리
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  취소
                </Button>
                <Button onClick={onSave}>저장 변경</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="password" className="mb-5 space-y-4 px-5">
            {/* 비밀번호 변경 폼은 필요에 따라 구현 */}
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="currentPassword"
                className="text-right font-medium">
                현재 비밀번호
              </label>
              <input
                id="currentPassword"
                type="password"
                className="col-span-3 rounded border p-2"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="newPassword" className="text-right font-medium">
                새 비밀번호
              </label>
              <input
                id="newPassword"
                type="password"
                className="col-span-3 rounded border p-2"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="confirmPassword"
                className="text-right font-medium">
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="col-span-3 rounded border p-2"
              />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
export default AccountDetailDialog;
