<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <span class="footer__logo" aria-hidden="true">
          <LucideSparkles :size="14" />
        </span>
        <div class="footer__brand-text">
          <span class="footer__name">Claudeverse</span>
          <span class="footer__tag"
            >The Developer's Universe for Claude Code Mastery</span
          >
        </div>
      </div>

      <nav class="footer__nav" aria-label="Site footer">
        <NuxtLink to="/changelog" class="footer__link">
          <LucideHistory :size="14" aria-hidden="true" />
          <span>Changelog</span>
        </NuxtLink>
        <a
          href="https://github.com/IwuchukwuDivine/ClaudeVerse"
          target="_blank"
          rel="noopener"
          class="footer__link"
        >
          <IconGithub :size="14" aria-hidden="true" />
          <span>GitHub</span>
        </a>
        <a
          href="https://docs.claude.com"
          target="_blank"
          rel="noopener"
          class="footer__link"
        >
          <LucideExternalLink :size="14" aria-hidden="true" />
          <span>Official Docs</span>
        </a>
      </nav>

      <p class="footer__credit">
        Built by
        <a
          href="https://x.com/_DeeVyn"
          target="_blank"
          rel="noopener"
          class="footer__credit-link"
        >
          @_DeeVyn
        </a>
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts"></script>

<style scoped>
.footer {
  border-top: 1px solid var(--border-subtle);
  background: color-mix(in oklab, var(--bg) 92%, transparent);
  margin-top: auto;
}
.footer__inner {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  max-width: 100%;
}
.footer__brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  min-width: 0;
}
.footer__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 1.5rem;
  width: 1.5rem;
  background: linear-gradient(
    135deg,
    var(--primary),
    var(--accent-orchestration)
  );
  color: #fff;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}
.footer__brand-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.footer__name {
  color: var(--text-primary);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.2;
}
.footer__tag {
  color: var(--text-muted);
  font-size: 0.75rem;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.footer__nav {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  justify-self: center;
}
.footer__link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.625rem;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.8125rem;
  font-weight: 500;
  transition: background 160ms ease, color 160ms ease;
}
.footer__link:hover {
  background: var(--surface-elevated);
  color: var(--text-primary);
}
.footer__credit {
  color: var(--text-muted);
  font-size: 0.75rem;
  margin: 0;
  justify-self: end;
  text-align: right;
}
.footer__credit-link {
  color: inherit;
  text-decoration: none;
  border-bottom: 1px dotted currentColor;
}
.footer__credit-link:hover {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

@media (max-width: 900px) {
  .footer__inner {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
    gap: 0.75rem;
    padding: 1.25rem 1rem;
  }
  .footer__brand {
    justify-content: center;
  }
  .footer__tag {
    display: none;
  }
  .footer__credit {
    justify-self: center;
    text-align: center;
  }
}
</style>
