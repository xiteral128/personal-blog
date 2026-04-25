import api from './index'

export interface SessionPayload {
  accessToken: string
  sessionId: string
  user: any
}

export function login(data: any) {
  return api.post<SessionPayload, SessionPayload>('/auth/login', data)
}

export function refreshSession(data: { sessionId: string }) {
  return api.post<SessionPayload, SessionPayload>('/auth/refresh', data)
}

export function getProfile() {
  return api.get<any, any>('/auth/me')
}

export function logout(data: { sessionId: string }) {
  return api.post<unknown, unknown>('/auth/logout', data)
}
