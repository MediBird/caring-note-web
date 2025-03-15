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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'primary'}>내용 확인</Button>
      </DialogTrigger>
      <DialogContent className="w-[520px] z-50">
        <DialogHeader className="pr-2">
          <DialogTitle>대화에 참석한 사람을 선택해주세요</DialogTitle>
          <DialogClose
            asChild
            className="cursor-pointer border-none bg-transparent text-grayscale-100 !mt-0 !p-0 w-6 h-6">
            <XIcon />
          </DialogClose>
        </DialogHeader>
        <div className="h-[1px] bg-grayscale-20" />
        <DialogDescription
          asChild
          className="flex flex-col items-center m-0 p-0">
          <div>
            {isSuccessGetSpeakerList &&
              speakerList?.map((data, index) => {
                return (
                  <div
                    key={index}
                    className="flex items-center w-full cursor-pointer mt-6"
                    onClick={handleClickSpeaker(data.speaker)}>
                    <div
                      className={cn(
                        'flex items-center justify-center font-medium w-[36px] h-[36px] p-4 mx-4 rounded-full',
                        selectedSpeakers.includes(data?.speaker || '')
                          ? 'text-white bg-primary-50'
                          : SPEAKER_COLOR_LIST[index % 4],
                      )}>
                      {data.speaker}
                    </div>
                    <p
                      className={cn(
                        'w-full pr-4',
                        selectedSpeakers.includes(data?.speaker || '')
                          ? 'text-primary-50 font-bold'
                          : 'text-grayscale-90',
                      )}>
                      {data.text}
                    </p>
                  </div>
                );
              })}
          </div>
        </DialogDescription>
        <DialogFooter className="flex items-center justify-end m-0 p-5">
          <Button variant="primary" size="md" onClick={handleClickConfirm}>
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SelectSpeakerDialog;
