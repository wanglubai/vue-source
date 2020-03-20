/* @flow */

import type Watcher from "./watcher";
import { remove } from "../util/index";
import config from "../config";

let uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
export default class Dep {
  //静态 观察者
  static target: ?Watcher;
  //计数器
  id: number;
  //观察者列表
  subs: Array<Watcher>;

  constructor() {
    this.id = uid++;
    this.subs = [];
  }

  //观察者列表注入观察者
  addSub(sub: Watcher) {
    this.subs.push(sub);
  }

  //观察者列表移除观察者
  removeSub(sub: Watcher) {
    remove(this.subs, sub);
  }

  //当前观察者依赖注入dep实例
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }

  //触发通知
  notify() {
    // stabilize the subscriber list first
    const subs = this.subs.slice();
    //-----------------????????----------------
    //-----------------？？？？？----------------
    if (process.env.NODE_ENV !== "production" && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id);
    }
    //遍历观察者->通知
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  }
}

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
Dep.target = null;
const targetStack = [];

export function pushTarget(target: ?Watcher) {
  targetStack.push(target);
  Dep.target = target;
}

export function popTarget() {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
}
