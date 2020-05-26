/**
 * Create a basic component with common options
 */
import '../../locale';
import { isFunction } from '..';
import { camelize } from '../format/string';
import { SlotsMixin } from '../../mixins/slots';
import Vue from 'vue';

function install(Vue) {
  var name = this.name;
  // console.log("this_install--->", this)
  Vue.component(name, this);
  Vue.component(camelize("-" + name), this);
} // unify slots & scopedSlots


export function unifySlots(context) {
  // use data.scopedSlots in lower Vue version
  var scopedSlots = context.scopedSlots || context.data.scopedSlots || {};
  var slots = context.slots();
  Object.keys(slots).forEach(function (key) {
    if (!scopedSlots[key]) {
      scopedSlots[key] = function () {
        return slots[key];
      };
    }
  });
  return scopedSlots;
} // should be removed after Vue 3

function transformFunctionComponent(pure) {
  return {
    functional: true,
    props: pure.props,
    model: pure.model,
    render: function render(h, context) {
      return pure(h, context.props, unifySlots(context), context);
    }
  };
}
/*
1. createComponent
createComponent方法根据参数name，创建一个vue组件。
*/
export function createComponent(name) {
  // sfc参数是调用createComponent参数时传的值 支持两种格式，对象式组件或者函数式组件
  return function (sfc) {
    if (isFunction(sfc)) { //// 这里判断是否是函数式组件，如是转换为对象式组件
      sfc = transformFunctionComponent(sfc);
    }

    if (!sfc.functional) {
      //mixins是vue自带的，算是一种组件可复用的一些功能组合。
      // 当组件使用混入对象时，所有混入对象的选项将被混入该组件本身的选项。
      sfc.mixins = sfc.mixins || [];
      //  push了一个兼容低版本scopedSlots的mixin
      sfc.mixins.push(SlotsMixin);
    }

    sfc.name = name;
    // install中调用了vue.compoent注册组件的方法
    sfc.install = install;
    return sfc;
  };
}