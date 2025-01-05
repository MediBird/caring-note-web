import { CounselCardControllerApi } from "@/api";
import CardContent from "@/components/common/CardContent";
import useConsultCardStore from "@/store/consultCardStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Button from "../../../../components/Button";
import CardContainer from "../../../../components/common/CardContainer";
import TabContentContainer from "../../../../components/consult/TabContentContainer";
import TabContentTitle from "../../../../components/consult/TabContentTitle";
import { useNavigate } from "react-router-dom";

const ConsultCard: React.FC = () => {
  const counselSessionId = "TEST-COUNSEL-SESSION-01"; // TODO : 다른 곳에서 전달받아야됨

  const counselCardControllerApi = new CounselCardControllerApi();

  const navigate = useNavigate();
  const selectCounselCard = async () => {
    const response = await counselCardControllerApi.selectCounselCard(
      counselSessionId,
    );
    console.log("selectCounselCard", response);

    // 302 리다이렉트 테스트 (25-01-05)
    if (response.status === 302) {
      console.log("Redirect to", response.headers.location);
      navigate(response.headers.location);
    }
    return response;
  };

  // tanstack/react-query 를 사용하여 데이터 fetch
  const consultCardQuery = useQuery({
    queryKey: ["consultCard"],
    queryFn: selectCounselCard,
    enabled: false, // 자동 새로고침 block
  });
  // zustand 로 상태관리
  const {
    originalData,
    editedData,
    setOriginalData,
    setEditedData,
    setHttpStatus,
  } = useConsultCardStore();

  useEffect(() => {
    // API 호출
    consultCardQuery.refetch().then(() => {
      // originalData 가 비어있을 때만 setOriginalData 호출
      if (consultCardQuery.isSuccess && JSON.stringify(originalData) === "{}") {
        // Zustand 상태 update
        setHttpStatus && setHttpStatus(consultCardQuery.data?.status || 0);
        setOriginalData &&
          setOriginalData(consultCardQuery.data?.data?.data || {});
        setEditedData && setEditedData(consultCardQuery.data?.data?.data || {});

        console.log("jw, consultCard:: originalData updated!!");
      }
    });
  }, [originalData]);

  return (
    <>
      <TabContentContainer>
        <div className="flex justify-between items-center">
          <TabContentTitle text="상담카드" />
          <Button variant="secondary" onClick={() => {}}>
            수정하기
          </Button>
        </div>

        <div className="flex justify-between items-start space-x-4">
          <div id="consult-card-left" className="w-1/2">
            <CardContainer
              title="기본 정보"
              variant="grayscale"
              informationName="baseInformation"
              itemName="baseInfo">
              <CardContent
                item="성명"
                value={originalData?.baseInformation?.baseInfo?.name || ""}
              />
              <CardContent
                item="생년월일"
                value={originalData?.baseInformation?.baseInfo?.birthDate || ""}
              />
              <CardContent
                item="의료보장형태"
                value={
                  originalData?.baseInformation?.baseInfo
                    ?.counselSessionOrder || ""
                }
              />
            </CardContainer>

            <CardContainer
              title="상담 목적 및 특이사항"
              informationName="baseInformation"
              itemName="counselPurposeAndNote">
              <CardContent
                item="상담 목적"
                value={
                  originalData?.baseInformation?.counselPurposeAndNote
                    ?.counselPurpose || ""
                }
              />
              <CardContent
                item="특이사항"
                value={
                  originalData?.baseInformation?.counselPurposeAndNote
                    ?.SignificantNote || ""
                }
              />
              <CardContent
                item="의약품"
                value={
                  originalData?.baseInformation?.counselPurposeAndNote
                    ?.MedicationNote || ""
                }
              />
            </CardContainer>

            <CardContainer
              title="흡연"
              variant="secondary"
              informationName="livingInformation"
              itemName="smoking">
              <CardContent
                item="흡연 여부"
                value={
                  originalData?.livingInformation?.smoking?.isSmoking
                    ? "흡연"
                    : "비흡연"
                }
              />
              <CardContent
                item="총 흡연기간"
                value={
                  originalData?.livingInformation?.smoking?.smokingPeriodNote ||
                  ""
                }
              />
              <CardContent
                item="하루 평균 흡연량"
                value={
                  originalData?.livingInformation?.smoking?.smokingAmount || ""
                }
              />
            </CardContainer>

            <CardContainer
              title="음주"
              informationName="livingInformation"
              itemName="drinking">
              <CardContent
                item="음주 여부"
                value={
                  originalData?.livingInformation?.drinking?.isDrinking
                    ? "음주"
                    : "비음주"
                }
              />
              <CardContent
                item="음주 횟수"
                value={
                  originalData?.livingInformation?.drinking?.drinkingAmount ||
                  ""
                }
              />
            </CardContainer>

            <CardContainer
              title="영양상태"
              informationName="livingInformation"
              itemName="nutrition">
              <CardContent
                item="하루 식사 패턴"
                value={
                  originalData?.livingInformation?.nutrition?.mealPattern || ""
                }
              />
              <CardContent
                item="식생활 특이사항"
                value={
                  originalData?.livingInformation?.nutrition?.nutritionNote ||
                  ""
                }
              />
            </CardContainer>

            <CardContainer
              title="운동"
              informationName="livingInformation"
              itemName="exercise">
              <CardContent
                item="주간 운동 패턴"
                value={
                  originalData?.livingInformation?.exercise?.exercisePattern ||
                  ""
                }
              />
              <CardContent
                item="운동 종류"
                value={
                  originalData?.livingInformation?.exercise?.exerciseNote || ""
                }
              />
            </CardContainer>

            <CardContainer
              title="약 복용 관리"
              informationName="livingInformation"
              itemName="medicationManagement">
              <CardContent
                item="독거 여부"
                value={
                  originalData?.livingInformation?.medicationManagement?.isAlone
                    ? "혼자"
                    : "동거"
                }
              />
              <CardContent
                item="동거인 구성원"
                value={
                  originalData?.livingInformation?.medicationManagement
                    ?.houseMateNote || ""
                }
              />
              <CardContent
                item="복용자 및 투약 보조자"
                value={
                  originalData?.livingInformation?.medicationManagement?.medicationAssistants?.join(
                    ", ",
                  ) || ""
                }
              />
            </CardContainer>
          </div>
          <div id="consult-card-right" className="w-1/2">
            <CardContainer
              title="앓고 있는 질병"
              variant="primary"
              informationName="healthInformation"
              itemName="diseaseInfo">
              <CardContent
                item="질병"
                value={
                  originalData?.healthInformation?.diseaseInfo?.diseases?.join(
                    " · ",
                  ) || ""
                }
              />
              <CardContent
                item="질병 및 수술 이력"
                value={
                  originalData?.healthInformation?.diseaseInfo?.historyNote ||
                  ""
                }
              />
              <CardContent
                item="주요 불편 증상"
                value={
                  originalData?.healthInformation?.diseaseInfo
                    ?.mainInconvenienceNote || ""
                }
              />
            </CardContainer>

            <CardContainer
              title="알레르기"
              informationName="healthInformation"
              itemName="allergy">
              <CardContent
                item="알레르기 여부"
                value={
                  originalData?.healthInformation?.allergy?.isAllergy
                    ? "알레르기 있음"
                    : "없음"
                }
              />
              <CardContent
                item="의심 식품/약물"
                value={
                  originalData?.healthInformation?.allergy?.allergyNote || ""
                }
              />
            </CardContainer>

            <CardContainer
              title="약물 부작용"
              informationName="healthInformation"
              itemName="medicationSideEffect">
              <CardContent
                item="약물 부작용 여부"
                value={
                  originalData?.healthInformation?.medicationSideEffect
                    ?.isSideEffect
                    ? "약물 부작용 있음"
                    : "없음"
                }
              />
              <CardContent
                item="부작용 의심 약물"
                value={
                  originalData?.healthInformation?.medicationSideEffect
                    ?.suspectedMedicationNote || ""
                }
              />
              <CardContent
                item="부작용 증상"
                value={
                  originalData?.healthInformation?.medicationSideEffect
                    ?.symptomsNote || ""
                }
              />
            </CardContainer>

            {originalData?.independentLifeInformation && (
              <>
                <CardContainer
                  title="보행"
                  variant="error"
                  informationName="independentLifeInformation"
                  itemName="walking">
                  <CardContent
                    item="보행 여부"
                    value={
                      originalData?.independentLifeInformation?.walking?.walkingMethods?.join(
                        ", ",
                      ) || "정보 없음"
                    }
                  />
                  <CardContent
                    item="이동 장비"
                    value={
                      originalData?.independentLifeInformation?.walking?.walkingEquipments?.join(
                        ", ",
                      ) || "정보 없음"
                    }
                  />
                  <CardContent
                    item="기타"
                    value={
                      originalData?.independentLifeInformation?.walking
                        ?.etcNote || "정보 없음"
                    }
                  />
                </CardContainer>

                <CardContainer
                  title="배변 처리"
                  informationName="independentLifeInformation"
                  itemName="evacuation">
                  <CardContent
                    item="배변 처리 방식"
                    value={
                      originalData?.independentLifeInformation?.evacuation?.evacuationMethods?.join(
                        ", ",
                      ) || "정보 없음"
                    }
                  />
                  <CardContent
                    item="기타"
                    value={
                      originalData?.independentLifeInformation?.evacuation
                        ?.etcNote || "정보 없음"
                    }
                  />
                </CardContainer>

                <CardContainer
                  title="의사소통 정도"
                  informationName="independentLifeInformation"
                  itemName="Communication">
                  <CardContent
                    item="시력"
                    value={
                      originalData?.independentLifeInformation?.communication?.sights?.join(
                        ", ",
                      ) || "정보 없음"
                    }
                  />
                  <CardContent
                    item="청력"
                    value={
                      originalData?.independentLifeInformation?.communication?.hearings?.join(
                        ", ",
                      ) || "정보 없음"
                    }
                  />
                  <CardContent
                    item="언어 소통"
                    value={
                      originalData?.independentLifeInformation?.communication?.communications?.join(
                        ", ",
                      ) || "정보 없음"
                    }
                  />
                  <CardContent
                    item="한글 사용"
                    value={
                      originalData?.independentLifeInformation?.communication?.usingKoreans?.join(
                        ", ",
                      ) || "정보 없음"
                    }
                  />
                </CardContainer>
              </>
            )}
          </div>
        </div>
      </TabContentContainer>
    </>
  );
};

export default ConsultCard;
