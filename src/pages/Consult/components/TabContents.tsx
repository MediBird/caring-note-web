import { TabsContent } from '@/components/ui/tabs';
import ConsultCard from '@/pages/Consult/components/tabs/ConsultCard';
import DiscardMedicine from '@/pages/Consult/components/tabs/DiscardMedicine';
import MedicineMemo from '@/pages/Consult/components/tabs/MedicineMemo';
import PastConsult from '@/pages/Consult/components/tabs/PastConsult';
import AINote from './tabs/AINote';

function TabContents({ hasPreviousConsult }: { hasPreviousConsult: boolean }) {
  return (
    <div className="flex-grow overflow-y-auto">
      <div className="mb-100 mt-6 h-full w-full px-layout pb-10 [&>*]:mx-auto [&>*]:max-w-content">
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
        <TabsContent value="wasteMedication">
          <DiscardMedicine />
        </TabsContent>
        <TabsContent value="note">
          <AINote />
        </TabsContent>
      </div>
    </div>
  );
}

export default TabContents;
