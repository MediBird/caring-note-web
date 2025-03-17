import { InfoIcon } from '@/components/icon/InfoIcon';
import { Button } from '@/components/ui/button';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useRecording } from '@/hooks/useRecording';
import { cn } from '@/lib/utils';
import { SPEAKER_COLOR_LIST } from '@/pages/Consult/types/Recording.enum';
import { XIcon } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetRecordingSpeakersQuery } from '../../hooks/query/counselRecording/useGetRecordingSpeakersQuery';

function SelectSpeakerDialog() {
  const { counselSessionId } = useParams();
  const { submitSpeakers, recordingStatus } = useRecording(counselSessionId);
  const [open, setOpen] = useState(false);
  const [selectedSpeakers, setSelectedSpeakers] = useState<string[]>([]);
  const { data: speakerList, isSuccess: isSuccessGetSpeakerList } =
    useGetRecordingSpeakersQuery(counselSessionId, recordingStatus);

  const handleClickSpeaker =
    (speaker: string = '') =>
    () => {
      if (selectedSpeakers.includes(speaker)) {
        setSelectedSpeakers(
          selectedSpeakers.filter((selected) => selected !== speaker),
        );
      } else {
        setSelectedSpeakers([...selectedSpeakers, speaker]);
      }
    };

  const handleClickConfirm = () => {
    submitSpeakers(selectedSpeakers);
    setOpen(false);
  };

  const tooltip = () => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <InfoIcon className="ml-2 h-5 w-5 text-grayscale-90" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="p-1 text-caption1 text-grayscale-10">
              음성 변환 시, 한 사람의 발화가 여러 개로 나뉘거나, <br />
              여러 사람의 발화가 하나로 뭉쳐 나올 수도 있어요.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // 발화자 선택화면 테스트용 더미 데이터 (QA이후 삭제하겠습니다)
  // function generateMockData(count: number) {
  //   return {
  //     message: 'Mock data response',
  //     data: Array.from({ length: count }, (_, index) => ({
  //       speaker: String.fromCharCode(65 + (index % 26)), // A, B, C ... Z 반복
  //       text: `Sample text ${index + 1}`,
  //       isRecommended: Math.random() > 0.5, // 랜덤 true/false 값
  //     })),
  //   };
  // }
  // const mockData = generateMockData(7);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'primary'}>내용 확인</Button>
      </DialogTrigger>
      <DialogContent className="z-50 max-h-[680px] w-[520px]">
        <DialogHeader className="my-3 flex items-center pr-2">
          <DialogTitle>
            <div>
              <p className="mb-1 flex items-center text-subtitle2 font-bold">
                상담에 참여한 사람을 선택해주세요.
                {tooltip()}
              </p>
              <p className="text-body1 text-grayscale-60">
                각자 말한 내용 중 가장 긴 문장을 추출했어요.
              </p>
            </div>
          </DialogTitle>
          <DialogClose
            asChild
            className="!m-0 h-6 w-6 cursor-pointer border-none bg-transparent !p-0 text-grayscale-100">
            <XIcon />
          </DialogClose>
        </DialogHeader>
        <div className="h-[1px] bg-grayscale-20" />
        <DialogDescription
          asChild
          className="m-0 flex max-h-[530px] flex-col items-center overflow-y-auto p-0">
          <ScrollArea>
            {isSuccessGetSpeakerList &&
              speakerList?.map((data, index) => {
                return (
                  <div
                    key={index}
                    className="mt-6 flex w-full cursor-pointer items-center"
                    onClick={handleClickSpeaker(data.speaker)}>
                    <div
                      className={cn(
                        'mx-4 w-full rounded-sm border-l-[6px] pl-3',
                        SPEAKER_COLOR_LIST[index % 7],
                        selectedSpeakers.includes(data?.speaker || '')
                          ? 'font-bold text-primary-50'
                          : 'text-grayscale-90',
                      )}>
                      {data.isRecommended && (
                        <span className="mr-2 h-[20px] min-w-[30px] rounded-xl bg-primary-50 px-2 py-1 text-caption2 font-medium text-white">
                          추천
                        </span>
                      )}
                      {data.text}
                    </div>
                  </div>
                );
              })}
          </ScrollArea>
        </DialogDescription>
        <DialogFooter className="m-0 flex items-center justify-end p-5">
          <Button variant="primary" size="md" onClick={handleClickConfirm}>
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SelectSpeakerDialog;
