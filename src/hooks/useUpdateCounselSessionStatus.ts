import { UpdateStatusInCounselSessionReqStatusEnum } from '@/api';

import { CounselSessionControllerApi } from '@/api/api/counsel-session-controller-api';
import { useMutation } from '@tanstack/react-query';

const counselSessionControllerApi = new CounselSessionControllerApi();

const updateCounselSessionStatus = async (
  counselSessionId: string,
  status: UpdateStatusInCounselSessionReqStatusEnum,
) => {
  const response = await counselSessionControllerApi.updateCounselSessionStatus(
    {
      counselSessionId,
      status,
    },
  );
  return response.data;
};

const useUpdateCounselSessionStatus = ({
  counselSessionId,
}: {
  counselSessionId: string;
}) => {
  const { mutate } = useMutation({
    mutationFn: (status: UpdateStatusInCounselSessionReqStatusEnum) =>
      updateCounselSessionStatus(counselSessionId, status),
  });

  return { mutate };
};

export default useUpdateCounselSessionStatus;
