export const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '42882343-4100e0711ccee762d89ae20bd';

export const options = {
    params: {
        key: API_KEY,
        q:'',
        image_type:'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: 1,
        per_page: 40,
    },
};