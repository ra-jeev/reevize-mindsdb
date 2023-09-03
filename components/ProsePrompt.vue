<script setup lang="ts">
import type { FormError } from "@nuxthq/ui/dist/runtime/types";

const emit = defineEmits(["generateQuestions"]);
const props = defineProps({
  item: { type: Object, required: true },
  generating: { type: Boolean, default: false },
});

const state = ref({
  prose: undefined,
  mcqCount: props.item.mcqCount,
  trueCount: props.item.trueCount,
});

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.prose) {
    errors.push({ path: "prose", message: "Please enter the starting prose." });
  } else if (state.prose.length < 500) {
    errors.push({ path: "prose", message: "Starting prose too short." });
  } else if (state.prose.length > props.item.maxLength) {
    errors.push({
      path: "prose",
      message: "Starting prose too big. Maximum 4096 characters are allowed.",
    });
  }

  return errors;
};

const form = ref();

async function submit() {
  emit("generateQuestions", {
    text: state.value.prose,
    mcqCount: state.value.mcqCount,
    trueCount: state.value.trueCount,
  });
}
</script>

<template>
  <UForm
    ref="form"
    :validate="validate"
    :state="state"
    @submit.prevent="submit"
  >
    <UCard>
      <template #header>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ item.description }}
        </p>
      </template>

      <UFormGroup label="Prose input" name="prose" required>
        <UTextarea
          v-model="state.prose"
          placeholder="Enter the input prose"
          :rows="6"
          :disabled="generating"
          required
        />
      </UFormGroup>

      <h4 class="mt-4">Number of questions to generate?</h4>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        This is just suggestive, and the actual output may vary based on the
        content length.
      </p>
      <div class="flex mt-4 gap-4">
        <UFormGroup class="flex-grow" label="MCQ count" name="mcqCount">
          <UInput
            v-model="state.mcqCount"
            type="number"
            :disabled="generating"
          />
        </UFormGroup>
        <UFormGroup class="flex-grow" label="True/False count" name="trueCount">
          <UInput
            v-model="state.trueCount"
            type="number"
            :disabled="generating"
          />
        </UFormGroup>
      </div>

      <template #footer>
        <UButton
          icon="i-heroicons-beaker"
          type="submit"
          :loading="generating"
          :disabled="generating"
        >
          {{ generating ? "Generating questions" : "Generate questions" }}
        </UButton>
      </template>
    </UCard>
  </UForm>
</template>
