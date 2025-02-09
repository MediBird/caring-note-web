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
import { XIcon } from 'lucide-react';
import { useState } from 'react';

function SelectSpeakerDialog() {
  const { submitSpeakers } = useRecording();
  const [open, setOpen] = useState(false);
  const [selectedSpeakers, setSelectedSpeakers] = useState<string[]>([]);

  // FOR TEST
  const tempData = [
    {
      speaker: 'A',
      text: '안녕하세요 저는 첫번째 발화자입니다. 안녕하세요 저는 첫번째 발화자입니다.안녕하세요 저는 첫번째 발화자입니다.안녕하세요 저는 첫번째 발화자입니다.안녕하세요 저는 첫번째 발화자입니다.안녕하세요 저는 첫번째 발화자입니다.안녕하세요 저는 첫번째 발화자입니다.',
    },
    {
      speaker: 'B',
      text: '안녕하세요 저는 두번째 발화자입니다.',
    },
    {
      speaker: 'C',
      text: '안녕하세요 저는 세번째 발화자입니다.',
    },
    {
      speaker: 'D',
      text: '안녕하세요 저는 네번째 발화자입니다.',
    },
    {
      speaker: 'E',
      text: '안녕하세요 저는 다섯번째 발화자입니다.',
    },
  ];

  const handleClickSpeaker = (speaker: string) => () => {
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
        <div className="h-[1px] bg-grayscale-20 mb-4" />
        <DialogDescription
          asChild
          className="flex flex-col items-center m-0 p-0">
          <>
            {tempData.map((data, index) => {
              return (
                <div
                  key={index}
                  className="flex items-center w-full cursor-pointer"
                  onClick={handleClickSpeaker(data.speaker)}>
                  <div
                    className={cn(
                      'flex items-center justify-center font-bold w-[36px] h-[36px] p-4 m-4 rounded-full',
                      selectedSpeakers.includes(data.speaker)
                        ? 'text-white bg-primary-50'
                        : 'text-error-90 bg-error-10', // TODO : 글자색과 배경색 - 기디에서 정의하면 변경
                    )}>
                    {data.speaker}
                  </div>
                  <p
                    className={cn(
                      'w-full pr-4',
                      selectedSpeakers.includes(data.speaker)
                        ? 'text-primary-50 font-bold'
                        : 'text-grayscale-90',
                    )}>
                    {data.text}
                  </p>
                </div>
              );
            })}
          </>
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
