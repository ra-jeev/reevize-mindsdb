<script setup lang="ts">
const props = defineProps({
  quiz: {
    type: Object,
    required: true,
  },
});

const published = ref(props.quiz.published as boolean);
const editMode = ref(false);
const loading = ref(false);

const onEdit = () => {
  if (!editMode.value) {
    editMode.value = true;
  } else {
    published.value = props.quiz.published;
    editMode.value = false;
  }
};

const onSave = async () => {
  if (published.value !== props.quiz.published) {
    loading.value = true;

    const res = await $fetch(`/api/quizzes/${props.quiz.id}`, {
      method: "PATCH",
      body: {
        published: published.value,
      },
    });

    if (res.result?.published) {
      published.value = res.result?.published;
      props.quiz.published = res.result?.published;
    }
  }

  editMode.value = false;
};
</script>

<template>
  <UCard>
    <div class="flex items-center justify-between">
      <UButton
        :to="`/q/${quiz.id}`"
        target="_blank"
        variant="link"
        :padded="false"
        class="text-lg md:text-xl font-medium"
      >
        {{ quiz.name }}
        <UIcon name="i-heroicons-arrow-top-right-on-square-20-solid" />
      </UButton>
      <UButton
        :icon="
          editMode ? 'i-heroicons-x-mark-solid' : 'i-heroicons-pencil-square'
        "
        :disabled="loading"
        size="sm"
        color="gray"
        @click="onEdit"
      />
    </div>

    <p
      v-if="quiz.description"
      class="mt-1 text-sm text-gray-400 dark:text-gray-300"
    >
      {{ quiz.description }}
    </p>

    <div
      class="my-6 flex items-center text-sm text-gray-400 dark:text-gray-300"
    >
      {{ published ? "Published" : "Draft" }}
      <UToggle :disabled="!editMode" class="ml-2" v-model="published" />
    </div>

    <div v-if="!editMode">
      <div v-if="quiz.tags" class="mb-4 flex gap-3">
        <UBadge
          v-for="tag in quiz.tags"
          :key="tag.id"
          :label="tag.name"
          variant="subtle"
        />
      </div>
      <p class="italic text-xs text-gray-500 dark:text-gray-400">
        Last updated {{ formatDateTime(quiz.updatedAt) }}
      </p>
    </div>
    <UButton v-else :loading="loading" :disabled="loading" @click="onSave">
      Save
    </UButton>
  </UCard>
</template>
