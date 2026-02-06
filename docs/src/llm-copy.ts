export function convertToMarkdown(): string {
  const main = document.querySelector('main');
  if (!main) return '';

  const lines: string[] = [];

  function walk(el: Element) {
    // Skip demo sections
    if (el.classList.contains('demo')) return;

    const tag = el.tagName.toLowerCase();

    if (tag === 'h2') {
      lines.push('', `## ${el.textContent?.trim()}`, '');
    } else if (tag === 'h3') {
      lines.push('', `### ${el.textContent?.trim()}`, '');
    } else if (tag === 'p') {
      lines.push(el.textContent?.trim() || '');
    } else if (tag === 'pre') {
      const code = el.querySelector('code');
      if (code) {
        const lang = code.className.match(/language-(\w+)/)?.[1] || '';
        lines.push('', '```' + lang, code.textContent?.trimEnd() || '', '```', '');
      }
    } else if (tag === 'section' || tag === 'div') {
      for (const child of el.children) {
        walk(child);
      }
    }
  }

  for (const child of main.children) {
    walk(child);
  }

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

export function setupLLMCopy() {
  const btn = document.getElementById('btn-llm-copy');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const md = convertToMarkdown();

    try {
      await navigator.clipboard.writeText(md);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = md;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }

    const orig = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = orig; }, 2000);
  });
}
