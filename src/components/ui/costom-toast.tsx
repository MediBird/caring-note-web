import { toast } from 'sonner';

export const InfoToast = ({ message }: { message: string }) => {
  return toast(message, {
    unstyled: true,
    position: 'bottom-center',
    style: {
      backgroundColor: '#000',
      color: '#fff',
      paddingLeft: '12px',
      paddingRight: '12px',
      paddingTop: '8px',
      paddingBottom: '8px',
      borderRadius: '4px',
      fontSize: '16px',
      fontWeight: 'medium',
    },
  });
};
