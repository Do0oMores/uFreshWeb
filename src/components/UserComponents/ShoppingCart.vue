<template>
    <div class="shopping-cart">
        <header class="header">
            <h1>购物车</h1>
            <div class="search">
                <input type="text" placeholder="搜索" />
                <button>管理</button>
            </div>
        </header>

        <main class="cart-items">
            <div class="cart-item" v-for="(item, index) in cartItems" :key="index">
                <input type="checkbox" v-model="item.selected" class="item-checkbox" />
                <div class="item-image">
                    <img :src="'http://localhost:8081' + item.image" alt="商品图片" />
                </div>
                <div class="item-details">
                    <h3 class="item-name">{{ item.name }}</h3>
                    <el-button class="spec">{{ item.spec_name }} : {{ item.spec_value }}</el-button>
                    <p class="item-tag">{{ item.tag }}</p>
                    <p class="item-price">¥ {{ item.added_price }}</p>
                </div>
                <div class="item-quantity">
                    <button @click="decreaseAmount(item)" class="quantity-btn">-</button>
                    <span class="quantity">{{ item.amount }}</span>
                    <button @click="increaseAmount(item)" class="quantity-btn">+</button>
                </div>
            </div>
        </main>

        <footer class="cart-footer">
            <div class="footer-actions">
                <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" /> 全选
                <div class="total">
                    合计: <span class="total-price">¥ {{ totalPrice }}</span>
                </div>
            </div>
            <button class="checkout">结算</button>
        </footer>
    </div>
</template>

<script>
import axios from 'axios';
import { ElMessage } from 'element-plus';

export default {
    data() {
        return {
            cartItems: [],
            totalCartPrice: 0,
            userId: null,
            isSelected: true,
            tableData: [],
            selectAll: false,
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
    computed: {
        totalPrice() {
            return this.cartItems
                .filter(item => item.selected) // 筛选出选中的商品
                .reduce((total, item) => total + item.added_price * item.amount, 0); // 累加计算总价
        },
    },
    methods: {
        async fetchData() {
            try {
                const response = await axios.post('/api/fetch-cart', {
                    user_id: this.userId
                });
                if (response.data.code === 200) {
                    this.cartItems = response.data.data;
                    console.log(this.item);
                } else {
                    ElMessage.error(response.data.message);
                }
            } catch (error) {
                console.log(error);
                ElMessage.error('获取数据失败，请稍后再试');
            }
        },
        getUserId() {
            return sessionStorage.getItem('userID') || null;
        },
        toggleSelectAll() {
            this.cartItems.forEach(item => {
                item.selected = this.selectAll;
            });
        },
        increaseAmount(item) {
            item.amount++;
        },
        decreaseAmount(item) {
            if (item.amount > 1) {
                item.amount--;
            } else {
                this.$confirm("确定要删除该商品吗？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }).then(() => {
                    this.cartItems = this.cartItems.filter(i => i !== item);
                });
            }
        }
    }
}
</script>

<style scoped>
.shopping-cart {
    max-width: 900px;
    margin: 20px auto;
    padding: 15px;
    font-family: 'Arial', sans-serif;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 15px;
    border-bottom: 2px solid #ddd;
}

.header h1 {
    font-size: 24px;
    font-weight: bold;
    color: #333;
}

.search {
    display: flex;
    align-items: center;
}

.search input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-right: 10px;
}

.search button {
    padding: 8px 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.search button:hover {
    background-color: #0056b3;
}

.cart-items {
    margin-top: 20px;
}

.cart-item {
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 8px;
    margin-bottom: 15px;
    padding: 15px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
}

.cart-item:hover {
    transform: translateY(-2px);
}

.item-checkbox {
    margin-right: 15px;
}

.item-image img {
    width: 80px;
    height: 80px;
    border-radius: 5px;
    object-fit: cover;
}

.item-details {
    flex-grow: 1;
    margin-left: 15px;
}

.item-name {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 8px;
    color: #333;
}

.item-options {
    width: 100px;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 8px;
}

.item-tag {
    font-size: 14px;
    color: #ff4d4f;
    font-weight: bold;
    margin-bottom: 8px;
}

.item-price {
    font-size: 18px;
    color: #f40;
    font-weight: bold;
}

.item-quantity {
    font-size: 16px;
    color: #555;
}

.quantity-btn {
    border: 1px solid #ddd;
    background-color: #f9f9f9;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 16px;
    margin: 0 5px;
}
.quantity {
    font-size: 16px;
    padding: 0 10px;
}
.quantity-btn:hover {
    background-color: #f0f0f0;
}

.cart-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding-top: 15px;
    border-top: 2px solid #ddd;
}

.footer-actions {
    display: flex;
    align-items: center;
}

.total {
    margin-left: 20px;
    font-size: 18px;
    font-weight: bold;
    color: #333;
}

.total-price {
    color: #f40;
}

.checkout {
    background-color: #007bff;
    color: white;
    padding: 12px 25px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
}

.checkout:hover {
    background-color: #0056b3;
}

@media (max-width: 768px) {
    .cart-item {
        flex-wrap: wrap;
        text-align: center;
    }

    .item-details {
        margin-left: 0;
        margin-top: 10px;
    }

    .checkout {
        width: 100%;
        text-align: center;
    }
}
</style>