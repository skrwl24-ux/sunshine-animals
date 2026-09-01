# Sunshine Animals

Sunshine Animals 웹게임의 마스터 저장소입니다.

- 운영 브랜치: `main`
- 읽기 쉬운 실행 진입점: `dev-index.html`
- GitHub Pages 배포: `.github/workflows/pages.yml`
- 기존 실행본은 `legacy/`에 보존

## 운영 방식
`main`에 검증된 변경을 반영하면 GitHub Actions가 `dev-index.html`을 공개 `index.html`로 패키징해 GitHub Pages에 배포합니다.

배포 전에는 `npm test` 회귀 검사를 통과해야 하며, 실제 공개 URL을 브라우저에서 확인하기 전에는 배포 완료로 간주하지 않습니다.
