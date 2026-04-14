import api from './index'

export function login(data: any) {
  return api.post<{ token: string, user: any }>('/auth/login', data)
}