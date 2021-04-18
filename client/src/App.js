import React from 'react';
import './App.css';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import LandingPage from "./pages/landing/LandingPage";
import MenuAppBar from './components/AppBar'
import FilesPage from "./pages/files/FilesPage";
import AccountPage from "./pages/account/AccountPage";
import EditPage from "./pages/edit/EditPage";

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path='/'>
                    <LandingPage/>
                </Route>
                <Route path='/'>
                    <MenuAppBar/>
                    <Route exact path='/files'>
                        <FilesPage/>
                    </Route>
                    <Route exact path='/edit/:id' render={(props) => <EditPage {...props}/>}/>
                    <Route exact path='/account'>
                        <AccountPage/>
                    </Route>
                </Route>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
