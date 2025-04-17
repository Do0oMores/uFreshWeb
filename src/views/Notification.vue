<template>
    <div class="message-center-container">
        <el-card class="message-card">
            <template #header>
                <div class="card-header">
                    <h2>消息中心</h2>
                    <div>
                        <el-button type="text" @click="markAllAsRead" :disabled="unreadCount === 0">
                            全部标记为已读
                        </el-button>
                        <el-button type="text" @click="refreshMessages">
                            刷新
                        </el-button>
                    </div>
                </div>
            </template>

            <el-tabs v-model="activeTab" @tab-change="handleTabChange">
                <el-tab-pane label="全部消息" name="all"></el-tab-pane>
                <el-tab-pane :label="`未读消息(${unreadCount})`" name="unread"></el-tab-pane>
                <el-tab-pane label="已读消息" name="read"></el-tab-pane>
            </el-tabs>

            <div class="message-list">
                <el-empty v-if="filteredMessages.length === 0" description="暂无消息" />

                <div v-else>
                    <div v-for="message in filteredMessages" :key="message.id" class="message-item"
                        :class="{ 'unread': !message.isRead }">
                        <div class="message-content">
                            <div class="message-title">
                                <el-tag v-if="message.type" size="small" :type="getTagType(message.type)">
                                    {{ message.type }}
                                </el-tag>
                                <span>{{ message.title }}</span>
                                <el-badge v-if="!message.isRead" is-dot class="unread-dot" />
                            </div>
                            <div class="message-body">
                                <!-- <router-link v-if="message.link" :to="message.link" @click="markAsRead(message)">
                                    {{ message.content }}
                                </router-link>
                                <span v-else>{{ message.content }}</span> -->
                                <span>{{ message.content }}</span>
                            </div>
                            <div class="message-time">{{ formatTime(message.time) }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="pagination-container">
                <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="totalMessages"
                    layout="prev, pager, next, jumper" @current-change="handlePageChange" />
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import axios from 'axios'

const fetchNotificationList = async () => {
    try {
        const response = await axios.post("/api/fetch-notificationList", {
            user_id: getUserId()
        });
        if (response.data.code === 200) {
            messages.value = response.data.data.map(msg => ({
                id: msg.id,
                userId: msg.user_id,
                title: msg.notification_title,
                content: msg.notification_content,
                isRead: msg.enable_read,
                type: msg.type,
                time: new Date(msg.time),
                link: msg.link
            }));
        } else {
            ElMessage.error(response.data.message);
        }
    } catch (error) {
        ElMessage.error('获取数据信息失败', error);
    }
}

const messages = ref([])
const activeTab = ref('all')
const currentPage = ref(1)
const pageSize = ref(10)

// 初始化消息数据
onMounted(() => {
    fetchNotificationList();
})

// 计算属性
const unreadCount = computed(() => messages.value.filter(msg => !msg.isRead).length)

const filteredMessages = computed(() => {
    let result = [...messages.value]

    // 根据标签过滤
    if (activeTab.value === 'unread') {
        result = result.filter(msg => !msg.isRead)
    } else if (activeTab.value === 'read') {
        result = result.filter(msg => msg.isRead)
    }

    // 分页处理
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return result.slice(start, end)
})

const totalMessages = computed(() => {
    if (activeTab.value === 'all') return messages.value.length
    if (activeTab.value === 'unread') return unreadCount.value
    return messages.value.length - unreadCount.value
})

// 获取标签类型
const getTagType = (type) => {
    const typeMap = {
        '系统': '',
        '订单': 'success',
        '售后': 'success',
        '安全': 'danger',
        '活动': 'warning',
        '会员': 'info',
        '调查': ''
    }
    return typeMap[type] || ''
}

const formatTime = (time) => {
    return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

const markAsRead = async (message) => {
    try {
        if (!message.isRead) {
            const response = await axios.post("/api/mark-as-read", {
                user_id: getUserId(),
                id: message.id
            });
            if (response.data.code === 200) {
                message.isRead = true;
                if (message.link) {
                    setTimeout(() => {
                        this.$router.push(message.link);
                    }, 100);
                }
            } else {
                ElMessage.error(response.data.message);
            }
        } else if (message.link) {
            this.$router.push(message.link);
        }
    } catch (error) {
        ElMessage.error('发生错误', error);
    }
}

const markAllAsRead = () => {
    messages.value.forEach(msg => {
        msg.isRead = true
    })
    ElMessage.success('全部消息已标记为已读')
}

const refreshMessages = () => {
    fetchNotificationList();
    ElMessage.info('消息已刷新');
}

const handleTabChange = () => {
    currentPage.value = 1
}

const handlePageChange = (page) => {
    currentPage.value = page
}

const getUserId = () => {
    return sessionStorage.getItem('userID') || null
}
</script>

<style scoped>
.message-center-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.message-list {
    margin-top: 20px;
    min-height: 400px;
}

.message-item {
    padding: 16px;
    border-bottom: 1px solid #ebeef5;
    cursor: pointer;
    transition: background-color 0.3s;
}

.message-item:hover {
    background-color: #f5f7fa;
}

.message-item.unread {
    background-color: #f0f7ff;
}

.message-content {
    position: relative;
}

.message-title {
    font-weight: bold;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.message-body {
    color: #606266;
    margin-bottom: 8px;
    line-height: 1.5;
}

.message-time {
    color: #909399;
    font-size: 12px;
}

.unread-dot {
    margin-left: 8px;
}

.pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}

.el-tag {
    margin-right: 8px;
}

.message-content a {
    color: var(--el-color-primary);
    text-decoration: none;
    cursor: pointer;
}

.message-content a:hover {
    text-decoration: underline;
}

.unread .message-content a {
    font-weight: bold;
}
</style>