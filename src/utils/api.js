// 获取 API 基础 URL
const getBaseUrl = () => {
  if (import.meta.env.PROD && __WORKER_URL__) {
    // 生产环境使用环境变量中的 WORKER_URL
    return __WORKER_URL__
  }
  // 开发环境直接使用相对路径，将由 Vite 代理处理
  return ''
}

// API 请求工具
export const api = {
  async get(endpoint) {
    const baseUrl = getBaseUrl()
    const response = await fetch(`${baseUrl}${endpoint}`)
    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.statusText}`)
    }
    return response.json()
  },

  async post(endpoint, data) {
    const baseUrl = getBaseUrl()
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.statusText}`)
    }
    return response.json()
  }
} 