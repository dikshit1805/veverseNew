import React, {Component} from 'react';

import {MenuItems} from './MenuItems';
import './NavBar.css';
class NavBar extends Component {
    
render() {
    return(
        <nav className="NavBarItems">
            <div className="div-flex"> 
            <h1 className="NavBar-logo">Veverse<i className="fab fa-react"></i></h1>
            </div>
            
            <div className="search-div">
            <input className="search-field" type="text" placeholder="Search.." />
            <i className="fas fa-search"></i>
            </div>
            <div className="div-flex">
            <ul className= 'nav-menu'>
                {MenuItems.map((item,index)=> {
                    return (
                    <li key={index}><a className={item.cname} href={item.url}>{item.title}</a></li>
                    );
                })}
                
            </ul>
            </div>

        </nav>
    )
}
}
export default  NavBar;