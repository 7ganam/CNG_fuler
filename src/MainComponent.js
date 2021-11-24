import React from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ScrollToTopComponent from './componenets/shared/ScrollToTopComponent/ScrollToTopComponent'
import HeaderComponent from './componenets/shared/HeaderComponent/HeaderComponent';
import HomePageComponent from './componenets/HomePageComponent/HomePageComponent';
function MainComponent() {
    return (
        <div>
            <Router >
                <ScrollToTopComponent />
                <HeaderComponent /> {/* the navbar has to be inside the router since it uses LINK component which runs only inside router component */}
                <div style={{ paddingTop: '60px', minHeight: '100vh', backgroundColor: '#F2F5F8' }}>
                    <Switch id="react_router_switch">
                        <Route exact path="/">
                            <HomePageComponent />
                        </Route>
                    </Switch>
                </div>
            </Router>


        </div>
    )
}

export default MainComponent
