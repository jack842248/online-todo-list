<template>
    <div class="container mx-auto">
        <div class="grid md:grid-cols-2 gap-4">
            <div class="hidden ml-auto md:block">
                <img class="max-w-[500px] w-full" src="/images/img-todo-bg.png" alt="待辦事項" />
            </div>
            <div class="flex flex-col justify-center px-10 lg:px-20">
                <img class="w-full max-w-80 mx-auto mb-4 md:hidden" src="/images/logo.svg" alt="LOGO"/>
                <h2 class="text-xl font-medium text-center md:text-left mb-5">註冊帳號</h2>
                <Form @submit="onSubmit">
                    <!-- 信箱 -->
                    <div class="form-group mb-3">
                        <label
                            for="email"
                            class="block text-sm font-medium mb-1">Email
                        </label>
                        <Field
                            id="email"
                            name="email"
                            as="input"
                            type="text"
                            class="w-full bg-white rounded-lg p-2"
                            placeholder="請輸入Email"
                            rules="required|email">
                        </Field>
                        <ErrorMessage
                            name="email"
                            class="text-red-800 text-sm font-medium opacity-50">
                        </ErrorMessage>
                    </div>
                    <!-- 暱稱 -->
                    <div class="form-group mb-3">
                        <label
                            for="nickname"
                            class="block text-sm font-medium mb-1">你的暱稱
                        </label>
                        <Field
                            id="nickname"
                            name="nickname"
                            as="input"
                            type="text"
                            class="w-full bg-white rounded-lg p-2"
                            placeholder="請輸入您的暱稱"
                            rules="required">
                        </Field>
                        <ErrorMessage
                            name="nickname"
                            class="text-red-800 text-sm font-medium opacity-50">
                        </ErrorMessage>
                    </div>
                    <!-- 密碼 -->
                    <div class="form-group mb-3">
                        <label
                            for="password"
                            class="block text-sm font-medium mb-1">密碼
                        </label>
                        <Field
                            id="password"
                            name="password"
                            as="input"
                            type="password"
                            class="w-full bg-white rounded-lg p-2"
                            placeholder="請輸入密碼"
                            rules="required|minLength:6">
                        </Field>
                        <ErrorMessage
                            name="password"
                            class="text-red-800 text-sm font-medium opacity-50">
                        </ErrorMessage>
                    </div>
                    <!-- 再次輸入密碼 -->
                    <div class="form-group mb-3">
                        <label
                            for="confirmPassword"
                            class="block text-sm font-medium mb-1">再次輸入密碼
                        </label>
                        <Field
                            id="confirmPassword"
                            name="confirmPassword"
                            as="input"
                            type="password"
                            class="w-full bg-white rounded-lg p-2"
                            placeholder="請再次輸入密碼"
                            rules="required|confirmed:password">
                        </Field>
                        <ErrorMessage
                            name="confirmPassword"
                            class="text-red-800 text-sm font-medium opacity-50">
                        </ErrorMessage>
                    </div>

                    <button type="submit" class="block mx-auto bg-gray-900 text-white font-medium rounded-lg px-10 py-2 my-6 cursor-pointer">註冊帳號</button>

                    <button type="button" @click="togglePage('/')" class="block mx-auto font-medium my-4 cursor-pointer">登入</button>
                </Form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { Field, Form, ErrorMessage, defineRule } from 'vee-validate';
import { required, email } from '@vee-validate/rules';
import { postSignUpData } from '@/api/api'; 

//引入驗證規則
defineRule('required', required);
defineRule('email', email);
defineRule('minLength', (value, [limit]) => {
    if (value.length < limit) {
        return `密碼長度必須大於 ${limit} 字元`;
    }
    return true;
});
defineRule('confirmed', ( value, params, ctx )=>{
    if(!value){ 
        return '請再次輸入密碼'
    }
    if(value !== ctx.form.password){
        return '密碼不一致'
    }
    return true;
});

const emit = defineEmits(['modalData','showModal']);

//切換頁面
const router = useRouter();
const togglePage = (page) => {
    router.push(page);
};

//點擊"註冊帳號"
const onSubmit = async(formData,{ resetForm }) => {

    try {
        const signupRes = await postSignUpData(formData);
        if (signupRes.data.status) {
            emit('modalData', {
                show: true,
                page: '/',
                message: '註冊成功',
                type: 'success'
            });
        }
    } catch (error) {
        console.error("伺服器錯誤",error);
        if(error.status){
            emit('modalData',{
                show: true,
                page: '/signup',
                message: error.response.data.message,
                type: 'error'
            })
        }
    } finally {
        resetForm();
    }
};
</script>
