<template>
    <div class="product-detail">
        <div class="product-image">
            <img :src="'http://localhost:8081' + product.image" alt="商品图片" />
        </div>

        <div class="product-info">
            <h1 class="product-name">{{ product.commodity_name }}</h1>

            <div class="product-price">
                <span class="current-price">￥{{ selectedSpec ? selectedSpec.price : product.price }}</span>
            </div>

            <div class="product-description">
                <p>{{ product.description }}</p>
            </div>

            <div class="product-tags">
                <span class="product-tag">{{ product.tag }}</span>
            </div>

            <div class="product-specs">
                <h3>规格：
                    <el-button-group>
                        <el-button v-for="(spec, index) in product.specs" :key="index" size="small"
                            :type="selectedSpec === spec ? 'primary' : 'default'" @click="selectSpec(spec)">
                            {{ spec.spec }}
                        </el-button>
                    </el-button-group>
                </h3>
            </div>

            <div class="product-quantity">
                <h3>数量：<el-input-number v-model="quantity" :min="1" size="small"
                        @change="updateQuantity"></el-input-number></h3>
            </div>

            <div class="action-buttons">
                <button class="add-to-cart" @click="addToCart">加入购物车</button>
                <button class="buy-now" @click="buyNow">立即购买</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { ElMessage } from "element-plus";

export default {
    data() {
        return {
            product: null,
            selectedSpec: null,
            quantity: 1,
            commodityId: null,
            selectedSpecId: null,
        };
    },
    created() {
        this.commodityId = this.$route.params.commodityId;
        this.fetchProductData();
        this.fetchCommoditySpec();
    },
    methods: {
        async fetchProductData() {
            try {
                const response = await axios.post('/api/fetch-commodity-detail', {
                    commodity_id: this.commodityId
                });
                if (response.data.code == 200) {
                    this.product = response.data.data;
                } else {
                    ElMessage.error('获取商品详情失败！');
                }
            } catch (error) {
                ElMessage.error('请求失败');
            }
        },
        async fetchCommoditySpec() {
            try {
                const response = await axios.post('/api/fetch-commodity-spec', {
                    commodity_id: this.commodityId
                });
                if (response.data.code == 200) {
                    this.product.specs = response.data.data;
                } else {
                    ElMessage.error('获取商品规格失败！');
                }
            } catch (error) {
                console.log(error);
                ElMessage.error('请求失败');
            }
        },
        selectSpec(spec) {
            this.selectedSpec = spec;
            this.selectedSpecId = spec.id;
        },
        decreaseQuantity() {
            if (this.quantity > 1) this.quantity--;
        },
        increaseQuantity() {
            this.quantity++;
        },
        addToCart() {
            if (!this.selectedSpec) {
                ElMessage.error("请选择规格！");
                return;
            }
            try {
                axios.post('/api/add-to-cart', {
                    user_id: sessionStorage.getItem('userID'),
                    commodity_id: this.commodityId,
                    spec_id: this.selectedSpecId,
                    amount: this.quantity
                }).then(response => {
                    if (response.data.code === 200) {
                        ElMessage.success(response.data.message);
                    } else {
                        ElMessage.error(response.data.message);
                    }
                });
            } catch (error) {
                ElMessage.error("加入购物车失败");
            }
        },
        buyNow() {
            if (!this.selectedSpec) {
                ElMessage.error("请选择规格！");
                return;
            }
            alert(`立即购买：${this.product.commodity_name}，规格：${this.selectedSpec.spec}，数量：${this.quantity}`);
        },
    }
};
</script>

<style scoped>
.product-detail {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.product-image {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.product-image img {
    width: 100%;
    max-width: 300px;
    height: auto;
    border-radius: 8px;
    object-fit: cover;
}

.product-info {
    flex: 2;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.product-name {
    font-size: 28px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
}

.product-price {
    font-size: 24px;
    color: #e60023;
    font-weight: bold;
}

.product-description {
    font-size: 16px;
    color: #666;
    line-height: 1.5;
    margin-bottom: 20px;
}

.product-specs {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.spec-options {
    display: flex;
    gap: 10px;
}

.spec-options button {
    padding: 8px 16px;
    border: 2px solid #ddd;
    border-radius: 8px;
    background-color: #fff;
    color: #333;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;
}

.spec-options button.selected {
    border-color: #e60023;
    background-color: #ffe6e6;
    color: #e60023;
}

.spec-options button:hover {
    border-color: #e60023;
    color: #e60023;
}

.product-quantity {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.quantity-controls {
    display: flex;
    align-items: center;
    gap: 10px;
}

.product-quantity button {
    width: 36px;
    height: 36px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 50%;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.3s;
}

.product-quantity button:hover {
    background-color: #ffe6e6;
    border-color: #e60023;
}

.product-quantity input {
    width: 50px;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.action-buttons {
    display: flex;
    gap: 20px;
}

.action-buttons button {
    flex: 1;
    padding: 12px 20px;
    font-size: 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
}

.add-to-cart {
    background-color: #ff9900;
    color: #fff;
    border: none;
}

.add-to-cart:hover {
    background-color: #e68a00;
}

.buy-now {
    background-color: #e60023;
    color: #fff;
    border: none;
}

.buy-now:hover {
    background-color: #cc001f;
}

.product-tags {
    margin-bottom: 10px;
}

.product-tag {
    display: inline-block;
    padding: 2px 8px;
    margin-right: 5px;
    font-size: 0.9em;
    color: white;
    background-color: #ff5722;
    border-radius: 4px;
}
</style>
