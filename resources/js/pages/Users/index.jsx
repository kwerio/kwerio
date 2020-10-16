import { Box, CircularProgress } from "@material-ui/core"
import { useSelector } from "react-redux"
import React from "react"

import { actions, adapter, tableAsyncActions } from "./index.slice"
import Header from "./Header"
import OneColumnPage from "../Page/OneColumnPage"
import PaginatedTable from "../../components/PaginatedTable/index.jsx"
import Toolbar from "./Toolbar"
import useStyles from "./index.styles"

function Users() {
  const classes = useStyles(),
    state = useSelector(state => state.users)

  return (
    <Box>
      <Header
        RightComponent={<HeaderRight loading={state.loading} />}
      />

      <OneColumnPage>
        <Toolbar
          actions={actions}
          tableAsyncActions={tableAsyncActions}
        />

        <PaginatedTable
          reducerName="users"
          adapter={adapter}
          actions={actions}
          asyncActions={tableAsyncActions}
        />
      </OneColumnPage>
    </Box>
  )
}

function HeaderRight({ loading }) {
  return (
    <Box>
      {loading && (
        <CircularProgress size={20} />
      )}
    </Box>
  )
}

export default React.memo(Users)
