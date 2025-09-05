import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { safeEditorContentParser } from './safeEditorContentParser';
import { convertMedicineStatus } from './StringConvertUtils';
import {
  SelectCounselSessionRes,
  MainCounselBaseInformationRes,
  MainCounselHealthInformationRes,
  MainCounselLivingInformationRes,
  MainCounselIndependentLifeInformationRes,
  SelectMedicationRecordHistRes,
  SmokingDTOSmokingAmountEnum,
  DrinkingDTODrinkingAmountEnum,
  NutritionDTOMealPatternEnum,
  NutritionDTOWaterIntakeEnum,
  ExerciseDTOExercisePatternEnum,
  MedicationManagementDTOMedicationAssistantsEnum,
  CommunicationDTOSightsEnum,
  CommunicationDTOHearingsEnum,
  CommunicationDTOCommunicationsEnum,
  CommunicationDTOUsingKoreansEnum,
  WalkingDTOWalkingMethodsEnum,
  WalkingDTOWalkingEquipmentsEnum,
  EvacuationDTOEvacuationsEnum,
} from '@/api';
import { formatDisplayText } from './formatDisplayText';
import {
  COUNSEL_PURPOSE_MAP,
  DISEASE_MAP,
  SMOKING_AMOUNT_MAP,
  DRINKING_FREQUENCY_MAP,
  MEAL_PATTERN_MAP,
  WATER_INTAKE_MAP,
  EXERCISE_PATTERN_MAP,
  MEDICATION_ASSISTANTS_MAP,
  WALKING_METHODS_MAP,
  WALKING_EQUIPMENTS_MAP,
  EVACUATIONS_MAP,
  SIGHTS_MAP,
  HEARINGS_MAP,
  COMMUNICATIONS_MAP,
  USING_KOREANS_MAP,
} from './constants';

interface PDFGenerationData {
  session: SelectCounselSessionRes;
  interventionRecord?: string;
  aiSummary?: string | unknown;
  baseInfo?: MainCounselBaseInformationRes;
  healthInfo?: MainCounselHealthInformationRes;
  livingInfo?: MainCounselLivingInformationRes;
  independentLifeInfo?: MainCounselIndependentLifeInformationRes;
  prescriptionMedications?: SelectMedicationRecordHistRes[];
  otcMedications?: SelectMedicationRecordHistRes[];
}

// Lexical 에디터 상태를 HTML로 변환하는 헬퍼 함수
const extractHtmlFromLexicalState = (lexicalState: unknown): string => {
  try {
    if (!lexicalState) return '';

    // 문자열인 경우 JSON 파싱 시도
    let parsedState;
    if (typeof lexicalState === 'string') {
      const safeParsed = safeEditorContentParser(lexicalState);
      if (!safeParsed) return '';
      parsedState = JSON.parse(safeParsed);
    } else {
      parsedState = lexicalState;
    }

    if (!parsedState || typeof parsedState !== 'object') {
      return '';
    }

    const state = parsedState as Record<string, unknown>;
    if (!state.root || typeof state.root !== 'object') {
      return '';
    }

    const root = state.root as Record<string, unknown>;
    if (!Array.isArray(root.children)) {
      return '';
    }

    const convertNodeToHtml = (node: unknown): string => {
      if (!node || typeof node !== 'object') {
        return '';
      }

      const nodeObj = node as Record<string, unknown>;

      if (nodeObj.type === 'text' && typeof nodeObj.text === 'string') {
        let text = nodeObj.text;

        // 텍스트 포맷팅 적용
        if (typeof nodeObj.format === 'number' && nodeObj.format > 0) {
          if (nodeObj.format & 1) text = `<strong>${text}</strong>`; // bold
          if (nodeObj.format & 2) text = `<em>${text}</em>`; // italic
          if (nodeObj.format & 128)
            text = `<mark style="background-color: #fff3cd; padding: 2px 4px;">${text}</mark>`; // highlight
        }

        return text;
      }

      if (nodeObj.type === 'paragraph') {
        const content = Array.isArray(nodeObj.children)
          ? nodeObj.children.map(convertNodeToHtml).join('')
          : '';
        return content
          ? `<p style="margin: 8px 0; line-height: 1.5;">${content}</p>`
          : '<p style="margin: 8px 0;"><br/></p>';
      }

      if (nodeObj.type === 'heading') {
        const level = (nodeObj.tag as string) || 'h1';
        const content = Array.isArray(nodeObj.children)
          ? nodeObj.children.map(convertNodeToHtml).join('')
          : '';
        return `<${level} style="margin: 12px 0 8px 0; font-weight: bold;">${content}</${level}>`;
      }

      if (nodeObj.type === 'list') {
        const tag = nodeObj.listType === 'number' ? 'ol' : 'ul';
        const content = Array.isArray(nodeObj.children)
          ? nodeObj.children.map(convertNodeToHtml).join('')
          : '';
        return `<${tag} style="margin: 8px 0; padding-left: 20px;">${content}</${tag}>`;
      }

      if (nodeObj.type === 'listitem') {
        const content = Array.isArray(nodeObj.children)
          ? nodeObj.children.map(convertNodeToHtml).join('')
          : '';
        return `<li style="margin: 4px 0;">${content}</li>`;
      }

      // 기타 노드 타입 처리
      if (Array.isArray(nodeObj.children)) {
        return nodeObj.children.map(convertNodeToHtml).join('');
      }

      return '';
    };

    return root.children.map(convertNodeToHtml).join('').trim();
  } catch (error) {
    console.error('Lexical HTML conversion error:', error);
    // 파싱 실패 시 기본 텍스트 추출 시도
    return extractSimpleTextFromLexical(lexicalState);
  }
};

