<script setup lang="ts">
import type { FormError } from "@nuxthq/ui/dist/runtime/types";

const props = defineProps({
  questions: {
    type: Array,
    required: true,
  },
  contentId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["quizCancel", "quizCreated"]);

const form = ref();
const loading = ref(false);
const state = ref({
  publish: true,
  name: "",
  description: "",
  tags: "",
});

const validate = (state: any): FormError[] => {
  const errors = [];

  if (!state.name) {
    errors.push({ path: "name", message: "Quiz name is required" });
  } else if (state.name.length < 3) {
    errors.push({ path: "name", message: "Quiz name is too short" });
  }

  return errors;
};

const submit = async () => {
  loading.value = true;

  const tags = state.value.tags.split(",").map((tag) => tag.trim());

  try {
    const res = await $fetch("/api/quizzes", {
      method: "POST",
      body: {
        questions: props.questions,
        contentId: props.contentId,
        published: state.value.publish,
        name: state.value.name,
        description: state.value.description,
        tags: tags,
      },
    });

    console.log("quiz creation res", res);
    navigateTo(`/q/${res.result.id}`);
  } catch (error) {
    console.log("failed to create quiz", error);
  }

  loading.value = false;
};
</script>

<template>
  <UCard>
    <UForm
      ref="form"
      :validate="validate"
      :state="state"
      @submit.prevent="submit"
    >
      <div class="flex items-center justify-between">
        <span class="text-lg md:text-xl"> Create quiz </span>
        <div class="flex items-center">
          Publish <UToggle class="ml-2" v-model="state.publish" />
        </div>
      </div>
      <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Use the generated questions to create a quiz and share it with others.
      </p>
      <UFormGroup class="mt-4" name="name" label="Name" required>
        <UInput
          v-model.trim="state.name"
          placeholder="e.g. English quiz"
          icon="i-heroicons-book-open"
        />
      </UFormGroup>

      <UFormGroup
        class="mt-4"
        name="description"
        label="Description"
        hint="Optional"
      >
        <UTextarea
          v-model.trim="state.description"
          placeholder="Description of the quiz"
          icon="i-heroicons-bars-3-center-left-20-solid"
          :rows="2"
        />
      </UFormGroup>

      <UFormGroup class="mt-4" name="tags" label="Quiz tags" hint="Optional">
        <UInput
          v-model.trim="state.tags"
          placeholder="Comma separated tags (e.g. Grade 5, English)"
          icon="i-heroicons-rectangle-group-20-solid"
        />
      </UFormGroup>

      <div class="flex mt-6 gap-4">
        <UButton
          :disabled="loading"
          class="flex-grow justify-center"
          variant="outline"
          @click="$emit('quizCancel')"
        >
          Cancel
        </UButton>
        <UButton
          :loading="loading"
          :disabled="loading"
          class="flex-grow justify-center"
          type="submit"
        >
          {{ state.publish ? "Publish quiz" : "Save draft" }}
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>
