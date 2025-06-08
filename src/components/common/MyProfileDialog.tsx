import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { ROLE_TYPE_MAP } from '@/utils/constants';
import { ChangePasswordReq, UpdateMyInfoReq } from '@/api/models';
import {
  useUpdateMyInfo,
  useChangeMyPassword,
  useDeleteMyAccount,
} from '@/pages/Account/hooks/queries/useCounselorQuery';
import { AsYouType } from 'libphonenumber-js';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import CloseBlackIcon from '@/assets/icon/24/close.outlined.black.svg?react';

interface MyProfileDialogProps {
  children: React.ReactNode;
}

export function MyProfileDialog({ children }: MyProfileDialogProps) {
  const { user, initAuthState } = useAuthContext();
  const [activeTab, setActiveTab] = useState('basic');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // 비밀번호 변경 상태
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 기본 정보 편집 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    phoneNumber: user?.phoneNumber || '',
  });

  // 커스텀 훅들 사용
  const updateMyInfoMutation = useUpdateMyInfo(
    () => {
      alert('정보가 성공적으로 업데이트되었습니다.');
      setIsEditing(false);
      initAuthState();
      // 페이지 리로드로 최신 정보 반영
      setTimeout(() => {
        window.location.reload();
      }, 500);
    },
    (error) => {
      console.error('정보 업데이트 실패:', error);
      alert('정보 업데이트에 실패했습니다.');
    },
  );

  const changePasswordMutation = useChangeMyPassword(
    () => {
      alert('비밀번호가 성공적으로 변경되었습니다.');
      setNewPassword('');
      setConfirmPassword('');
    },
    (error) => {
      console.error('비밀번호 변경 실패:', error);
      alert('비밀번호 변경에 실패했습니다.');
    },
  );

  const deleteAccountMutation = useDeleteMyAccount(
    () => {
      alert('계정이 성공적으로 탈퇴되었습니다.');
      window.location.href = '/';
    },
    (error) => {
      console.error('계정 탈퇴 실패:', error);
      alert('계정 탈퇴에 실패했습니다.');
    },
  );

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      name: user?.name || '',
      phoneNumber: user?.phoneNumber || '',
    });
  };

  const handleSave = () => {
    const updateData: UpdateMyInfoReq = {
      name: editData.name,
      phoneNumber: editData.phoneNumber,
    };
    updateMyInfoMutation.mutate(updateData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: user?.name || '',
      phoneNumber: user?.phoneNumber || '',
    });
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      alert('비밀번호는 8글자 이상이어야 합니다.');
      return;
    }

    const changePasswordData: ChangePasswordReq = {
      newPassword: newPassword,
    };
    changePasswordMutation.mutate(changePasswordData);
  };

  const handleAccountDelete = () => {
    if (
      confirm('정말로 계정을 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')
    ) {
      deleteAccountMutation.mutate();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[500px] p-0">
        <DialogHeader className="relative flex items-center justify-between">
          <DialogTitle>내 정보</DialogTitle>
          <button onClick={() => setIsOpen(false)}>
            <CloseBlackIcon width={24} height={24} />
          </button>
        </DialogHeader>

        <div>
          <Separator />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start px-5">
            <TabsTrigger value="basic" className="px-4">
              기본 정보
            </TabsTrigger>
            <TabsTrigger value="password" className="px-4">
              비밀번호 변경
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 px-5 py-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-body1 font-semibold text-grayscale-90">
                  이메일 계정
                </Label>
                <p className="flex h-10 items-center text-body1 font-medium text-grayscale-90">
                  {user?.email || ''}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-x-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-body1 font-semibold text-grayscale-90">
                    이름
                  </Label>
                  <Input
                    value={isEditing ? editData.name : user?.name || ''}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-body1 font-semibold text-grayscale-90">
                    권한
                  </Label>
                  <p className="flex h-10 items-center text-body1 font-medium text-grayscale-90">
                    {user?.roleType ? ROLE_TYPE_MAP[user.roleType] : ''}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-body1 font-semibold text-grayscale-90">
                    휴대폰
                  </Label>
                  <Input
                    value={
                      isEditing ? editData.phoneNumber : user?.phoneNumber || ''
                    }
                    onChange={(e) => {
                      if (isEditing) {
                        const formatter = new AsYouType('KR');
                        const formattedNumber = formatter.input(
                          e.target.value.replace(/[^0-9]/g, ''),
                        );
                        setEditData({ ...editData, phoneNumber: formattedNumber });
                      }
                    }}
                    disabled={!isEditing}
                    maxLength={13}
                    placeholder="010-0000-0000"
                  />
                </div>
                <div className="item flex flex-col gap-2">
                  <Label className="text-body1 font-semibold text-grayscale-90">
                    참여일수
                  </Label>
                  <p className="flex h-10 items-center text-body1 font-medium text-grayscale-90">
                    {user?.participationDays || 0}일
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="password" className="space-y-4 px-5 py-4">
            <div className="space-y-4">
              <div>
                <Label className="text-body1 font-semibold text-grayscale-90">
                  신규 비밀번호
                </Label>
                <div className="relative mt-1">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="새 비밀번호를 입력하세요"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <Label className="text-body1 font-semibold text-grayscale-90">
                  비밀번호 확인
                </Label>
                <div className="relative mt-1">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="비밀번호를 다시 입력하세요"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          {activeTab === 'basic' && (
            <div className="flex w-full justify-between">
              <Button
                variant="secondaryError"
                onClick={handleAccountDelete}
                disabled={deleteAccountMutation.isPending}>
                {deleteAccountMutation.isPending
                  ? '탈퇴 처리 중...'
                  : '계정 탈퇴하기'}
              </Button>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button variant="secondary" onClick={handleCancel}>
                      취소
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={updateMyInfoMutation.isPending}>
                      {updateMyInfoMutation.isPending ? '저장 중...' : '확인'}
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleEdit}>수정</Button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="flex w-full justify-end">
              <Button
                onClick={handlePasswordChange}
                disabled={
                  !newPassword ||
                  !confirmPassword ||
                  changePasswordMutation.isPending
                }>
                {changePasswordMutation.isPending
                  ? '변경 중...'
                  : '비밀번호 변경'}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
