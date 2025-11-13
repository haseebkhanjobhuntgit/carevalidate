<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const isOpen = ref(false);
const searchTerm = ref("");
const router = useRouter();

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const closeMenu = () => {
  isOpen.value = false;
};

const submitSearch = () => {
  const q = searchTerm.value.trim();
  if (!q) return;

  router.push({
    path: "/search",
    query: { q },
  });

  isOpen.value = false;
};

</script>

<template>
  <header class="cv-header">
    <div class="cv-header__inner">
      <!-- Logo -->
      <NuxtLink to="/" class="cv-header__logo" @click="closeMenu">
        CareValidate
      </NuxtLink>

      <!-- Desktop nav -->
      <nav class="cv-header__nav cv-header__nav--desktop">
        <NuxtLink to="/blog">Blog</NuxtLink>
        <NuxtLink to="/pricing">Pricing</NuxtLink>
        <NuxtLink to="/contact">Contact</NuxtLink>
      </nav>

      <!-- Desktop search + CTA -->
      <div class="cv-header__right cv-header__nav--desktop">
        <form class="cv-header__search" @submit.prevent="submitSearch">
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Search blog…"
            class="cv-header__search-input"
          />
        </form>

        <NuxtLink to="/contact" class="cv-header__cta">
          Book a demo
        </NuxtLink>
      </div>

      <!-- Mobile menu button -->
      <button
        type="button"
        class="cv-header__menu-btn"
        :class="{ 'cv-header__menu-btn--open': isOpen }"
        @click="toggleMenu"
        :aria-expanded="isOpen ? 'true' : 'false'"
        aria-label="Toggle navigation"
      >
        <span class="cv-header__menu-line" />
        <span class="cv-header__menu-line" />
        <span class="cv-header__menu-line" />
      </button>
    </div>

    <!-- Mobile nav -->
    <transition name="cv-header-slide">
      <div v-if="isOpen" class="cv-header__mobile">
        <form class="cv-header__mobile-search" @submit.prevent="submitSearch">
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Search blog…"
            class="cv-header__search-input"
          />
        </form>

        <nav class="cv-header__mobile-nav">
          <NuxtLink to="/blog" @click="closeMenu">Blog</NuxtLink>
          <NuxtLink to="/pricing" @click="closeMenu">Pricing</NuxtLink>
          <NuxtLink to="/contact" @click="closeMenu">Contact</NuxtLink>
        </nav>

        <NuxtLink
          to="/contact"
          class="cv-header__mobile-cta"
          @click="closeMenu"
        >
          Book a demo
        </NuxtLink>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.cv-header {
  position: sticky;
  top: 0;
  z-index: 40;
  backdrop-filter: blur(10px);
  background: color-mix(in srgb, var(--bg) 92%, transparent);
  border-bottom: 1px solid var(--muted);
}

.cv-header__inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.cv-header__logo {
  font-size: 1.3rem;
  font-weight: 700;
  text-decoration: none;
  color: var(--text);
}

/* Desktop nav */
.cv-header__nav {
  display: flex;
  align-items: center;
  gap: 18px;
}

.cv-header__nav a {
  font-size: 0.95rem;
  text-decoration: none;
  color: var(--text);
  opacity: 0.8;
}

.cv-header__nav a:hover,
.cv-header__nav a.router-link-active {
  opacity: 1;
}

/* Right side (search + CTA) */
.cv-header__right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Search */
.cv-header__search {
  position: relative;
}

.cv-header__search-input {
  border-radius: 999px;
  border: 1px solid var(--muted);
  background: color-mix(in srgb, var(--bg) 96%, #ffffff 4%);
  padding: 6px 12px;
  font-size: 0.9rem;
  min-width: 180px;
  outline: none;
  color: var(--text);
}

.cv-header__search-input::placeholder {
  opacity: 0.6;
}

.cv-header__search-input:focus {
  border-color: var(--accent, #3daaab);
}

/* CTA */
.cv-header__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 999px;
  background: var(--accent, #3daaab);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
}

/* Mobile button */
.cv-header__menu-btn {
  display: none;
  border: none;
  background: transparent;
  padding: 6px;
  cursor: pointer;
  position: relative;
  width: 28px;
  height: 24px;
}

.cv-header__menu-line {
  position: absolute;
  left: 4px;
  right: 4px;
  height: 2px;
  background: var(--text);
  border-radius: 999px;
  transition: transform 0.16s ease, opacity 0.16s ease, top 0.16s ease,
    bottom 0.16s ease;
}

.cv-header__menu-line:nth-child(1) {
  top: 5px;
}
.cv-header__menu-line:nth-child(2) {
  top: 11px;
}
.cv-header__menu-line:nth-child(3) {
  bottom: 5px;
}

/* Open state → X icon */
.cv-header__menu-btn--open .cv-header__menu-line:nth-child(1) {
  top: 11px;
  transform: rotate(45deg);
}
.cv-header__menu-btn--open .cv-header__menu-line:nth-child(2) {
  opacity: 0;
}
.cv-header__menu-btn--open .cv-header__menu-line:nth-child(3) {
  bottom: 11px;
  transform: rotate(-45deg);
}

/* Mobile nav panel */
.cv-header__mobile {
  border-top: 1px solid var(--muted);
  background: var(--bg);
}

.cv-header__mobile-search {
  padding: 10px 20px 0;
}

.cv-header__mobile-nav {
  display: flex;
  flex-direction: column;
  padding: 8px 20px 4px;
  gap: 8px;
}

.cv-header__mobile-nav a {
  text-decoration: none;
  color: var(--text);
  opacity: 0.85;
  font-size: 0.95rem;
}

.cv-header__mobile-cta {
  display: block;
  margin: 4px 20px 12px;
  text-align: center;
  padding: 8px 0;
  border-radius: 999px;
  background: var(--accent, #3daaab);
  color: #fff;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
}

/* Transition */
.cv-header-slide-enter-active,
.cv-header-slide-leave-active {
  transition: all 0.16s ease-out;
}
.cv-header-slide-enter-from,
.cv-header-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Responsive */
@media (max-width: 768px) {
  .cv-header__nav--desktop {
    display: none;
  }

  .cv-header__menu-btn {
    display: inline-flex;
  }

  .cv-header__inner {
    padding-inline: 16px;
  }
}
</style>
