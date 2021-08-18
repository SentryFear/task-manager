import React from 'react'
import {Route, Switch} from "react-router-dom"
import "react-datepicker/dist/react-datepicker.css";
import Tasks from "./components/Tasks/Tasks";

const App: React.FC = () => {
    return (
        <Switch>
            <Route exact path='/'
                   render={() => <Tasks/>}/>

            <Route path='/tab/:id'
                   render={() => <Tasks/>}/>

            <Route path='*'
                   render={() => <Tasks/>}/>
        </Switch>
    )
}

export default App;
