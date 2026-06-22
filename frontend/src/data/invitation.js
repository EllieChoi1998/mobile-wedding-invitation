export const theme = {
  primary: '#f4a7b9',
  primaryDark: '#e8899e',
  accent: '#fff0f3',
  background: '#fffbfc',
  text: '#4a4a4a',
  textMuted: '#888',
}

export const couple = {
  groom: { fullName: '조 문경' },
  bride: { fullName: '최 혜령' },
}

export const parents = {
  groom: {
    label: '신랑 측 혼주',
    father: {
      name: '조 석영',
      bank: '국민은행',
      accountNumber: '123456-01-123456',
      holder: '조 석영',
    },
    mother: {
      name: '김 경화',
      bank: '신한은행',
      accountNumber: '110-123-456789',
      holder: '김 경화',
    },
  },
  bride: {
    label: '신부 측 혼주',
    father: {
      name: '최 태경',
      bank: '우리은행',
      accountNumber: '1002-123-456789',
      holder: '최 태경',
    },
    mother: {
      name: '강 미선',
      bank: '하나은행',
      accountNumber: '123-456789-01234',
      holder: '강 미선',
    },
  },
}

export const wedding = {
  date: '2026년 08월 15일',
  dayNote: '광복절',
  time: '오전 11시',
  venue: '노블발렌티 삼성점',
  calendar: { year: 2026, month: 8, day: 15 },
  greeting:
    '저희 두 사람이 사랑과 믿음으로\n한 가족이 되려 합니다.\n바쁘시겠지만 귀한 걸음 하시어\n축복해 주시면 감사하겠습니다.',
}

export const invitationData = {
  groom: {
    side: 'groom',
    label: '신랑 측',
    names: '조 문경 ♥ 최 혜령',
    greeting: wedding.greeting,
    themeColor: theme.primary,
    accentColor: theme.accent,
    parentInfo: parents.groom,
  },
  bride: {
    side: 'bride',
    label: '신부 측',
    names: '최 혜령 ♥ 조 문경',
    greeting: wedding.greeting,
    themeColor: theme.primary,
    accentColor: theme.accent,
    parentInfo: parents.bride,
  },
}

export function getInvitationBySide(side) {
  return invitationData[side] ?? invitationData.groom
}
