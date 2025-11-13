<template>
  <footer class="cv-footer">
    <div class="cv-footer__inner">

      <div class="cv-footer__brand">
        <NuxtLink to="/" class="cv-footer__logo">CareValidate</NuxtLink>
        <p class="cv-footer__desc">
          Empowering digital health workflows with intelligent automation.
        </p>
      </div>

      <nav class="cv-footer__nav">
        <div class="cv-footer__col">
          <h4>Product</h4>
          <ul>
            <li><NuxtLink to="/blog">Blog</NuxtLink></li>
            <li><NuxtLink to="/contact">Contact</NuxtLink></li>
            <li><NuxtLink to="/pricing">Pricing</NuxtLink></li>
          </ul>
        </div>

        <div class="cv-footer__col">
          <h4>Company</h4>
          <ul>
            <li><NuxtLink to="/about">About</NuxtLink></li>
            <li><NuxtLink to="/careers">Careers</NuxtLink></li>
            <li><NuxtLink to="/privacy">Privacy Policy</NuxtLink></li>
          </ul>
        </div>
      </nav>
    </div>

    <div class="cv-footer__bottom">
      <p>© {{ new Date().getFullYear() }} CareValidate. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
.cv-footer {
  background: var(--card);
  padding: 40px 24px 24px;
  border-top: 1px solid var(--muted);
}

.cv-footer__inner {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 40px;
}

.cv-footer__brand {
  max-width: 260px;
}

.cv-footer__logo {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text);
  text-decoration: none;
}

.cv-footer__desc {
  color: var(--text);
  opacity: 0.75;
  margin-top: 8px;
  line-height: 1.4;
}

.cv-footer__nav {
  display: flex;
  gap: 48px;
}

.cv-footer__col h4 {
  margin-bottom: 10px;
  font-size: 0.95rem;
  font-weight: 600;
}

.cv-footer__col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cv-footer__col li {
  margin-bottom: 6px;
}

.cv-footer__col a {
  text-decoration: none;
  color: var(--text);
  opacity: 0.75;
  font-size: 0.9rem;
}

.cv-footer__col a:hover {
  opacity: 1;
}

.cv-footer__bottom {
  margin-top: 32px;
  text-align: center;
  font-size: 0.85rem;
  opacity: 0.6;
  color: var(--text);
}

@media (max-width: 640px) {
  .cv-footer__nav {
    flex-direction: column;
    gap: 24px;
  }
}
</style>
