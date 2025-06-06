import {
  getCurrentInstance,
  defineComponent, h, shallowRef, triggerRef
} from 'vue'
import type { PropType, VNode, Component, ComponentInternalInstance } from 'vue'
import { DialogOptions, Callback, CloseDialogOptions } from './index.d'
import { omit } from './helper'

const CMP_NAME = 'satrong-vue-dialog'
const list = shallowRef([] as VNode[])
const cbMap = new WeakMap<VNode, Callback>()
let defaultContainerComponent: Component | undefined

const onClose = (vnode: VNode) => {
  return (...args: any[]) => {
    const index = list.value.indexOf(vnode)
    list.value.splice(index, 1)
    triggerRef(list)

    if (cbMap.has(vnode)) {
      cbMap.get(vnode)?.(...args)
      cbMap.delete(vnode)
    }
  }
}

export function useDialog (options: DialogOptions, container = defaultContainerComponent) {
  let itemVNode: VNode

  options.component.inheritAttrs = true
  const child = h(options.component as any, {
    ...options.props,
    key: Math.random()
  })

  if (container) {
    itemVNode = h(container as any, {
      ...omit(options, ['component', 'props', 'callback']),
      onClose: (...args: any[]) => {
        onClose(itemVNode)(...args)
      }
    }, {
      default: () => child
    })
    list.value.push(itemVNode)
  } else {
    itemVNode = child
    list.value.push(child)
  }

  if (typeof options.callback === 'function') {
    cbMap.set(itemVNode, options.callback)
  }

  triggerRef(list)

  return onClose(itemVNode)
}

export function useCloseDialog (options: CloseDialogOptions = { immediate: false }) {
  const instance = getCurrentInstance()

  const tryClose = (...args: any[]) => {
    if (instance) {
      const container = getCurrentContainer(instance)
      if (!options.immediate && typeof container?.exposed?.close === 'function') {
        container.exposed.close(...args)
      } else {
        onClose(instance.vnode)(...args)
      }
      return true
    }
    return false
  }

  return tryClose
}

function getCurrentContainer (instance: ComponentInternalInstance) {
  let prev = instance
  let p = instance.parent
  while (p) {
    if (p.type.name === CMP_NAME) {
      return prev
    }
    prev = p
    p = p.parent
  }
  return null
}

export const DialogSlot = defineComponent({
  name: CMP_NAME,
  props: {
    container: Object as PropType<Component>
  },
  setup (props) {
    defaultContainerComponent = props.container

    return () => list.value.map(el => h(el))
  }
})
