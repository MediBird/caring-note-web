import { SelectMedicationRecordHistResDivisionCodeEnum } from '@/api';
import { CardHeader, CardTitle } from '@/components/ui/card';
import MedicineRecordTable from '@/pages/Consult/components/table/MedicineRecordTable';
import UsableSiteList from '@/pages/Consult/components/UsableSiteList';
import { useDeleteMedicationRecordList } from '@/pages/Consult/hooks/query/medicationRecord/useDeleteMedicationRecordList';
import { MedicationRecordListDTO } from '@/pages/Consult/hooks/query/medicationRecord/useMedicationRecordList';
import { initSelectMedicationRecordHistRes } from '@/pages/Consult/hooks/store/useWasteMedicationListStore';
import useMedicineMemoStore from '@/store/medicineMemoStore';
import { useMemo, useCallback, memo } from 'react';
import { useParams } from 'react-router-dom';

const MedicineMemo: React.FC = memo(() => {
  const { counselSessionId } = useParams();

  const { deleteMedicationRecordListMutation } =
    useDeleteMedicationRecordList();

  const {
    medicationRecordList,
    setMedicationRecordList,
    updateMedicationRecordListById,
  } = useMedicineMemoStore();

  const prescriptionMedicineList = useMemo(() => {
    return (
      medicationRecordList?.filter(
        (item) => item.divisionCode === 'PRESCRIPTION',
      ) ?? []
    );
  }, [medicationRecordList]);

  const overTheCounterMedicineList = useMemo(() => {
    return (
      medicationRecordList?.filter((item) => item.divisionCode === 'OTC') ?? []
    );
  }, [medicationRecordList]);

  const handleAddTableRowButton = useCallback(
    (divisionCode: string) => {
      setMedicationRecordList([
        ...medicationRecordList,
        {
          ...initSelectMedicationRecordHistRes,
          divisionCode:
            divisionCode as SelectMedicationRecordHistResDivisionCodeEnum,
          id: 'temp' + Math.random().toString(36).substring(2, 15),
        },
      ]);
    },
    [medicationRecordList, setMedicationRecordList],
  );

  const handleUpdateCell = useCallback(
    (id: string, field: string, value: string | number | null) => {
      const updatedItem: MedicationRecordListDTO | undefined =
        medicationRecordList.find((item) => {
          return item.id === id;
        });

      if (!updatedItem) return;

      updateMedicationRecordListById(id, {
        ...updatedItem,
        [field as keyof MedicationRecordListDTO]: value,
      });
    },
    [medicationRecordList, updateMedicationRecordListById],
  );

  const handleSearchEnter = useCallback(
    (id: string, medicationId: string, medicationName: string) => {
      const updatedItem: MedicationRecordListDTO | undefined =
        medicationRecordList.find((item) => item.id === id);

      if (!updatedItem) return;

      updateMedicationRecordListById(id, {
        ...updatedItem,
        medicationId,
        medicationName,
      });
    },
    [medicationRecordList, updateMedicationRecordListById],
  );

  const handleDelete = useCallback(
    (id: string) => {
      if (id.includes('temp')) {
        const filteredList = medicationRecordList.filter(
          (item) => item.id !== id,
        );

        setMedicationRecordList(filteredList);
      } else {
        deleteMedicationRecordListMutation.mutate({
          id,
          counselSessionId: counselSessionId as string,
        });
      }
    },
    [
      medicationRecordList,
      setMedicationRecordList,
      deleteMedicationRecordListMutation,
      counselSessionId,
    ],
  );

  return (
    <div className="flex flex-col gap-10">
      <div>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>처방 의약품</CardTitle>
          </div>
        </CardHeader>

        <MedicineRecordTable
          medicineRecordList={prescriptionMedicineList}
          divisionCode="PRESCRIPTION"
          handleAddTableRowButton={handleAddTableRowButton}
          handleUpdateCell={handleUpdateCell}
          handleSearchEnter={handleSearchEnter}
          onDelete={handleDelete}
        />
      </div>
      <div>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>일반 의약품 및 건강식품</CardTitle>
          </div>
        </CardHeader>

        <MedicineRecordTable
          medicineRecordList={overTheCounterMedicineList}
          divisionCode="OTC"
          handleAddTableRowButton={handleAddTableRowButton}
          handleUpdateCell={handleUpdateCell}
          handleSearchEnter={handleSearchEnter}
          onDelete={handleDelete}
        />
      </div>
      <UsableSiteList />
    </div>
  );
});

MedicineMemo.displayName = 'MedicineMemo';

export default MedicineMemo;
