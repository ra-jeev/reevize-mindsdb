<script setup lang="ts">
const user = useCurrentUser();

watch(
  user,
  () => {
    if (user.value) {
      return navigateTo("/play", { replace: true });
    }
  },
  { immediate: true }
);
</script>

<template>
  <div
    class="flex flex-col bg-white dark:bg-gray-950 min-h-screen justify-center items-center"
  >
    <AppLogo text-class="text-4xl" :icon-size="48" />
    <slot />
  </div>
</template>
