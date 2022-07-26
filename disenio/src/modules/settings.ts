import {ProjectSettings} from '../models/models'

export default {
  state: new ProjectSettings(),
  getters: {
    // projectSettings: (state: any, getters: any) => (property: string) => state[property]
  },
  mutations: {
    setProjectSettingsCollapsibles (state: any, payload: any) {
      if (payload.subKey) {
        state.collapsibles[payload.key][payload.subKey] = payload.value
      } else {
        state.collapsibles[payload.key] = payload.value
      }
    }
  }
}
