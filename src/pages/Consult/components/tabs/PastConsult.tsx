// import {
//   CounselSessionControllerApi,
//   MedicationCounselControllerApi,
// } from '@/api';
// import PastConsultContainer from '@/components/consult/PastConsultContainer';
// import { Card, CardHeader, CardTitle } from '@/components/ui/card';
// import { useQuery } from '@tanstack/react-query';
// import moment from 'moment';
// import React from 'react';
// import { useParams } from 'react-router-dom';

// const PastConsult: React.FC = () => {
//   const { counselSessionId } = useParams();

//   // TODO: 쿼리 커스텀 훅 분리 및 데이터 store set init 로직 개선 필요
//   const counselSessionControllerApi = new CounselSessionControllerApi();
//   const medicationCounselControllerApi = new MedicationCounselControllerApi();

//   const selectPreviousMedicationCounsel = async () => {
//     if (!counselSessionId) return;
//     const response =
//       await medicationCounselControllerApi.selectPreviousMedicationCounsel(
//         counselSessionId,
//       );

//     return response;
//   };

//   // const columns: GridColDef[] = React.useMemo(
//   //   () => [
//   //     {
//   //       ...createDefaultNumberColumn({
//   //         field: 'col1',
//   //         headerName: '상담횟수',
//   //         unitName: '회차',
//   //         isFirstColumn: true,
//   //       }),
//   //     },
//   //     {
//   //       ...createDefaultDateColumn({
//   //         field: 'col2',
//   //         headerName: '상담일자',
//   //       }),
//   //     },
//   //     { ...createDefaultTextColumn({ field: 'col3', headerName: '담당약사' }) },
//   //     {
//   //       ...createDefaultTextColumn({
//   //         field: 'col4',
//   //         headerName: '케어링메세지',
//   //       }),
//   //     },
//   //   ],
//   //   [],
//   // );

//   //const memoizedColumns = React.useMemo(() => columns, [columns]);

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>이전 상담 내용</CardTitle>
//       </CardHeader>
//       <div className="flex flex-row justify-between items-start space-x-4">
//         <PastConsultContainer title="상담 기록 하이라이트" variant="primary">
//           <ul className="mt-4 text-body1 font-medium space-y-2">
//             {previousMedicationCounselQuery?.data?.data?.data?.counselRecordHighlights?.map(
//               (item, index) => {
//                 return (
//                   <li
//                     key={index}
//                     className="border-l-2 border-grayscale-10 pl-2">
//                     {item.highlight}
//                   </li>
//                 );
//               },
//             )}
//           </ul>
//         </PastConsultContainer>

//         <PastConsultContainer title="상담노트 요약" variant="secondary">
//           <h2 className="text-subtitle2 font-bold text-secondary-70 flex items-center"></h2>
//           <p className="mt-4 whitespace-pre-wrap">
//             {
//               previousMedicationCounselQuery?.data?.data?.data
//                 ?.counselNoteSummary
//             }
//           </p>
//         </PastConsultContainer>
//       </div>

//       <CardHeader>
//         <CardTitle>상담 내역</CardTitle>
//         <p className="text-body1 font-medium text-grayscale-70 !mt-0">
//           케어링 노트로 남긴 상담 내역이 노출됩니다
//         </p>
//       </CardHeader>
//       <div className="h-auto">
//         {/* <TableComponent
//           tableKey={'past-consult'}
//           rows={pastConsultRows || []}
//           columns={memoizedColumns}
//         /> */}
//       </div>
//     </Card>
//   );
// };

// export default PastConsult;
