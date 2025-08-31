import { configure } from 'vee-validate';
import { localize } from '@vee-validate/i18n';
import zh_TW from '@vee-validate/i18n/dist/locale/zh_TW.json';

export function setupVeeValidate() {
    configure({
        generateMessage: localize({
            zh_TW: {
                messages: {
                    ...zh_TW.messages,
                    required: '{field} 不能留空！',
                    email: '{field} 格式不正確！',
                },
                names: {
                    email: '電子信箱',
                    nickname: '暱稱',
                    password: '密碼',
                    confirmPassword: '再次輸入密碼',
                },
            },
        }),
    });

    configure({
        generateMessage: localize('zh_TW'),
    });
}