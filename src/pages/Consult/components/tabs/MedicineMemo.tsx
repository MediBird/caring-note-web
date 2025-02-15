import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { CardHeader } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';
import UsableSiteList from '@/pages/Consult/components/UsableSiteList';
import {
  MedicationRecordListDTO,
  useMedicationRecordList,
} from '@/pages/Consult/hooks/query/medicationRecord/useMedicationRecordList';
import useMedicineMemoStore from '@/store/medicineMemoStore';
import { initSelectMedicationRecordHistRes } from '@/pages/Consult/hooks/store/useWasteMedicationListStore';
import { SelectMedicationRecordHistResDivisionCodeEnum } from '@/api/api';
import MedicineRecordTable from '@/pages/Consult/components/table/MedicineRecordTable';
import { useDeleteMedicationRecordList } from '@/pages/Consult/hooks/query/medicationRecord/useDeleteMedicationRecordList';

const MedicineMemo: React.FC = () => {
  const { counselSessionId } = useParams();

  const { data: medicationRecordListData } = useMedicationRecordList({
    counselSessionId: counselSessionId as string,
  });
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

  useEffect(() => {
    setMedicationRecordList(medicationRecordListData ?? []);
  }, [medicationRecordListData, setMedicationRecordList]);

  const handleAddTableRowButton = (divisionCode: string) => {
    setMedicationRecordList([
      ...medicationRecordList,
      {
        ...initSelectMedicationRecordHistRes,
        divisionCode:
          divisionCode as SelectMedicationRecordHistResDivisionCodeEnum,
        id: 'temp' + Math.random().toString(36).substring(2, 15),
      },
    ]);
  };

  const handleUpdateCell = (
    id: string,
    field: string,
    value: string | number,
  ) => {
    const updatedItem: MedicationRecordListDTO | undefined =
      medicationRecordList.find((item) => item.id === id);

    if (!updatedItem) return;

    updateMedicationRecordListById(id, {
      ...updatedItem,
      [field as keyof MedicationRecordListDTO]: value,
    });
  };

  const handleSearchEnter = (
    id: string,
    medicationId: string,
    medicationName: string,
  ) => {
    const updatedItem: MedicationRecordListDTO | undefined =
      medicationRecordList.find((item) => item.id === id);

    if (!updatedItem) return;

    updateMedicationRecordListById(id, {
      ...updatedItem,
      medicationId,
      medicationName,
    });
  };

  const handleDelete = (id: string) => {
    if (id.includes('temp')) {
      setMedicationRecordList(
        medicationRecordList.filter((item) => !item.id.includes('temp')),
      );
    } else {
      deleteMedicationRecordListMutation.mutate({
        id,
        counselSessionId: counselSessionId as string,
      });
    }
  };
  console.log(medicationRecordList);
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
};

export default MedicineMemo;
