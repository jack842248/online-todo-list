<template>
    <div class="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/75 z-10">
        <div class="aspect-video w-full max-w-96 bg-white rounded-xl flex flex-col justify-center">
            <div class="text-center mb-5">
                <p class="text-2xl">確認是否要登出？</p>
            </div>
            <div class="flex gap-3 mx-auto">
                <button
                    type="button"
                    class="bg-gray-300 rounded px-10 py-2 hover:cursor-pointer"
                    @click="cancelModal">取消
                </button>
                <button 
                    type="button"
                    class="bg-main-900 rounded px-10 py-2 hover:cursor-pointer"
                    @click="confrimModal">確認
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
const emit = defineEmits(['modalData','clearToken']);

//點擊'取消'
const cancelModal = () => {
    emit('modalData',{
        show: false
    })
}

//點擊'確認'
const confrimModal = () => {
    emit('clearToken');
}
</script>