import { render } from "react-dom"
import React from "react"

import App from "Kwerio/App"
import createStore from "Kwerio/store"
import groups from "Kwerio/pages/Groups/index.slice"
import modules from "Kwerio/pages/Modules/index.slice"
import abilities from "Kwerio/pages/Abilities/index.slice"
import profile from "Kwerio/pages/Profile/index.slice"
import users from "Kwerio/pages/Users/index.slice"
import apiUsers from "Kwerio/pages/ApiUsers/index.slice"

const reducers = {
  groups,
  users,
  apiUsers,
  modules,
  abilities,
  abilities,
  profile,
}

render(
  <App store={createStore(reducers)} />,
  document.getElementById("root")
)
