import { Checkbox } from "@components/components/ui/checkbox";
import { Button } from "@components/components/ui/button";
import DatePickerComponent from "@components/components/ui/datepicker";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@components/components/ui/tabs";
import { Label } from "@components/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@components/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import Tooltip from "@components/Tooltip";
import Badge from "@components/common/Badge";
import TableComponent from "@components/common/TableComponent";
import { GridColDef } from "@mui/x-data-grid";
import {
  createDefaultDateColumn,
  createDefaultNumberColumn,
  createDefaultTextColumn,
} from "@utils/TableUtils";
import moment from "moment";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@components/components/ui/dialog";

function Home() {
  const navigate = useNavigate();

  const columns: GridColDef[] = [
    {
      field: "col1",
      headerName: "예약시간",
      flex: 1,
      renderCell: (params) => {
        const formattedDate = params.value
          ? moment(params.value).format("HH:mm")
          : null;
        return (
          formattedDate || <span className="italic text-gray-400">HH:mm</span>
        );
      },
    },
    {
      ...createDefaultDateColumn({
        field: "col2",
        headerName: "상담일자",
      }),
    },
    {
      ...createDefaultNumberColumn({
        field: "col3",
        headerName: "상담횟수",
        unitName: "회차",
      }),
    },
    {
      ...createDefaultTextColumn({
        field: "col4",
        headerName: "내담자명",
      }),
    },
    {
      ...createDefaultTextColumn({
        field: "col5",
        headerName: "담당약사",
      }),
    },
    {
      field: "col6",
      headerName: "담당 할당",
      flex: 1,
      renderCell: (params) => {
        // TODO : 할당 여부에 따라 버튼 diable 처리 (아래는 임시 코드)
        return parseInt(params.id.toString()) % 2 === 1 ? (
          <Button variant={"secondary"} onClick={handleClickAssignMe}>
            나에게 할당
          </Button>
        ) : (
          <Button variant={"secondary"} disabled>
            할당 완료
          </Button>
        );
      },
    },
  ];

  const testRows = [
    {
      id: "1",
      col1: new Date(),
      col2: new Date(),
      col3: 1,
      col4: "김진영",
      col5: "박진완",
      col6: "조영호",
    },
    {
      id: "2",
      col1: new Date(),
      col2: new Date(),
      col3: 1,
      col4: "김진영",
      col5: "박진완",
      col6: "조영호",
    },
    {
      id: "3",
      col1: new Date(),
      col2: new Date(),
      col3: 1,
      col4: "김진영",
      col5: "박진완",
      col6: "조영호",
    },
  ];

  const handleClickAssignMe = () => {
    console.log("할당하기 버튼 클릭");
    // TODO : 할당하기 버튼 클릭 시 확인 Dialog 띄우기
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center pt-20 bg-blue-100">
        <p className="w-full font-bold text-h2 text-primary-70 pl-28">
          박진완님, <br />
          오늘도 힘찬 하루를 보내세요!{" "}
        </p>
        <div className="flex flex-row items-center justify-center w-full px-24 mt-10 space-x-5">
          <div className="w-1/2 h-32 bg-white border-2 border-white rounded-xl bg-opacity-60">
            <div className="flex flex-row w-full h-full">
              <div className="flex flex-col items-start justify-center w-1/2 pl-5 space-y-2">
                <p className="font-medium text-body1">
                  올해 케어링 메세지 공유 수
                </p>
                <p className="font-bold text-h2 text-primary-50">{"1,234"}회</p>
              </div>
              <div className="flex flex-col items-start justify-center w-1/2 pl-5 space-y-2">
                <p className="font-medium text-body1">올해 상담한 내담자 수</p>
                <p className="font-bold text-h2 text-primary-50">{"201"}명</p>
              </div>
            </div>
          </div>
          <div className="w-1/2 h-32 bg-white border-2 border-white rounded-xl bg-opacity-60">
            <div className="flex flex-row w-full h-full">
              <div className="flex flex-col items-start justify-center w-1/2 pl-5 space-y-2">
                <p className="font-medium text-body1">
                  올해 케어링 메세지 공유 수
                </p>
                <p className="font-bold text-h2 text-secondary-50">
                  {"1,234"}회
                </p>
              </div>
              <div className="flex flex-col items-start justify-center w-1/2 pl-5 space-y-2">
                <p className="font-medium text-body1">올해 상담한 내담자 수</p>
                <p className="font-bold text-h2 text-secondary-50">{"201"}명</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full px-24 pt-10">
          <div className="w-full h-auto p-10 bg-white rounded-xl">
            {/* 실제 코드 */}
            <div className="flex flex-row items-center justify-between w-full h-10">
              <span className="font-bold text-h3">오늘의 상담 일정</span>
              <Button variant="secondary">전체 상담 노트 보기</Button>
            </div>
            <div className="mt-10">
              <TableComponent
                rows={testRows}
                columns={columns}
                checkboxSelection={false}
                onUpdateCell={() => {}}
                onRowSelectionModelChange={() => {}}
              />
            </div>

            {/* 테스트 코드 */}
            <p
              className="mt-10 text-3xl text-center"
              onClick={() => {
                navigate("/consult");
              }}>
              박진완 : 본상담 화면으로 이동 (임시){" "}
            </p>
            <p
              className="mt-10 text-3xl text-center"
              onClick={() => {
                navigate("/assistant");
              }}>
              조영호 : 기초상담 화면으로 이동 (임시){" "}
            </p>

            <DatePickerComponent></DatePickerComponent>
            <Tabs defaultValue="account" className="w-[400px]">
              <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                Make changes to your account here.
              </TabsContent>
              <TabsContent value="password">
                Change your password here.
              </TabsContent>
            </Tabs>

            <RadioGroup>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-one" id="option-one" />
                <Label htmlFor="option-one">Option One</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-two" id="option-two" />
                <Label htmlFor="option-two">Option Two</Label>
              </div>
            </RadioGroup>
            <Checkbox></Checkbox>
            <Button variant={"secondary"} disabled={true}>
              wwwwww
            </Button>

            <Tooltip id="tooltip" text="This is a tooltip" eventType="hover" />
            <Tooltip id="tooltip2" text="This is a tooltip" eventType="click" />

            <div className="grid items-start grid-cols-4 gap-4">
              <div>
                <Badge variant="filled" size="extra-large" color="primary">
                  Badge
                </Badge>
              </div>
              <div>
                <Badge variant="tint" size="large" color="primary">
                  Badge
                </Badge>
              </div>
              <div>
                <Badge variant="outline" size="medium" color="primary">
                  Badge
                </Badge>
              </div>
              <div>
                <Badge variant="ghost" size="small" color="primary">
                  Badge
                </Badge>
              </div>
              <div>
                <Badge variant="filled" size="extra-large" color="error">
                  Badge
                </Badge>
              </div>
              <div>
                <Badge variant="tint" size="large" color="error">
                  Badge
                </Badge>
              </div>
              <div>
                <Badge variant="outline" size="medium" color="error">
                  Badge
                </Badge>
              </div>
              <div>
                <Badge variant="ghost" size="small" color="error">
                  Badge
                </Badge>
              </div>
            </div>
            <Dialog>
              <DialogTrigger>Open</DialogTrigger>
              <DialogOverlay />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>타이틀</DialogTitle>
                </DialogHeader>
                <DialogDescription>내용을 넣어주세요</DialogDescription>
                <DialogFooter>
                  <DialogClose>취소</DialogClose>
                  <DialogTrigger>확인</DialogTrigger>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
