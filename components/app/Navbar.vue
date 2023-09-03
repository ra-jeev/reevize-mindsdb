<script setup lang="ts">
const auth = useFirebaseAuth()!;
const user = useCurrentUser();
const loading = ref(false);

const signOut = async () => {
  loading.value = true;
  await auth.signOut();

  loading.value = false;
};
</script>

<template>
  <nav class="bg-white border-gray-200 dark:bg-gray-900">
    <UContainer class="flex flex-wrap items-center justify-between py-4">
      <AppLogo />

      <div v-if="user" class="flex items-center gap-4">
        <UButton @click="signOut" :loading="loading"> Sign Out </UButton>
        <UButton
          color="white"
          variant="soft"
          :padded="false"
          size="xl"
          icon="i-heroicons-bars-3-bottom-right-20-solid"
          class="md:hidden"
          @click="$emit('drawerOpen')"
        />
      </div>
      <div v-else class="flex md:order-2 space-x-4">
        <UButton size="md" variant="outline" to="/register"> Sign Up </UButton>
        <UButton size="md" to="/login">Login</UButton>
      </div>
    </UContainer>
  </nav>
</template>
