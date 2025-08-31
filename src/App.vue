<template>
    <Transition name="fade">
        <ConfrimModal
            v-if="comfrimModal"
            @modalData="toggleConfrimModal"
            @clearToken="clearToken">
        </ConfrimModal>
    </Transition>

    <Transition name="fade">
        <MessageModal
            v-if="messageModalData.show"
            :messageModalData="messageModalData">
        </MessageModal>
    </Transition>
    
    <router-view
        @modalData="toggleMessageModal"
        @showModal="toggleConfrimModal">
    </router-view>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import MessageModal from '@/components/MessageModal.vue';
import ConfrimModal from '@/components/ConfrimModal.vue';
import { postSignOutData } from '@/api/api';

//訊息彈窗
const messageModalData = ref({
    show: false,
    page: '',
    message: '',
    type:'success'
})
const router = useRouter();
const toggleMessageModal = (data) => {
    messageModalData.value = data;
    if(data.show){
        setTimeout(()=>{
            messageModalData.value.show = false;
            router.push(data.page);
        },1000)
    }
}

//確認彈窗
const comfrimModal = ref(false);
const toggleConfrimModal = (data) => {
    comfrimModal.value = data.show;
    if(data.page){
        router.push(data.page);
    }
}

//登出清除Token
const clearToken = async() => {
    try{
        const signoutRes = await postSignOutData();
        if(signoutRes.data.status){
            comfrimModal.value = false;
            router.push('/');
            //清除cookie
            document.cookie = "todolistToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
            messageModalData.value = {
                show: true,
                page: '/',
                message: signoutRes.data.message,
                type: 'success'
            }
        }
    } catch (error) {
        console.error("伺服器錯誤",error)
        if(error.status){
            messageModalData.value = {
                show: true,
                page: '/todolist',
                message: signoutRes.response.data.message,
                type: 'error'
            }
        }
    } finally {
        setTimeout(()=>{
            messageModalData.value.show = false;
        },1000)
    }
}
</script>