// 간단한 텍스트 추출 (fallback)
const extractSimpleTextFromLexical = (lexicalState: unknown): string => {
  try {
    if (!lexicalState || typeof lexicalState !== 'object') {
      return typeof lexicalState === 'string' ? lexicalState : '';
    }

    const state = lexicalState as Record<string, unknown>;
    if (!state.root || typeof state.root !== 'object') {
      return '';
    }

    const root = state.root as Record<string, unknown>;
    if (!Array.isArray(root.children)) {
      return '';
    }

    const extractTextFromNode = (node: unknown): string => {
      if (!node || typeof node !== 'object') {
        return '';
      }

      const nodeObj = node as Record<string, unknown>;

      if (nodeObj.type === 'text' && typeof nodeObj.text === 'string') {
        return nodeObj.text;
      }

      if (Array.isArray(nodeObj.children)) {
        return nodeObj.children.map(extractTextFromNode).join('');
      }

      return '';
    };

    return root.children.map(extractTextFromNode).join('\n').trim();
  } catch (error) {
    console.error('Simple text extraction error:', error);
    return typeof lexicalState === 'string' ? lexicalState : '';
  }
};

// 마크다운을 HTML로 변환하는 함수 (### 헤더 지원)
const markdownToHtml = (markdown: string): string => {
  if (!markdown) return '';

  // 먼저 헤더 처리
  let html = markdown
    .replace(/### (.*?)(?:\n|$)/g, '<h3>$1</h3>\n') // ### 헤더
    .replace(/## (.*?)(?:\n|$)/g, '<h2>$1</h2>\n') // ## 헤더
    .replace(/# (.*?)(?:\n|$)/g, '<h1>$1</h1>\n'); // # 헤더

  // 텍스트 스타일링
  html = html
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **bold**
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // *italic*
    .replace(/`(.*?)`/g, '<code>$1</code>'); // `code`

  // 문단 처리 - 헤더가 아닌 텍스트를 p 태그로 감싸기
  const lines = html.split('\n');
  const processedLines = lines.map((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return '';
    if (trimmedLine.startsWith('<h') || trimmedLine.startsWith('</h'))
      return line;
    if (trimmedLine.startsWith('<p>') || trimmedLine.startsWith('</p>'))
      return line;
    return `<p>${trimmedLine}</p>`;
  });

  return processedLines.filter((line) => line).join('\n');
};

// 기본 정보 포맷팅
const formatBaseInfo = (baseInfo: MainCounselBaseInformationRes): string => {
  const counselPurpose =
    baseInfo.counselPurpose?.currentState
      ?.map((purpose) => COUNSEL_PURPOSE_MAP[purpose])
      .join(', ') || '(정보 없음)';

  const significantNote =
    formatDisplayText(baseInfo.significantNote?.currentState) || '(정보 없음)';
  const medicationNote =
    formatDisplayText(baseInfo.medicationNote?.currentState) || '(정보 없음)';

  return `
    <table class="table">
      <tr>
        <th>상담 목적</th>
        <td>${counselPurpose}</td>
      </tr>
      <tr>
        <th>특이사항</th>
        <td>${significantNote}</td>
      </tr>
      <tr>
        <th>복약 메모</th>
        <td>${medicationNote}</td>
      </tr>
    </table>
  `;
};

// 건강 정보 포맷팅
const formatHealthInfo = (
  healthInfo: MainCounselHealthInformationRes,
): string => {
  let html = '';

  // 질병 정보
  if (healthInfo.diseases) {
    const diseases =
      healthInfo.diseases.currentState
        ?.map((disease) => DISEASE_MAP[disease])
        .join(' | ') || '(정보 없음)';

    html += `
      <div class="subsection">
        <div class="subsection-title">앓고 있는 질병</div>
        <table class="table">
          <tr>
            <th>질병</th>
            <td>${diseases}</td>
          </tr>
        </table>
      </div>
    `;
  }

  // 병력 및 불편사항
  if (healthInfo.historyNote || healthInfo.mainInconvenienceNote) {
    html += `<div class="subsection">`;

    if (healthInfo.historyNote) {
      html += `
        <div class="subsection-title">질병 및 수술 이력</div>
        <div class="info-value">${formatDisplayText(healthInfo.historyNote.currentState) || '(정보 없음)'}</div>
      `;
    }

    if (healthInfo.mainInconvenienceNote) {
      html += `
        <div class="subsection-title">주요 불편 증상</div>
        <div class="info-value">${formatDisplayText(healthInfo.mainInconvenienceNote.currentState) || '(정보 없음)'}</div>
      `;
    }

    html += `</div>`;
  }

  // 알레르기
  if (healthInfo.allergy?.currentState) {
    const isAllergic = healthInfo.allergy.currentState.isAllergic;
    const allergyNote =
      formatDisplayText(healthInfo.allergy.currentState.allergyNote) ||
      '(정보 없음)';

    html += `
      <div class="subsection">
        <div class="subsection-title">알레르기</div>
        <table class="table">
          <tr>
            <th>알레르기 여부</th>
            <td>${isAllergic ? '있음' : '없음'}</td>
          </tr>
          ${
            isAllergic
              ? `
          <tr>
            <th>의심 식품/약물</th>
            <td>${allergyNote}</td>
          </tr>
          `
              : ''
          }
        </table>
      </div>
    `;
  }

  // 약물 부작용
  if (healthInfo.medicationSideEffect?.currentState) {
    const hasSideEffect =
      healthInfo.medicationSideEffect.currentState.isMedicationSideEffect;
    const suspectedMed =
      formatDisplayText(
        healthInfo.medicationSideEffect.currentState.suspectedMedicationNote,
      ) || '(정보 없음)';
    const symptoms =
      formatDisplayText(
        healthInfo.medicationSideEffect.currentState.symptomsNote,
      ) || '(정보 없음)';

    html += `
      <div class="subsection">
        <div class="subsection-title">약물 부작용</div>
        <table class="table">
          <tr>
            <th>약물 부작용 여부</th>
            <td>${hasSideEffect ? '있음' : '없음'}</td>
          </tr>
          ${
            hasSideEffect
              ? `
          <tr>
            <th>부작용 의심 약물</th>
            <td>${suspectedMed}</td>
          </tr>
          <tr>
            <th>부작용 증상</th>
            <td>${symptoms}</td>
          </tr>
          `
              : ''
          }
        </table>
      </div>
    `;
  }

  return html;
};

// 생활 정보 포맷팅
const formatLivingInfo = (
  livingInfo: MainCounselLivingInformationRes,
): string => {
  let html = '';

  // 흡연
  if (livingInfo.smoking?.currentState) {
    const smokingData = livingInfo.smoking.currentState as {
      smokingAmount?: SmokingDTOSmokingAmountEnum;
      smokingPeriodNote?: string;
    };
    const smokingAmount = smokingData.smokingAmount;
    const isSmokingUser =
      smokingAmount && smokingAmount !== SmokingDTOSmokingAmountEnum.None;

    html += `
      <div class="subsection">
        <div class="subsection-title">흡연</div>
        <table class="table">
          <tr>
            <th>흡연 여부</th>
            <td>${isSmokingUser ? '흡연' : '비흡연'}</td>
          </tr>
          ${
            isSmokingUser
              ? `
          <tr>
            <th>총 흡연 기간</th>
            <td>${smokingData.smokingPeriodNote || '(정보 없음)'}</td>
          </tr>
          <tr>
            <th>하루 평균 흡연량</th>
            <td>${SMOKING_AMOUNT_MAP[smokingAmount] || '(정보 없음)'}</td>
          </tr>
          `
              : ''
          }
        </table>
      </div>
    `;
  }

  // 음주
  if (livingInfo.drinkingAmount?.currentState) {
    const drinkingData = livingInfo.drinkingAmount.currentState as {
      drinkingAmount?: DrinkingDTODrinkingAmountEnum;
    };
    const drinkingAmount = drinkingData.drinkingAmount;
    const isDrinkingUser =
      drinkingAmount && drinkingAmount !== DrinkingDTODrinkingAmountEnum.None;

    html += `
      <div class="subsection">
        <div class="subsection-title">음주</div>
        <table class="table">
          <tr>
            <th>음주 여부</th>
            <td>${isDrinkingUser ? '음주' : '비음주'}</td>
          </tr>
          ${
            isDrinkingUser
              ? `
          <tr>
            <th>음주 횟수</th>
            <td>${DRINKING_FREQUENCY_MAP[drinkingAmount] || '(정보 없음)'}</td>
          </tr>
          `
              : ''
          }
        </table>
      </div>
    `;
  }

  // 영양상태
  if (livingInfo.nutrition?.currentState) {
    const nutritionData = livingInfo.nutrition.currentState as {
      mealPattern?: NutritionDTOMealPatternEnum;
      waterIntake?: NutritionDTOWaterIntakeEnum;
      nutritionNote?: string;
    };
    html += `
      <div class="subsection">
        <div class="subsection-title">영양상태</div>
        <table class="table">
          <tr>
            <th>하루 식사 패턴</th>
            <td>${nutritionData.mealPattern ? MEAL_PATTERN_MAP[nutritionData.mealPattern] : '(정보 없음)'}</td>
          </tr>
          <tr>
            <th>수분 섭취량</th>
            <td>${nutritionData.waterIntake ? WATER_INTAKE_MAP[nutritionData.waterIntake] : '(정보 없음)'}</td>
          </tr>
          <tr>
            <th>식생활 특이사항</th>
            <td>${nutritionData.nutritionNote || '(정보 없음)'}</td>
          </tr>
        </table>
      </div>
    `;
  }

  // 운동
  if (livingInfo.exercise?.currentState) {
    const exerciseData = livingInfo.exercise.currentState as {
      exercisePattern?: ExerciseDTOExercisePatternEnum;
      exerciseNote?: string;
    };
    const exercisePattern = exerciseData.exercisePattern;

    html += `
      <div class="subsection">
        <div class="subsection-title">운동</div>
        <table class="table">
          ${
            exercisePattern
              ? `
          <tr>
            <th>운동 패턴</th>
            <td>${EXERCISE_PATTERN_MAP[exercisePattern]}</td>
          </tr>
          `
              : ''
          }
          <tr>
            <th>운동 종류</th>
            <td>${exerciseData.exerciseNote || '(정보 없음)'}</td>
          </tr>
        </table>
      </div>
    `;
  }

  // 약 복용 관리
  if (livingInfo.medicationManagement?.currentState) {
    const medData = livingInfo.medicationManagement.currentState as {
      isAlone?: boolean;
      houseMateNote?: string;
      medicationAssistants?: MedicationManagementDTOMedicationAssistantsEnum[];
      customMedicationAssistant?: string;
    };
    const isAlone = medData.isAlone;

    html += `
      <div class="subsection">
        <div class="subsection-title">약 복용 관리</div>
        <table class="table">
          <tr>
            <th>거주 형태</th>
            <td>${isAlone ? '독거' : '동거'}</td>
          </tr>
          ${
            !isAlone
              ? `
          <tr>
            <th>동거인 구성원</th>
            <td>${medData.houseMateNote || '(정보 없음)'}</td>
          </tr>
          <tr>
            <th>복용자 및 투약 보조자</th>
            <td>${medData.medicationAssistants?.map((assistant) => MEDICATION_ASSISTANTS_MAP[assistant]).join(', ') || '(정보 없음)'}</td>
          </tr>
          ${
            medData.customMedicationAssistant
              ? `
          <tr>
            <th>기타 투약 보조자</th>
            <td>${medData.customMedicationAssistant}</td>
          </tr>
          `
              : ''
          }
          `
              : ''
          }
        </table>
      </div>
    `;
  }

  return html;
};

// 자립 생활 정보 포맷팅
const formatIndependentLifeInfo = (
  independentLifeInfo: MainCounselIndependentLifeInformationRes,
): string => {
  let html = '';

  // 의사소통 정도
  if (independentLifeInfo.communication?.currentState) {
    const commData = independentLifeInfo.communication.currentState as {
      sights?: CommunicationDTOSightsEnum[];
      hearings?: CommunicationDTOHearingsEnum[];
      communications?: CommunicationDTOCommunicationsEnum;
      usingKoreans?: CommunicationDTOUsingKoreansEnum[];
    };

    html += `
      <div class="subsection">
        <div class="subsection-title">의사소통 정도</div>
        <table class="table">
          <tr>
            <th>시력</th>
            <td>${commData.sights?.map((sight) => SIGHTS_MAP[sight]).join(', ') || '(정보 없음)'}</td>
          </tr>
          <tr>
            <th>청력</th>
            <td>${commData.hearings?.map((hearing) => HEARINGS_MAP[hearing]).join(', ') || '(정보 없음)'}</td>
          </tr>
          <tr>
            <th>언어 소통</th>
            <td>${commData.communications ? COMMUNICATIONS_MAP[commData.communications] : '(정보 없음)'}</td>
          </tr>
          <tr>
            <th>한글 사용</th>
            <td>${commData.usingKoreans?.map((korean) => USING_KOREANS_MAP[korean]).join(', ') || '(정보 없음)'}</td>
          </tr>
        </table>
      </div>
    `;
  }

  // 보행
  if (independentLifeInfo.walking?.currentState) {
    const walkingData = independentLifeInfo.walking.currentState as {
      walkingMethods?: WalkingDTOWalkingMethodsEnum[];
      walkingEquipments?: WalkingDTOWalkingEquipmentsEnum[];
      walkingNote?: string;
    };
    const equipments =
      walkingData.walkingEquipments?.map(
        (equipment) => WALKING_EQUIPMENTS_MAP[equipment],
      ) || [];
    const allItems = walkingData.walkingNote
      ? [...equipments, walkingData.walkingNote]
      : equipments;

    html += `
      <div class="subsection">
        <div class="subsection-title">보행</div>
        <table class="table">
          <tr>
            <th>보행 여부</th>
            <td>${walkingData.walkingMethods?.map((method) => WALKING_METHODS_MAP[method]).join(', ') || '(정보 없음)'}</td>
          </tr>
          <tr>
            <th>이동 장비</th>
            <td>${allItems.length > 0 ? allItems.join(', ') : '(정보 없음)'}</td>
          </tr>
        </table>
      </div>
    `;
  }

  // 배변 처리
  if (independentLifeInfo.evacuation?.currentState) {
    const evacuationData = independentLifeInfo.evacuation.currentState as {
      evacuations?: EvacuationDTOEvacuationsEnum[];
      evacuationNote?: string;
    };
    const evacuations =
      evacuationData.evacuations?.map(
        (evacuation) => EVACUATIONS_MAP[evacuation],
      ) || [];
    const allItems = evacuationData.evacuationNote
      ? [...evacuations, evacuationData.evacuationNote]
      : evacuations;

    html += `
      <div class="subsection">
        <div class="subsection-title">배변 처리</div>
        <table class="table">
          <tr>
            <th>배변 처리 방식</th>
            <td>${allItems.length > 0 ? allItems.join(', ') : '(정보 없음)'}</td>
          </tr>
        </table>
      </div>
    `;
  }

  return html;
};

// HTML 템플릿 생성
const createHTMLTemplate = (data: PDFGenerationData): string => {
  const fileName = `${data.session.counseleeName || '내담자'}_${data.session.scheduledDate || ''}`;

  // 중재기록 파싱
  let parsedInterventionRecord = '';
  if (data.interventionRecord) {
    try {
      const jsonContent = JSON.parse(data.interventionRecord);
      if (jsonContent && typeof jsonContent === 'object') {
        parsedInterventionRecord = extractHtmlFromLexicalState(jsonContent);
      }
    } catch {
      parsedInterventionRecord = data.interventionRecord;
    }
  }

  // AI 요약 파싱 (마크다운으로 처리)
  let parsedAiSummary = '';
  if (data.aiSummary) {
    if (typeof data.aiSummary === 'string') {
      parsedAiSummary = markdownToHtml(data.aiSummary);
    } else if (typeof data.aiSummary === 'object' && data.aiSummary !== null) {
      parsedAiSummary = markdownToHtml(JSON.stringify(data.aiSummary, null, 2));
    }
  }

  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${fileName}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Malgun Gothic', '맑은 고딕', Arial, sans-serif;
          line-height: 1.4;
          color: #333;
          background: white;
          margin: 0;
          padding: 0;
          font-size: 12pt;
          letter-spacing: -0.1px;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 30px 40px;
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
        }
        
        .title {
          font-size: 20pt;
          font-weight: bold;
          margin-bottom: 15px;
          letter-spacing: -0.3px;
        }
        
        .section {
          margin-bottom: 20px;
          page-break-inside: avoid;
        }
        
        .section-title {
          font-size: 16pt;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 15px;
          padding-bottom: 6px;
          letter-spacing: -0.2px;
        }
        
        .content {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 15px;
          white-space: pre-wrap;
          word-wrap: break-word;
          line-height: 1.5;
        }
        
        .table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
          font-size: 12pt;
          table-layout: auto;
        }
        
        .table th,
        .table td {
          border: 1px solid #d1d5db;
          padding: 10px 14px;
          text-align: left;
          vertical-align: top;
          line-height: 1.4;
          word-wrap: break-word;
          white-space: normal;
        }
        
        .table th {
          background-color: #f3f4f6;
          font-weight: bold;
          color: #374151;
          width: 25%;
          min-width: 120px;
        }
        
        .table td {
          color: #6b7280;
        }
        
        .table tr:nth-child(even) {
          background-color: #f9fafb;
        }
        
        .subsection {
          margin-bottom: 18px;
        }
        
        .subsection-title {
          font-size: 14pt;
          font-weight: bold;
          color: #000000;
          margin-bottom: 10px;
          letter-spacing: -0.1px;
        }
        
        .page-break {
          page-break-before: always;
        }
        
        h1, h2, h3 {
          color: #1f2937;
          margin: 15px 0 10px 0;
          font-weight: bold;
          letter-spacing: -0.2px;
        }
        
        h1 { font-size: 18pt; }
        h2 { font-size: 16pt; }
        h3 { font-size: 14pt; }
        
        code {
          background-color: #f1f5f9;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 11pt;
        }
        
        p {
          margin-bottom: 8px;
          line-height: 1.5;
        }
        
        @media print {
          body {
            padding: 0;
          }
          
          .page-break {
            page-break-before: always;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="title">${fileName}</div>
          <div>상담 기록 보고서</div>
        </div>

        ${
          parsedInterventionRecord
            ? `
        <div class="section">
          <div class="section-title">중재기록</div>
          <div class="content">${parsedInterventionRecord}</div>
        </div>
        `
            : ''
        }

        ${
          parsedAiSummary
            ? `
        <div class="section">
          <div class="section-title">상담 녹음 AI 요약</div>
          <div class="content">${parsedAiSummary}</div>
        </div>
        `
            : ''
        }

        <div class="page-break"></div>
        
        <div class="section">
          <div class="section-title">기초 설문 내역</div>
          
          ${
            data.baseInfo
              ? `
          <div class="subsection">
            <div class="subsection-title">상담 목적 및 특이사항</div>
            ${formatBaseInfo(data.baseInfo)}
          </div>
          `
              : ''
          }

          ${
            data.healthInfo
              ? `
          <div class="subsection">
            <div class="subsection-title">건강 정보</div>
            ${formatHealthInfo(data.healthInfo)}
          </div>
          `
              : ''
          }

          ${
            data.livingInfo
              ? `
          <div class="subsection">
            <div class="subsection-title">생활 정보</div>
            ${formatLivingInfo(data.livingInfo)}
          </div>
          `
              : ''
          }

          ${
            data.independentLifeInfo
              ? `
          <div class="subsection">
            <div class="subsection-title">자립생활 역량</div>
            ${formatIndependentLifeInfo(data.independentLifeInfo)}
          </div>
          `
              : ''
          }
        </div>

        ${
          (data.prescriptionMedications &&
            data.prescriptionMedications.length > 0) ||
          (data.otcMedications && data.otcMedications.length > 0)
            ? `
        <div class="page-break"></div>
        <div class="section">
          <div class="section-title">약물 기록</div>
          
          ${
            data.prescriptionMedications &&
            data.prescriptionMedications.length > 0
              ? `
          <div class="subsection">
            <div class="subsection-title">처방 의약품</div>
            <table class="table">
              <thead>
                <tr>
                  <th>약물명</th>
                  <th>처방일</th>
                  <th>처방일수</th>
                  <th>복용법</th>
                  <th>복용상태</th>
                </tr>
              </thead>
              <tbody>
                ${data.prescriptionMedications
                  .map(
                    (med) => `
                <tr>
                  <td>${formatDisplayText(med.medicationName)}</td>
                  <td>${formatDisplayText(med.prescriptionDate)}</td>
                  <td>${formatDisplayText(med.prescriptionDays?.toString())}</td>
                  <td>${formatDisplayText(med.usageObject)}</td>
                  <td>${formatDisplayText(convertMedicineStatus(med.usageStatusCode))}</td>
                </tr>
                `,
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
          `
              : ''
          }

          ${
            data.otcMedications && data.otcMedications.length > 0
              ? `
          <div class="subsection">
            <div class="subsection-title">일반 의약품</div>
            <table class="table">
              <thead>
                <tr>
                  <th>약물명</th>
                  <th>처방일</th>
                  <th>처방일수</th>
                  <th>복용법</th>
                  <th>복용상태</th>
                </tr>
              </thead>
              <tbody>
                ${data.otcMedications
                  .map(
                    (med) => `
                <tr>
                  <td>${formatDisplayText(med.medicationName)}</td>
                  <td>${formatDisplayText(med.prescriptionDate)}</td>
                  <td>${formatDisplayText(med.prescriptionDays?.toString())}</td>
                  <td>${formatDisplayText(med.usageObject)}</td>
                  <td>${formatDisplayText(convertMedicineStatus(med.usageStatusCode))}</td>
                </tr>
                `,
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
          `
              : ''
          }
        </div>
        `
            : ''
        }
      </div>
    </body>
    </html>
  `;
};

export const generateCounselSessionPDFFromHTML = async (
  data: PDFGenerationData,
): Promise<void> => {
  const fileName = `${data.session.counseleeName || '내담자'}_${data.session.scheduledDate || ''}`;

  try {
    // HTML 템플릿 생성
    const htmlContent = createHTMLTemplate(data);

    // 임시 div 생성
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.style.width = '800px';
    document.body.appendChild(tempDiv);

    // HTML을 캔버스로 변환
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    // 임시 div 제거
    document.body.removeChild(tempDiv);

    // PDF 생성
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // 첫 페이지
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // 추가 페이지들
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    // PDF 다운로드
    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error('HTML to PDF 변환 중 오류:', error);
    throw error;
  }
};
