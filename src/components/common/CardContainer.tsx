import { CounselCardControllerApi } from "@api/api";
import ClockBlackIcon from "@icon/24/clock.outlined.black.svg?react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import HistoryList from "./HistoryList";

interface CardContainerProps {
  className?: string;
  variant?: "primary" | "secondary" | "grayscale" | "error";
  title?: string;
  titleIcon?: "clock";
  informationName?: string;
  itemName?: string;
  children: React.ReactNode;
}

const CardContainer = ({
  className,
  variant,
  title,
  informationName = "",
  itemName,
  titleIcon = itemName !== "baseInfo" ? "clock" : undefined, // 모든 cardContainer에 clock 아이콘이 추가되도록 기획이 수정됨 -> 기본정보에선 없음..
  children,
}: CardContainerProps) => {
  const counselSessionId = "TEST-COUNSEL-SESSION-01"; // TODO : 다른 곳에서 전달받아야됨
  const counselCardControllerApi = new CounselCardControllerApi();

  const selectPreviousHistoryItemList = async () => {
    const response =
      await counselCardControllerApi.selectPreviousItemListByInformationNameAndItemName(
        counselSessionId,
        informationName,
        itemName || "",
      );
    console.log("상담카드 history", response.data);
    return response.data;
  };

  const queryClient = useQueryClient();
  const previousHistoryItemQuery = useQuery({
    queryKey: ["previousHistoryItemList"],
    queryFn: selectPreviousHistoryItemList,
  });

  const [modalStyle, setModalStyle] = useState<ReactModal.Styles>({});
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  useEffect(() => {
    if (isHistoryModalOpen && informationName && itemName) {
      previousHistoryItemQuery.refetch();
    }
  }, [isHistoryModalOpen]);

  const getTitleIcon = () => {
    if (titleIcon === "clock") {
      return (
        <ClockBlackIcon
          className="w-6 h-6 text-grayscale-50 ml-3 cursor-pointer"
          onClick={(e) => openModalAtPosition(e)}
        />
      );
    }
    return titleIcon;
  };

  const openModalAtPosition = (e: React.MouseEvent<SVGSVGElement>) => {
    // 클릭한 위치에서 마우스 좌표를 가져옴
    const { clientX, clientY } = e;

    // 클릭한 위치가 왼쪽인지 오른쪽인지 확인
    const dir = clientX > window.innerWidth / 2 ? "left" : "right";

    // 모달의 위치를 클릭한 위치로 설정
    setModalStyle({
      content: {
        top: `${clientY + 10}px`, // 클릭 위치에서 10px 아래
        left: `${dir === "left" ? clientX - 300 : clientX + 10}px`, // -300은 width와 같음
        position: "absolute",
        transform: "none", // transform은 사용하지 않음
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "white",
        width: "32rem", // 원하는 너비 설정
        height: "auto",
      },
      overlay: { backgroundColor: "rgba(0,0,0,0.1)" },
    });

    setIsHistoryModalOpen(true);
  };

  /**
   * 으아....정녕 이 방법뿐이 없을까...
   * 근데 방법이 없어...boolean 때문에...
   */
  const extractItemToString = (item: any): string[] => {
    let itemDto: any;

    switch (itemName) {
      case "counselPurposeAndNote":
        itemDto = JSON.parse(JSON.stringify(item));
        return [
          ...Object.values(itemDto).filter(
            (value): value is string => typeof value === "string",
          ),
        ];
      case "smoking":
        itemDto = JSON.parse(JSON.stringify(item));
        return [
          itemDto?.isSmoking ? "흡연" : "비흡연",
          ...Object.values(itemDto).filter(
            (value): value is string => typeof value === "string",
          ),
        ];
      case "drinking":
        itemDto = JSON.parse(JSON.stringify(item));
        return [
          itemDto?.isDrinking ? "음주" : "음주안함",
          ...Object.values(itemDto).filter(
            (value): value is string => typeof value === "string",
          ),
        ];
      case "nutrition":
        itemDto = JSON.parse(JSON.stringify(item));
        return [
          ...Object.values(itemDto).filter(
            (value): value is string => typeof value === "string",
          ),
        ];
      case "exercise":
        itemDto = JSON.parse(JSON.stringify(item));
        return [
          ...Object.values(itemDto).filter(
            (value): value is string => typeof value === "string",
          ),
        ];
      case "medicationManagement":
        itemDto = JSON.parse(JSON.stringify(item));
        return [
          itemDto?.isAlone ? "독거" : "동거",
          ...Object.values(itemDto).filter(
            (value): value is string => typeof value === "string",
          ),
        ];
      case "diseaseInfo":
        itemDto = JSON.parse(JSON.stringify(item));
        return [
          ...Object.values(itemDto).filter(
            (value): value is string => typeof value === "string",
          ),
        ];
      case "allergy":
        itemDto = JSON.parse(JSON.stringify(item));
        return [
          itemDto?.isAllergy ? "있음" : "없음",
          ...Object.values(itemDto).filter(
            (value): value is string => typeof value === "string",
          ),
        ];
      case "medicationSideEffect":
        itemDto = JSON.parse(JSON.stringify(item));
        return [
          itemDto?.isSideEffect ? "있음" : "없음",
          ...Object.values(itemDto).filter(
            (value): value is string => typeof value === "string",
          ),
        ];
      case "walking":
        itemDto = JSON.parse(JSON.stringify(item));
        return [
          ...Object.values(itemDto).filter(
            (value): value is string => typeof value === "string",
          ),
        ];
      case "evacuation":
        itemDto = JSON.parse(JSON.stringify(item));
        return [
          ...Object.values(itemDto).filter(
            (value): value is string => typeof value === "string",
          ),
        ];
      case "Communication":
        itemDto = JSON.parse(JSON.stringify(item));
        return [
          ...Object.values(itemDto).filter(
            (value): value is string => typeof value === "string",
          ),
        ];
      default:
        return ["히스토리 불러오기 실패"];
    }
  };

  return (
    <>
      <div
        className={classNames(
          "py-4 w-full bg-grayscale-3 rounded-md mb-4",
          variant ? `border-t-4 border-${variant}-30` : "",
          className,
        )}>
        {title && (
          <div className="flex items-center px-4 mb-4">
            <p className="text-subtitle2 font-bold text-grayscale-90">
              {title}
            </p>
            {getTitleIcon()}
          </div>
        )}
        {children}
      </div>

      <ReactModal
        appElement={document.getElementById("root") as HTMLElement}
        isOpen={isHistoryModalOpen}
        style={modalStyle}
        onRequestClose={() => setIsHistoryModalOpen(false)}>
        <div>
          <p className="text-subtitle2 font-bold mb-4">히스토리</p>
          {previousHistoryItemQuery.isLoading && <p>Loading...</p>}
          {previousHistoryItemQuery.isError && <p>Error!</p>}
          {previousHistoryItemQuery.isSuccess && (
            <div>
              {previousHistoryItemQuery.data.data?.map(
                (item, index: number) => {
                  return (
                    <HistoryList
                      key={index}
                      date={item?.counselDate || ""}
                      items={extractItemToString(item.counselCardItem)}
                    />
                  );
                },
              )}
            </div>
          )}
        </div>
      </ReactModal>
    </>
  );
};

export default CardContainer;
