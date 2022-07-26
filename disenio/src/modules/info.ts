import { GeneralInformation } from '../models/models';

export default {
    state: new GeneralInformation(),
    getters: {
        generalSettings: (state: any, getters: any) => ((property: string) => state[property])
    },
    mutations: {
        setGeneralInfo (state: any, payload: any) {
            state[payload.key] = payload.value
        }
    }
}