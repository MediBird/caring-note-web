import { $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { createEditor } from 'lexical';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeNode } from '@lexical/code';
import { LinkNode } from '@lexical/link';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { convertSlateToLexical } from '@/utils/convertSlateToLexcialState';

export function getMarkdownFromLexical(
  lexicalJsonString: string | null | undefined,
): string {
  if (!lexicalJsonString) {
    return '';
  }

  if (lexicalJsonString.trim() === '') {
    return '';
  }

  try {
    const lexicalData = JSON.parse(lexicalJsonString);
    let lexicalString = lexicalJsonString;

    // Lexical 형식이 아닌 경우 원본 문자열 반환
    if (!lexicalData.root) {
      lexicalString = convertSlateToLexical(lexicalJsonString) || '';
    }

    const editor = createEditor({
      nodes: [
        HorizontalRuleNode,
        CodeNode,
        HeadingNode,
        LinkNode,
        ListNode,
        ListItemNode,
        QuoteNode,
      ],
      onError: (error) => {
        console.error('Lexical editor error:', error);
      },
    });

    const editorState = editor.parseEditorState(lexicalString);

    return editorState.read(() => {
      return $convertToMarkdownString(TRANSFORMERS);
    });
  } catch (error) {
    console.error('Lexical JSON 변환 중 오류 발생:', error);
    return lexicalJsonString;
  }
}
