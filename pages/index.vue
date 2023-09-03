<template>
  <section
    class="bg-cover bg-center bg-image bg-no-repeat bg-gray-500 bg-blend-multiply"
  >
    <div class="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-48">
      <h1
        class="mb-6 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl md:px-16 lg:px-36"
      >
        Create Quizzes from Text or Images. Magically...
      </h1>
      <p
        class="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-56"
      >
        Just enter a prose, or a snapshot of a book's pages, and automagically
        get a set of questions based on that text
      </p>
      <div>
        <UButton
          icon="i-heroicons-arrow-right-solid"
          trailing
          size="xl"
          to="/playground"
        >
          Get started
        </UButton>

        <span class="text-gray-300 ml-4"> It's free! </span>
      </div>
    </div>
  </section>

  <UContainer class="py-14">
    <h2
      class="text-3xl text-center font-bold tracking-tight leading-none text-white md:text-4xl lg:text-5xl"
    >
      Features
    </h2>
    <div class="flex flex-wrap gap-6 justify-center mt-16">
      <UCard class="w-full md:w-1/2 lg:w-1/3">
        <div>
          <UIcon
            name="i-heroicons-bars-3-center-left-20-solid"
            class="text-4xl md:text-5xl lg:text-6xl text-primary-500 dark:text-primary-400"
          />
        </div>
        <h3 class="mt-4 text-lg font-medium text-white md:text-xl lg:text-2xl">
          Create quiz from Prose
        </h3>
        <p class="mt-2 text-md text-gray-300">
          Just paste a prose for which you want to create a quiz, and get the
          same within seconds.
        </p>
      </UCard>
      <UCard class="w-full md:w-1/2 lg:w-1/3">
        <div>
          <UIcon
            name="i-heroicons-book-open-solid"
            class="text-4xl md:text-5xl lg:text-6xl text-primary-500 dark:text-primary-400"
          />
        </div>
        <h3 class="mt-4 text-lg font-medium text-white md:text-xl lg:text-2xl">
          Use snap of book pages
        </h3>
        <p class="mt-2 text-md text-gray-300">
          Or, just use a snap of a book's pages, and automagically get a quiz
          from those pages.
        </p>
      </UCard>
    </div>
  </UContainer>

  <AppFooter />
</template>

<style scoped>
.bg-image {
  background-image: url("~/assets/images/home-page.jpeg");
}
</style>
