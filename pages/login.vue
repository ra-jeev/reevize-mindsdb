<script setup lang="ts">
definePageMeta({
  layout: "auth",
});
</script>

<template>
  <UCard class="max-w-md w-full mt-10">
    <h2 class="text-2xl font-medium text-center">Log in to your account</h2>

    <Login class="my-6" />

    <div
      class="text-sm font-medium text-gray-500 dark:text-gray-300 text-center"
    >
      Don't have an account?
      <UButton variant="link" :padded="false" to="/register">
        Create one now
      </UButton>
    </div>
  </UCard>
</template>
