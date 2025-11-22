<template>
    <div class="checkout-container">
        <el-row :gutter="20">
            <el-col :span="16">
                <el-card class="order-info">
                    <h2>确认订单信息</h2>
                    <div class="order-header">
                        <span>商品信息</span>
                        <span>单价</span>
                        <span>数量</span>
                        <span>小计</span>
                    </div>
                    <div v-for="(item, index) in items" :key="index" class="order-item">
                        <div class="item-details">
                            <el-image :src="'http://localhost:8081' + item.image" fit="cover"
                                class="product-image"></el-image>
                            <div class="item-text">
                                <h3>{{ item.name }}</h3>
                                <p>商品规格：{{ item.spec }}</p>
                            </div>
                        </div>
                        <span>￥{{ item.price.toFixed(2) }}</span>
                        <div class="quantity">
                            <el-button type="primary" size="small" @click="decreaseQuantity(index)">-</el-button>
                            <span>{{ item.quantity }}</span>
                            <el-button type="primary" size="small" @click="increaseQuantity(index)">+</el-button>
                        </div>
                        <span class="subtotal">￥{{ (item.price * item.quantity).toFixed(2) }}</span>
                    </div>
                    <el-form-item label="订单备注" class="order-note">
                        <el-input type="textarea" v-model="orderNote" placeholder="填写备注信息" rows="3"
                            show-word-limit></el-input>
                    </el-form-item>
                </el-card>
            </el-col>

            <el-col :span="8">
                <el-card class="payment-info">
                    <h3>付款详情</h3>
                    <div class="payment-item">
                        <span>商品总价</span>
                        <span>￥{{ totalOriginalPrice.toFixed(2) }}</span>
                    </div>
                    <div class="payment-item">
                        <span>优惠</span>
                        <span>-￥{{ discount.toFixed(2) }}</span>
                    </div>
                    <!-- <el-divider>优惠详细信息</el-divider>
                    <div class="discount-details">
                        <p>新店满减：-￥{{ discount.toFixed(2) }}</p>
                    </div> -->
                    <el-form-item label="取货方式" class="pickup-method">
                        <el-select v-model="pickupMethod" placeholder="请选择取货方式">
                            <el-option label="自提" value="自提"></el-option>
                            <el-option label="三公里配送" value="配送"></el-option>
                        </el-select>
                    </el-form-item>
                    <div class="total-payment">
                        <span>实付款</span>
                        <span class="total">￥{{ totalFinalPrice.toFixed(2) }}</span>
                    </div>
                    <div class="action-buttons">
                        <el-button @click="cancelOrder" type="danger">取消订单</el-button>
                        <el-button @click="goBack" type="default">返回</el-button>
                        <el-button @click="submitOrder" type="success" plain>提交订单</el-button>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
    name: 'OrderCheckout',
    data() {
        return {
            items: [],
            orderNote: '',
            pickupMethod: '自提',
            discount: 0,
            userId: null,
            order_uuid: null
        };
    },
    computed: {
        totalOriginalPrice() {
            return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        },
        totalFinalPrice() {
            return this.totalOriginalPrice - this.discount;
        }
    },
    methods: {
        goBack() {
            this.$router.push("/user/shoppingcart");
        },
        async increaseQuantity(index) {
            const response = await axios.post("/api/increaseQuantity1", {
                order_uuid: this.order_uuid,
                commodity_id: this.items[index].commodity_id,
                spec: this.items[index].spec,
            });
            if (response.data.code === 200) {
                this.items[index].quantity++;
            } else {
                ElMessage.error(response.data.message);
            }
        },
        async decreaseQuantity(index) {
            if (this.items[index].quantity > 1) {
                const response = await axios.post("/api/decreaseQuantity1", {
                    order_uuid: this.order_uuid,
                    commodity_id: this.items[index].commodity_id,
                    spec: this.items[index].spec,
                });
                if (response.data.code === 200) {
                    this.items[index].quantity--;
                } else {
                    ElMessage.error(response.data.message);
                }
            } else {
                const isLastItem = this.items.length === 1;
                ElMessageBox.confirm(
                    isLastItem ? '这是最后一件商品，是否要清空订单？' : '是否要移除该商品？',
                    isLastItem ? '确认清空' : '确认移除',
                    {
                        confirmButtonText: isLastItem ? '清空' : '移除',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }
                ).then(async () => {
                    if (isLastItem) {
                        const response = await axios.post("/api/clearOrder", {
                            order_uuid: this.order_uuid
                        });
                        if (response.data.code === 200) {
                            this.items = [];
                            ElMessage.success(response.data.message);
                        } else {
                            ElMessage.error(response.data.message);
                        }
                    } else {
                        const response = await axios.post("/api/removeOrderItem", {
                            order_uuid: this.order_uuid,
                            commodity_id: this.items[index].commodity_id,
                            spec: this.items[index].spec,
                        });
                        if (response.data.code === 200) {
                            this.items.splice(index, 1);
                            ElMessage.success(response.data.message);
                        } else {
                            ElMessage.error(response.data.message);
                        }
                    }
                }).catch(() => {
                    ElMessage.info('已取消操作');
                });
            }
        },
        async submitOrder() {
            try {
                const response = await axios.post('/api/submit-order', {
                    order_uuid: this.order_uuid,
                    order_note: this.orderNote,
                    pickup_method: this.pickupMethod

                });
                if (response.data.code === 200) {
                    ElMessage.success(response.data.message);
                    this.$router.push('/user/oldorders');
                } else {
                    ElMessage.error(response.data.message);
                }
            } catch (error) {
                console.log(error);
                ElMessage.error("error")
            }
        },
        async fetchOrders() {
            if (!this.userId) {
                ElMessage.error('请先登录');
                return;
            }
            try {
                const response = await axios.post('/api/getOrders', {
                    user_id: this.userId
                });

                if (response.data.code === 200) {
                    const orderData = response.data.data;
                    if (!orderData || !orderData.order_items || orderData.order_items.length === 0) {
                        ElMessage.warning('当前没有未结算订单');
                        return;
                    }

                    this.items = orderData.order_items.map(order => ({
                        name: order.commodity_name,
                        spec: order.spec,
                        price: order.price,
                        quantity: order.quantity,
                        image: order.image,
                        commodity_id: order.commodity_id
                    }));
                    this.order_uuid = orderData.order_uuid;
                } else {
                    ElMessage.error('获取订单失败');
                }
            } catch (error) {
                console.error(error);
                ElMessage.error('获取数据失败，请稍后再试');
            }
        },
        async cancelOrder() {
            try {
                const response = await axios.post("/api/clearOrder", {
                    order_uuid: this.order_uuid,
                });
                if (response.data.code === 200) {
                    ElMessage.success(response.data.message);
                    this.$router.push("/user/shoppingcart");
                } else {
                    ElMessage.error(response.data.message);
                }
            } catch (error) {
                console.log(error);
                ElMessage.error("请求失败");
            }
        }
    },
    mounted() {
        this.userId = sessionStorage.getItem('userID');
        this.fetchOrders();
    }
};
</script>

<style scoped>
.checkout-container {
    padding: 20px;
    background-color: #f7f7f7;
}

.order-header {
    display: grid;
    grid-template-columns: 3fr 1fr 1fr 1fr;
    font-weight: bold;
    margin-bottom: 10px;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 10px;
}

.order-item {
    display: grid;
    grid-template-columns: 3fr 1fr 1fr 1fr;
    align-items: center;
    margin-bottom: 15px;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
}

.item-details {
    display: flex;
    align-items: center;
    gap: 10px;
}

.product-image {
    width: 80px;
    height: 80px;
    border-radius: 5px;
    object-fit: cover;
}

.item-text h3 {
    margin: 0;
    font-size: 16px;
}

.item-text p {
    margin: 5px 0 0;
    color: #666;
    font-size: 14px;
}

.quantity {
    display: flex;
    align-items: center;
    gap: 10px;
}

.subtotal {
    color: #e60023;
    font-weight: bold;
    font-size: 16px;
}

.payment-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.total-payment {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    font-size: 18px;
    margin-top: 20px;
}

.total {
    font-size: 24px;
    color: #e53935;
    font-weight: bold;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.action-buttons {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 20px;
}
</style>