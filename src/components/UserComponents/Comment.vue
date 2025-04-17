<template>
    <div class="comment-container">
        <div class="order-search">
            <el-input v-model="orderId" placeholder="请输入订单号" clearable @clear="clearOrder"
                @keyup.enter="fetchOrderDetails">
                <template #append>
                    <el-button type="primary" :icon="Search" @click="fetchOrderDetails"
                        :loading="loading">查询</el-button>
                </template>
            </el-input>
        </div>

        <div class="order-details" v-if="orderItems.length > 0">
            <h3 class="order-title">订单号: {{ currentOrderId }}</h3>

            <div class="product-list">
                <div class="product-item" v-for="(item, index) in orderItems" :key="item.commodity_id">
                    <div class="product-image">
                        <img :src="'http://localhost:8081' + item.image" :alt="item.commodity_id" />
                    </div>
                    <div class="product-info">
                        <h4 class="product-name">{{ item.commodity_name }}</h4>
                        <p class="product-spec">{{ item.spec }}</p>
                        <div class="product-price-quantity">
                            <span class="price">¥{{ item.price.toFixed(2) }}</span>
                            <span class="quantity">x{{ item.quantity }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="comment-section">
                <h3 class="comment-title">发表评价</h3>

                <div class="rating-section">
                    <span class="rating-label">商品满意度：</span>
                    <el-rate v-model="commentForm.rating" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" show-text
                        :texts="['很差', '一般', '满意', '很好', '非常棒']" />
                </div>

                <div class="comment-content">
                    <el-input v-model="commentForm.content" type="textarea" :rows="5" maxlength="500"
                        placeholder="请输入您的评价，商品使用感受等（500字以内）" show-word-limit />
                </div>

                <div class="submit-section">
                    <el-button type="primary" size="large" @click="submitComment" :loading="submitting">提交评价</el-button>
                </div>
            </div>
        </div>

        <div class="empty-tip" v-else-if="orderId && !loading">
            <el-empty description="未找到该订单信息" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

import { useRoute } from 'vue-router'
import axios from 'axios'
const route = useRoute()

// 订单号
const orderId = ref('')
const currentOrderId = ref('')
const loading = ref(false)
const orderItems = ref([])

// 评论表单
const commentForm = ref({
    rating: 5, 
    content: '',
    images: [],
    isAnonymous: false
})

const submitting = ref(false)

onMounted(() => {
    const commentId = route.params.commentId;
    if (commentId) {
        orderId.value = commentId;
        fetchOrderDetails();
    }
})

const fetchOrderDetails = async () => {
    if (!orderId.value.trim()) {
        ElMessage.warning('请输入订单号')
        return
    }
    loading.value = true;
    orderItems.value = [];
    try {
        const response=await axios.post('/api/fetch-commentItems', {
            order_uuid: orderId.value
        });
        if (response.data.code === 200) {
            currentOrderId.value = orderId.value;
        }else {
            ElMessage.error(response.data.message);
        }
    } catch (error) {
        ElMessage.error('获取订单信息失败: ' + error.message);
    }
}

const clearOrder = () => {
    orderItems.value = []
    currentOrderId.value = ''
}

const submitComment = async () => {
    if (!commentForm.value.content.trim()) {
        ElMessage.warning('请填写评价内容')
        return
    }
    submitting.value = true
    try {
        await new Promise(resolve => setTimeout(resolve, 1000))

        console.log('提交的评论数据:', {
            orderId: currentOrderId.value,
            ...commentForm.value
        })

        ElMessage.success('评价提交成功')
        // 清空表单
        commentForm.value = {
            rating: 5,
            content: '',
            images: [],
            isAnonymous: false
        }
    } catch (error) {
        ElMessage.error('评价提交失败: ' + error.message)
    } finally {
        submitting.value = false
    }
}
</script>

<style scoped>
.comment-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.order-search {
    margin-bottom: 30px;
    max-width: 500px;
}

.order-title {
    margin: 20px 0;
    color: #333;
    font-size: 18px;
}

.product-list {
    border: 1px solid #eee;
    border-radius: 4px;
    padding: 15px;
    margin-bottom: 30px;
}

.product-item {
    display: flex;
    padding: 15px 0;
    border-bottom: 1px dashed #eee;
}

.product-item:last-child {
    border-bottom: none;
}

.product-image {
    width: 80px;
    height: 80px;
    margin-right: 15px;
}

.product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
}

.product-info {
    flex: 1;
}

.product-name {
    margin: 0 0 8px 0;
    font-size: 16px;
    color: #333;
}

.product-spec {
    margin: 0 0 8px 0;
    font-size: 14px;
    color: #999;
}

.product-price-quantity {
    display: flex;
    justify-content: space-between;
}

.price {
    color: #f56c6c;
    font-weight: bold;
}

.quantity {
    color: #666;
}

.comment-section {
    background: #f9f9f9;
    padding: 20px;
    border-radius: 4px;
}

.comment-title {
    margin-top: 0;
    margin-bottom: 20px;
    color: #333;
}

.rating-section {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.rating-label {
    margin-right: 10px;
    font-size: 14px;
    color: #666;
}

.comment-content {
    margin-bottom: 20px;
}

.comment-upload {
    margin-bottom: 20px;
}

.upload-label {
    display: inline-block;
    margin-bottom: 10px;
    font-size: 14px;
    color: #666;
}

.anonymous-section {
    margin-bottom: 20px;
}

.submit-section {
    text-align: center;
}

.empty-tip {
    margin-top: 50px;
    text-align: center;
}
</style>