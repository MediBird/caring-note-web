import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';

const counseleeBaseInfoQuery = useQuery({
  queryKey: ['counseleeBaseInfo', counselSessionId],
  queryFn: selectCounseleeBaseInformation,
});
export function Index() {
  return (
    <Tabs defaultValue="이전 상담 내역" className="w-full h-screen">
      <div className="sticky bg-white h-[167px]">
        <div className="px-[5.75rem] py-4 border-b border-grayscale-05">
          <p className="text-h3 font-bold">
            김상담 <span className="text-subtitle-2 font-bold">님</span>
          </p>
          <div className="mt-2 flex items-center gap-4 text-sm text-grayscale-60">
            <span className="flex items-center gap-1">
              <span>재상담</span>
            </span>
            <span className="flex items-center gap-1">
              <span>만 64세</span>
            </span>
            <span className="flex items-center gap-1">
              <span>고혈압 · 고지혈증 · 뇌혈관질환 외 00개의 질병</span>
            </span>
          </div>
        </div>
        <TabsList className="grid w-full grid-cols-12">
          <TabsTrigger value="pastConsult">이전 상담 내역</TabsTrigger>
          <TabsTrigger value="survey">기초 설문 내역</TabsTrigger>
          <TabsTrigger value="medicine">의약물 기록</TabsTrigger>
          <TabsTrigger value="note">중재 기록 작성</TabsTrigger>
          <TabsTrigger value="wasteMedication">폐의약물 기록</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="pastConsult">
        <Card>
          <CardHeader>
            <CardTitle>이전 상담 내역</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="@peduarte" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="survey">
        <Card>
          <CardHeader>
            <CardTitle>기초 설문 내역</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default Index;
