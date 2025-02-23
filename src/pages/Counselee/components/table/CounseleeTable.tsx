import { SelectCounseleeRes } from '@/api/api';
import { DataTable } from '@/components/common/DataTable/data-table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { createCounseleeColumns } from './counseleeColumns';

interface CounseleeTableProps {
  data: SelectCounseleeRes[];
  onDelete: (id: string) => void;
  onEdit: (counselee: SelectCounseleeRes) => void;
}

export function CounseleeTable({
  data,
  onDelete,
  onEdit,
}: CounseleeTableProps) {
  return (
    <ScrollArea className="max-w-[1000px] w-[1084px]">
      <DataTable
        columns={createCounseleeColumns({ onDelete, onEdit })}
        data={data}
      />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
