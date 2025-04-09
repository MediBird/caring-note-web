import { Node } from 'slate';

export const parseEditorContent = (content: string): Node[] => {
  if (content === '') {
    return [
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ];
  }

  try {
    const parsedContent = JSON.parse(content);

    if (Array.isArray(parsedContent)) {
      return parsedContent;
    }

    return [
      {
        type: 'paragraph',
        children: [{ text: content }],
      },
    ];
  } catch (error) {
    console.error(error);
    return [
      {
        type: 'paragraph',
        children: [{ text: content }],
      },
    ];
  }
};
