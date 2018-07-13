import { mount as _mount } from '@vue/test-utils'
import Vue, { Component } from 'vue'
import Router, { RouteConfig } from 'vue-router'
import { createRouterLayout } from '../src/index'

Vue.config.productionTip = false
Vue.config.devtools = false

Vue.use(Router)

const layouts: Record<string, Component> = {
  default: {
    template: '<div>Default <router-view/></div>'
  },

  foo: {
    template: '<div>Foo <router-view/></div>'
  },

  bar: {
    template: '<div>Bar <router-view/></div>'
  }
}

const RouterLayout = createRouterLayout(layout => {
  return () => Promise.resolve(layouts[layout])
})

async function mount(children: RouteConfig[]) {
  const router = new Router({
    routes: [
      {
        path: '/',
        component: RouterLayout,
        children
      }
    ]
  })

  const Root = Vue.extend({
    template: '<router-view/>'
  })

  const wrapper = _mount(Root, {
    router
  })
  await wrapper.vm.$nextTick()
  return wrapper
}

describe('RouterLayout component', () => {
  it('shows default layout', async () => {
    const Comp = {
      template: '<p>component</p>'
    }

    const wrapper = await mount([
      {
        path: '',
        component: Comp
      }
    ])
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('shows named layout', async () => {
    const Comp = {
      layout: 'foo',
      template: '<p>component</p>'
    }

    const wrapper = await mount([
      {
        path: '',
        component: Comp
      }
    ])
    expect(wrapper.html()).toMatchSnapshot()
  })

  it("uses the leaf component's layout option", async () => {
    const Test1 = {
      layout: 'foo',
      template: '<div>Test1 <router-view/></div>'
    }

    const Test2 = {
      layout: 'bar',
      template: '<p>Test2</p>'
    }

    const wrapper = await mount([
      {
        path: '',
        component: Test1,
        children: [
          {
            path: '',
            component: Test2
          }
        ]
      }
    ])
    expect(wrapper.html()).toMatchSnapshot()
  })
})
