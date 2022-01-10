import 'regenerator-runtime/runtime';
const axios = require('axios');
const API_KEY = '25175816-a3b0e6224fe7d6836881efcec';
const API_URL = 'https://pixabay.com/api/';

export default class PixabayAPI {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
  }

  async search() {
    const SEARCH_URL = `${API_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;

    try {
      const request = await axios.get(SEARCH_URL);
      this.page += 1;
      return request.data;
    } catch (error) {
      return error;
    }
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  reset() {
    this.page = 1;
  }
}
