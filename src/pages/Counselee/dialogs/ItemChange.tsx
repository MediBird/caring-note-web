import {
  CounseleeAddDialogTypes,
  CounseleeDeleteDialogTypes,
} from '@/pages/Counselee/constants/dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import CloseButton from '@/assets/icon/24/close.outlined.black.svg';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import {
  counseleeInfoType,
  useCounseleeInfoStore,
} from '@/pages/Counselee/hooks/store/counseleeInfoStore';
import {
  disabilityTypes,
  genderTypes,
} from '@/pages/Counselee/constants/counseleeInfo';
import SearchComponent from '@/components/common/SearchComponent';
import DatePickerComponent from '@/components/ui/datepicker';
import Search from '@/assets/icon/24/search.outline.black.svg';
import {
  useCreateCounseleeInfo,
  useDeleteCounseleeInfo,
} from '@/pages/Counselee/hooks/query/useCounseleeInfoQuery';
import { useSelectCounseleeList } from '@/pages/Counselee/hooks/query/useCounseleeInfoQuery';
import {
  counselCalendarInfoType,
  useCounselCalendarInfoStore,
} from '@/pages/Counselee/hooks/store/counselCalendarInfoStore';
import { format } from 'date-fns';
import { useAuthContext } from '@/context/AuthContext';
import { useAddCounselSession } from '../hooks/query/useCounselSessionQuery';
import { useNavigate } from 'react-router-dom';
import TimepickerComponent from '@/components/ui/timepicker';

type ButtonOption = {
  label: string;
  value: string | number | boolean;
};

