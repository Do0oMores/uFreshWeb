<template>
    <div class="order-container">
        <el-card class="order-card">
            <h2 class="order-title">订单详情</h2>
            <div v-for="(order, index) in orders[0].commodity_list" :key="index" class="order-item">
                <el-row :gutter="20" class="product-row">
                    <el-col :span="6">
                        <el-image class="product-image" :src="'http://localhost:8081' + order.image"
                            fit="cover"></el-image>
                    </el-col>
                    <el-col :span="12">
                        <div class="product-info">
                            <h3 class="product-name">{{ order.commodity_name }}</h3>
                            <p class="product-spec">{{ order.spec }}</p>
                        </div>
                    </el-col>
                    <el-col :span="6" class="price-section">
                        <p class="price">￥{{ order.price }}</p>
                        <p class="quantity">x{{ order.quantity }}</p>
                        <p class="total-price">
                            <strong>共计</strong>
                            <span class="price-red">￥{{ order.price * order.quantity }}</span>
                        </p>
                    </el-col>
                </el-row>
            </div>
            <div class="information">
                <p><span>订单号：{{ orders[0].order_uuid }}</span></p>
                <p><span>下单时间：{{ orders[0].created_time }}</span></p>
                <p><span>订单备注：{{ orders[0].order_note }}</span></p>
                <p><span>取货方式：{{ orders[0].pickup_method }}</span></p>
                <p><span>订单状态：{{ orders[0].status }}</span></p>
            </div>
            <div class="order-summary">
                <div class="button-row" v-if="orders[0].status !== '待处理'">
                    <el-button type="primary" class="refund-button" @click="gotoAfterSales">申请售后</el-button>
                </div>
                <p class="summary-item">
                    <span>优惠：</span>
                    <span class="discount">-￥{{ discount }}</span>
                </p>
                <p class="summary-item total">
                    <span>实付款：</span>
                    <span class="final-price">￥{{ orders[0].total_price }}</span>
                </p>
            </div>
        </el-card>
    </div>
</template>

<script>
import axios from 'axios';
import { ElMessage } from "element-plus";

export default {
    name: "OrderDetails",
    data() {
        return {
            orders: [
                {
                    commodity_list: [
                        {
                            image: '',
                            commodity_name: '',
                            spec: '',
                            price: 0,
                            quantity: 0
                        }
                    ],
                    created_time: '',
                    order_note: '',
                    pickup_method: '',
                    status: '',
                    total_price: 0,
                    order_uuid: ''
                }
            ],
            discount: 0,
            orderId: null,
        };
    },
    created() {
        this.orderId = this.$route.params.orderId;
        this.getOrderDetails();
    },
    methods: {
        async getOrderDetails() {
            try {
                const response = await axios.post('/api/fetch-order-details', {
                    order_uuid: this.orderId
                });
                console.log(this.orderId);
                if (response.data.code === 200) {
                    this.orders = response.data.data;
                    console.log(this.orders);
                } else {
                    ElMessage.error(response.data.message);
                }
            } catch (error) {
                console.log(error);
                ElMessage.error('获取订单详情失败');
            }
        },
        gotoAfterSales() {
            this.$router.push(`/user/aftersales/${this.orderId}`)
        }
    }
};
</script>

<style scoped>
.order-container {
    max-width: 650px;
    margin: 20px auto;
}

.order-card {
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    background: #fff;
}

.order-title {
    font-size: 22px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 15px;
}

.order-item {
    border-bottom: 1px solid #f0f0f0;
    padding: 15px 0;
}

.product-row {
    display: flex;
    align-items: center;
}

.product-image {
    width: 100px;
    height: 100px;
    border-radius: 8px;
    border: 1px solid #ddd;
    transition: transform 0.3s ease-in-out;
}

.product-image:hover {
    transform: scale(1.05);
}

.product-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.product-name {
    font-size: 18px;
    font-weight: bold;
}

.product-spec {
    color: gray;
    font-size: 14px;
}

.price-section {
    text-align: right;
    font-size: 16px;
    font-weight: bold;
}

.price {
    color: black;
}

.quantity {
    color: #666;
}

.total-price {
    font-size: 18px;
    margin-top: 5px;
}

.price-red {
    color: #d32f2f;
    font-size: 18px;
    font-weight: bold;
}

.button-row {
    display: flex;
    justify-content: flex-start;
    margin-top: 10px;
}

.refund-button {
    font-size: 14px;
    padding: 6px 12px;
    border-radius: 5px;
    transition: background 0.3s ease-in-out;
}

.refund-button:hover {
    background: #ff7043;
    color: white;
}

.order-summary {
    text-align: right;
    margin-top: 15px;
    padding-top: 10px;
    border-top: 2px solid #f0f0f0;
}

.summary-item {
    font-size: 16px;
    margin-bottom: 5px;
}

.discount {
    color: #4caf50;
    font-weight: bold;
}

.final-price {
    color: #d32f2f;
    font-size: 22px;
    font-weight: bold;
}

.information {
    display: flex;
    flex-direction: column;
    text-align: left;
    margin-top: 15px;
    padding: 10px;
    border-radius: 5px;
    background-color: #f9f9f9;
}

.information p {
    font-size: 14px;
    color: #333;
    margin: 5px 0;
}

.information span {
    font-weight: bold;
    color: #555;
}
</style>