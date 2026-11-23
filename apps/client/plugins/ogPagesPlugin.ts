import type { Plugin } from 'vite';
import { OG_PAGES, SITE_ORIGIN, type IOgPage } from './ogPages';

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** 바꿀 태그가 없으면 빌드를 멈춥니다. index.html에서 태그가 빠졌을 때 메인 값이 조용히 나가는 것을 막기 위해서입니다 */
function replaceOrThrow(html: string, pattern: RegExp, replacement: string, label: string) {
  if (!pattern.test(html)) {
    throw new Error(`[og-pages] index.html에서 ${label} 태그를 찾지 못했습니다.`);
  }
  return html.replace(pattern, replacement);
}

function setMeta(html: string, attribute: 'name' | 'property', key: string, content: string) {
  const pattern = new RegExp(`<meta\\s+${attribute}="${key}"\\s+content="[^"]*"\\s*/?>`);
  return replaceOrThrow(html, pattern, `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`, key);
}

function renderPage(html: string, page: IOgPage) {
  let result = replaceOrThrow(html, /<title>[^<]*<\/title>/, `<title>${escapeHtml(page.title)}</title>`, 'title');
  result = setMeta(result, 'name', 'description', page.description);
  result = setMeta(result, 'property', 'og:url', `${SITE_ORIGIN}/${page.path}`);
  result = setMeta(result, 'property', 'og:title', page.title);
  result = setMeta(result, 'property', 'og:description', page.description);
  result = setMeta(result, 'property', 'og:image', `${SITE_ORIGIN}/og/${page.image}`);
  return result;
}

/**
 * 페이지마다 OG 태그를 바꾼 HTML을 빌드 결과에 추가합니다.
 * 링크 미리보기 봇은 자바스크립트를 실행하지 않아 Helmet으로 넣은 값을 읽지 못하고 서버가 준 HTML만 봅니다.
 * 서버(nginx)가 /live 요청에 live/index.html을 주도록 설정되어 있어야 미리보기에 반영됩니다.
 */
export function ogPagesPlugin(): Plugin {
  return {
    name: 'allcll-og-pages',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const index = bundle['index.html'];
      if (!index || index.type !== 'asset') {
        this.error('[og-pages] 빌드 결과에서 index.html을 찾지 못했습니다.');
      }

      const html = String(index.source);
      OG_PAGES.forEach(page => {
        this.emitFile({ type: 'asset', fileName: `${page.path}/index.html`, source: renderPage(html, page) });
      });
    },
  };
}
