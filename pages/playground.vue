<script setup lang="ts">
const router = useRouter();
const user = useCurrentUser();

if (user.value) {
  navigateTo("/create");
}

const outputRef = ref();
const questionsRef = ref();
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
      questions.value = [...qs];
      contentId.value = result.id;

      questionsRef.value.scrollIntoView({ behavior: "smooth" });
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
  outputRef.value.scrollIntoView({ behavior: "smooth" });
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
    showAuthModal.value = true;
  } else {
    showAuthModal.value = false;
    showQuizModal.value = true;
  }
};
</script>

<template>
  <UContainer class="flex flex-wrap py-4">
    <div class="w-full lg:w-1/2 lg:p-2">
      <h2 class="text-xl md:text-2xl text-center p-2 border rounded mb-4">
        Your Input
      </h2>
      <UTabs :items="items">
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
    </div>
    <div class="w-full mt-6 lg:mt-0 lg:w-1/2 lg:p-2">
      <h2
        ref="outputRef"
        class="text-xl md:text-2xl text-center p-2 border rounded mb-4"
      >
        The Output
      </h2>

      <QuestionsLoading v-if="loading" />

      <template v-else-if="questions.length">
        <h3
          ref="questionsRef"
          class="text-gray-900 dark:text-white flex items-center justify-between"
        >
          <span class="text-lg md:text-xl lg:text-2xl font-semibold">
            Generated Questions
          </span>
          <div class="flex gap-2">
            <UButton size="2xs" variant="outline" @click="router.go(0)">
              Reset
            </UButton>
            <UButton size="2xs" @click="handleQuizPublish">
              Publish quiz
            </UButton>
          </div>
        </h3>

        <UCard
          v-for="(question, index) in questions"
          :key="`question_${index}`"
          class="mt-6"
        >
          <p>{{ index + 1 }}. {{ question.text }}</p>
          <div class="flex flex-wrap">
            <div
              v-for="(option, i) in question.options"
              class="w-full sm:w-1/2 p-2"
            >
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
          <UButton class="mt-6" size="lg" @click="router.go(0)">
            Reset
          </UButton>
        </UCard>
      </div>
      <div v-else class="flex flex-col items-center justify-center py-16 px-4">
        <img
          src="~/assets/images/decide.svg"
          alt="Cartoon for taking decision"
          class="max-w-full w-[320px]"
        />
        <p class="text-gray-400 mt-8 lg:hidden">
          Add your input above, and wait for the magic...
        </p>
        <p class="text-gray-400 mt-8 hidden lg:block">
          Add your input on the left, and wait for the magic...
        </p>
      </div>
    </div>
    <UModal v-model="showAuthModal" prevent-close>
      <AuthModal
        @auth-cancel="showAuthModal = false"
        @auth-done="handleQuizPublish"
      />
    </UModal>
    <UModal v-model="showQuizModal" prevent-close>
      <CreateQuiz
        :questions="questions"
        :content-id="contentId"
        @quiz-cancel="showQuizModal = false"
      />
    </UModal>
  </UContainer>
</template>
