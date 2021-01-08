import {
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListSubheader
} from "@material-ui/core"
import { makeStyles, createStyles } from "@material-ui/core/styles"
import { useDispatch, useSelector } from "react-redux"
import { useRouteMatch, useHistory } from "react-router-dom"
import ExpandLessIcon from "@material-ui/icons/ExpandLess"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import React from "react"

import _ from "lodash"

const useStyles = makeStyles(theme => createStyles({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}))

function PageMenu({ menu = null, actions }) {
  const classes = useStyles(),
    match = useRouteMatch(),
    history = useHistory(),
    dispatch = useDispatch()

  if (!menu) menu = "module.menu"

  const state = useSelector(state => state)

  if (!_.hasIn(state, menu)) {
    console.error(`State does not have the following path ${menu}`)
    return []
  }

  const menu_items = _.get(state, menu)

  /**
   * Check if menu is selected or not based on the url path.
   */
  function _is_menu_selected(item) {
    if (("link" in item) && ("matches" in item)) {
      return item.matches.indexOf(match.path) !== -1
    }

    return ("link" in item) && item.link === match.path
  }

  /**
   * Handle menu item click.
   */
  function _handle_click(item) {
    console.log(item)
    if ("open" in item) {
      console.log(actions)
      dispatch(actions.toggleMenu({ menu, item }))
    }

    if (("link" in item) && item.link !== "#") {
      history.push(item.link)
    }
  }

  /**
   * Render menu list.
   */
  function _render_list(list) {
    return (
      <React.Fragment key={list.id}>
        <ListItem
          button
          selected={_is_menu_selected(list)}
          onClick={() => _handle_click(list)}
        >
          <ListItemText
            primary={list.text}
          />
          {("children" in list) && (
            <>
              {list.open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </>
          )}
        </ListItem>
        {("children" in list) && (
          <Collapse in={list.open} timeout="auto" unmountOnExit>
            {list.children.map(item => (
              <ListItem
                key={item.id}
                button
                onClick={() => _handle_click(item)}
                className={classes.nested}
                selected={_is_menu_selected(item)}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </Collapse>
        )}
      </React.Fragment>
    )
  }

  return (
    <>
      <List component="div">
        {menu_items.map(list => (
          <React.Fragment key={list.id}>
            {("is_header" in list) && (
              <List subheader={("is_header" in list) && <ListSubheader>{list.text}</ListSubheader>}>
                {("children" in list) && list.children.map(item => _render_list(item))}
              </List>
            )}
            {!("is_header" in list) && _render_list(list)}
          </React.Fragment>
        ))}
      </List>
    </>
  )
}

export default React.memo(PageMenu)
