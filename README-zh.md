易于通过 API 的方式将您的 Vue 组件放入对话框中（适用于 Vue 3.x 和 Vue 2.7+）。

[English]((./README.md)) | 简体中文

## API

`useDialog(options)`:
- `options.component` `{Component}` **必填**。
- `options.props` `{object}` 对应 `options.component` 的 props。
- `options.callback(...args1)` `{function}` 当调用 `useCloseDialog()(...args2)` 时，此函数将被触发。`args1` 来自 `args2`。

## 安装

首先，安装依赖

```bash
npm install @satrong/vue-dialog
```

然后在您的根组件中引入 `DialogSlot` 组件。

_App.vue_:

```js
<script setup>
import { DialogSlot } from '@satrong/vue-dialog'
</script>

<template>
  <div id="app">
    <h1>根组件</h1>
    <DialogSlot />
  </div>
</template>
```

最后，您可以使用 `useDialog` 函数将您的组件插入到对话框中。

_Foo.vue_ 组件:
```html
<template>
  <button @click="add">将 DialogForm 插入根组件</button>
</template>

<script setup>
import { useDialog } from '@satrong/vue-dialog'
import DialogForm from './DialogForm.vue'

useDialog({
  component: DialogForm,
  props: {
    name: 'Vue',
    onSubmit() {
      // 提交后执行某些操作
    }
  },
  callback(a, b) {
    console.log(a, b) // hi, Vue
  }
})
</script>
```

_DialogForm.vue_ 组件:
```html
<template>
  <button @click="close('hi', 'Vue')">点击后将移除此组件</button>
  <button @click="submit">提交</button>
</template>

<script setup>
import { useCloseDialog } from '@satrong/vue-dialog'

const props = defineProps(['name', 'onSubmit'])

const close = useCloseDialog()

function submit() {
  props.onSubmit(props.name)
}
</script>
```