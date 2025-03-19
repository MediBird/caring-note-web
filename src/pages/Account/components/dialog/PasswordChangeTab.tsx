import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormInput } from '@/components/ui/form-input';
import { Label } from '@/components/ui/label';
import {
  validateConfirmPassword,
  validatePassword,
} from '@/utils/inputValidations';
import { useEffect, useState } from 'react';
import { InfoToast } from '@/components/ui/costom-toast';
import { useCounselorManagement } from '../../hooks/useCounselorManagement';

export default function PasswordChangeTab({
  counselorId,
  onClose,
}: {
  counselorId: string;
  onClose: () => void;
}) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [temporary, setTemporary] = useState(false);
  // 새로운 상태 변수 추가
  const [showPassword, setShowPassword] = useState(false);
  const [useAutoGeneratedPassword, setUseAutoGeneratedPassword] =
    useState(false);

  const { handleResetPassword } = useCounselorManagement();

  // 자동 생성 비밀번호 함수
  const generateSecurePassword = () => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // 자동 생성 비밀번호 체크박스가 변경될 때 비밀번호 생성
  useEffect(() => {
    if (useAutoGeneratedPassword) {
      const generatedPassword = generateSecurePassword();
      setNewPassword(generatedPassword);
      setConfirmPassword('');
    }
  }, [useAutoGeneratedPassword]);

  const handlePasswordChange = async () => {
    // 비밀번호 유효성 검사
    let hasError = false;

    if (!newPassword || (!confirmPassword && !useAutoGeneratedPassword)) {
      setError('모든 항목을 입력해주세요.');
      hasError = true;
    } else if (newPassword.length < 8) {
      setError('비밀번호는 8자 이상으로 입력해주세요.');
      hasError = true;
    } else if (newPassword !== confirmPassword && !useAutoGeneratedPassword) {
      setError('새 비밀번호와 확인이 일치하지 않습니다.');
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);
    try {
      const success = await handleResetPassword(counselorId, {
        newPassword,
        temporary: temporary, // 임시 비밀번호 설정 여부 전달
      });

      if (success) {
        InfoToast({ message: '비밀번호가 성공적으로 변경되었습니다.' });
        // 입력 필드 초기화
        setNewPassword('');
        setConfirmPassword('');
        // 대화 상자 닫기
        onClose();
      } else {
        setError('비밀번호 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('비밀번호 변경 중 오류가 발생했습니다:', error);
      setError('비밀번호 변경 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }

    setError(null);
  };

  return (
    <div className="mb-5 flex h-[427px] flex-col px-5">
      <div className="flex-grow space-y-5">
        <div className="flex w-full flex-col items-start justify-start gap-3">
          <Label htmlFor="newPassword" className="text-body1 font-bold">
            신규 비밀번호
          </Label>
          <div className="relative w-full">
            <FormInput
              id="newPassword"
              type={showPassword ? 'text' : 'password'}
              className="rounded border pr-10"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={useAutoGeneratedPassword}
              validation={
                !useAutoGeneratedPassword ? validatePassword : undefined
              }
            />
          </div>
        </div>
        <div className="!mt-1.5 flex items-center justify-start gap-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="showPassword"
              checked={showPassword}
              className="border"
              onCheckedChange={(checked) => setShowPassword(checked === true)}
            />
            <Label
              htmlFor="showPassword"
              className="cursor-pointer text-sm text-grayscale-40">
              비밀번호 표시
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="autoGenerate"
              className="border"
              checked={useAutoGeneratedPassword}
              onCheckedChange={(checked) =>
                setUseAutoGeneratedPassword(checked === true)
              }
            />
            <Label
              htmlFor="autoGenerate"
              className="cursor-pointer text-sm text-grayscale-40">
              안전한 비밀번호 자동 생성
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="temporary"
              className="border"
              checked={temporary}
              onCheckedChange={(checked) => setTemporary(checked === true)}
            />
            <Label
              htmlFor="temporary"
              className="cursor-pointer text-sm text-grayscale-40">
              임시 비밀번호
            </Label>
          </div>
        </div>

        <div className="flex w-full flex-col items-start justify-start gap-3">
          <Label htmlFor="confirmPassword" className="text-body1 font-bold">
            비밀번호 확인
          </Label>
          <FormInput
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            className="col-span-3 rounded border p-3"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={useAutoGeneratedPassword}
            validation={
              !useAutoGeneratedPassword
                ? (value) => validateConfirmPassword(value, newPassword)
                : undefined
            }
          />
        </div>

        {/* 체크박스 그룹 추가 */}

        {error && <div className="mt-2 text-center text-red-500">{error}</div>}
      </div>

      <div className="mt-auto flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          취소
        </Button>
        <Button onClick={handlePasswordChange} disabled={isLoading}>
          {isLoading ? '처리 중...' : '비밀번호 변경'}
        </Button>
      </div>
    </div>
  );
}
