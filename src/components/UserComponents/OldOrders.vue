<template>
    <div class="order-history">
        <el-card class="order-container" shadow="hover">
            <h2 class="title">历史订单</h2>
            <div class="order-list">
                <div v-for="(order, index) in orders" :key="index" class="order-item">
                    <div v-if="order.commodity_list && order.commodity_list.length > 1" class="product-info">
                        <el-image class="product-image" :src="'http://localhost:8081' + order.commodity_list[0].image"
                            fit="cover">
                        </el-image>
                        <div class="product-details">
                            <div class="product-title">
                                <a @click="goOrderDetail(order.order_uuid)">
                                    <p>订单号：{{ order.order_uuid }}</p>
                                </a>
                                <p>
                                    {{ order.commodity_list[0].commodity_name }}
                                </p>
                            </div>
                            <div class="product-spec">{{ order.commodity_list[0].spec }}</div>
                        </div>
                    </div>
                    <div class="product-meta">
                        <div class="product-quantity">
                            <span v-if="order.commodity_list && order.commodity_list.length === 1">
                                x{{ order.commodity_list[0].quantity }}
                            </span>
                            <span v-else>
                                共{{ order.commodity_list ? order.commodity_list.length : 0 }}件
                            </span>
                        </div>
                    </div>

                    <div class="order-total">
                        <span>实付款</span>
                        <span class="order-price">￥{{ order.total_price }}</span>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>


<script>
import axios from 'axios';
import { ElMessage } from 'element-plus';

export default {
    data() {
        return {
            orders: [
                {
                    status: '',
                    order_uuid: '',
                    total_price: 0,
                    commodity_list: []
                }
            ]
        };
    },
    created() {
        this.userId = this.getUserId();
        this.fetchOldOrders();
    },
    methods: {
        getUserId() {
            return sessionStorage.getItem('userID') || null;
        },
        async fetchOldOrders() {
            try {
                const response = await axios.post('/api/fetch-old-orders', {
                    user_id: this.userId
                });
                if (response.data.code === 200) {
                    this.orders = response.data.data;
                    console.log(this.orders);
                } else {
                    this.orders = [];
                    ElMessage.error(response.data.msg);
                }
            } catch (error) {
                console.log(error);
                ElMessage.error('请求失败');
            }
        },
        goOrderDetail(orderId) {
            this.$router.push(`/user/orderdetail/${orderId}`);
        }
    }
}
</script>

<style scoped>
.order-history {
    max-width: 800px;
    margin: 20px auto;
}

.order-container {
    padding: 20px;
    border-radius: 10px;
}

.order-list {
    max-height: 600px;
    overflow-y: auto;
    padding-right: 10px;
}

.order-item {
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 15px;
    margin-bottom: 15px;
    background: #fff;
    transition: transform 0.2s ease-in-out;
}

.order-item:hover {
    transform: translateY(-2px);
}

.product-info {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
}

.product-image {
    width: 80px;
    height: 80px;
    border-radius: 5px;
    margin-right: 15px;
}

.product-details {
    flex-grow: 1;
}

.product-title {
    font-weight: bold;
    font-size: 16px;
}

.product-title a {
    color: #333;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.2s;
}

.product-title a:hover {
    color: #ff5722;
}

.product-spec {
    color: #777;
    font-size: 14px;
}

.product-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 5px;
}

.product-price {
    font-size: 16px;
    font-weight: bold;
    color: #ff5722;
}

.product-quantity {
    font-size: 14px;
    color: #999;
}

.order-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    margin-top: 10px;
}

.order-price {
    color: red;
    font-weight: bold;
    font-size: 18px;
}
</style>