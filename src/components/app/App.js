import { Component } from "react";
import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import SingleComic from '../singleComic/SingleComic'
import ComicsList from "../comicsList/ComicsList";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";

import decoration from '../../resources/img/vision.png';

class App extends Component {
    state = {
        selectedChar: null,
        pageName: "characters"
    }

    onCharSelected = (id) => {
        this.setState({
            selectedChar: id
        })
    }

    onChangePage = (pageName) => {
        if (this.state.pageName !== pageName) {
            this.setState({
                pageName
            })
        }
    }

    render() {
        const {pageName, selectedChar} = this.state;
        return (
            <div className="app">
                <AppHeader onChangePage = {this.onChangePage}/>
                <main>

                    <ErrorBoundary>
                        <RandomChar/>
                    </ErrorBoundary>
                    
                    <div className="char__content">
                        {pageName === "characters" ? <CharList onCharSelected = {this.onCharSelected}/> : <ComicsList/>}
                        <ErrorBoundary>
                            {pageName === "characters" ? <CharInfo charId = {selectedChar}/> : <SingleComic/>}
                        </ErrorBoundary>
                    </div>

                    <img className="bg-decoration" src={decoration} alt="vision"/>
                </main>
            </div>
        )
    }
}


export default App;