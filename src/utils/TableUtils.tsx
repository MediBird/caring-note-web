import { AddCounselSessionReqStatusEnum } from '@/api/api';
import { cn } from '@/lib/utils';
import { GridColDef } from '@mui/x-data-grid';
import moment from 'moment';

export const createDefaultTextColumn = ({
  field,
  headerName,
  isFirstColumn = false,
}: {
  field: string;
  headerName: string;
  isFirstColumn?: boolean;
}): GridColDef => {
  return {
    field,
    headerName,
    flex: 1,
    renderCell: (params) => {
      return (
        <span className="text-grayscale-100">
          {params?.value ? params.value : '-'}
        </span>
      );
    },
    headerClassName: isFirstColumn ? '!pl-6' : '',
    cellClassName: isFirstColumn ? '!pl-6' : '',
  };
};

export const createDefaultNumberColumn = ({
  field,
  headerName,
  unitName = '',
  isFirstColumn = false,
}: {
  field: string;
  headerName: string;
  unitName?: string;
  isFirstColumn?: boolean;
}): GridColDef => {
  return {
    field,
    headerName,
    headerAlign: 'left',
    flex: 1,
    type: 'number',
    renderCell: (params) => {
      return params.value > 0 ? (
        `${params.value} ${unitName}`
      ) : (
        <span className="text-gray-400 ">0</span>
      );
    },
    align: 'left',
    headerClassName: isFirstColumn ? '!pl-6' : '',
    cellClassName: isFirstColumn ? '!pl-6' : '',
  };
};

export const createDefaultDateColumn = ({
  field,
  headerName,
  dateFormat = 'YYYY-MM-DD',
  isFirstColumn = false,
}: {
  field: string;
  headerName: string;
  dateFormat?: string;
  isFirstColumn?: boolean;
}): GridColDef => {
  return {
    field,
    headerName,
    flex: 1,
    renderCell: (params) => {
      const formattedDate = params.value
        ? moment(params.value).format(dateFormat)
        : null;
      return (
        formattedDate || <span className="text-gray-400 ">{dateFormat}</span>
      );
    },
    headerClassName: isFirstColumn ? '!pl-6' : '',
    cellClassName: isFirstColumn ? '!pl-6' : '',
  };
};

const counselSessionStatus = {
  COMPLETED: '완료',
  SCHEDULED: '예정',
  PROGRESS: '진행',
  CANCELLED: '취소',
};

export const createDefaultStatusColumn = ({
  field,
  headerName,
  isFirstColumn = false,
}: {
  field: string;
  headerName: string;
  isFirstColumn?: boolean;
}): GridColDef => {
  const getCounselSessionStatusColor = (status: string): string => {
    switch (status) {
      case AddCounselSessionReqStatusEnum.Completed:
        return 'text-grayscale-100';
      case AddCounselSessionReqStatusEnum.Scheduled:
        return 'text-grayscale-50';
      case AddCounselSessionReqStatusEnum.Progress:
        return 'text-primary-50';
      case AddCounselSessionReqStatusEnum.Canceled:
        return 'text-error-50';
      default:
        return 'text-black';
    }
  };

  return {
    field,
    headerName,
    flex: 1,
    renderCell: (params) => {
      const status =
        counselSessionStatus[params.value as keyof typeof counselSessionStatus];
      return (
        <span className={cn(getCounselSessionStatusColor(params.value))}>
          {status}
        </span>
        // ) || (
        //   <span className={cn(getCounselSessionStatusColor(params.value))}>
        //     {'-'}
        //   </span>
        // )
      );
    },
    headerClassName: isFirstColumn ? '!pl-6' : '',
    cellClassName: isFirstColumn ? '!pl-6' : '',
  };
};
