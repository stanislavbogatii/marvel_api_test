import './comicsList.scss';
import MarvelService from '../../services/MarvelService';
import { Component } from 'react/cjs/react.production.min';
import Spinner from '../spinner/spiner';
import ErrorMessage from '../errorMessage/errorMessage';

class ComicsList extends Component {

    state = {
        comics: [],
        loading: true,
        singleLoading: false,
        error: false,
        offset: 0,
        ended: false
    }

    marvelService = new MarvelService()

    handleScroll = () => {
        const contentHeight = document.body.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        if (scrollPosition + windowHeight >= contentHeight) {
            this.onRequest(this.state.offset);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
    }

    componentDidMount() {
        this.onRequest(this.state.offset)
    }

    onLoaded = () => {
        this.setState({
            singleLoading: true
        })
        window.removeEventListener('scroll', this.handleScroll);
    }

    onLoadedComics = (newComics) => {
        window.addEventListener('scroll', this.handleScroll);
        let ended = false;
        if (newComics.length < 12) {
            ended = true
        }

        this.setState(({offset, comics}) => ({
            comics: [...comics, ...newComics],
            singleLoading: false,
            loading: false,
            offset: offset + 12,
            ended: ended
        }))
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    onRequest = (offset) => {
        this.onLoaded()
        this.marvelService.getAllComics(offset)
        .then(this.onLoadedComics)
        .catch(this.onError)
    }

    onFocusItem = (item) => {
        item.preventDefault()
    }

    renderItems = (comicsList) => {
        const comics = comicsList.map((item, i) => {
            const {title, price, thumbnail, id} = item
            return (
                <li 
                    className="comics__item"
                    key={id}
                    onClick={this.onFocusItem}>
                    <a href="#">
                        <img src={thumbnail} alt="ultimate war" className="comics__item-img"/>
                        <div className="comics__item-name">{title}</div>
                        <div className="comics__item-price">{price}$</div>
                    </a>
                </li>
            )
        })
        return (
            <ul className="comics__grid">
                {comics}
            </ul>
        );
    }

    render() {
        const comics = this.renderItems(this.state.comics)
        
        const {loading, error, singleLoading, offset} = this.state;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? comics : null;

        return (
            <div className='randomchar__content'>
                <div className="comics__list">
                    {spinner}
                    {errorMessage}
                    {content}
                </div>
                <button 
                className="button button__main button__long"
                disabled={singleLoading}
                onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}


export default ComicsList;