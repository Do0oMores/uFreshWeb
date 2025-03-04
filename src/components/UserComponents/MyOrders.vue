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
                            <el-image
                                :src="'http://localhost:8081' + item.image"
                                fit="cover"
                                class="product-image"
                            ></el-image>
                            <div class="item-text">
                                <h3>{{ item.name }}</h3>
                                <p>商品规格：{{ item.spec }}</p>
                            </div>
                        </div>
                        <span>￥{{ item.price.toFixed(2) }}</span>
                        <div class="quantity">
                            <el-button
                                type="primary"
                                size="small"
                                @click="decreaseQuantity(index)"
                            >-</el-button>
                            <span>{{ item.quantity }}</span>
                            <el-button
                                type="primary"
                                size="small"
                                @click="increaseQuantity(index)"
                            >+</el-button>
                        </div>
                        <span class="subtotal">￥{{ (item.price * item.quantity).toFixed(2) }}</span>
                    </div>
                    <el-form-item label="订单备注" class="order-note">
                        <el-input
                            type="textarea"
                            v-model="orderNote"
                            placeholder="填写备注信息"
                            rows="3"
                            show-word-limit
                        ></el-input>
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
                            <el-option label="配送" value="配送"></el-option>
                        </el-select>
                    </el-form-item>
                    <div class="total-payment">
                        <span>实付款</span>
                        <span class="total">￥{{ totalFinalPrice.toFixed(2) }}</span>
                    </div>
                    <div class="action-buttons">
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
import { ElMessage } from 'element-plus';
import { ref, computed, onMounted } from 'vue';

export default {
    name: 'OrderCheckout',
    setup() {
        const items = ref([]);
        const orderNote = ref('');
        const pickupMethod = ref('自提');

        const totalOriginalPrice = computed(() =>
            items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
        );
        const discount = ref(0);
        const totalFinalPrice = computed(() => totalOriginalPrice.value - discount.value);

        const increaseQuantity = (index) => {
            items.value[index].quantity++;
        };

        const decreaseQuantity = (index) => {
            if (items.value[index].quantity > 1) items.value[index].quantity--;
        };

        const goBack = () => {
            alert('返回按钮点击');
        };

        const submitOrder = () => {
            alert('订单已提交');
        };

        const userId = ref(null);

        const fetchOrders = async () => {
            if (!userId.value) {
                ElMessage.error('请先登录');
                return;
            }
            try {
                const response = await axios.post('/api/getOrders', {
                    user_id: userId.value
                });
                console.log(response.data);
                if (response.data.code === 200) {
                    console.log(response.data);
                    items.value = response.data.data.order_items.map(order => ({
                        name: order.commodity_name,
                        spec: order.spec,
                        price: order.price,
                        quantity: order.quantity,
                        image: order.image
                    }));
                } else {
                    ElMessage.error('获取订单失败');
                }
            } catch (error) {
                console.log(error);
                ElMessage.error('获取数据失败，请稍后再试');
            }
        };

        onMounted(() => {
            userId.value = sessionStorage.getItem('userID');
            fetchOrders();
        });

        return {
            items,
            orderNote,
            pickupMethod,
            totalOriginalPrice,
            discount,
            totalFinalPrice,
            increaseQuantity,
            decreaseQuantity,
            goBack,
            submitOrder,
        };
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

.total{
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