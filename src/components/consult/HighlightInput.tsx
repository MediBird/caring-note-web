import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import "@/assets/css/DraftJsCss.css";
import Tooltip from "@/components/Tooltip";
import { changeEditorState } from "@/reducers/editorStateReducer";
import eraserBlack from "@/assets/icon/24/erase.outlined.black.svg";
import highlightpenBlack from "@/assets/icon/24/highlighter.outlined.black.svg";
import { Editor, EditorState, Modifier, ContentState, SelectionState } from "draft-js";
import "draft-js/dist/Draft.css";
import React, { forwardRef, useImperativeHandle } from "react";
import { useSelectMedicineConsult, useSaveMedicineConsult } from "@/hooks/useMedicineConsultQuery";
import { useMedicineConsultStore} from "@/store/medicineConsultStore";
import { useEffect} from "react";

const HighlightInput = forwardRef((_, ref) => {

  const dispatch = useAppDispatch();
  const editorState = useAppSelector((state) => state.editorState.editorState);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const counselSessionId = "TEST-COUNSEL-SESSION-01";
  const { medicineConsult
        , setMedicationConsult
        , setCounselRecordHighlights
        , setCounselRecord } = useMedicineConsultStore();

        
  const { data } = useSelectMedicineConsult(counselSessionId);
  const saveMedicineConsult = useSaveMedicineConsult();
  const styleMap = {
    HIGHLIGHT: {
      backgroundColor: "#FFBD14",
    },
    CLEAR: {
      backgroundColor: "#FFFFFF",
    },
  };

  useImperativeHandle(ref, () => ({
    saveMedicineConsult: () => {
      saveMedicineConsult.mutate(medicineConsult);
    },
  }));


  useEffect(() => {

    if (data) {
      
      setMedicationConsult({
       counselSessionId: counselSessionId,
        medicationCounselId: data.medicationCounselId || '',
       counselRecord: data.counselRecord || '',
       counselRecordHighlights: data.counselRecordHighlights || [],
     });
    
       // ContentState 초기화
      const contentState = ContentState.createFromText(data.counselRecord || "");

      // 특정 하이라이트 설정 (데이터가 있다면 처리)
      let contentStateWithHighlight = contentState;

      if (
        data.counselRecordHighlights?.length &&
        data.counselRecord // 추가 확인
      ) {
        data.counselRecordHighlights.forEach((highlight) => {
          const start = data.counselRecord
            ? data.counselRecord.indexOf(highlight)
            : -1; // 안전 처리
          const end = start + highlight.length;

        if (start !== -1) {
            const selectionState = SelectionState.createEmpty(
              contentState.getFirstBlock().getKey()
            ).merge({
              anchorOffset: start,
              focusOffset: end,
            });
          
            contentStateWithHighlight = Modifier.applyInlineStyle(
              contentStateWithHighlight,
              selectionState,
              "HIGHLIGHT"
            );
          }
        });
      }
      
      const newEditorState = EditorState.createWithContent(
      contentStateWithHighlight
      );
      dispatch(changeEditorState(newEditorState));

    }
  }, [data,dispatch,setMedicationConsult]); 

  // 하이라이트 버튼 핸들러
  const applyHighlight = () => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    if (selectionState.isCollapsed()) return;

    const newContentState = Modifier.applyInlineStyle(
      contentState,
      selectionState,
      "HIGHLIGHT",
    );
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "change-inline-style",
    );
    dispatch(changeEditorState(newEditorState));

    setCounselRecordHighlights(getHighlightedText()||[]);
  };

  // 하이라이트 버튼 핸들러
  const removeHighlight = () => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    if (selectionState.isCollapsed()) return;

    const newContentState = Modifier.removeInlineStyle(
      contentState,
      selectionState,
      "HIGHLIGHT",
    );
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "change-inline-style",
    );

    dispatch(changeEditorState(newEditorState));
    setCounselRecordHighlights(getHighlightedText()||[]);
  };



  // 현재 하이라이트된 텍스트 추출
  const getHighlightedText = () => {
    if (!containerRef.current) return;

    // container 내에서 background가 yellow(#FFBD14)인 span 요소만 선택
    const yellowSpans = Array.from(
      containerRef.current.querySelectorAll("span"),
    ).filter(
      (span) =>
        getComputedStyle(span).backgroundColor === "rgb(255, 189, 20)", // #FFBD14
    );

    return yellowSpans.map((span) => span.textContent || "")
  
  };

  return (
    <div className="p-0 rounded-lg bg-white border-2 border-gray-300">
      <div
        ref={containerRef}
        className="border-b p-2 min-h-64"
        onClick={getHighlightedText}>
        <Editor
          editorState={editorState}
          placeholder={`상담 내용을 기록하세요`}
          onChange={(editorState) => {
            dispatch(changeEditorState(editorState));
            setCounselRecord(editorState.getCurrentContent().getPlainText());
          }}
          customStyleMap={styleMap}
        />
      </div>
      <div className="flex items-center">
        <img
          className="w-8 h-8 cursor-pointer m-2 inline-block"
          src={highlightpenBlack}
          alt="하이라이트"
          onClick={applyHighlight}
        />
        <img
          className="w-8 h-8 cursor-pointer inline-block"
          src={eraserBlack}
          alt="하이라이트 지우기"
          onClick={removeHighlight}
        />
        <Tooltip
          className="ml-2"
          id="highlight"
          text={`왼쪽 형광펜으로 원하는 내용을 강조하고, 
          오른쪽 지우개로 다시 지울 수 있어요`}
          eventType="hover"
          key={"highlight"}
          place="right"
        />
      </div>
    </div>
  );
});

export default HighlightInput;
