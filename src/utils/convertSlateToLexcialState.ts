/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Slate 데이터 형식을 Lexical 형식으로 변환하는 함수
 * @param slateContent Slate 에디터에서 직렬화된 JSON
 * @returns Lexical 형식의 JSON 문자열
 */
export function convertSlateToLexical(slateContent: string): string | null {
  if (slateContent === '') {
    return null;
  }

  try {
    // Slate 콘텐츠 파싱
    const slateData = JSON.parse(slateContent);

    // 지정된 형식의 Lexical 구조 생성
    const lexicalData: any = {
      root: {
        children: [],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    };

    // Slate 노드를 반복하며 Lexical 노드로 변환
    if (Array.isArray(slateData)) {
      lexicalData.root.children = slateData.map((slateNode) => {
        return convertSlateNodeToLexical(slateNode);
      });
    }

    return JSON.stringify(lexicalData);
  } catch (error) {
    console.error('Slate에서 Lexical로 변환 중 오류 발생:', error);
    // 오류 시 빈 Lexical 문서 반환
    return JSON.stringify({
      root: {
        children: [
          {
            children: [],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
            textFormat: 0,
            textStyle: '',
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    });
  }
}

/**
 * 개별 Slate 노드를 Lexical 노드로 변환
 */
function convertSlateNodeToLexical(slateNode: any): any {
  // 정확한 lexical 노드 구조
  const lexicalNode: any = {
    children: [],
    direction: 'ltr', // ltr로 변경
    format: '',
    indent: 0,
    type: 'paragraph',
    version: 1,
    textFormat: 0, // 추가
    textStyle: '', // 추가
  };

  // 자식 노드 처리
  if (Array.isArray(slateNode.children)) {
    slateNode.children.forEach((childNode: any) => {
      // 텍스트 노드 처리
      if (childNode.text !== undefined) {
        const textNode: any = {
          detail: 0,
          format: 0,
          mode: 'normal',
          style: '',
          text: childNode.text,
          type: 'text',
          version: 1,
        };

        // bold 타입은 highlight로 변환
        if (childNode.bold) {
          textNode.format = 128; // Highlight = 128
        }

        lexicalNode.children.push(textNode);
      } else {
        // 중첩된 블록 노드 처리
        lexicalNode.children.push(convertSlateNodeToLexical(childNode));
      }
    });
  }

  return lexicalNode;
}

/**
 * 주어진 문자열이 Slate 형식인지 확인하는 함수
 * @param content 확인할 JSON 문자열
 * @returns Slate 형식이면 true, 아니면 false
 */
export const getIsSlateNode = (content: string): boolean => {
  if (!content) return false;

  try {
    const data = JSON.parse(content);

    // Lexical 형식은 root 객체를 갖고 있음
    if (data.root) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error('JSON 파싱 중 오류 발생:', error);
    return false;
  }
};
