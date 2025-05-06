import './editorStyles.css';
import { useParams } from 'react-router-dom';
import LexicalEditor from './LexicalEditor';
import { useState } from 'react';
import { useCounselSessionQueryById } from '@/hooks';
import { Button } from '@/components/ui/button';

function InterventionEditor() {
  const { counselSessionId } = useParams();

  const [editorContent, setEditorContent] = useState<string>('');

  const { data } = useCounselSessionQueryById(counselSessionId as string);

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  const handleSave = () => {
    // API 호출로 저장 기능 구현
    console.log('저장된 내용:', editorContent);
    // TODO: 서버에 저장하는 로직 추가
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <div className="flex flex-col gap-2 p-6 pb-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {data?.counseleeName}님 중재 기록
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

      <div className="flex-grow overflow-auto px-6 pb-6">
        <LexicalEditor onChange={handleEditorChange} />
      </div>
    </div>
  );
}

export default InterventionEditor;
