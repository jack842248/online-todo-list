<template>
    <div class="container mx-auto">
        <div class="grid md:grid-cols-2 gap-4">
            <div class="hidden ml-auto md:block">
                <img class="max-w-[500px] w-full" src="/images/img-todo-bg.png" alt="待辦事項" />
            </div>
            <div class="flex flex-col justify-center px-10 lg:px-20">
                <img class="w-full max-w-80 mx-auto mb-4 md:hidden" src="/images/logo.svg" alt="LOGO"/>
                <h2 class="text-xl font-medium text-center md:text-left mb-5">最實用的線上代辦事項服務</h2>
                <Form @submit="onSubmit">
                    <div class="form-group mb-4">
                        <label for="email" class="block text-sm font-medium mb-1">Email</label>
                        <Field
                            id="email"
                            name="email"
                            as="input"
                            type="text"
                            class="w-full bg-white rounded-lg p-2"
                            placeholder="請輸入Email"
                            rules="required|email">
                        </Field>
                        <ErrorMessage name="email" class="text-red-800 text-sm font-medium opacity-50"></ErrorMessage>
                    </div>

                    <div class="form-group mb-4">
                        <label for="password" class="block text-sm font-medium mb-1">密碼</label>
                        <Field id="password" name="password" as="input" type="password" class="w-full bg-white rounded-lg p-2 mb-2" placeholder="請輸入密碼" rules="required|minLength:6"></Field>
                        <ErrorMessage name="password" class="text-red-800 text-sm font-medium opacity-50"></ErrorMessage>
                    </div>

                    <button type="submit" class="block mx-auto bg-gray-900 text-white font-medium rounded-lg px-10 py-2 my-6 cursor-pointer">登入</button>

                    <button type="button" @click="togglePage('/signup')" class="block mx-auto font-medium my-4 cursor-pointer">註冊帳號</button>
                </Form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Field, Form, ErrorMessage, defineRule } from 'vee-validate';
import { required, email } from '@vee-validate/rules';
import { getToken, getUserData, postSignInData } from '@/api/api';

//引入驗證規則
defineRule('required', required);
defineRule('email', email);
defineRule('minLength', (value, [limit]) => {
    if (value.length < limit) {
        return `密碼長度必須大於 ${limit} 字元`;
    }
    return true;
});
const emit = defineEmits(['modalData','showModal']);

//驗證token
onMounted( async() => {
    const token = getToken();
    if(!token) { return; }
    try{
        const userData = await getUserData();
        if(userData.data.status){
            emit('modalData',{
                show: true,
                page: '/todolist',
                message: '您已登入',
                type: 'success'
            })
        }else{
            emit('modalData',{
                show: true,
                page: '/',
                message: '請重新登入',
                type: 'error'
            })
        }
    } catch(error) {
        console.error("伺服器錯誤",error);
    }
});

//切換頁面
const router = useRouter();
const togglePage = (page) => {
    router.push(page);
};

//點擊"登入"
const onSubmit = async (fromData,{ resetForm }) => {
    try {
        const signinRes = await postSignInData(fromData);
        if (signinRes.data.status) {
            //cookie儲存token
            document.cookie = `todolistToken=${signinRes.data.token};path=/`;
            emit('modalData',{
                show: true,
                page: '/todolist',
                message: '登入成功',
                type: 'success'
            });
        }
    } catch (error) {
        console.error("伺服器錯誤", error);
        switch (error.response.status) {
            case 400:
            case 401:
            case 404:
                emit('modalData', {
                    show: true,
                    page: '/',
                    message: error.response.data.message,
                    type: 'error'
                });
                break;
        }
    } finally {
        resetForm();
    }
};
</script>
