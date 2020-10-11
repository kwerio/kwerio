import { Button, Paper, TextField } from "@material-ui/core"
import React, { useState } from "react"

import axios from "axios"

function Login() {
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState("")

  function submit() {
    axios.post("/_/basic-authentication/login", { email, password })
      .then(response => {})
      .catch(e => console.error(e))
  }

  return (
    <Paper>
      <TextField
        name="email"
        label="Email"
        type="email"
        variant="outlined"
        value={email}
        onChange={e => setEmail(e.target.value)}
        margin="dense"
        size="small"
      />

      <TextField
        name="password"
        label="Password"
        type="password"
        variant="outlined"
        value={password}
        onChange={e => setPassword(e.target.value)}
        margin="dense"
        size="small"
      />

      <Button color="primary" name="submit" variant="contained" onClick={submit}>
        login
      </Button>

    </Paper>
  )
}

export default React.memo(Login)