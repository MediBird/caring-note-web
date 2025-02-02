export enum RecordingFileInfo {
  Type = 'audio/webm',
  DownloadName = 'CHANGE_MY_NAME.webm',
}
export enum RecordingStatus {
  Ready = '녹음 시작하기',
  Recording = '녹음 중',
  Paused = '녹음 일시정지',
  Stopped = '녹음 종료',
  Completed = '완료', // 녹음이 정지되고 API 로 전송완료 된 상태
  PermissionDenied = '권한거부', // 사용자가 권한을 거부한 상태
  Error = '에러',
}

/** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/state) */
export enum MediaRecorderStatus {
  Inactive = 'inactive',
  Recording = 'recording',
  Paused = 'paused',
}
