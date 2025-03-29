import { TabsContent } from '@/components/ui/tabs';
import useContentWidth from '@/hooks/useContentWidth';
import ConsultCard from '@/pages/Consult/components/tabs/ConsultCard';
import DiscardMedicine from '@/pages/Consult/components/tabs/DiscardMedicine';
import MedicineConsult from '@/pages/Consult/components/tabs/MedicineConsult';
import MedicineMemo from '@/pages/Consult/components/tabs/MedicineMemo';
import PastConsult from '@/pages/Consult/components/tabs/PastConsult';

function TabContents({
  onWidthChange,
  hasPreviousConsult,
}: {
  onWidthChange: (width: number) => void;
  hasPreviousConsult: boolean;
}) {
  const contentRef = useContentWidth(onWidthChange);

  return (
    <div
      ref={contentRef}
      className="mb-100 mt-6 h-full w-full px-layout pb-10 pt-[168px] [&>*]:mx-auto [&>*]:max-w-content">
      {hasPreviousConsult && (
        <TabsContent value="pastConsult">
          <PastConsult />
        </TabsContent>
      )}
      <TabsContent value="survey">
        <ConsultCard />
      </TabsContent>
      <TabsContent value="medicine">
        <MedicineMemo />
      </TabsContent>
      <TabsContent value="note">
        <MedicineConsult />
      </TabsContent>
      <TabsContent value="wasteMedication">
        <DiscardMedicine />
      </TabsContent>
    </div>
  );
}

export default TabContents;
