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
import { useHistory } from "react-router-dom"
import React from "react"
import clsx from "clsx"

import { merge } from "lodash"

import { init_services } from "./index"
import Suspense from "../Suspense"
import useRequest from "../../hooks/useRequest"
import useStyles from "./index.styles"
import useT from "../../hooks/useT"

const Toolbar = React.lazy(() => import("./Toolbar.jsx"))

function PaginatedTable({
  reducer,                      // Reducer name.
  adapter,                      // Data to display in the table.
  actions,                      // Slice actions.
  api,                          // Api to use for making requests.
  endpoint,                     // Endpoints for the current entity.
  hover = true,                 // Enable hover on the table.
  canCheck = true,              // Rows can be checked using checkbox.
  renderCell = null,            // Custom cell renderer.
  onRowClick = null,            // Click event for the row.
  onSort = () => { },           // Callback to handle sorting.
  primaryKey = "uuid",          // Primary key used in the data as 'id'.
  slugKey = "slug",             // Name of the slug key.
  size = "small",               // Size of the table. (medium, small).
  disableRowClick = false,      // Disable row click.
  canIndex = null,
  afterIndexFn = data => data,
  highlightRowIf = [],          // Highligh row if the given condition is met.

  // Components..
  toolbar = false,              // Show table toolbar
  addButtons = () => [],
  canSearch = false,
  canCreate = false,
  canDelete = false,
  canDeleteFn = () => true,
  afterDeleteFn = data => data,
  canDuplicate = false,
  searchLabel = null,
  createButtonLabel = null,

  // Customize request
  requests = { },
}) {
  const dispatch = useDispatch(),
    state = useSelector(state => state[reducer]),
    selector = adapter.getSelectors(),
    classes = useStyles(),
    t = useT(),
    request = useRequest({ reducer, services: init_services(api, actions) }),
    history = useHistory()

  const defaultRequests = {
    index: {                      // Index request.
      url: null,                  // Url to make the request to.
      method: "post",             // Type of request method.
      requestBody: null,          // Request body to be sent.
      extraParams: {},            // Additional params to add to request body.
      convertResponseBody: null,  // Converts response body to an acceptable format by the table.
    },
    delete: {                     // Delete request.
      url: null,
      method: "delete",
      requestBody: null,
      extraParams: {},
      convertResponseBody: null,
    },
    duplicate: {
      url: null,
      method: "post",
      requestBody: null,
      extraParams: {},
      convertResponseBody: null,
    },
  }

  requests = merge(defaultRequests, requests)

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

  const checkedItems = selector.selectAll(state).filter(item => ("checked" in item) && item.checked === true),
    nb_checked = checkedItems.length

  let checkbox_all = { }

  React.useEffect(() => {
    if (!canIndex) {
      return
    }

    if (nb_checked > 0) {
      _toggle_check_all(false)
    }

    request.index({ requests }).then(action => {
      dispatch(actions.moveTouchedToStart())
      afterIndexFn(action)
    })
  }, [canIndex])

  if (nb_checked > 0 && nb_checked < data.length) {
    checkbox_all = { indeterminate: true }
  }

  canIndex = canIndex === null ? canSearch : canIndex

  return (
    <Box>
      {toolbar && (
        <Suspense component={<Toolbar
            request={request}
            requests={requests}
            actions={actions}
            api={api}
            endpoint={endpoint}
            reducer={reducer}
            canIndex={canIndex}
            canSearch={canSearch}
            canCreate={canCreate}
            canDelete={canDelete}
            canDeleteFn={canDeleteFn}
            afterDeleteFn={afterDeleteFn}
            canDuplicate={canDuplicate}
            searchLabel={searchLabel}
            createButtonLabel={createButtonLabel}
            nbChecked={nb_checked}
            itemsToDelete={checkedItems}
            itemsToDuplicate={checkedItems}
            checkedItems={checkedItems}
            addButtons={addButtons}
          />
        } />
      )}

      {canIndex && (
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
                {state.columns && state.columns.map(col => (
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
                          request.index({ requests })
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
                  selected={("checked" in row) && row.checked === true}
                  key={row[primaryKey]}
                  onClick={() => {
                    if (onRowClick) {
                      onRowClick(row)
                    } else if (!disableRowClick) {
                      history.push(endpoint.update.replace(/:uuid/, row[primaryKey]))
                    }
                  }}
                  className={(() => {
                    let highlights = { }

                    for (let i = 0; i < highlightRowIf.length; i ++) {
                      highlights[highlightRowIf[i].classes] = highlightRowIf[i].condition(row)
                    }

                    highlights[classes.touchedAt] = ("touched_at" in row)

                    return clsx(highlights)
                  })()}
                >
                  {canCheck && (
                    <TableCell key={row[primaryKey]}>
                      <Checkbox
                        checked={("checked" in row) && row.checked === true}
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
                    if (typeof renderCell === "function") {
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
                  labelRowsPerPage={`${t("Rows per page")}:`}
                  labelDisplayedRows={({ from, to, count }) => (
                    `${from}-${to} ${t("of")} ${count !== -1 ? count : `${t("more than")} ${to}`}`
                  )}
                  rowsPerPage={state.per_page}
                  page={state.page}
                  onChangePage={(_, page) => {
                    if (nb_checked > 0) {
                      _toggle_check_all(false)
                    }

                    dispatch(actions.setPage(page))
                    request.index({ requests })
                  }}
                  onChangeRowsPerPage={e => {
                    if (nb_checked > 0) {
                      _toggle_check_all(false)
                    }

                    dispatch(actions.setPerPage(e.target.value))
                    request.index({ requests })
                  }}
                  count={state.rsc.total || 0}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}

    </Box>
  )
}

export default React.memo(PaginatedTable)
