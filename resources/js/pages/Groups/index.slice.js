import { createSlice, createEntityAdapter } from "@reduxjs/toolkit"

import { PREFIX } from "./index.service"
import { api } from "../../routes/app"
import PaginatedTable from "../../components/PaginatedTable/index"

export const adapter = createEntityAdapter({
  selectId: group => group.uuid,
})

const paginatedTable = PaginatedTable(PREFIX, api.groups)

const initialState = adapter.getInitialState({
  ...paginatedTable.initialState,
  columns: [
    { slug: "id", label: "Id" },
    { slug: "name", label: "Name", sort: true, sortDirection: "asc" },
    { slug: "updated_at", label: "Updated at", sort: true, sortDirectory: "desc" },
    { slug: "created_at", label: "Created at", sort: true, sortDirection: "desc" },
  ],
})

const slice = createSlice({
  name: PREFIX,
  initialState,
  reducers: {
    upsertMany: adapter.upsertMany,
    ...paginatedTable.reducers,
  },
  extraReducers: {
    ...paginatedTable.extraReducers,
  },
})

export const actions = slice.actions
export const tableAsyncActions = paginatedTable.asyncActions("groups", actions)

export default slice.reducer
