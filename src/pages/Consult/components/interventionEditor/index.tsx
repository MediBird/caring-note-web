import './editorStyles.css';
import LexicalEditor from './LexicalEditor';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/common/Spinner';
import { useInterventionEditor } from './useInterventionEditor';
import WarningIcon from '@/assets/icon/20/warning.filled.red.svg?react';
import CheckIcon from '@/assets/icon/16/check.outline.blue.svg?react';
import LoadingIcon from '@/assets/icon/16/loading.svg?react';
import { useCallback, useEffect, useRef } from 'react';
import EditorSaveDialog from '@/pages/Consult/components/interventionEditor/EditorSaveDialog';
import { formatToKSTDotFormat } from '@/pages/Session/utils/dateTimeUtils';

function InterventionEditor() {
  const {
    isEditorReady,
    editorContent,
    handleEditorChange,
    handleSave,
    counselSessionData,
    saveStatus,
    setSaveStatus,
  } = useInterventionEditor();

  const savedByMainWindow = useRef(false);

  const editorSaveTimestamp = localStorage.getItem(
    `editorSaveTimestamp_${counselSessionData?.counselSessionId}`,
  );

  const renderSaveStatus = () => {
    if (saveStatus === 'INIT') {
      return '';
    }

    if (saveStatus === 'CHANGED') {
      return (
        <span className="text-sm text-error-50">
          <div className="flex items-center gap-1">
            <WarningIcon width={16} height={16} />
            {`저장 필요  ${editorSaveTimestamp ? `(마지막 저장: ${formatToKSTDotFormat(editorSaveTimestamp)})` : ''}`}
          </div>
        </span>
      );
    }

    if (saveStatus === 'SAVING') {
      return (
        <span className="text-sm text-grayscale-30">
          <div className="flex items-center gap-1">
            <LoadingIcon width={16} height={16} />
            저장 중...
          </div>
        </span>
      );
    }

    if (saveStatus === 'SAVED') {
      return (
        <span className="text-sm text-primary-50">
          <div className="flex items-center gap-1">
            <CheckIcon width={16} height={16} />
            저장 완료{' '}
            {editorSaveTimestamp
              ? formatToKSTDotFormat(editorSaveTimestamp)
              : ''}
          </div>
        </span>
      );
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.data &&
        event.data.type ===
          `MAIN_WINDOW_SAVED_${counselSessionData?.counselSessionId}`
      ) {
        savedByMainWindow.current = true;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [counselSessionData?.counselSessionId]);

  const handleBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (saveStatus === 'CHANGED' && !savedByMainWindow.current) {
        const message =
          '저장되지 않은 변경사항이 있습니다. 변경사항을 저장하시겠습니까?';
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    },
    [saveStatus],
  );

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleBeforeUnload]);

  const handleSaveAndClose = () => {
    handleSave();

    setTimeout(() => {
      window.close();
    }, 300);
  };

  const handleClose = () => {
    setSaveStatus('SAVED');
    window.close();
  };

  // 로컬스토리지 clear
  useEffect(() => {
    const clearLocalStorage = () => {
      localStorage.removeItem(
        `editorContent_${counselSessionData?.counselSessionId}`,
      );
      localStorage.removeItem(
        `editorSaveTimestamp_${counselSessionData?.counselSessionId}`,
      );
    };

    window.addEventListener('beforeunload', clearLocalStorage);

    return () => {
      window.removeEventListener('beforeunload', clearLocalStorage);
      clearLocalStorage();
    };
  }, [counselSessionData?.counselSessionId]);

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden">
      <div className="flex flex-col gap-2 px-10 py-6 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold">
              {counselSessionData?.counseleeName}님 중재 기록
            </h1>
            <span className="text-sm">{renderSaveStatus()}</span>
          </div>
          <div className="flex gap-2">
            <Button size="xl" onClick={handleSave}>
              내용 저장하기
            </Button>
            {saveStatus === 'CHANGED' ? (
              <EditorSaveDialog
                onSave={handleSaveAndClose}
                setSaveStatus={setSaveStatus}
                savedByMainWindowRef={savedByMainWindow}
              />
            ) : (
              <Button size="xl" variant="secondary" onClick={handleClose}>
                창 닫기
              </Button>
            )}
          </div>
        </div>
        <div className="mb-2 font-medium text-grayscale-70">
          내담자에 대한 중요한 정보나 상담 내용을 기록하면 다음 상담 회차 때
          참고할 수 있습니다. <br /> 기록 후 사라지지 않도록 우측
          <span className="font-bold text-primary-50"> [내용 저장하기] </span>
          버튼을 꼭 눌러주세요.
        </div>
      </div>

      <div className="flex-grow overflow-auto px-10 pb-10">
        {!isEditorReady ? (
          <div className="flex h-full w-full items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <LexicalEditor
            onChange={handleEditorChange}
            initialContent={editorContent}
          />
        )}
      </div>
    </div>
  );
}

export default InterventionEditor;
