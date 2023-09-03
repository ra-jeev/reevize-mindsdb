<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: "authenticated",
});

const { data, pending } = await useFetch("/api/quizzes");
</script>

<template>
  <div v-if="pending" class="space-y-2">
    <USkeleton class="h-4 w-[250px]" />
    <USkeleton class="h-4 w-[200px]" />
  </div>
  <div v-else-if="data?.result">
    <h2 class="text-xl md:text-2xl mb-4">Your Quizzes</h2>
    <div class="flex flex-wrap">
      <div
        v-for="quiz in data.result"
        :key="quiz.id"
        class="w-full md:w-1/2 p-2"
      >
        <QuizCard :quiz="quiz" />
      </div>
    </div>
  </div>

  <UCard v-else class="text-center">
    <p>You haven't created any quizzes yet.</p>
    <UButton class="mt-6" size="lg" @click="navigateTo('/create')">
      Create one
    </UButton>
  </UCard>
</template>
