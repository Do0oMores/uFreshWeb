<template>
    <el-container class="shopping-cart">
        <el-header class="header">
            <el-row type="flex" justify="space-between" align="middle">
                <el-col :span="12">
                    <h1>购物车</h1>
                </el-col>
                <el-col :span="12">
                    <el-input placeholder="搜索" class="search-input" />
                    <el-button class="manage-btn" type="primary">管理</el-button>
                </el-col>
            </el-row>
        </el-header>

        <el-main class="cart-items">
            <div class="cart-item" v-for="(item, index) in cartItems" :key="index">
                <el-checkbox v-model="item.selected" class="item-checkbox" />
                <div class="item-image">
                    <img :src="'http://localhost:8081' + item.image" alt="商品图片" />
                </div>
                <div class="item-details">
                    <h3 class="item-name">{{ item.name }}</h3>
                    <el-button class="spec" size="small">{{ item.spec }}</el-button>
                    <p class="item-tag">{{ item.tag }}</p>
                    <p class="item-price">¥ {{ item.added_price }}</p>
                </div>
                <div class="item-quantity">
                    <el-button @click="decreaseAmount(item)" class="quantity-btn" size="mini"
                        type="danger">-</el-button>
                    <span class="quantity">{{ item.amount }}</span>
                    <el-button @click="increaseAmount(item)" class="quantity-btn" size="mini"
                        type="success">+</el-button>
                </div>
            </div>
        </el-main>

        <el-footer class="cart-footer">
            <el-row type="flex" justify="space-between" align="middle">
                <el-col :span="12">
                    <el-checkbox v-model="selectAll" @change="toggleSelectAll">全选</el-checkbox>
                </el-col>
                <el-col :span="12" class="total">
                    合计:<span class="total-price">¥{{ totalPrice }}</span>
                </el-col>
            </el-row>
            <el-button class="checkout" type="primary" size="large" @click="checkout">结算</el-button>
        </el-footer>
    </el-container>
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
                .filter(item => item.selected)
                .reduce((total, item) => total + item.added_price * item.amount, 0);
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
        },
        async checkout() {
            // 提取选中的商品信息
            const itemsToCheckout = this.selectedItems.map(item => ({
                productId: item.id,
                specName: item.spec_name,
                specValue: item.spec_value,
                quantity: item.amount,
            }));

            // 发送请求到后端
            try {
                const response = await this.$axios.post('/api/checkout', { items: itemsToCheckout });

                // 处理返回的结算结果
                if (response.data.success) {
                    // 显示成功信息或跳转到结算页面
                    this.$message.success('结算成功！');
                } else {
                    // 处理结算失败
                    this.$message.error('结算失败！');
                }
            } catch (error) {
                console.error('结算请求失败', error);
                this.$message.error('网络错误，请稍后再试！');
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

.header h1 {
    font-size: 24px;
    font-weight: bold;
    color: #333;
}

.search-input {
    width: 200px;
    margin-right: 10px;
}

.manage-btn {
    padding: 8px 12px;
    background-color: #007bff;
    color: white;
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
    margin: 0 5px;
}

.quantity {
    font-size: 16px;
    padding: 0 10px;
}

.cart-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding-top: 15px;
    border-top: 2px solid #ddd;
}

.total {
    font-size: 18px;
    font-weight: bold;
    color: #333;
}

.total-price {
    color: #f40;
}

.checkout {
    padding: 12px 25px;
    font-size: 16px;
    cursor: pointer;
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