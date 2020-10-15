import { createAsyncThunk } from "@reduxjs/toolkit"

import axios from "axios"

import { actions, form } from "./index.slice"
import { api } from "../../routes/app"
import { move_to_start } from "../../utils/service"
import { rsc_catched_error ,show_under_form_fields } from "../../utils/errors"

export const PREFIX = "GROUPS"

export const fetch_by_uuid = createAsyncThunk(`${PREFIX}/fetch_by_uuid`, async (uuid, { getState, dispatch, rejectWithValue }) => {
  try {
    const response = await axios.post(api.groups.fetch_by_uuid, { uuid })

    if (response.status === 200 && _.hasIn(response.data, "total") && _.hasIn(response.data, "items")) {
      dispatch(actions.upsertOne({ ...response.data.items[0] }))

      return response.data
    }

    return rejectWithValue(response.data)
  }

  catch (err) {
    return rsc_catched_error(err, rejectWithValue)
  }
})

/**
 * Insert or Update the given item.
 */
export const upsert = createAsyncThunk(`${PREFIX}/upsert`, async (__, { dispatch, getState, rejectWithValue }) => {
  try {
    const { uuid, name, modules } = getState().groups.upsert
    let endpoint = api.groups.update

    if (_.isNull(uuid)) {
      endpoint = api.groups.create
    }

    const response = await axios.post(endpoint, {
      name: name.value,
      modules: modules.value.map(module => module.uid),
    })

    if (response.status === 200 && _.hasIn(response.data, "total") && _.hasIn(response.data, "items")) {
      dispatch(actions.upsertOne({
        ...response.data.items[0],
        touched_at: Date.now(),
      }))

      dispatch(actions.softReset())

      return response.data
    }

    return rejectWithValue(response.data)
  }

  catch (err) {
    return rsc_catched_error(err, rejectWithValue)
  }
})

export const extraReducers = {

  // upsert
  [upsert.pending]: (state, action) => {
    state.loading = true
  },
  [upsert.rejected]: (state, action) => {
    state.loading = false
    show_under_form_fields(state.upsert, action.payload)
    console.error(action)
  },
  [upsert.fulfilled]: (state, action) => {
    state.loading = false

    if (_.hasIn(action.payload, "total")) {
      state.rsc.total = action.payload.total
    }

    state.upsert = {
      ...state.upsert,
      ...form.state,
    }

    if (_.hasIn(action.payload, "items")) {
      move_to_start(state, action.payload.items[0].uuid)
    }
  },

  [fetch_by_uuid.pending]: (state, action) => {
    state.pending = true
  },
  [fetch_by_uuid.rejected]: (state, action) => {
    state.loading = false
    console.error(action)
  },
  [fetch_by_uuid.fulfilled]: (state, action) => {
    state.loading = false

    if (_.hasIn(action.payload, "total")) {
      state.rsc.total = action.payload.total
    }
  },
}
