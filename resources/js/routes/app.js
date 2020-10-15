const API_ENDPOINT = '/api',
  ENDPOINT = ''

const API_PERMISSIONS_ENDPOINT = `${API_ENDPOINT}/account/permissions`
const API_MODULES_ENDPOINT = `${API_ENDPOINT}/modules`

const PERMISSIONS_ENDPOINT = `${ENDPOINT}/account/permissions`
const MODULES_ENDPOINT = `${ENDPOINT}/modules`

export const endpoints = {
  groups: {
    index: `${PERMISSIONS_ENDPOINT}/groups`,
    create: `${PERMISSIONS_ENDPOINT}/groups/create`,
  },
  users: {
    index: `${PERMISSIONS_ENDPOINT}/users`,
  },
  modules: {
    index: `${MODULES_ENDPOINT}`,
  },
}

export const api = {
  metadata: `${API_ENDPOINT}/metadata`,
  groups: {
    index: `${API_PERMISSIONS_ENDPOINT}/groups`,
    create: `${API_PERMISSIONS_ENDPOINT}/groups/create`,
    update: `${API_PERMISSIONS_ENDPOINT}/groups/update`,
    metadata: `${API_PERMISSIONS_ENDPOINT}/groups/metadata`,
  },
  users: {
    index: `${API_PERMISSIONS_ENDPOINT}/users`,
  },
  modules: {
    index: `${API_MODULES_ENDPOINT}/modules`,
    all: `${API_MODULES_ENDPOINT}/all`,
  },
}
