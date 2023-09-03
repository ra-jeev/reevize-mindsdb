<script setup lang="ts">
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const emit = defineEmits(["registerDone"]);

const auth = useFirebaseAuth()!;

const showPassword = ref(false);
const form = ref({ name: "", email: "", password: "" });
const errors = ref({
  name: "",
  email: "",
  password: "",
  form: "",
});
const loading = ref(false);

const onSubmit = async () => {
  const name = form.value.name;
  const email = form.value.email;
  const password = form.value.password;

  errors.value = { name: "", email: "", password: "", form: "" };

  let hasError = false;

  if (!name || name.length < 3) {
    errors.value.name = "Please enter your full name";
    hasError = true;
  }

  if (!email) {
    errors.value.email = "Please enter a valid email address";
    hasError = true;
  }

  if (!password || password.length < 8) {
    errors.value.password = "Password should be minimum 8 characters long";
    hasError = true;
  }

  if (hasError) {
    return;
  }

  loading.value = true;
  try {
    const userCreds = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await $fetch("/api/users", {
      method: "POST",
      body: {
        id: userCreds.user.uid,
        name,
        email,
      },
    });

    emit("registerDone");
  } catch (error) {
    errors.value.form =
      "Failed to create your account. Pleases try again later.";

    console.log(error);
  }

  loading.value = false;
};
</script>

<template>
  <form @submit.prevent="onSubmit">
    <UFormGroup name="name" label="Your name" :error="errors.name" required>
      <UInput
        v-model.trim="form.name"
        placeholder="John Doe"
        icon="i-heroicons-user"
      />
    </UFormGroup>

    <UFormGroup
      name="email"
      label="Your email"
      :error="errors.email"
      class="mt-4"
      required
    >
      <UInput
        v-model.trim="form.email"
        placeholder="you@example.com"
        icon="i-heroicons-envelope"
        type="email"
      />
    </UFormGroup>

    <UFormGroup
      name="password"
      label="Your password"
      :error="errors.password"
      class="mt-4"
      required
    >
      <UInput
        v-model.trim="form.password"
        :type="showPassword ? 'text' : 'password'"
        placeholder="password"
        icon="i-heroicons-key"
        :ui="{ icon: { trailing: { pointer: '' } } }"
      >
        <template #trailing>
          <UButton
            v-if="showPassword"
            icon="i-heroicons-eye-slash-solid"
            :padded="false"
            color="gray"
            variant="link"
            @click="showPassword = false"
          />
          <UButton
            v-else
            icon="i-heroicons-eye-solid"
            :padded="false"
            color="gray"
            variant="link"
            @click="showPassword = true"
          />
        </template>
      </UInput>
    </UFormGroup>

    <UAlert
      v-if="errors.form"
      :title="errors.form"
      icon="i-heroicons-exclamation-triangle-solid"
      color="red"
      variant="subtle"
      class="mt-4"
      :close-button="{
        icon: 'i-heroicons-x-mark-20-solid',
        color: 'red',
        variant: 'link',
      }"
      @close="errors.form = ''"
    />

    <UButton
      class="mt-6"
      block
      :loading="loading"
      :disabled="loading"
      type="submit"
    >
      Create your account
    </UButton>
  </form>
</template>
