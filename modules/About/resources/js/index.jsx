import { Box } from "@material-ui/core"
import { Route } from "react-router-dom"
import { render } from "react-dom"
import React from "react"

import App from "Kwerio/App"
import createStore from "Kwerio/store"

const reducers = {

}

render(
  <App
    store={createStore(reducers)}
    switchRoutes={() => (
      <Route exact path="/_/about" render={props => <Box>About Module</Box>} />
    )}
  />,
  document.getElementById("root")
)
