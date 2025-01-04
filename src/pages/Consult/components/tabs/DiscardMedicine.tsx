import Button from "@/components/Button";
import InputContainer from "@/components/common/InputContainer";
import TabContentContainer from "@/components/consult/TabContentContainer";
import TabContentTitle from "@/components/consult/TabContentTitle";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@mui/material";

const DiscardMedicine: React.FC = () => {
  return (
    <>
      <TabContentContainer>
        <TabContentTitle text="폐의약품의 처리" />
        <div className="bg-grayscale-3 rounded-lg p-4">
          <p className="text-body1 font-bold mb-4">
            사용하지 않고 약이 남는 경우에 누구의 판단으로 사용하지 않게
            되었나요?
          </p>
          <RadioGroup id="whos-decision" className="flex flex-row">
            <InputContainer>
              <RadioGroupItem value="whos-decision-1" id="whos-decision-1" />
              <Label htmlFor="whos-decision-1">의/약사 지시</Label>
            </InputContainer>
            <InputContainer>
              <RadioGroupItem value="whos-decision-2" id="whos-decision-2" />
              <Label htmlFor="whos-decision-2">본인 판단</Label>
            </InputContainer>
            <InputContainer>
              <RadioGroupItem value="whos-decision-3" id="whos-decision-3" />
              <Label htmlFor="whos-decision-3">폐의약품 없음</Label>
            </InputContainer>
          </RadioGroup>
        </div>

        <div className="bg-grayscale-3 rounded-lg p-4 mt-4">
          <p className="text-body1 font-bold mb-4">사용하지 않은 주된 이유</p>
          <div className="flex flex-row">
            <div className="w-1/3 space-y-4">
              <InputContainer>
                <Checkbox id="reason-2" />
                <Label htmlFor="reason-2">부작용이 나타나 사용 중단함</Label>
              </InputContainer>
              <InputContainer>
                <Checkbox id="reason-3" />
                <Label htmlFor="reason-3">재처방 받음</Label>
              </InputContainer>
              <InputContainer>
                <Checkbox id="reason-4" />
                <Label htmlFor="reason-4">기타</Label>
              </InputContainer>
            </div>
            <div className="space-y-4">
              <InputContainer>
                <Checkbox id="reason-5" />
                <Label htmlFor="reason-5">다른 약으로 대체함</Label>
              </InputContainer>
              <InputContainer>
                <Checkbox id="reason-6" />
                <Label htmlFor="reason-6">약 먹는 것을 잊어버림</Label>
              </InputContainer>
              <InputContainer>
                <Checkbox id="reason-7" />
                <Label htmlFor="reason-7">필요시 복용하려고 남겨둠</Label>
              </InputContainer>
            </div>
          </div>
        </div>

        <div className="bg-grayscale-3 rounded-lg p-4 mt-4">
          <p className="text-body1 font-bold mb-4">주된 처리 방법</p>
          <RadioGroup id="whos-decision" className="flex flex-row">
            <div className="w-1/3 space-y-4">
              <InputContainer>
                <RadioGroupItem id="way-to-discard-1" value="1" />
                <Label htmlFor="way-to-discard-1">쌓아둠</Label>
              </InputContainer>
              <InputContainer>
                <RadioGroupItem id="way-to-discard-2" value="2" />
                <Label htmlFor="way-to-discard-2">지인에게 나눠줌</Label>
              </InputContainer>
              <InputContainer>
                <RadioGroupItem id="way-to-discard-3" value="3" />
                <Label htmlFor="way-to-discard-3">기타</Label>
              </InputContainer>
            </div>
            <div className="space-y-4">
              <InputContainer>
                <RadioGroupItem id="way-to-discard-4" value="4" />
                <Label htmlFor="way-to-discard-4">쓰레기통에 버림</Label>
              </InputContainer>
              <InputContainer>
                <RadioGroupItem id="way-to-discard-5" value="5" />
                <Label htmlFor="way-to-discard-5">
                  폐의약품 수거함 등 지정된 폐기 장소에 버림
                </Label>
              </InputContainer>
            </div>
          </RadioGroup>
        </div>

        <div className="bg-grayscale-3 rounded-lg p-4 mt-4">
          <p className="text-body1 font-bold mb-4">폐의약품 회수</p>
          <RadioGroup id="medicine-collection" className="flex flex-row">
            <div className="w-1/3 space-y-4">
              <InputContainer>
                <RadioGroupItem id="collection-agree" value="agree" />
                <Label htmlFor="collection-agree">회수 동의</Label>
              </InputContainer>
            </div>
            <div className="space-y-4">
              <InputContainer>
                <RadioGroupItem id="collection-disagree" value="disagree" />
                <Label htmlFor="collection-disagree">회수 미동의</Label>
              </InputContainer>
            </div>
          </RadioGroup>
        </div>

        <div className="bg-grayscale-3 rounded-lg p-4 mt-4">
          <p className="text-body1 font-bold mb-4">폐의약품 무게</p>
          <Input
            type="text"
            placeholder="OO"
            className="w-24"
            inputProps={{
              style: {
                textAlign: "right",
                paddingRight: "0.5rem",
              },
            }}
          />
          <span className="text-body1">g</span>
        </div>

        <div className="mt-8">
          <div className="flex flex-row items-center justify-between">
            <TabContentTitle text="폐의약품 목록" />
            <Button variant="primary" onClick={() => {}} _class="mb-4">
              수정하기
            </Button>
          </div>
          <div className="h-96">테이블 내용 확정 후 추가 예정</div>
        </div>
      </TabContentContainer>
    </>
  );
};

export default DiscardMedicine;
