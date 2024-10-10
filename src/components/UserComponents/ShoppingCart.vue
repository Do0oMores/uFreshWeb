<template>
    <el-main v-if="isSelected">
        <div class="shoppingcart">
            <div class="aproduct" v-for="product in products" :key="product.productName">
                <!-- <img :src="product.productName" /> -->
                <p>{{ product.productName }}</p>
                <p class="price">单价：${{ product.unitPrice }}</p>
                <p class="total-price">总价：${{ product.totalPrice }}</p>
                <div class="quantity-control">
                    <el-button class="custom-button" @click="decreaseQuantity(product.productID)"
                        size="mini">-</el-button>
                    <span>{{ product.quantity }}</span>
                    <el-button class="custom-button" @click="increaseQuantity(product.productID)"
                        size="mini">+</el-button>
                </div>
            </div>
        </div>
        <div class="total-cart-price">
            <p>购物车总价：${{ totalCartPrice }}</p>
            <el-button class="submit-button" @click="createOrder()">结账</el-button>
        </div>
    </el-main>
    <div v-if="!isSelected">
        <el-button type="primary" style="width:100%;" @click="checkout()">
            订单总金额 [{{ totalCartPrice }}] 点击结账
        </el-button>
        <el-button type="primary" style="width:100%;" @click="back()">
            点击返回
        </el-button>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="product_id" label="商品名" width="180" />
            <el-table-column prop="price" label="单价" width="180" />
            <el-table-column prop="amount" label="数量" />
            <el-table-column prop="total_price" label="总价" />
        </el-table>
    </div>
</template>

<script>
import axios from 'axios';
import { ElMessage } from 'element-plus';

export default {
    data() {
        return {
            products: [],
            totalCartPrice: 0,
            userId: null,
            isSelected: true,
            tableData: []
        };
    },
    created() {
        this.userId = this.getUserId();
        if (this.userId) {
            this.fetchData();
        } else {
            ElMessage.error('请先登录');
        }
    },
    methods: {
        async fetchData() {
            try {
                const response = await axios.get('/api/show-shopping', {
                    params: {
                        userID: this.userId
                    }
                });
                if (response.data.code === 200) {
                    this.products = response.data.Data.items;
                    this.totalCartPrice = response.data.Data.totalCartPrice;
                } else {
                    ElMessage.error(response.data.msg);
                }
            } catch (error) {
                ElMessage.error('获取数据失败，请稍后再试');
            }
        },
        getUserId() {
            return sessionStorage.getItem('userID') || null;
        },
        async decreaseQuantity(product_id) {
            try {
                const response = await axios.get('/api/remove-from-cart', {
                    params: {
                        userId: this.userId,
                        productId: product_id,
                        quantity: 1
                    }
                });
                if (response.data.code === 200) {
                    const product = this.products.find(p => p.productID === product_id);
                    if (product && product.quantity > 0) {
                        product.quantity -= 1;
                        product.totalPrice = (product.unitPrice * product.quantity).toFixed(2);
                        this.totalCartPrice = this.calculateTotalCartPrice();
                    }
                    if (product.quantity === 0) {
                        this.products = this.products.filter(p => p.productID !== product_id);
                    }
                    ElMessage.success(response.data.msg);
                } else {
                    ElMessage.error(response.data.msg);
                }
            } catch (error) {
                ElMessage.error('获取信息失败，请稍后再试');
            }
        },
        async increaseQuantity(product_id) {
            try {
                const response = await axios.get('/api/add-to-cart', {
                    params: {
                        userId: this.userId,
                        productId: product_id,
                        quantity: 1
                    }
                });
                if (response.data.code === 200) {
                    const product = this.products.find(p => p.productID === product_id);
                    if (product) {
                        product.quantity += 1;
                        product.totalPrice = (product.unitPrice * product.quantity).toFixed(2);
                        this.totalCartPrice = this.calculateTotalCartPrice();
                    }
                    ElMessage.success(response.data.msg);
                } else {
                    ElMessage.error(response.data.msg);
                }
            } catch (error) {
                ElMessage.error('获取信息失败，请稍后再试');
            }
        },
        calculateTotalCartPrice() {
            return this.products.reduce((total, product) => total + parseFloat(product.totalPrice), 0).toFixed(2);
        },
        async createOrder() {
            try {
                const response = await axios.get('/api/create-order', {
                    params: {
                        UserID: this.userId
                    }
                });
                if (response.data.code === 200) {
                    ElMessage.success(response.data.msg);
                    this.tableData = response.data.Data;
                    setTimeout(() => {
                        this.isSelected = false;
                    }, 500);
                } else {
                    ElMessage.error(response.data.msg);
                }
            } catch (error) {
                ElMessage.error('服务器错误，请稍后再试');
            }
        },
        async checkout() {
            try {
                const response = await axios.get('/api/checkout', {
                    params: {
                        UserID: this.userId
                    }
                });
                if (response.data.code === 200) {
                    ElMessage.success(response.data.msg);
                } else {
                    ElMessage.error(response.data.msg);
                }
            } catch (error) {
                ElMessage.error('服务器错误，请稍后再试');
            }
        },
        async back() {
            try {
                const response = await axios.get('/api/cleanorders', {
                    params: {
                        userID: this.userId
                    }
                });
                if (!response.data.code === 200) {
                    ElMessage.error(response.data.msg);
                }
            } catch (error) {
                ElMessage.error('服务器错误，请稍后再试')
            }
            this.isSelected = true
        }
    }
}
</script>

<style>
.shoppingcart {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.aproduct {
    display: flex;
    align-items: center;
    background-color: #12a8c9;
    border: 1px solid #2d502d;
    border-radius: 8px;
    padding: 10px;
    box-sizing: border-box;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
}

.aproduct p {
    margin: 10px 0;
}

.aproduct p:first-of-type {
    font-weight: bold;
    /* 商品名称加粗 */
}

.aproduct:hover {
    transform: translateY(-5px);
    /* 鼠标悬停时上移 */
}

.aproduct .price,
.aproduct .total-price {
    font-size: 1.2em;
    font-weight: bold;
    color: #e74c3c;
    margin: auto;
    /* 价格的颜色 */
}

.quantity-control {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.custom-button {
    background-color: #50dcff;
    border-color: #2778a4;
    color: white;
    font-weight: bold;
    border-radius: 5px;
    transition: background-color 0.3s, transform 0.3s;
}

.custom-button:hover {
    background-color: #47ffff;
    border-color: #288da7;
    transform: scale(1.1);
}

.total-cart-price {
    margin-top: 20px;
    font-size: 1.5em;
    font-weight: bold;
    text-align: center;
}

.submit-button {
    background: linear-gradient(90deg, #3498db, #2980b9);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
    transition: background 0.3s, transform 0.3s, box-shadow 0.3s;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    /* 添加按钮阴影 */
}

.submit-button:hover {
    background: linear-gradient(90deg, #097ab3, #0b89c7);
    transform: translateY(-3px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}
</style>