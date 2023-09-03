<script setup lang="ts">
defineProps({
  textClass: {
    type: String,
    default: "text-2xl",
  },
  iconSize: {
    type: Number,
    default: 32,
  },
  iconColor: {
    type: String,
    default: "text-lime-500",
  },
});
</script>

<template>
  <a href="/" class="flex items-center whitespace-nowrap">
    <AppIcon :color="iconColor" :size="iconSize" />
    <span
      :class="textClass"
      class="self-center font-semibold dark:text-white ml-2"
    >
      Reevize
    </span>
  </a>
</template>
