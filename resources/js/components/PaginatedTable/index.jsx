import {
  Box,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel
} from "@material-ui/core"
import { useDispatch, useSelector } from "react-redux"
import React from "react"
import clsx from "clsx"

import _ from "lodash"

import { init_services } from "./index"
import Toolbar from "./Toolbar"
import useRequest from "../../hooks/useRequest"
import useStyles from "./index.styles"
import useT from "../../hooks/useT"

function PaginatedTable({
  reducer,                      // Reducer name.
  adapter,                      // Data to display in the table.
  actions,                      // Slice actions.
  api,                          // Api to use for making requests.
  endpoint,                     // Endpoints for the current entity.
  hover = true,                 // Enable hover on the table.
  canCheck = true,              // Rows can be checked using checkbox.
  renderCell = null,            // Custom cell renderer.
  onRowClick = () => { },       // Click event for the row.
  onSort = () => { },           // Callback to handle sorting.
  primaryKey = "uuid",          // Primary key used in the data as 'id'.
  slugKey = "slug",             // Name of the slug key.
  size = "small",               // Size of the table. (medium, small).

  // Components..
  toolbar = false,              // Show table toolbar
  canSearch = false,
  canCreate = false,
  searchLabel = null,
  createButtonLabel = null,
}) {
  const dispatch = useDispatch(),
    state = useSelector(state => state[reducer]),
    selector = adapter.getSelectors(),
    classes = useStyles(),
    translations = useSelector(state => state.app.t),
    t = useT(translations),
    request = useRequest({ reducer, services: init_services(api, actions) })

  let data = selector.selectAll(state),
    offset = state.page * state.per_page

  data = data.slice(offset, offset + state.per_page)

  /**
   * Toggle checked attribute of all items in the cache.
   *
   * @param {boolran} checked
   */
  function _toggle_check_all(checked) {
    dispatch(actions.updateMany(selector.selectIds(state).map(id => ({
      id,
      changes: { checked }
    }))))
  }

  const nb_checked = selector.selectAll(state).filter(item => _.get(item, "checked", false)).length
  let checkbox_all = { }

  React.useEffect(() => {
    if (nb_checked > 0) {
      _toggle_check_all(false)
    }

    request.index()
  }, [])

  if (nb_checked > 0 && nb_checked < data.length) {
    checkbox_all = { indeterminate: true }
  }

  return (
    <Box>
      {toolbar && (
        <Toolbar
          request={request}
          actions={actions}
          api={api}
          endpoint={endpoint}
          reducer={reducer}
          canSearch={canSearch}
          canCreate={canCreate}
          searchLabel={searchLabel}
          createButtonLabel={createButtonLabel}
        />
      )}

      <TableContainer className={classes.root}>
        <Table size={size}>
          <TableHead>
            <TableRow>
              {canCheck && (
                <TableCell>
                  <Checkbox
                    { ...checkbox_all }
                    checked={nb_checked > 0}
                    color="primary"
                    onChange={e => {
                      const updates = data.map(item => ({
                          id: item[primaryKey],
                          changes: { checked: e.target.checked }
                        }))

                      dispatch(actions.updateMany(updates))
                    }}
                    onClick={e => e.stopPropagation()}
                  />
                </TableCell>
              )}
              {state.columns.map(col => (
                <TableCell key={col[slugKey]}>
                  {col.sort && (
                    <TableSortLabel
                      active={true}
                      direction={col.sortDirection}
                      onClick={() => {
                        if (nb_checked > 0) {
                          _toggle_check_all(false)
                        }

                        dispatch(actions.removeAll())
                        dispatch(actions.handleSort(col))
                        request.index()
                      }}
                    >
                      {t(col.label)}
                    </TableSortLabel>
                  )}
                  {!col.sort && (col.label)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map(row => (
              <TableRow
                hover={hover}
                selected={_.get(row, "checked", false)}
                key={row[primaryKey]}
                onClick={() => onRowClick(row)}
                className={clsx({ [classes.touchedAt]: _.hasIn(row, "touched_at") })}
              >
                {canCheck && (
                  <TableCell key={row[primaryKey]}>
                    <Checkbox
                      checked={_.get(row, "checked", false)}
                      onChange={e => dispatch(actions.updateOne({
                        id: row[primaryKey],
                        changes: { checked: e.target.checked }
                      }))}
                      onClick={e => e.stopPropagation()}
                      color="primary"
                      value={row[primaryKey]}
                    />
                  </TableCell>
                )}
                {state.columns.map(col => {
                  if (_.isFunction(renderCell)) {
                    return renderCell(row, col)
                  }

                  return (
                    <TableCell key={col[slugKey]}>
                      {row[col[slugKey]]}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPage={state.per_page}
                page={state.page}
                onChangePage={(_, page) => {
                  if (nb_checked > 0) {
                    _toggle_check_all(false)
                  }

                  dispatch(actions.setPage(page))
                  request.index()
                }}
                onChangeRowsPerPage={e => {
                  if (nb_checked > 0) {
                    _toggle_check_all(false)
                  }

                  dispatch(actions.setPerPage(e.target.value))
                  request.index()
                }}
                count={state.rsc.total}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default React.memo(PaginatedTable)
