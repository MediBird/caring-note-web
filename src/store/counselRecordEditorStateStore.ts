import { EditorState } from 'draft-js';
import { create } from 'zustand';

interface CounselRecordEditorStateStore {
  editorState: EditorState;
  setEditorState: (editorState: EditorState) => void;
}

const initialState = {
  editorState: EditorState.createEmpty(),
};

//zustand
export const useCounselRecordEditorStateStore =
  create<CounselRecordEditorStateStore>((set) => ({
    editorState: initialState.editorState,
    setEditorState: (editorState: EditorState) => set({ editorState }),
  }));

export default useCounselRecordEditorStateStore;
