Easy to place your vue components into dialog using the API (Works with Vue 3.x and Vue 2.7+).

English | [简体中文](./README-zh.md)

## API

`useDialog(options)`:
- `options.component` `{Component}` **required**. 
- `options.props` `{object}` Corresponds to `options.component`'s props.
- `options.callback(...args1)` `{function}` When exec `useCloseDialog()(...args2)` this function will be fired. The `args1` is from `args2`

## Install

First, install dependencies

```bash
npm install @satrong/vue-dialog
```

And then import the `DialogSlot` component in your root component.

_App.vue_:

```js
<script setup>
import { DialogSlot } from '@satrong/vue-dialog'
</script>

<template>
  <div id="app">
    <h1>Root component</h1>
    <DialogSlot />
  </div>
</template>
```

Finally, you can use the `useDialog` function to insert your component into the dialog.

_Foo.vue_ component:
```html
<template>
  <button @click="add">insert DialogForm to root component</button>
</template>

<script setup>
import { useDialog } from '@satrong/vue-dialog'
import DialogForm from './DialogForm.vue'

useDialog({
  component: DialogForm,
  props: {
    name: 'Vue',
    onSubmit() {
      // do something after submit
    }
  },
  callback(a, b) {
    console.log(a, b) // hi, Vue
  }
})
</script>
```

_DialogForm.vue_ component:
```html
<template>
  <button @click="close('hi')">will remove this component after click</button>
  <button @click="submit">submit</button>
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
