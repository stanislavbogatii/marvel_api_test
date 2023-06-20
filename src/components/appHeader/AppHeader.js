import './appHeader.scss';
import { Component } from 'react';

class AppHeader extends Component {
    render() { 
        return (
            <header className="app__header">
                <h1 className="app__title">
                    <a href="">
                        <span>Marvel</span> information portal
                    </a>
                </h1>
                <nav className="app__menu">
                    <ul>
                        <li><a href="" onClick={() => this.props.onChangePage("characters")}>Characters</a></li>
                        <li><a href="" onClick={() => this.props.onChangePage("comics")}>Comics</a></li>
                    </ul>
                </nav>
            </header>
        )
    }
}

export default AppHeader;