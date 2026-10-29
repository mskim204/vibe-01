/**
 * 투표 웹앱 (Google Apps Script)
 * 시트 구성
 *  - '코드' 탭: 1행 머리글(코드), 2행부터 4자리 투표 코드
 *  - '투표' 탭: 1행 머리글(시각 | 코드 | 고른 것), 2행부터 투표 기록
 * 주소 끝에 ?page=result 를 붙이면 결과 막대그래프 화면이 나옵니다.
 */

var CHOICES = ['빵', '밥', '파스타', '햄'];
var CODE_SHEET = '코드';
var VOTE_SHEET = '투표';

function doGet(e) {
  var t = HtmlService.createTemplateFromFile('index');
  t.page = (e && e.parameter && e.parameter.page === 'result') ? 'result' : 'vote';
  t.choices = CHOICES; // 보기 목록만 보냄 (코드 목록은 절대 보내지 않음)
  return t.evaluate()
    .setTitle(t.page === 'result' ? '투표 결과' : '투표하기')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// 시트에서 숫자로 바뀐 코드(예: 0123 → 123)도 4자리 문자로 맞춰서 비교
function normalizeCode_(v) {
  var s = String(v).trim();
  if (/^\d{1,4}$/.test(s)) s = ('0000' + s).slice(-4);
  return s;
}

function columnValues_(sheet, col) {
  var last = sheet.getLastRow();
  if (last < 2) return [];
  return sheet.getRange(2, col, last - 1, 1).getValues().map(function (r) {
    return normalizeCode_(r[0]);
  });
}

/** 투표 제출: 결과 메시지만 돌려줌 */
function submitVote(code, choice) {
  code = normalizeCode_(code || '');
  if (!/^\d{4}$/.test(code)) {
    return { ok: false, message: '유효한 코드가 아닙니다' };
  }
  if (CHOICES.indexOf(choice) === -1) {
    return { ok: false, message: '보기를 하나 골라 주세요' };
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(10000); // 동시에 같은 코드로 투표하는 것 방지
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var codeSheet = ss.getSheetByName(CODE_SHEET);
    var voteSheet = ss.getSheetByName(VOTE_SHEET);

    if (columnValues_(codeSheet, 1).indexOf(code) === -1) {
      return { ok: false, message: '유효한 코드가 아닙니다' };
    }
    if (columnValues_(voteSheet, 2).indexOf(code) !== -1) {
      return { ok: false, message: '이미 투표했습니다' };
    }

    // 코드 앞에 ' 를 붙여 0으로 시작하는 코드도 글자 그대로 저장
    voteSheet.appendRow([new Date(), "'" + code, choice]);
    return { ok: true, message: '투표 완료! (' + choice + ')' };
  } finally {
    lock.releaseLock();
  }
}

/** 보기별 득표 수만 돌려줌 */
function getResults() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(VOTE_SHEET);
  var counts = {};
  CHOICES.forEach(function (c) { counts[c] = 0; });
  var last = sheet.getLastRow();
  if (last >= 2) {
    sheet.getRange(2, 3, last - 1, 1).getValues().forEach(function (r) {
      var c = String(r[0]).trim();
      if (counts.hasOwnProperty(c)) counts[c]++;
    });
  }
  return CHOICES.map(function (c) { return { choice: c, count: counts[c] }; });
}
