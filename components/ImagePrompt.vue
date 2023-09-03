<script setup lang="ts">
import { ref as storageRef, uploadBytes } from "firebase/storage";
import { useFirebaseStorage } from "vuefire";
import type { FormError } from "@nuxthq/ui/dist/runtime/types";

const props = defineProps({
  item: { type: Object, required: true },
  generating: { type: Boolean, default: false },
});

const emit = defineEmits(["generateQuestions"]);
const fileNamePrefix = `reevize/uploads/`;
const loading = ref(false);
const btnText = ref("Generate questions");
const storage = useFirebaseStorage();

const state = ref<{
  files: FileList | null;
  images: string | undefined;
  mcqCount: number | undefined;
  trueCount: number | undefined;
}>({
  files: null,
  images: undefined,
  mcqCount: props.item.mcqCount,
  trueCount: props.item.trueCount,
});

const validate = (state: any): FormError[] => {
  const maxSize = 5 * 1024 * 1024;
  const errors = [];

  if (!state.files || !state.files.length) {
    errors.push({
      path: "images",
      message: "Please select the images containing the text content",
    });
  } else if (state.files.length > props.item.maxImages) {
    errors.push({
      path: "images",
      message: `You can only select ${props.item.maxImages} images at once`,
    });

    state.images = undefined;
    state.files = null;
  }

  if (state.files) {
    for (let i = 0; i < state.files.length; i++) {
      if (state.files[i].size > maxSize) {
        errors.push({
          path: "images",
          message: `Maximum allowed file size is 5MB each`,
        });

        state.images = undefined;
        state.files = null;

        break;
      }
    }
  }

  return errors;
};

const form = ref();
const extractError = ref("");
const {
  public: { extractTextUrl },
} = useRuntimeConfig();

async function submit() {
  if (state.value.files?.length) {
    loading.value = true;
    btnText.value = `Uploading ${
      state.value.files.length === 1 ? "image" : "images"
    }`;

    const uploadPromises = [];
    const date = Date.now();
    const fileNames = [];
    for (const file of state.value.files) {
      const fileName = fileNamePrefix + date + "--" + file.name;
      fileNames.push(fileName);
      const fileRef = storageRef(storage, fileName);
      uploadPromises.push(uploadBytes(fileRef, file));
    }

    const res = await Promise.all(uploadPromises);
    console.log("upload res", res);

    btnText.value = "Extracting text";
    const extractRes = await $fetch<{ image: string; text: string }[]>(
      extractTextUrl,
      {
        method: "POST",
        body: { images: fileNames },
      }
    );

    console.log("extractText res", typeof extractRes);

    let finalText = "";
    for (const res of extractRes) {
      finalText += res.text + "\n\n";
    }

    finalText = finalText.trim();
    if (finalText) {
      if (finalText.length < 500) {
        extractError.value =
          "Extracted text too small to be useful. Please try with another image.";
      } else {
        emit("generateQuestions", {
          text: finalText,
          mcqCount: state.value.mcqCount,
          trueCount: state.value.trueCount,
        });

        btnText.value = "Generate questions";
      }
    } else {
      extractError.value = "Failed to extract text from the image(s).";
    }

    loading.value = false;
  }
}

function filesChanged(args: Event) {
  state.value.files = (args.target as HTMLInputElement).files;
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

      <UFormGroup label="Image file" name="images" hint="Max 5MB" required>
        <UInput
          v-model="state.images"
          accept=".jpg, .jpeg, .png"
          capture="environment"
          type="file"
          required
          :disabled="loading || generating"
          @change="filesChanged"
        />
      </UFormGroup>

      <h4 class="mt-6">Number of questions to generate?</h4>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        This is just suggestive, and the actual output may vary based on the
        content length.
      </p>
      <div class="flex mt-4 gap-4">
        <UFormGroup class="flex-grow" label="MCQ count" name="mcqCount">
          <UInput
            v-model="state.mcqCount"
            type="number"
            :disabled="loading || generating"
          />
        </UFormGroup>
        <UFormGroup class="flex-grow" label="True/False count" name="trueCount">
          <UInput
            v-model="state.trueCount"
            type="number"
            :disabled="loading || generating"
          />
        </UFormGroup>
      </div>

      <UAlert
        v-if="extractError"
        :title="extractError"
        icon="i-heroicons-exclamation-triangle-solid"
        color="red"
        variant="subtle"
        class="mt-6"
        :close-button="{
          icon: 'i-heroicons-x-mark-20-solid',
          color: 'red',
          variant: 'link',
        }"
        @close="extractError = ''"
      />

      <template #footer>
        <UButton
          icon="i-heroicons-beaker"
          :disabled="loading || generating"
          :loading="loading || generating"
          type="submit"
        >
          {{ generating ? "Generating questions" : btnText }}
        </UButton>
      </template>
    </UCard>
  </UForm>
</template>
