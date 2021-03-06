import { createSlice, createEntityAdapter } from "@reduxjs/toolkit"
import Form from "@euvoor/form"

import generate_extra_reducers from "Kwerio/utils/generate-extra-reducers"
import PaginatedTable from "Kwerio/components/PaginatedTable/index.slice"

import services from "./index.service"

export const adapter = createEntityAdapter({
  selectId: language => language.uuid,
})

const form = Form({
  locale: { },
})

const extraReducers = generate_extra_reducers("languages", services, {
  metadata: {
    fulfilled: (state, action) => {
      if ("languages" in action.payload) {
        state.languages = action.payload.languages
      }
    }
  }
})

const initialState = adapter.getInitialState({
  ...PaginatedTable.state,
  upsert: {
    uuid: null,
    ...form.state,
  },
  columns: [
    { slug: "name", label: "Language", sort: true, sortOrder: 3 },
    { slug: "locale", label: "Locale", sort: true, sortOrder: 4 },
    { slug: "created_at", label: "Created at", sort: true, sortOrder: 2, sortDirection: "desc" },
    { slug: "updated_at", label: "Updated at", sort: true, sortOrder: 1, sortDirection: "desc" },
  ],
  languages: [],
})

const slice = createSlice({
  name: "languages",
  initialState,
  reducers: {
    ...PaginatedTable.reducers(adapter),
    ...form.reducers,
    loaded: (state, action) => {
      state.loaded = true
    },
    toggleDefaultAtExcept: (state, action) => {
      for (let entity in state.entities) {
        state.entities[entity].checked = false
        state.entities[entity].default_at = null
      }

      state.entities[action.payload.uuid].default_at = action.payload.default_at
    },
    setLanguagesDisabledTo: (state, action) => {
      state.languages.filter(language => {
        return action.payload.items.map(item => item.locale).indexOf(language.locale) !== -1
      })
        .forEach(language => {
          language.disabled = action.payload.disabled
        })
    },
    fillUpsert: (state, action) => {
      const item = action.payload

      state.upsert.uuid = item.uuid
      state.upsert.locale.value = item.locale
    },
    resetUpsert: (state, action) => {
      state.upsert = {
        uuid: null,
        ...form.state,
      }
    },
    handleChange: (state, action) => {
      form.reducers.handleChange(state.upsert, action)
    },
    handleBlur: (state, action) => {
      form.reducers.handleBlur(state.upsert, action)
    },
  },
  extraReducers: {
    ...PaginatedTable.extraReducers("languages"),
    ...extraReducers,
  },
})

export const actions = slice.actions

export default slice.reducer
