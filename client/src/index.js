import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'antd/dist/antd.css';
import App from "./App";
import {Provider} from 'react-redux';
import {createStore} from "redux";
import reducers from './reducers'

ReactDOM.render(
        <div style={{height: '100%'}}>
            <Provider store={createStore(reducers)}>
                <App/>
            </Provider>
        </div>,
  document.getElementById('root')
);

