<script setup lang="ts">
defineEmits(["authCancel", "authDone"]);

const items = [
  { slot: "login", label: "Login", description: "Log in to your account" },
  {
    slot: "register",
    label: "Register",
    description: "Register a new account",
  },
];

const loading = ref(false);
</script>

<template>
  <UCard>
    <UTabs :items="items">
      <template #login="{ item }">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ item.description }}
        </p>
        <Login class="mt-4" @login-done="$emit('authDone')" />
      </template>
      <template #register="{ item }">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ item.description }}
        </p>
        <Register class="mt-4" @register-done="$emit('authDone')" />
      </template>
    </UTabs>
    <UButton
      class="mt-4"
      variant="soft"
      block
      :disabled="loading"
      @click="$emit('authCancel')"
    >
      Cancel
    </UButton>
  </UCard>
</template>
