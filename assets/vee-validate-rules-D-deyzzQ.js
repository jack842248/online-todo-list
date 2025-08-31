const o="/online-todo-list/images/img-todo-bg.png";/**
  * vee-validate v4.15.1
  * (c) 2025 Abdelrahman Awad
  * @license MIT
  */function i(r){return!!(r==null||r===""||Array.isArray(r)&&r.length===0)}const t=/^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i,f=r=>i(r)?!0:Array.isArray(r)?r.every(n=>t.test(String(n))):t.test(String(r));function e(r){return r==null}function s(r){return Array.isArray(r)&&r.length===0}const A=r=>e(r)||s(r)||r===!1?!1:!!String(r).trim().length;export{o as _,f as e,A as r};
