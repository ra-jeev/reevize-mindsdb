<template>
  <div class="flex p-4 space-x-4">
    <USkeleton class="h-4 w-4" :ui="{ rounded: 'rounded-full' }" />
    <div class="flex flex-col flex-grow space-y-4">
      <USkeleton class="h-4 max-w-[84%]" />
      <div class="flex items-center space-x-4">
        <USkeleton class="h-4 w-[36%]" />
        <USkeleton class="h-4 w-[36%]" />
      </div>
      <div class="flex items-center space-x-4">
        <USkeleton class="h-4 w-[36%]" />
        <USkeleton class="h-4 w-[36%]" />
      </div>
    </div>
  </div>
</template>
