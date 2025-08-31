import App from './App.vue';
import { createApp } from 'vue'
import './style.css'
import router from './router/index.js';

/* 引入fontawesome核心 */
import { library } from '@fortawesome/fontawesome-svg-core'

/* 引入fontawesomem元件 */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* 選擇添加資料庫中的圖示 */
import { faPencil, faPlus, faXmark, faCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';

library.add(faPencil, faCircleCheck, faPlus, faXmark, faCheck, faCircleExclamation);

/* 設定驗證語系 */
import { setupVeeValidate } from './plugins/vee-validate';
setupVeeValidate();

const app = createApp(App)
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')


