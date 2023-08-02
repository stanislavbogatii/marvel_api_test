import './charList.scss';

import PropTypes from 'prop-types'
import { Component } from 'react';
import Spinner from '../spinner/spiner';
import ErrorMessage from '../errorMessage/errorMessage';
import MarvelService from '../../services/MarvelService';

class CharList extends Component {
    
    state = {
        chars: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 0,
        charEnded: false,
    }

    componentDidMount() {
        this.onRequest(this.state.offset);
    }


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

    marvelService = new MarvelService();

    onLoadedChars = (newChars) => {
        window.addEventListener('scroll', this.handleScroll);
        let ended = false;
        if (newChars.length < 12) {
            ended = true
        }

        this.setState(({offset, chars}) => ({
            chars: [...chars, ...newChars],
            loading: false,
            newItemLoading: false,
            offset: offset + 12,
            charEnded: ended
        }));

        if (this.state.offset === 12) {
            this.props.onCharSelected(this.state.chars[0].id)
            this.onFucusItem(0)
        }
    }

    onRequest = (offset) => {
        this.onCharListLoaded()
        this.marvelService.getAllCharacters(offset)
            .then(this.onLoadedChars)
            .catch(this.onError)
        
    }

    onCharListLoaded = () => {
        this.setState({
            newItemLoading: true
        })
        window.removeEventListener('scroll', this.handleScroll)
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    itemRefs = []


    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    onFucusItem = (id) => {
        this.itemRefs.forEach(item => 
            item.classList.remove('char__item_selected')
        )
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }


    renderItems(arr) {
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li 
                    ref={this.setRef}
                    tabIndex={0}
                    className="char__item"
                    key={item.id}
                    onClick={() => {
                        this.props.onCharSelected(item.id);
                        this.onFucusItem(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            this.props.onCharSelected(item.id);
                            this.onFucusItem(i);
                        }
                    }}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }


    render() {

        const {chars, charEnded, loading, error, newItemLoading, offset} = this.state;
        const items = this.renderItems(chars);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;


        return (
            <div className='randomchar__content'>
                <div className="char__list">
                    {errorMessage}
                    {spinner}
                    {content}
                </div>        
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">Load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;