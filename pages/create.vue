<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: "authenticated",
});

const router = useRouter();
const user = useCurrentUser();

const loading = ref(false);
const showQuizModal = ref(false);
const showAuthModal = ref(false);
const contentId = ref("");
const questions = ref<Question[]>([]);
const parseError = ref("");
const choices = ["a).", "b).", "c).", "d)."];

const items = [
  {
    slot: "prose",
    label: "Try with Text",
    description:
      "Enter the prose here for which you want to generate some questions. For a meaningful output please enter at least 300-400 words.",
    maxLength: 4096,
    mcqCount: 6,
    trueCount: 2,
  },
  {
    slot: "file",
    label: "Try with image",
    description:
      "Take a snap of your content, or upload an existing jpg/png image file. No questions will be generated if not enough text is present in the image.",
    maxImages: 1,
    mcqCount: 6,
    trueCount: 2,
  },
];

const parseQuestions = (
  result: { id: string; value: string | undefined } | undefined
) => {
  if (result?.value) {
    try {
      const qs = JSON.parse(result.value);
      questions.value.push(...qs);
      contentId.value = result.id;
      return;
    } catch (error) {
      console.log("failed to find JSON data");
    }
  }

  parseError.value = "Failed to generate questions. Please retry.";
};

const generateQuestions = async (input: {
  text: string;
  mcqCount: number;
  trueCount: number;
}) => {
  loading.value = true;
  const res = await $fetch<GenerateResponse>("/api/generate", {
    method: "POST",
    body: input,
  });

  console.log("res", res);
  parseQuestions(res.result);
  loading.value = false;
};

const handleQuizPublish = () => {
  if (!user.value) {
    showQuizModal.value = true;
  } else {
    showAuthModal.value = false;
    showQuizModal.value = true;
  }
};
</script>

<template>
  <QuestionsLoading v-if="loading" />
  <template v-else-if="questions.length">
    <h3 class="text-gray-900 dark:text-white flex items-center justify-between">
      <span class="text-2xl font-semibold">Generated Questions</span>
      <div class="flex gap-2">
        <UButton size="2xs" variant="outline" @click="router.go(0)">
          Reset
        </UButton>
        <UButton size="2xs" @click="handleQuizPublish">Publish</UButton>
      </div>
    </h3>

    <UCard
      v-for="(question, index) in questions"
      :key="`question_${index}`"
      class="mt-6"
    >
      <p>{{ index + 1 }}. {{ question.text }}</p>
      <div class="flex flex-wrap">
        <div v-for="(option, i) in question.options" class="w-1/2 p-2">
          {{ choices[i] }} {{ option }}
        </div>
      </div>
      <p class="mt-4">
        <span class="text-gray-500 dark:text-gray-400 text-sm">
          Correct answer:
        </span>
        {{ question.answer }}
      </p>
    </UCard>
  </template>
  <div v-else-if="parseError">
    <UCard class="text-center">
      <p>
        {{ parseError }}
      </p>
      <UButton class="mt-6" size="lg" @click="parseError = ''">
        Go back
      </UButton>
    </UCard>
  </div>
  <UTabs v-else :items="items">
    <template #prose="{ item }">
      <ProsePrompt
        :item="item"
        :generating="loading"
        @generate-questions="generateQuestions"
      />
    </template>
    <template #file="{ item }">
      <ImagePrompt
        :item="item"
        :generating="loading"
        @generate-questions="generateQuestions"
      />
    </template>
  </UTabs>

  <UModal v-model="showQuizModal" prevent-close>
    <CreateQuiz
      :questions="questions"
      :content-id="contentId"
      @quiz-cancel="showQuizModal = false"
    />
  </UModal>
</template>
