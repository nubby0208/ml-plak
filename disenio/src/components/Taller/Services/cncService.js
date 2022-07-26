import axios from 'axios'

export default class cncService{
    // endpoint = 'http://168.205.92.138/insertar/api/cnc';
    endpoint = process.env.CNC_BASE_URL;

    async send(cnc, data) {
        let result = await axios.post(this.endpoint + 'api/cnc/?cnc=' +cnc, data);

        return result.data
    }
}
