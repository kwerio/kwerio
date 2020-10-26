import { Box, Divider, Paper, Typography } from "@material-ui/core"
import { makeStyles, createStyles } from "@material-ui/core/styles"
import { useSelector } from "react-redux"
import React from "react"

function PageWithFixedMenu({
  title = false,
  menu = () => {},
  content = () => {},
}) {
  const config = useSelector(state => state.app.config),
    classes = useStyles(config)

  return (
    <Box display="flex" width={1}>
      <Paper variant="outlined" square={true} className={classes.paper}>
        {title && (
          <>
            <Typography className={classes.typography} variant="h6">{title}</Typography>
            <Divider className={classes.divider} />
          </>
        )}
        {menu()}
      </Paper>

      <Box width={1} p={2} className={classes.content}>
        {content()}
      </Box>
    </Box>
  )
}

const useStyles = makeStyles(theme => createStyles({
  root: {

  },

  paper: {
    height: config => `calc(100vh - ${config.appbar_height}px)`,
    position: "fixed",
  },

  typography: {
    textAlign: "center",
    margin: 0,
    padding: 0,
    height: config => config.appbar_height,
    lineHeight: config => `${config.appbar_height}px`,
  },

  divider: {
    margin: 0,
  },

  menu: {
    width: config => config.menu_width,
  },

  content: {
    width: config => `calc(100% - ${config.menu_width}px)`,
    marginLeft: config => config.menu_width,
  },
}))

export default React.memo(PageWithFixedMenu)
