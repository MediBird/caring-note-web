import { Button } from '@/components/ui/button';

interface TemporarySaveDialogProps {
  onSave: () => void;
}

const TemporarySaveDialog = ({ onSave }: TemporarySaveDialogProps) => {
  return (
    <>
      <Button variant="tertiary" size="xl" onClick={onSave}>
        임시 저장
      </Button>
    </>
  );
};

export default TemporarySaveDialog;
