<template>
  <div class="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/75 z-10">
    <div class="aspect-video w-full max-w-96 bg-white rounded-xl flex flex-col justify-center">
      <div class="text-center">
        <font-awesome-icon v-if="messageModalData.type == 'success'" class="mb-3 text-green-600" icon="fa-regular fa-circle-check" size="2xl"/>
        <font-awesome-icon v-if="messageModalData.type == 'error'" class="mb-3 text-red-600" icon="fa-solid fa-circle-exclamation" size="2xl"/>
        <p class="text-2xl">{{ messageModalData.message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  messageModalData:{
    type: Object,
    required: true
  }
})
</script>