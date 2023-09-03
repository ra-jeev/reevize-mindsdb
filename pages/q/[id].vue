<script setup lang="ts">
const router = useRouter();
const route = useRoute();
const choicePrefixes = ["a).", "b).", "c).", "d)."];
const showAnswers = ref(false);
const questions = ref<QuizQuestion[]>([]);
const { data, pending } = await useFetch(`/api/quizzes/${route.params.id}`);

const quiz = data.value?.result;
if (quiz) {
  quiz.questions.forEach((question: any) => {
    const options: Option[] = [];

    for (const [i, option] of question.options.entries()) {
      options.push({
        label: `${choicePrefixes[i]} ${option}`,
        name: option,
        value: option,
      });
    }

    questions.value.push({ ...question, selected: "", options });
  });
}

const onBtnClick = () => {
  if (!showAnswers.value) {
    showAnswers.value = true;
  } else {
    router.go(0);
  }
};
</script>

<template>
  <UContainer class="pb-12">
    <UCard v-if="pending" class="text-center mt-12">Getting the quiz...</UCard>
    <div v-else-if="quiz && questions.length">
      <UCard class="mt-6" :ui="{ body: { padding: 'p-4' } }">
        <h2
          class="text-xl md:text-3xl font-semibold text-gray-900 dark:text-white text-center"
        >
          {{ quiz.name }}
        </h2>
      </UCard>
      <UCard
        v-for="(question, index) in questions"
        :key="`question_${index}`"
        class="mt-6"
      >
        <p>{{ index + 1 }}. {{ question.text }}</p>
        <div class="flex flex-col gap-2 pl-4 pt-3">
          <URadio
            v-for="(option, i) in question.options"
            :key="`option-${index}${i}`"
            v-model="question.selected"
            v-bind="option"
            :disabled="showAnswers"
          />
        </div>

        <template v-if="showAnswers">
          <p class="mt-4 flex items-center">
            <UIcon
              :name="`${
                question.selected === question.answer
                  ? 'i-heroicons-check-circle-20-solid'
                  : 'i-heroicons-x-circle-20-solid'
              }`"
              :class="`${
                question.selected === question.answer
                  ? 'text-green-500 dark:text-green-400'
                  : 'text-red-500 dark:text-red-400'
              }`"
              class="text-2xl"
            />
            <span class="ml-2">
              {{
                question.selected === question.answer
                  ? "You got it right."
                  : "Uh-oh! Wrong answer."
              }}
            </span>
          </p>
          <p class="mt-2">
            <span class="text-gray-500 dark:text-gray-400 text-sm">
              Correct answer:
            </span>
            {{ question.answer }}
          </p>
        </template>
      </UCard>
      <UButton class="mt-4" @click="onBtnClick">
        {{ showAnswers ? "Reset quiz" : "Submit answers" }}
      </UButton>
    </div>
    <UCard v-else class="mt-12"> No such quiz</UCard>
  </UContainer>
</template>
