<script setup lang="ts">
import { signInWithEmailAndPassword } from "firebase/auth";

const emit = defineEmits(["loginDone"]);

const auth = useFirebaseAuth()!;

const showPassword = ref(false);
const form = ref({ email: "", password: "" });
const errors = ref({ email: "", password: "", form: "" });
const loading = ref(false);

const onSubmit = async () => {
  const email = form.value.email;
  const password = form.value.password;

  errors.value = { email: "", password: "", form: "" };

  let hasError = false;

  if (!email) {
    errors.value.email = "Please enter a valid email address";
    hasError = true;
  }

  if (!password || password.length < 8) {
    errors.value.password = "Password should at least be 8 characters";
    hasError = true;
  }

  if (hasError) {
    return;
  }

  loading.value = true;
  try {
    await signInWithEmailAndPassword(auth, email, password);

    emit("loginDone");
  } catch (error) {
    errors.value.form = "Failed to sign in. Pleases try again later.";
  }

  loading.value = false;
};
</script>

<template>
  <form @submit.prevent="onSubmit">
    <UFormGroup name="email" label="Your email" :error="errors.email" required>
      <UInput
        v-model="form.email"
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
      Log in
    </UButton>
  </form>
</template>
