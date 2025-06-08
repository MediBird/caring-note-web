import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface RecordingDB extends DBSchema {
  recordings: {
    key: string; // counselSessionId
    value: {
      blob: Blob;
      timestamp: number;
      duration: number;
      mimeType: string;
    };
  };
}

let dbInstance: IDBPDatabase<RecordingDB> | null = null;

// IndexedDB 초기화
const initDB = async (): Promise<IDBPDatabase<RecordingDB>> => {
  if (dbInstance) return dbInstance;

  try {
    dbInstance = await openDB<RecordingDB>('CaringNoteRecordingDB', 1, {
      upgrade(db) {
        // recordings 객체 저장소 생성
        if (!db.objectStoreNames.contains('recordings')) {
          db.createObjectStore('recordings');
        }
      },
    });
    return dbInstance;
  } catch (error) {
    console.error('IndexedDB 초기화 실패:', error);
    throw new Error('로컬 저장소 초기화에 실패했습니다.');
  }
};

// 녹음 파일 저장
export const saveRecordingBlob = async (
  counselSessionId: string,
  blob: Blob,
  duration: number,
): Promise<void> => {
  try {
    const db = await initDB();

    const recordingData = {
      blob,
      timestamp: Date.now(),
      duration,
      mimeType: blob.type || 'audio/webm',
    };

    await db.put('recordings', recordingData, counselSessionId);
    console.log(`녹음 파일 저장 완료: ${counselSessionId}`);
  } catch (error) {
    console.error('녹음 파일 저장 실패:', error);
    throw new Error('녹음 파일 저장에 실패했습니다.');
  }
};

// 녹음 파일 로드
export const loadRecordingBlob = async (
  counselSessionId: string,
): Promise<{ blob: Blob; duration: number; timestamp: number } | null> => {
  try {
    const db = await initDB();
    const recordingData = await db.get('recordings', counselSessionId);

    if (recordingData) {
      console.log(`녹음 파일 로드 완료: ${counselSessionId}`);
      return {
        blob: recordingData.blob,
        duration: recordingData.duration,
        timestamp: recordingData.timestamp,
      };
    }

    return null;
  } catch (error) {
    console.error('녹음 파일 로드 실패:', error);
    return null;
  }
};

// 녹음 파일 삭제
export const deleteRecordingBlob = async (
  counselSessionId: string,
): Promise<void> => {
  try {
    const db = await initDB();
    await db.delete('recordings', counselSessionId);
    console.log(`녹음 파일 삭제 완료: ${counselSessionId}`);
  } catch (error) {
    console.error('녹음 파일 삭제 실패:', error);
    throw new Error('녹음 파일 삭제에 실패했습니다.');
  }
};

// 모든 녹음 파일 목록 조회
export const getAllRecordingKeys = async (): Promise<string[]> => {
  try {
    const db = await initDB();
    const keys = await db.getAllKeys('recordings');
    return keys;
  } catch (error) {
    console.error('녹음 파일 목록 조회 실패:', error);
    return [];
  }
};

// 오래된 녹음 파일 정리 (7일 이상 된 파일)
export const cleanupOldRecordings = async (): Promise<void> => {
  try {
    const db = await initDB();
    const recordings = await db.getAll('recordings');
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    for (const [key, recording] of Object.entries(recordings)) {
      if (recording.timestamp < sevenDaysAgo) {
        await db.delete('recordings', key);
        console.log(`오래된 녹음 파일 삭제: ${key}`);
      }
    }
  } catch (error) {
    console.error('오래된 녹음 파일 정리 실패:', error);
  }
};

// IndexedDB 지원 여부 확인
export const isIndexedDBSupported = (): boolean => {
  return typeof window !== 'undefined' && 'indexedDB' in window;
};

// Blob을 Base64로 변환 (IndexedDB 미지원 시 fallback)
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // "data:audio/webm;base64," 부분 제거
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Base64를 Blob으로 변환
export const base64ToBlob = (
  base64: string,
  mimeType: string = 'audio/webm',
): Blob => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

// localStorage fallback 저장
export const saveRecordingBlobFallback = async (
  counselSessionId: string,
  blob: Blob,
  duration: number,
): Promise<void> => {
  try {
    const base64 = await blobToBase64(blob);
    const recordingData = {
      base64,
      timestamp: Date.now(),
      duration,
      mimeType: blob.type || 'audio/webm',
    };

    localStorage.setItem(
      `recording_blob_${counselSessionId}`,
      JSON.stringify(recordingData),
    );
    console.log(`녹음 파일 저장 완료 (localStorage): ${counselSessionId}`);
  } catch (error) {
    console.error('녹음 파일 저장 실패 (localStorage):', error);
    throw error;
  }
};

// localStorage fallback 로드
export const loadRecordingBlobFallback = async (
  counselSessionId: string,
): Promise<{ blob: Blob; duration: number; timestamp: number } | null> => {
  try {
    const savedData = localStorage.getItem(
      `recording_blob_${counselSessionId}`,
    );
    if (!savedData) return null;

    const recordingData = JSON.parse(savedData);
    const blob = base64ToBlob(recordingData.base64, recordingData.mimeType);

    return {
      blob,
      duration: recordingData.duration,
      timestamp: recordingData.timestamp,
    };
  } catch (error) {
    console.error('녹음 파일 로드 실패 (localStorage):', error);
    return null;
  }
};
