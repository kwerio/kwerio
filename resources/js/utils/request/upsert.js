/**
 * Build the data that will be sent on the request.
 */
export function data({ state, appends = {}, args = null }) {
  let data = {}

  if (args) {
    let { state } = args
  }

  for (let item in state.upsert) {
    if (item in appends) {
      data[item] = appends[item]({ state })
    } else if (_.isObject(state.upsert[item]) && ("value" in state.upsert[item])) {
      data[item] = state.upsert[item].value
    } else {
      data[item] = state.upsert[item]
    }
  }

  return data
}

/**
 * Build create/updata url.
 */
export function url({ api, state, primaryKey, substitute = {}, args = null }) {
  if (args) {
    let { state, primaryKey } = args
  }

  let endpoint

  if (state.upsert[primaryKey]) {
    let re = new RegExp(`:${primaryKey}`)

    endpoint = api.update
  } else {
    endpoint = api.create
  }

  for (let key in substitute) {
    endpoint = endpoint.replace(`:${key}`, substitute[key])
  }

  return endpoint
}

/**
 * Actions to dispatch before sending back fulfilled.
 */
function before_fulfilled({ actions, dispatch, data, args = null }) {
  if (args) {
    let { actions, dispatch, data } = args
  }

  dispatch(actions.upsertOne({ ...data.items[0], touched_at: Date.now() }))
  dispatch(actions.resetTableTrackers())
  dispatch(actions.fillUpsert(data.items[0]))

  return data
}

/**
 * Route to index if create.
 */
export function redirect_to_index({ actions, endpoint, dispatch, data, history, state, substitute = {}, args = null }) {
  if (args) {
    let { dispatch, data, history, state } = args
  }

  before_fulfilled({ actions, dispatch, data })

  dispatch(actions.resetUpsert())

  let to = endpoint.index

  for (let key in substitute) {
    to = to.replace(`:${key}`, substitute[key])
  }

  history.push(to)

  return data
}

/**
 * Route to index if create.
 */
export function redirect_to_index_if_create({ actions, endpoint, dispatch, data, history, state, primaryKey, substitute = {}, args = null }) {
  if (args) {
    let { dispatch, data, history, state, primaryKey } = args
  }

  const is_create = ! state.upsert[primaryKey]

  if (is_create) redirect_to_index({ actions, endpoint, dispatch, data, history, state })
  else before_fulfilled({ actions, dispatch, data })

  return data
}

export function redirect_to_index_if_update({ actions, endpoint, dispatch, data, history, state, primaryKey, substitute = {}, args = null }) {
  if (args) {
    let { dispatch, data, history, state, primaryKey } = args
  }

  const is_update = state.upsert[primaryKey]

  if (is_update) redirect_to_index({ actions, endpoint, dispatch, data, history, state })
  else before_fulfilled({ actions, dispatch, data })

  return data
}
