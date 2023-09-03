<script setup lang="ts">
const router = useRouter();
const route = useRoute();
const user = useCurrentUser();

// we don't need this watcher on server
onMounted(() => {
  watch(user, (user, prevUser) => {
    if (prevUser && !user) {
      // user logged out
      router.push("/");
    } else if (user && typeof route.query.redirect === "string") {
      // user logged in
      router.push(route.query.redirect);
    }
  });
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
