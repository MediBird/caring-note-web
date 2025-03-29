export enum RecordingFileInfo {
  Type = 'audio/webm',
  DownloadName = 'RECORDING',
  FileExtension = '.webm',
}

export enum RecordingStatus {
  Ready = '녹음 시작하기',
  Recording = '녹음 중',
  Paused = '녹음 일시정지',
  Stopped = '녹음 종료',
  STTLoading = 'STT 로딩 중', // 녹음 파일을 서버로 전송하고 STT 변환 중인 상태
  STTCompleted = 'STT 완료', // 녹음이 정지되고 API 로 전송완료 된 상태
  AILoading = 'AI 로딩 중', // AI 분석 요청 중인 상태
  AICompleted = 'AI 완료', // AI 분석 완료된 상태
  PermissionDenied = '권한거부', // 사용자가 권한을 거부한 상태
  Error = '에러',
}

/** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/state) */
export enum MediaRecorderStatus {
  Inactive = 'inactive',
  Recording = 'recording',
  Paused = 'paused',
}

// 기획에서 정의한 여러 발화자의 랜덤 색상 리스트
export enum SpeakersColor {
  FIRST = 'border-pfp-1',
  SECOND = 'border-pfp-2',
  THIRD = 'border-pfp-3',
  FOURTH = 'border-pfp-4',
  FIFTH = 'border-pfp-5',
  SIXTH = 'border-pfp-6',
  SEVENTH = 'border-pfp-7',
}
export const SPEAKER_COLOR_LIST = Object.values(SpeakersColor);
