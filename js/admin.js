// 基础配置
const API_BASE_URL = 'https://shuqian.ferr01.workers.dev';
const TIMEOUT_DURATION = 15000; // 15秒超时

// API 配置
const apiConfig = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    },
    mode: 'cors',
    credentials: 'omit'
};

// 页面状态
let currentSection = 'dashboard';
let currentBookmarks = [];
let editingBookmark = null;
let currentCategories = [];
let currentTags = [];
let editingCategory = null;
let editingTag = null;

// API 请求封装
const api = {
    async request(endpoint, options = {}) {
        const defaultOptions = {
            ...apiConfig,
            headers: {
                ...apiConfig.headers,
                ...options.headers
            }
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
                ...defaultOptions,
                ...options
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '请求失败');
            }

            return await response.json();
        } catch (error) {
            console.error('API请求失败:', error);
            throw error;
        }
    },

    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },

    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
};

// 工具函数
async function timeoutPromise(promise, ms) {
    const timeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('请求超时')), ms);
    });
    return Promise.race([promise, timeout]);
}

async function retryRequest(fn, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}

function getFaviconUrl(domain) {
    return `${API_BASE_URL}/api/favicon?domain=${encodeURIComponent(domain)}`;
}

// UI 相关函数
function showToast(message, type = 'success') {
    const toastHtml = `
        <div class="toast-container position-fixed bottom-0 end-0 p-3">
            <div class="toast" role="alert">
                <div class="toast-header ${type === 'success' ? 'bg-success' : 'bg-danger'} text-white">
                    <strong class="me-auto">${type === 'success' ? '成功' : '错误'}</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">${message}</div>
            </div>
        </div>
    `;

    document.querySelectorAll('.toast-container').forEach(el => el.remove());
    document.body.insertAdjacentHTML('beforeend', toastHtml);
    const toastElement = document.querySelector('.toast');
    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 3000
    });
    toast.show();
}

function showSuccess(message) {
    showToast(message, 'success');
}

function showError(message) {
    console.error(message);
    showToast(message, 'error');
}

function handleError(message, error) {
    console.error(message, error);
    const errorMessage = error.message || '未知错误';
    showError(`${message}: ${errorMessage}`);
}

// LoadingState 类
class LoadingState {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.originalContent = null;
    }

    show() {
        this.originalContent = this.container.innerHTML;
        this.container.innerHTML = `
            <div class="text-center my-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">加载中...</span>
                </div>
                <p class="mt-2">正在加载数据...</p>
                <small class="text-muted">如果加载时间过长，请检查网络连接</small>
            </div>
        `;
    }

    hide() {
        if (this.originalContent !== null) {
            this.container.innerHTML = this.originalContent;
        }
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    loadDashboard();
    initEventListeners();
    initSearchBar();
});

// 添加全局错误处理
window.addEventListener('unhandledrejection', event => {
    handleError('操作失败', event.reason);
});

window.addEventListener('error', event => {
    handleError('系统��误', event.error);
});

// 保留其他函数的实现...
// (initNavigation, switchSection, initEventListeners, loadDashboard, loadBookmarks 等)