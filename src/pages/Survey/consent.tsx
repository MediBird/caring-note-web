import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useSelectCounseleeInfo } from '@/hooks/useCounseleeQuery';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateCounseleeConsentMutation } from './hooks/useCounseleeConsentQuery';

// 동의서 섹션 타입 정의
interface ContentSection {
  type: 'heading' | 'list' | 'text' | 'divider' | 'notice';
  content: string;
}

// 동의서 타입 정의
interface ConsentItem {
  id: number;
  title: string;
  sections: ContentSection[];
}

// 동의서 데이터
const consentItems: ConsentItem[] = [
  {
    id: 1,
    title: '개인정보 수집·이용 내역 동의',
    sections: [
      { type: 'heading', content: '수집 항목' },
      {
        type: 'list',
        content: '개인정보 (필수): 성명, 생년월일, 주소, 연락처',
      },
      {
        type: 'list',
        content:
          '민감정보 (필수): 건강정보, 복용약물 및 기타 건강상태에 대한 사항',
      },
      { type: 'heading', content: '수집 목적' },
      {
        type: 'list',
        content: '찾아가는 복약상담소 사업 안내 및 개별 상담에 활용',
      },
      {
        type: 'list',
        content: '찾아가는 복약상담소 사업 종료 후 결과보고 자료 분석에 활용',
      },
      {
        type: 'list',
        content:
          '그 밖에 찾아가는 복약상담소 사업 운영 및 서비스 고도화에 필요한 자료로 황용',
      },
      { type: 'heading', content: '보유 및 이용기간' },
      { type: 'list', content: '해당 사업 제공기간 및 사업 종료일로부터 3년' },
      { type: 'divider', content: '' },
      {
        type: 'notice',
        content:
          '위와 같이 개인정보 제공 동의를 거부할 권리가 있으나, 동의를 거부하는 경우에는 사업 참여가 불가함을 알려 드립니다. "개인정보 보호법"에 따라 개인정보처리자가 준수해야 할 개인정보보호 규정을 준수하고, 관련 법령에 따라 대상자의 권익보호에 최선을 다하고 있으며 허가된 이용 목적 외에는 사용하지 않을 것을 약속드립니다.',
      },
      {
        type: 'notice',
        content:
          '위와 같이 개인정보 및 민감정보와 관련된 상담 내용은 녹음 및 저장 될 수 있습니다.',
      },
    ],
  },
  {
    id: 2,
    title: '개인정보의 제 3자 제공 동의',
    sections: [
      {
        type: 'text',
        content: '개인정보의 제 3자 제공 동의에 관한 상세 내용입니다.',
      },
      { type: 'heading', content: '제공 받는 자' },
      { type: 'list', content: '신림종합사회복지관, 강감찬종합사회복지관' },
      { type: 'heading', content: '제공 항목' },
      {
        type: 'list',
        content:
          '성명, 생년월일, 주소, 연락처, 건강정보, 복용약물 및 기타 건강상태에 대한 사항',
      },
      { type: 'heading', content: '제공 목적' },
      { type: 'list', content: '사회 복지 서비스 연계' },
      { type: 'heading', content: '보유 및 이용기간' },
      { type: 'list', content: '해당 사업 제공기간 및 사업 종료일로부터 3년' },
      { type: 'divider', content: '' },
      { type: 'heading', content: '제공 받는 자' },
      { type: 'list', content: '정다운우리의원' },
      { type: 'heading', content: '제공 항목' },
      {
        type: 'list',
        content:
          '성명, 생년월일, 주소, 연락처, 건강정보, 복용약물 및 기타 건강상태에 대한 사항',
      },
      { type: 'heading', content: '제공 목적' },
      { type: 'list', content: '진료 의뢰' },
      { type: 'heading', content: '보유 및 이용기간' },
      { type: 'list', content: '해당 사업 제공기간 및 사업 종료일로부터 3년' },
      { type: 'divider', content: '' },
      {
        type: 'notice',
        content:
          '위와 같이 개인정보 제공 동의를 거부할 권리가 있으나, 동의를 거부하는 경우에는 일부 사업 참여가 불가함을 알려 드립니다.',
      },
    ],
  },
  {
    id: 3,
    title: '폐의약품 수거에 관한 동의',
    sections: [
      {
        type: 'text',
        content:
          '안전한 폐의약품 분리배출을 위해 귀하의 불용의약품을 폐기하시는 것에 동의하십니까?',
      },
    ],
  },
];

