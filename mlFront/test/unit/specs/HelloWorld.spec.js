import Vue from 'vue'
import MlPlakIndex from '@/components/MlPlakIndex'

describe('MlPlakIndex.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(MlPlakIndex)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.mlPlak-background h1').textContent)
      .toEqual('ML PLAK')
  })
})
