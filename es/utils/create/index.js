import { createBEM } from './bem';
import { createComponent } from './component';
import { createI18N } from './i18n';
/*
在vant源码中，utils中封装了很多工具和方法。涉及了ts，tsx，js，vue等技术栈。

每个组件在一开是都会调用createNamespace函数，它接收参数(name)，
返回createComponent, createBEM, createI18N三个函数。
即comonent实例，css帮助类函数，以及多语言工具。
*/
export function createNamespace(name) {
  // console.log("1.createNamespace:", name)
  name = 'van-' + name;
  return [createComponent(name), createBEM(name), createI18N(name)];
}