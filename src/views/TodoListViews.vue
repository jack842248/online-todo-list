<template>
    <Transition name="fade">
        <Loading v-if="isloading"></Loading>
    </Transition>
    <div class="fixed top-70 left-0 right-0 -bottom-50 md:bg-white -skew-y-10 z-0"></div>
    <div class="absolute container top-0 z-1">
        <header class="mb-10 sm:mx-0 py-3">
            <nav class="flex items-center mx-5">
                <img src="/images/logo.svg" alt="LOGO"/>
                <div class="ml-auto flex">
                    <p class="font-bold hidden sm:block mr-3">{{ userName }}的代辦</p>
                    <button
                        @click="signOut"
                        class="hover:cursor-pointer hover:text-white">登出
                    </button>
                </div>
            </nav>
        </header>
        <main class="mx-8  sm:mx-auto max-w-2xl">
            <!-- 輸入區塊 -->
            <form @submit.prevent="addTodo">
                <div class="flex bg-white shadow-md rounded-xl p-1 mb-5">
                    <input
                        type="text"
                        class="grow px-2 focus:outline-0"
                        placeholder="新增待辦事項"
                        v-model="newTodo"
                        :disabled="isloading"
                    />
                    <button
                        type="submit"
                        class="bg-black text-white w-10 h-10 rounded-xl hover:cursor-pointer hover:bg-main-900"
                        :disabled="isloading"
                    >
                        <font-awesome-icon icon="fa-solid fa-plus" size="lg" />
                    </button>
                </div>
            </form>
            <!-- 有資料 -->
            <template v-if="todoData.length">
                <!-- 切換區塊 -->
                <nav class="flex bg-white shadow-md rounded-t-xl">
                    <button
                        class="todo-tab text-neutral-500 text-sm font-medium grow py-4 border-b-3 border-neutral-200 hover:cursor-pointer hover:text-main-900"
                        :class="{'active': selectNav === 'all'}"
                        @click="selectNav = 'all'">全部
                    </button>
                    <button
                        class="todo-tab text-neutral-500 text-sm font-medium grow py-4 border-b-3 border-neutral-200 hover:cursor-pointer hover:text-main-900"
                        :class="{'active': selectNav === 'incomplete'}"
                        @click="selectNav = 'incomplete'">待完成
                    </button>
                    <button
                        class="todo-tab text-neutral-500 text-sm font-medium grow py-4 border-b-3 border-neutral-200 hover:cursor-pointer hover:text-main-900"
                        :class="{'active': selectNav === 'completed'}"
                        @click="selectNav = 'completed'">已完成
                    </button>
                </nav>
                <!-- 顯示區塊 -->
                <ul class="bg-white shadow-md p-3">
                    <li
                        v-for="item in filterData" :key="item" class="flex items-center"
                        @mouseenter="item.showCross = true"
                        @mouseleave="item.showCross = false">
                        <div
                            class="todo-checkbox flex items-center grow border-b-1 border-neutral-200">
                            <input
                                :id="item.id"
                                type="checkbox"
                                class="hidden"
                                :checked="item.status"
                                @change="toggleStatus(item)">
                            <label
                                :for="item.id"
                                class="w-full p-3 hover:cursor-pointer">
                                <font-awesome-icon class="text-main-900" icon="fa-solid fa-check"/>
                                <span class="ml-2">{{ item.content }}</span>
                            </label>
                        </div>
                        <button
                            v-if="item.showCross"
                            @click="removeTodo(item)"
                            class="w-8 h-8rounded hover:text-main-900 hover:cursor-pointer">
                            <font-awesome-icon icon="fa-solid fa-xmark"/>
                        </button>
                    </li>
                </ul>
                <!-- 顯示數量 -->
                <div class="bg-white shadow-md rounded-b-xl pt-2 pb-4 px-3">
                    <p class="text-neutral-900 text-sm">{{ autoCalc }} 個待完成項目</p>
                </div>
            </template>
            <!-- 無資料 -->
            <template v-else>
                <div class="text-center">
                    <p class="mb-5">目前尚無待辦事項</p>
                    <img class="mx-auto max-w-[240px]" src="/images/img-nodata-bg.png" alt="無資料">
                </div>
            </template>
        </main>
    </div>
</template>

<script setup>
import { ref ,computed, onMounted } from 'vue';
import Loading from '@/components/Loading.vue';
import { getToken, getUserData, getTodo, postTodo, deleteTodo, patchTodo } from '@/api/api';

const emit = defineEmits(['modalData','showModal']);

//讀取中
const isloading = ref(false);

//Todo初始資料
const todoData = ref(['']);

//使用者暱稱
const userName = ref('');

//新輸入的Todo
const newTodo = ref('');

//頁籤初始值
const selectNav = ref("all");

//驗證Token
onMounted( async() => {
    const token = getToken();
    if(!token) {
        emit('modalData',{
            show: true,
            page: '/',
            message: '請重新登入',
            type: 'error'
        });
        return;
    }
    isloading.value = true;
    try {
        const userData = await getUserData();
        userName.value = userData.data.nickname;
        const newData = await getTodo();
        if(newData.data.status){
            todoData.value = newData.data.data;
        }else{
            emit('modalData',{
                show: true,
                page: '/',
                message: newData.response.data.message,
                type: 'error'
            })
        }
    } catch (error) {
        console.error("伺服器錯誤",error)
    } finally {
        isloading.value = false;
    }
})

//切換"頁籤"狀態
const filterData = computed(()=>{
    switch(selectNav.value){
        case "all":
            return todoData.value
        case "incomplete":
            return todoData.value.filter((item) => { return !item.status })
        case "completed":
            return todoData.value.filter((item) => { return item.status })
    }
})

//計算待完成項目
const autoCalc = computed(()=>{
    return todoData.value.filter((item) => { return !item.status }).length
})

//新增Todo
const addTodo = async() => {
    if(!newTodo.value.trim() || isloading.value){ return }
    isloading.value = true;
    try {
        const postRes = await postTodo(newTodo.value);
        if(postRes.data.status){
            todoData.value.push(postRes.data.newTodo);
        }else{
            emit('modalData',{
                show: true,
                page: '/',
                message: postRes.response.data.message,
                type: 'error'
            })
        }
    } catch (error) {
        console.error("伺服器錯誤",error)
    } finally {
        isloading.value = false;
        newTodo.value = '';
    }
}

//刪除Todo
const removeTodo = async(item) => {
    isloading.value = true;
    try {
        const deleteRes = await deleteTodo(item);
        if(deleteRes.data.status){
            const newTodoData = await getTodo();
            todoData.value = newTodoData.data.data;
        }else{
            emit('modalData',{
                show: true,
                page: '/',
                message: deleteRes.response.data.message,
                type: 'error'
            })
        }
    } catch(error) {
        console.error("伺服器錯誤",error)
    } finally {
        isloading.value = false;
    }
}

//切換Todo狀態
const toggleStatus = async(item) => {
    isloading.value = true;
    try{
        const patchRes = await patchTodo(item);
        if(patchRes.data.status){
            item.status = !item.status;
        }
    } catch (error) {
        console.error("伺服器錯誤",error)
        if(error.status){
            emit('modalData',{
                show: true,
                page: '/',
                message: patchRes.response.data.message,
                type: 'error'
            })
        }
        
    } finally {
        isloading.value = false;
    }
}

//登出
const signOut = () => {
    emit('showModal',{
        show: true
    });
}
</script>