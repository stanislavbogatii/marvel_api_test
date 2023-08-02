import { Component } from 'react';

import PropTypes from 'prop-types'

import './charInfo.scss';
import Spinner from '../spinner/spiner';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/errorMessage';
import Skeleton from '../skeleton/Skeleton';

class CharInfo extends Component {
    state = {
        char: null,
        loading: false,
        error: false
    }
    marvelServices = new MarvelService;
    
    
    componentDidMount() {
        window.addEventListener("scroll", this.fixCharInfo);
        this.updateChar();
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.fixCharInfo);
    }

    fixCharInfo = () => {
        const charList = document.querySelector('.char__content');
        const card = document.querySelector('.char__info')
        const preRect = charList.getBoundingClientRect();
        if (preRect.top <= 0) {
            card.style.marginTop = -1 * preRect.top + 'px';
        } else {
            card.style.marginTop = '0px';
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.charId !== prevProps.charId) {
            this.updateChar();
        }
    }

    onCharLoaded = (char) => {
        this.setState({
            char,
            loading: false
        })
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    updateChar = () => {
        const {charId} = this.props;
        if (!charId) {
            return;
        }
        this.setState({loading: true});

        this.marvelServices
        .getCharacter(charId)
        .then(this.onCharLoaded)
        .catch(this.onError)    
    }


    render() {
        const {error, loading, char} = this.state;


        const skeleton = char || loading || error ? null : <Skeleton/>; 
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error || !char) ? <View char = {char}/> : null;
        
        
        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}    
            </div>
        )
    }
}

const View = ({char}) => {
    const {name, thumbnail, description, homepage, wiki, comics} = char;
    let imgStyle = {'objectFit' : 'cover'};
            if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }

    return (
            <>
                <div className="char__basics">
                    <img src={thumbnail} alt="abyss" style={imgStyle}/>
                    <div>
                        <div className="char__info-name">{name}</div>
                        <div className="char__btns">
                            <a href={homepage} className="button button__main">
                                <div className="inner">homepage</div>
                            </a>
                            <a href={wiki} className="button button__secondary">
                                <div className="inner">Wiki</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="char__descr">
                    {description}
                </div>
                <div className="char__comics">Comics:</div>
                <ul className="char__comics-list">
                    {comics.length > 0 ? null : 'There is no comics with this character'}
                    {
                        comics.map((item, i) => {
                            if (i > 10) return; 
                            return (
                                <li key={i} className="char__comics-item">
                                    {item.name}
                                </li>
                            )
                        })
                    }
                    
                </ul>
            </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;