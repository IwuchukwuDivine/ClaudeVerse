<template>
  <div class="shell">
    <a href="#main-content" class="skip-link">Skip to content</a>

    <AppNavbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />

    <div class="shell__body">
      <AppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

      <div
        v-show="sidebarOpen"
        class="shell__scrim"
        aria-hidden="true"
        @click="sidebarOpen = false"
      />

      <main id="main-content" class="shell__main">
        <div class="shell__content">
          <slot />
        </div>
      </main>

      <AppToc />
    </div>

    <AppSearchDialog />
  </div>
</template>

<script setup lang="ts">
const sidebarOpen = ref(false);
const route = useRoute();
watch(
  () => route.fullPath,
  () => {
    sidebarOpen.value = false;
  },
);
</script>

<style scoped>
.shell {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}
.shell__body {
  display: grid;
  grid-template-columns: 16rem minmax(0, 1fr) 14rem;
  gap: 0;
  align-items: start;
  flex: 1;
}
.shell__main {
  min-width: 0;
  padding: 2rem 2.5rem 4rem;
}
.shell__content {
  max-width: 48rem;
  margin: 0 auto;
}
.shell__scrim {
  display: none;
  position: fixed;
  inset: 3.5rem 0 0 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 25;
}

@media (max-width: 1200px) {
  .shell__body {
    grid-template-columns: 16rem minmax(0, 1fr);
  }
}
@media (max-width: 900px) {
  .shell__body {
    grid-template-columns: 1fr;
  }
  .shell__main {
    padding: 1.5rem 1.25rem 3rem;
  }
  .shell__scrim {
    display: block;
  }
}
@media (max-width: 768px) {
  .shell {
    padding-top: 4rem;
  }
  .shell__scrim {
    inset: 4rem 0 0 0;
  }
}
</style>
