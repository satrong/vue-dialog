import type { Component, DefineComponent } from 'vue'

type BaseProps = InstanceType<DefineComponent>['$props']

export type Callback = (...args: any[]) => void;

export interface DialogOptions<T extends abstract new (...args: any) => any = DefineComponent> extends Record<string, any> {
  component: T;
  /** transfer to components's `props` */
  props?: Omit<InstanceType<T>['$props'], keyof BaseProps>;
  /** callback after dialog closed */
  callback?: Callback;
}

type Fn = () => void
declare function useDialog<T extends abstract new (...args: any) => any>(options: DialogOptions<T>, containerComponent?: Component): Fn;

type tryClose = (...args: any[]) => void
declare function useCloseDialog(): tryClose;

declare const DialogSlot: DefineComponent<{ container: Component }>

export { DialogSlot, useDialog, useCloseDialog }
