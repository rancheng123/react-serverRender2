
//react
import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Link ,browserHistory} from 'react-router';



import routes from './routes';





render((
    <div>
        <Router history={browserHistory} routes={routes}></Router>
    </div>

), document.getElementById('app'));

