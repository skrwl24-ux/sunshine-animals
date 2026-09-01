# Sunshine Animals — 개발 프로젝트 구조

이 브랜치는 기존 배포용 실행 파일을 보존하면서, 이후 수정이 쉬운 구조로 정리하기 위한 개발용 브랜치입니다.

## 안전 원칙

- `legacy/index.html`은 현재 실행본의 원본 스냅샷입니다. 기능 회귀 확인용으로 유지합니다.
- `src/data/game-data.js`는 현재 `game-data.js`와 동일한 데이터 스냅샷입니다.
- 기존 localStorage 키 이름은 변경하지 않습니다.
- 한국어/영어는 같은 저장 데이터를 공유합니다.
- 실제 배포 연결을 확인하기 전에는 배포 완료로 간주하지 않습니다.

## 권장 구조

```text
legacy/
  index.html              # 기존 실행본 원본
src/
  core/
    config.js             # 게임 상수/비용/언어/등급
    storage.js            # localStorage 호환 계층
    i18n.js               # 한국어/영어 전환
  data/
    game-data.js          # 동물/퀴즈 데이터 스냅샷
  README.md               # 개발 규칙
PROJECT_STRUCTURE.md
```

## 다음 리팩터링 순서

1. 기존 index.html의 CSS를 `src/styles/`로 분리
2. 상태/저장을 `src/core/storage.js`로 이동
3. 언어 텍스트를 `src/core/i18n.js`로 이동
4. 부화/도감/퀴즈/파티/구조대/퀘스트를 기능별 모듈로 분리
5. 기존 localStorage 데이터로 회귀 테스트
6. 한국어/영어 화면 동시 테스트
7. 배포 서비스 연결 확인 후에만 실제 운영본 반영