const ItemChange = ({
  isOpen,
  dialogType,
  onClose,
  selectedData,
}: {
  isOpen: boolean;
  dialogType: CounseleeAddDialogTypes;
  onClose: () => void;
  selectedData: CounseleeDeleteDialogTypes[];
}) => {
  // 내담자 목록 조회 API
  const { data: selectCounseleeInfoList, refetch } = useSelectCounseleeList({
    page: 0,
    size: 10,
  });
  // 내담자 정보 상태 업데이트 API
  const addCounseleeInfo = useCreateCounseleeInfo();
  // 내담자 정보 삭제 API
  const deleteCounseleeInfo = useDeleteCounseleeInfo();
  // 상담 일정 등록 API
  const addCounselSession = useAddCounselSession();
  // 상담 일정 정보 상태
  const { counselCalendarInfo } = useCounselCalendarInfoStore();
  // 내담자 정보 상태
  const { counseleeInfo } = useCounseleeInfoStore();
  // 인증 정보 상태
  const { user } = useAuthContext();
  const navigate = useNavigate();
  // 검색 키워드 상태
  const [keyword, setKeyword] = useState<string>('');
  // 검색 input focus 상태
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // 내담자 정보 상태 제어 데이터
  const [counseleeInfoData, setCounseleeInfoData] = useState<counseleeInfoType>(
    counseleeInfo || {},
  );
  // 상담 일정 정보 상태 제어 데이터
  const [counseleeCalendarData, setCounseleeCalendarData] =
    useState<counselCalendarInfoType>(counselCalendarInfo || {});

  // counseleeInfoData 업데이트 함수
  const updateCounseleeInfoData = (
    field: keyof counseleeInfoType,
    value: string | number | boolean | Date,
  ) => {
    setCounseleeInfoData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // counseleeCalendarData 업데이트 함수
  const updateCounseleeCalendarData = (
    field: keyof counselCalendarInfoType,
    value: string,
    type: 'date' | 'time',
  ) => {
    setCounseleeCalendarData((prev) => {
      // 기존 날짜와 시간 정보 추출
      const currentDate = prev.scheduledStartDateTime
        ? prev.scheduledStartDateTime.split(' ')[0]
        : format(new Date(), 'yyyy-MM-dd');
      const currentTime = prev.scheduledStartDateTime
        ? prev.scheduledStartDateTime.split(' ')[1]
        : '00:00';

      // 업데이트된 날짜와 시간 정보 생성
      let updatedDateTime = '';
      if (type === 'date') {
        updatedDateTime = `${value} ${currentTime}`;
      } else if (type === 'time') {
        updatedDateTime = `${currentDate} ${value}`;
      }
      // "YYYY-MM-DD HH:mm" 형식으로 저장
      return {
        ...prev,
        [field]: updatedDateTime,
      };
    });
  };

  // 입력 필드 렌더링 함수
  const handleInput = (
    label: string,
    placeholder: string,
    fieldName: keyof counseleeInfoType,
    condition: boolean = true,
  ) => {
    if (!condition) return null;

    return (
      <div className="pb-4">
        <Label
          htmlFor={fieldName}
          className="flex flex-row items-center font-bold">
          {label}
        </Label>
        <Input
          id={fieldName}
          name={fieldName}
          placeholder={placeholder}
          value={counseleeInfoData[fieldName] as string}
          onChange={(e) => updateCounseleeInfoData(fieldName, e.target.value)}
          className={fieldName === 'note' ? 'pt-5 mt-3 pb-20' : 'mt-3'}
        />
      </div>
    );
  };

  // 버튼 렌더링 함수
  const renderButtons = (
    label: string,
    options: ButtonOption[],
    field: keyof counseleeInfoType,
    condition: boolean = true,
  ) => {
    if (!condition) return null;

    return (
      <div className="pb-4">
        <Label htmlFor={field} className="font-bold">
          {label}
        </Label>
        <div className="flex gap-2">
          {options.map((option) => (
            <Button
              key={option.label}
              type="button"
              variant={
                counseleeInfoData[field] === option.value
                  ? 'pressed'
                  : 'nonpressed'
              }
              className="pl-3 pr-3 mt-3 font-medium rounded-lg"
              size="lg"
              onClick={() => updateCounseleeInfoData(field, option.value)}>
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  // 검색 렌더링 함수
  const handleSearchCounselee = (
    label: string,
    placeholder: string,
    fieldName: keyof counselCalendarInfoType,
  ) => {
    return (
      <div className="pt-4 pb-4">
        <Label
          htmlFor={fieldName}
          className="flex flex-row items-center font-bold">
          {label}
        </Label>
        <div className="relative inline-block w-full pb-4">
          <SearchComponent
            items={selectCounseleeInfoList?.map((item) => item.name || '')}
            defaultInputValue={keyword}
            searchIcon={Search}
            placeholder={placeholder}
            onChangeInputValue={(value) => setKeyword(value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            onSelect={(selectedItem) => {
              // 선택한 아이템의 id를 counseleeCalendarData에 업데이트
              const selected = selectCounseleeInfoList?.find(
                (item) => item.name === selectedItem,
              );
              if (selected) {
                setCounseleeCalendarData((prev) => ({
                  ...prev,
                  counseleeId: selected.id || '',
                }));
              }
              setKeyword(selectedItem);
            }}
          />
        </div>
      </div>
    );
  };

  // handleCalendar 함수
  const handleCalendar = (
    label: string,
    placeholder: string,
    fieldName: keyof counselCalendarInfoType,
  ) => {
    const isDateLabel = label === '상담 일자';
    return (
      <div className={`pb-4 ${isSearchFocused ? 'mt-16' : ''}`}>
        <Label
          htmlFor={fieldName}
          className="flex flex-row items-center font-bold">
          {label}
        </Label>
        {isDateLabel ? (
          <DatePickerComponent
            className="w-[220px] mt-3"
            placeholder={placeholder}
            handleClicked={(value) => {
              if (value) {
                updateCounseleeCalendarData(
                  'scheduledStartDateTime',
                  format(value, 'yyyy-MM-dd'),
                  'date',
                ); // 날짜 업데이트
              }
            }}
          />
        ) : (
          <TimepickerComponent
            className="w-[180px] h-[34px] mt-2 pt-1"
            placeholder={placeholder}
            handleClicked={(value) => {
              if (value) {
                updateCounseleeCalendarData(
                  'scheduledStartDateTime',
                  value,
                  'time',
                ); // 시간 업데이트
              }
            }}
          />
        )}
      </div>
    );
  };

  // 확인 버튼 타입에 따른 분기 처리
  const handleConfirmButton = () => {
    if (dialogType === 'COUNSELEE') {
      // 내담자 등록
      addCounseleeInfo.mutate(
        {
          ...counseleeInfoData,
          scheduledStartDateTime: counseleeCalendarData.scheduledStartDateTime,
        },
        {
          onSuccess: () => {
            onClose();
            // 등록 성공시 내담자 목록 다시 조회
            refetch();
          },
          onError: (error) => {
            window.alert('내담자 등록에 실패했습니다.' + error);
          },
        },
      );
    } else {
      // 상담 일정 등록
      addCounselSession.mutate(
        {
          ...counseleeCalendarData,
          counselorId: user?.id || '',
          status: 'SCHEDULED',
        },
        {
          onSuccess: () => {
            navigate('/');
          },
          onError: (error) => {
            window.alert('상담 일정 등록에 실패했습니다.' + error);
          },
        },
      );
    }
  };

  // 내담자 정보 삭제
  const handleDeleteButton = () => {
    // 삭제 API 호출
    if (selectedData) {
      deleteCounseleeInfo.mutate(selectedData, {
        onSuccess: () => {
          onClose();
          // 삭제 성공 시, 내담자 목록 다시 조회
          refetch();
        },
        onError: () => {
          window.alert('내담자 삭제에 실패했습니다.');
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay />
      <DialogContent className="w-auto">
        <DialogHeader className="flex items-center justify-between pb-2">
          <DialogTitle>
            {dialogType === 'DELETE'
              ? '내담자 정보를 정말 삭제하시겠습니까?'
              : dialogType === 'CALENDAR'
              ? '상담 일정 등록'
              : '신규 내담자 등록'}
          </DialogTitle>
          <DialogClose
            onClick={onClose}
            className="cursor-pointer border-none bg-transparent text-grayscale-100 !mt-0 !p-0 w-6 h-6">
            <img
              src={CloseButton}
              className="flex pb-5 cursor-pointer"
              onClick={onClose}
              alt="Close"
            />
          </DialogClose>
        </DialogHeader>
        <div className="h-[1px] bg-grayscale-20" />
        <DialogDescription className="sm:justify-start">
          {dialogType === 'DELETE' ? (
            <div>
              상남 내역이 모두 삭제되며, 삭제된 데이터는 복구하기 어렵습니다.
            </div>
          ) : dialogType === 'COUNSELEE' ? (
            <div>
              <div className="flex flex-row w-auto gap-3">
                {handleInput('성명', '성명', 'name')}
                {handleInput('생년월일', 'YYYY-MM-DD', 'dateOfBirth')}
              </div>
              <div className="">
                {renderButtons('성별', genderTypes, 'genderType')}
              </div>
              <div className="flex flex-row w-auto gap-3">
                {handleInput('전화번호', '010-1234-5678', 'phoneNumber')}
                {handleInput('행정동', 'OO동', 'address')}
              </div>
              <div className="flex flex-row w-auto gap-3">
                {handleInput('생활지원사', '성명', 'careManagerName')}
                <div>
                  {handleInput(
                    '연계기관',
                    '기관명 (띄어쓰기 생략)',
                    'affiliatedWelfareInstitution',
                  )}
                </div>
              </div>
              <div className="">
                {renderButtons('장애여부', disabilityTypes, 'disability')}
              </div>
              <div className="">
                {handleInput('비고', '전달드릴 사항을 작성해주세요', 'note')}
              </div>
            </div>
          ) : (
            <div>
              {handleSearchCounselee('내담자', '내담자 이름', 'counseleeId')}
              <div className="flex flex-row w-auto gap-3">
                {handleCalendar(
                  '상담 일자',
                  '상담 일자 선택',
                  'scheduledStartDateTime',
                )}
                {handleCalendar(
                  '예약 시각',
                  '예약 시각 선택',
                  'scheduledStartDateTime',
                )}
              </div>
            </div>
          )}
        </DialogDescription>
        <DialogFooter>
          {dialogType === 'DELETE' && (
            <Button onClick={onClose} variant={'secondary'}>
              취소
            </Button>
          )}
          {dialogType === 'DELETE' ? (
            <Button onClick={handleDeleteButton} color="destructive">
              삭제하기
            </Button>
          ) : (
            <Button onClick={handleConfirmButton} color="primary">
              확인
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ItemChange;
