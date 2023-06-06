class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=5699ec6c621de86f75f69b143a469dd5';
    _baseOffset = 210;

    getResource = async (url) => {
        let res = await fetch(url);

        if (!res.ok) throw Error(`Could not fetch ${url}, status: ${res.status}`);
        return await res.json();
    }

    getAllCharacters = async (offset = this._baseOffset) => {
        const res = await this.getResource(`${this._apiBase}characters?limit=12&offset=${offset}&${this._apiKey}`);
        return res.data.results.map(this._transformCharacter);
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?&${this._apiKey}`);
        return this._transformCharacter(res.data.results[0]);
    }

    _transformCharacter = (res) => {
        return {
            name: res.name,
            description: res.description,
            thumbnail: res.thumbnail.path + '.' + res.thumbnail.extension,
            homepage: res.urls[0].url,
            wiki: res.urls[1].url,
            id: res.id,
            comics: res.comics.items
        }
    }

    _transformComic = (res) => {
        return {
            title: res.title,
            thumbnail: res.thumbnail.path + '.' + res.thumbnail.extension,
            price: res.prices[0].price,
            id: res.id
        }
    }

    getAllComics = async (offset = this._baseOffset) => {
        const res = await this.getResource(`${this._apiBase}comics?limit=12&offset=${offset}&${this._apiKey}`);
        return res.data.results.map(this._transformComic);
    }

    getComic = async (id) => {
        const res = await this.getResource(`${this._apiBase}comics/${id}?&${this._apiKey}`);
        return this._transformCoimic(res.data.results[0]);
    }
}


export default MarvelService; 