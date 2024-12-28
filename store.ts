import { configureStore } from "@reduxjs/toolkit";
import editorStateReducer from "./src/reducers/editorStateReducer";
import navigationReducer from "./src/reducers/navigationReducer";
import tabReducer from "./src/reducers/tabReducer";

const store = configureStore({
  reducer: {
    tab: tabReducer,
    navigation: navigationReducer,
    editorState: editorStateReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // 직렬화 검사 비활성화 : draft.js의 editorState가 직렬화되지 않아서 에러 발생
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
