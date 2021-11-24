import { Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem } from 'reactstrap';
// import { div } from 'react-router-dom';
import React, { Component } from 'react';
import "./HeaderComponent.css"
// import { baseUrl } from '../../../../shared/baseURL';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";


import $ from 'jquery';
class HeaderComponent extends Component {






    render() {
        return (
            <div className='nav_bar'>
                <div>
                    <div className='nav_title' > </div>
                    <div className='nav_toggler' ></div>
                </div>
                <div className='nav_icon' >
                    <img src='/logo.png' alt='l' style={{ width: "50%", height: '50%' }} />
                </div>

            </div>
        );
    }
}

export default HeaderComponent;