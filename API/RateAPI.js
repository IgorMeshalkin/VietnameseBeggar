import axios from 'axios';

const REST_URL = "https://www.cbr-xml-daily.ru/daily_json.js";
export default class RateAPI {

    static async get() {
        const response = await axios.get(REST_URL);
        return response
    }
}