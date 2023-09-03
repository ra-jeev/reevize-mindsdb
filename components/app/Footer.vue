<template>
  <footer class="bg-white border-gray-200 dark:bg-gray-900">
    <UContainer class="flex flex-col items-center justify-between py-3">
      <div>
        Made with ❤️ & coffee, by
        <UButton
          to="https://twitter.com/ra_jeeves"
          target="_blank"
          rel="noreferrer"
          variant="link"
          :padded="false"
        >
          @ra_jeeves
        </UButton>
      </div>
      <div class="mt-1">
        Want to talk?
        <UButton
          variant="link"
          :padded="false"
          to="mailto:i.rarsh@gmail.com?subject=[Ref: FamJars]"
        >
          Email me
        </UButton>
      </div>
    </UContainer>
  </footer>
</template>
