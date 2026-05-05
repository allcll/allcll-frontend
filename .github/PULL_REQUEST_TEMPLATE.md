## 작업 내용

<!-- 무엇을 했는가 + 왜 했는가 를 함께 적어주세요. "왜"가 있어야 리뷰가 의미 있습니다. -->
<!-- QA 이슈가 있다면 본문 어디든 "Fixes #N" 또는 "QA-XXX" 를 적으면 자동 링크됩니다. -->

## 변경 사항 및 리뷰 포인트

<!-- 리뷰어가 특히 봐줬으면 하는 부분, 의도적인 트레이드오프, 같이 검토하고 싶은 결정을 적어주세요. -->

## 체크리스트

<!-- PR 올리기 전에 확인. /pr-ready 명령어로 자동 점검 가능. -->

- [ ] `pnpm run build-client` 통과 (admin 변경 시 `build-admin` 도)
- [ ] 절대 규칙 6가지 준수 (`/review` 또는 `/pr-ready` 로 점검)
- [ ] 커밋 메시지 형식 (`feat:` / `fix:` / `chore:` / `refactor:` / `hotfix:` / `docs:` / `style:` / `test:` 접두 + 한국어)
- [ ] 새 `useMutation` 추가 시 `onSuccess` 에 `invalidateQueries` / `removeQueries` 확인
- [ ] 머지 타깃 적절성 (feature/fix → develop, hotfix → main)
- [ ] 디자인 시스템 우선 사용 검토 (`@allcll/allcll-ui` 또는 `@allcll/sejong-ui` 카탈로그를 raw element 보다 먼저)
