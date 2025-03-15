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
import { useRecording } from '@/hooks/useRecording';
import { cn } from '@/lib/utils';
import { SPEAKER_COLOR_LIST } from '@/types/Recording.enum';
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'primary'}>내용 확인</Button>
      </DialogTrigger>
      <DialogContent className="z-50 w-[520px]">
        <DialogHeader className="pb-0 pr-2">
          <DialogTitle>상담에 참여한 사람을 선택해주세요</DialogTitle>
          <DialogClose
            asChild
            className="!m-0 h-6 w-6 cursor-pointer border-none bg-transparent !p-0 text-grayscale-100">
            <XIcon />
          </DialogClose>
        </DialogHeader>
        <DialogDescription className="m-0 pb-2 pl-5 text-grayscale-60">
          각자 말한 내용 중 가장 긴 문장을 추출했어요
        </DialogDescription>
        <div className="h-[1px] bg-grayscale-20" />
        <DialogDescription
          asChild
          className="m-0 flex flex-col items-center p-0">
          <div>
            {isSuccessGetSpeakerList &&
              speakerList?.map((data, index) => {
                return (
                  <div
                    key={index}
                    className="mt-6 flex w-full cursor-pointer items-center"
                    onClick={handleClickSpeaker(data.speaker)}>
                    <div
                      className={cn(
                        'mx-4 flex h-[36px] w-[36px] items-center justify-center rounded-full p-4 font-medium',
                        selectedSpeakers.includes(data?.speaker || '')
                          ? 'bg-primary-50 text-white'
                          : SPEAKER_COLOR_LIST[index % 4],
                      )}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <p
                      className={cn(
                        'w-full pr-4',
                        selectedSpeakers.includes(data?.speaker || '')
                          ? 'font-bold text-primary-50'
                          : 'text-grayscale-90',
                      )}>
                      {data.text}
                    </p>
                  </div>
                );
              })}
          </div>
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
