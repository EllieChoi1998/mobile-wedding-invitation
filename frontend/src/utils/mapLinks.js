/**
 * 네이버·카카오·티맵 앱/웹 길찾기 URL (개발자 API 키 불필요)
 * @see https://map.kakao.com/link
 * @see T map 앱 연동: goalx=경도(WGS84), goaly=위도(WGS84)
 */
export function buildMapLinks({ venue, address, lat, lng }) {
  const name = venue || address
  const searchQuery = encodeURIComponent(name)
  const encodedName = encodeURIComponent(name)

  return {
    naver: `https://map.naver.com/v5/search/${searchQuery}`,
    kakao: `https://map.kakao.com/link/map/${encodedName},${lat},${lng}`,
    kakaoRoute: `https://map.kakao.com/link/to/${encodedName},${lat},${lng}`,
    tmap: `tmap://route?goalname=${encodedName}&goalx=${lng}&goaly=${lat}`,
  }
}

/** API 키 없을 때 보여줄 정적 지도 이미지 (임시) */
export function buildStaticMapUrl(lat, lng, width = 640, height = 400) {
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=16&size=${width}x${height}&markers=${lat},${lng},lightblue1`
}
