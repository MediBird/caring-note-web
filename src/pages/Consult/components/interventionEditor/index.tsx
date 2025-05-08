import './editorStyles.css';
import LexicalEditor from './LexicalEditor';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/common/Spinner';
import { useInterventionEditor } from './useInterventionEditor';

function InterventionEditor() {
  const {
    isEditorReady,
    editorContent,
    handleEditorChange,
    handleSave,
    counselSessionData,
  } = useInterventionEditor();

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <div className="flex flex-col gap-2 px-10 py-6 pb-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {counselSessionData?.counseleeName}님 중재 기록
          </h1>
          <Button size="xl" onClick={handleSave}>
            내용 저장하기
          </Button>
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
