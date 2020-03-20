# Вложенные маршруты

Пользовательский интерфейс реальных приложений обычно представлен многоуровневой иерархией компонентов. Столь же обычно и соответствие сегментов URL некоторой структуре вложенности компонентов, например:

```
/user/foo/profile                     /user/foo/posts
+------------------+                  +-----------------+
| User             |                  | User            |
| +--------------+ |                  | +-------------+ |
| | Profile      | |  +------------>  | | Posts       | |
| |              | |                  | |             | |
| +--------------+ |                  | +-------------+ |
+------------------+                  +-----------------+
```

Используя `vue-router`, мы можем с лёгкостью выразить эти взаимоотношения при помощи вложенных путей.

Рассмотрим созданное в предыдущем разделе приложение:

```html
<div id="app">
  <router-view></router-view>
</div>
```

```js
const User = {
  template: '<div>Пользователь {{ $route.params.id }}</div>'
}

const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User }
  ]
})
```

Здесь `<router-view>` — это точка, в которой будет отображён компонент, соответствующий маршруту верхнего уровня. Аналогичным образом, отображаемый там компонент может и сам содержать вложенный `<router-view>`. Изменим немного шаблон компонента `User`:

```js
const User = {
  template: `
    <div class="user">
      <h2>Пользователь {{ $route.params.id }}</h2>
      <router-view></router-view>
    </div>
  `
}
```

Для отображения компонентов в этой вложенной точке, нам понадобится опция `children` в конфигурации конструктора `VueRouter`:

```js
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User,
      children: [
        {
          // при совпадении пути с шаблоном /user/:id/profile
          // в <router-view> компонента User будет показан UserProfile
          path: 'profile',
          component: UserProfile
        },
        {
          // при совпадении пути с шаблоном /user/:id/posts
          // в <router-view> компонента User будет показан UserPosts
          path: 'posts',
          component: UserPosts
        }
      ]
    }
  ]
})
```

**Обратите внимание, что вложенные пути, начинающиеся с `/`, считаются корневыми. Это позволяет задействовать вложенную структуру компонентов независимо от структуры URL.**

Как вы могли заметить, опция `children` принимает обычный массив объектов конфигурации маршрутов, такой же как и сам `routes`. Таким образом, вложенность путей в теории по глубине ничем не ограничена.

С текущим кодом, если перейти по пути `/user/foo`, внутри компонента `User` ничего не будет отображаться, так как не произойдёт совпадения по второй части пути. Может быть, что-то в таких случаях отобразить всё же захочется — тогда стоит указать пустой путь:

```js
const router = new VueRouter({
  routes: [
    {
      path: '/user/:id', component: User,
      children: [
        // при совпадении пути с шаблоном /user/:id
        // в <router-view> компонента User будет показан UserHome
        { path: '', component: UserHome },

        // ...остальные вложенные маршруты
      ]
    }
  ]
})
```

Рабочую демонстрацию этого примера можно найти [здесь](https://jsfiddle.net/yyx990803/L7hscd8h/).