export const theme = {
  primary: '#f4a7b9',
  primaryDark: '#e8899e',
  accent: '#fff0f3',
  background: '#fffbfc',
  text: '#4a4a4a',
  textMuted: '#888',
}

export const cover = {
  imagePath: 'cover/hero.jpg',
  eyebrow: 'Invitation',
  title: '소중한 분들을 초대합니다',
}

export const couple = {
  groom: {
    fullName: '조 문경',
    birthDate: '1990년 12월 10일',
    mbti: 'ISTP',
    tags: ['#캠핑', '#러닝'],
    phone: '010-0000-0001',
    photoPath: 'about/groom.jpg',
    account: {
      name: '조 문경',
      bank: '국민은행',
      accountNumber: '123456-01-000001',
      holder: '조 문경',
    },
  },
  bride: {
    fullName: '최 혜령',
    birthDate: '1993년 3월 14일',
    mbti: 'ESTJ',
    tags: ['#스노우보드', '#캠핑'],
    phone: '010-0000-0002',
    photoPath: 'about/bride.jpg',
    account: {
      name: '최 혜령',
      bank: '카카오뱅크',
      accountNumber: '3333-02-0000000',
      holder: '최 혜령',
    },
  },
}

export const parentsLine = {
  groom: {
    father: '조 석영',
    mother: '김 경화',
    relationLabel: '아들',
  },
  bride: {
    father: '최 태경',
    mother: '강 미선',
    relationLabel: '딸',
  },
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

export const contacts = [
  { role: '신랑', name: '조 문경', phone: '010-0000-0001' },
  { role: '신부', name: '최 혜령', phone: '010-0000-0002' },
  { role: '신랑 아버지', name: '조 석영', phone: '010-0000-0003' },
  { role: '신랑 어머니', name: '김 경화', phone: '010-0000-0004' },
  { role: '신부 아버지', name: '최 태경', phone: '010-0000-0005' },
  { role: '신부 어머니', name: '강 미선', phone: '010-0000-0006' },
]

export const timeline = [
  {
    date: '2014년 1월 16일',
    title: 'CGV 아르바이트',
    description: '같은 곳에서 함께 일하다\n서로에게 마음이 닿은 날',
    emoji: '🎬',
  },
  {
    date: '연애 기간 11년',
    title: '함께 걸어온 시간',
    description: '오랜 시간 서로를 알아가며\n조금씩 닮아온 마음들',
    emoji: '🫶',
  },
  {
    date: '프로포즈',
    title: '우리 첫 신혼집에서',
    description: '익숙한 공간이 특별해진 날\n우리의 약속이 시작된 순간',
    emoji: '🏡',
  },
  {
    date: '2026년 8월 15일',
    title: '결혼식',
    description: '서로의 손을 꼭 잡고\n새로운 이야기가 시작될 날',
    emoji: '🤵🏻🤍👰🏻‍♀️',
  },
]

export const interview = [
  {
    question: '첫인상은 어땠나요?',
    groomAnswer: '아주 밝고 에너지가 넘쳤어요.\n처음 만났는데도 오래 알던 사람처럼 편했어요.',
    brideAnswer: '말수가 적지만 진중한 느낌이었어요.\n눈웃음이 인상적이었고요 :)',
  },
  {
    question: '결혼을 결심한 계기가 있다면?',
    groomAnswer: "매일의 사소한 순간들이 즐겁고 편안했어요.\n'아, 이 사람이구나' 싶었죠.",
    brideAnswer: '어떤 상황에서도 저를 먼저 생각해주는 마음.\n그 따뜻함이 확신이 되었어요.',
  },
  {
    question: '신혼여행은 어디로 가나요?',
    groomAnswer: '미국과 칸쿤으로 13박 14일 ✈️🌴',
    brideAnswer: '미국과 칸쿤으로 13박 14일 ✈️🌴',
  },
]

export const wedding = {
  date: '2026년 08월 15일',
  dayNote: '토요일',
  time: '오전 11시',
  dateISO: '2026-08-15T11:00:00+09:00',
  venue: '노블발렌티 삼성점',
  hall: '2F, 그랜드홀',
  address: '서울특별시 강남구 영동대로 506',
  lat: 37.5088,
  lng: 127.0632,
  calendar: { year: 2026, month: 8, day: 15 },
  greeting:
    '저희 두 사람의 작은 만남이\n진실한 사랑으로 꽃피어\n오늘 이 자리를 빛내는 결혼식으로 이어졌습니다.\n\n평생 서로를 귀히 여기며\n처음의 설렘과 순수함을 잃지 않고\n존중하고 아껴 나가겠습니다.\n\n믿음과 사랑을 기초로 한 이 날에\n여러분의 따뜻한 축복이 함께 한다면\n더할 나위 없는 기쁨으로 간직하겠습니다.',
  mapLinks: {
    naver: 'https://map.naver.com/v5/search/노블발렌티%20삼성점',
    tmap: 'https://tmap.co.kr',
    kakao: 'https://map.kakao.com',
  },
  mapImagePath: 'location/map-placeholder.jpg',
  transport: {
    shuttle: {
      label: '셔틀버스',
      lines: ['⏱️ 10~20분 간격 왕복 (무료)', '📍 예식장 정문 앞 하차'],
    },
    bus: {
      label: '버스',
      lines: ['🚏 코엑스역 정류장 하차', '🚌 341 · 360 · 740', '📍 도보 5분 거리'],
    },
    subway: {
      label: '지하철',
      lines: ['🚆 삼성역 5번 출구 → 도보 8분', '📍 노블발렌티 삼성점'],
    },
    car: {
      label: '자가용',
      lines: ['🛣️ 영동대로 이용', '🅿️ 무료 주차장 (지하 1~2층)'],
    },
  },
}

export const relationship = {
  startDateISO: '2014-02-16T00:00:00+09:00',
}

export const information = [
  {
    title: '포토존',
    body: '예식장 로비에 포토존이 마련되어 있습니다.\n기념 사진을 남겨주세요.',
  },
  {
    title: '식사 안내',
    body: '예식 후 같은 층 뷔페에서 식사가 준비되어 있습니다.',
  },
  {
    title: '화환 안내',
    body: '축하 화환은 정중히 사양합니다.\n마음만 감사히 받겠습니다.',
  },
]

export const accounts = {
  groomSide: [
    { label: '신랑', ...couple.groom.account },
    { label: '신랑 아버지', ...parents.groom.father, name: parents.groom.father.name },
    { label: '신랑 어머니', ...parents.groom.mother, name: parents.groom.mother.name },
  ],
  brideSide: [
    { label: '신부', ...couple.bride.account },
    { label: '신부 아버지', ...parents.bride.father, name: parents.bride.father.name },
    { label: '신부 어머니', ...parents.bride.mother, name: parents.bride.mother.name },
  ],
}

export const assets = {
  midPhoto: 'sections/middle.jpg',
  endingPhoto: 'sections/ending.jpg',
}

export const flowerDeliveryUrl = 'https://www.example.com/flower'

export const share = {
  defaultMessage: '저희 결혼식에 초대합니다',
}

/** 청첩장 제작자 크레딧 — 하단 표시용 (email은 본인 주소로 수정) */
export const creator = {
  handle: 'EllieChoi1998',
  profileUrl: 'https://github.com/EllieChoi1998',
  email: '',
  builtAt: '2026-06-22',
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