// 동의서 내용 렌더링 컴포넌트
function ConsentContent({ sections }: { sections: ContentSection[] }) {
  return (
    <div className="space-y-3">
      {sections.map((section, index) => {
        switch (section.type) {
          case 'heading':
            return (
              <h3
                key={index}
                className="mb-3 text-body1 font-bold text-grayscale-90">
                {section.content}
              </h3>
            );
          case 'list':
            return (
              <div
                key={index}
                className="flex items-start pl-2 text-body2 font-medium text-grayscale-50">
                <span className="mr-2 text-grayscale-50">•</span>
                <span className="text-grayscale-50">{section.content}</span>
              </div>
            );
          case 'text':
            return (
              <p key={index} className="text-grayscale-50">
                {section.content}
              </p>
            );
          case 'divider':
            return <hr key={index} className="my-4 border-grayscale-10" />;
          case 'notice':
            return (
              <p
                key={index}
                className="text-body2 font-medium text-grayscale-50">
                ※ {section.content}
              </p>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

export default function Consent() {
  const navigate = useNavigate();
  const { counselSessionId } = useParams<{ counselSessionId: string }>();
  const createConsentMutation = useCreateCounseleeConsentMutation();
  const { data: counseleeInfo } = useSelectCounseleeInfo(
    counselSessionId ?? '',
  );
  const [selectedConsent, setSelectedConsent] = useState<ConsentItem | null>(
    null,
  );
  const [consents, setConsents] = useState<number[]>([]);

  // counselSessionId가 없으면 리다이렉트
  useEffect(() => {
    if (!counselSessionId) {
      navigate('/');
    }
  }, [counselSessionId, navigate]);

  // 동의 항목 클릭 시 상세 내용 표시
  const handleConsentClick = (consent: ConsentItem) => {
    setSelectedConsent(consent);
  };

  // 상세 내용에서 돌아오기
  const handleBack = () => {
    setSelectedConsent(null);
  };

  // 동의 체크 토글
  const toggleConsent = (id: number) => {
    if (consents.includes(id)) {
      setConsents(consents.filter((consentId) => consentId !== id));
    } else {
      setConsents([...consents, id]);
    }
  };

  // 모든 동의 항목에 체크했는지 확인
  const allConsented = consentItems.length === consents.length;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-grayscale-3 p-4">
      <Card className="flex w-[30rem] flex-col items-center justify-center bg-white px-5 pb-5 pt-10 shadow-md">
        {selectedConsent ? (
          // 선택된 동의 상세 내용 페이지
          <div className="w-full p-4">
            <p className="mb-4 flex items-center text-subtitle2 font-bold">
              <Button
                variant="ghost"
                className="flex"
                onClick={handleBack}
                size="md">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              {selectedConsent.title}
            </p>

            <div className="mb-6 rounded-md bg-gray-50 p-4 text-sm">
              <ConsentContent sections={selectedConsent.sections} />
            </div>

            <Button
              className={cn('w-full')}
              onClick={() => {
                // 동의하지 않은 상태일 때만 동의 상태로 변경 (이미 동의한 상태면 유지)
                if (!consents.includes(selectedConsent.id)) {
                  toggleConsent(selectedConsent.id);
                }
                handleBack();
              }}>
              {consents.includes(selectedConsent.id) ? '동의함' : '동의하기'}
            </Button>
          </div>
        ) : (
          // 메인 동의서 페이지
          <>
            <CardHeader>
              <h3 className="text-h3 font-bold">
                개인정보 수집 동의서를 작성해주세요.
              </h3>
            </CardHeader>

            <CardContent className="w-full pb-5">
              <div className="w-full space-y-2 bg-grayscale-3">
                {consentItems.map((consent) => (
                  <div
                    key={consent.id}
                    className="flex w-full overflow-hidden rounded-md p-4">
                    <div
                      className="flex w-full cursor-pointer items-center justify-between"
                      onClick={() => handleConsentClick(consent)}>
                      <div className="mr-3 flex items-center">
                        <Checkbox
                          id={`consent-${consent.id}`}
                          checked={consents.includes(consent.id)}
                          onCheckedChange={() => toggleConsent(consent.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <Label
                        htmlFor={`consent-${consent.id}`}
                        className="flex-1 cursor-pointer">
                        {consent.title}
                      </Label>
                      <ChevronRight className="h-5 w-5 text-grayscale-90" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="w-full">
              <Button
                className="w-full"
                disabled={!allConsented || !counselSessionId || !counseleeInfo}
                size="xl"
                variant={allConsented ? 'primary' : 'secondary'}
                onClick={async () => {
                  if (!counselSessionId || !counseleeInfo) {
                    console.error('상담 세션 ID 또는 내담자 정보가 없습니다.');
                    return;
                  }

                  try {
                    await createConsentMutation.mutateAsync({
                      counselSessionId,
                      counseleeId: counseleeInfo.counseleeId || '',
                      consent: true,
                    });
                    navigate(`/survey/${counselSessionId}`);
                  } catch (error) {
                    console.error('동의서 제출 중 오류가 발생했습니다:', error);
                  }
                }}>
                전부 동의하고 시작하기
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
