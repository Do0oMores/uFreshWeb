<template>
    <div class="product-detail">
        <div class="product-image">
            <img :src="product.image" alt="商品图片" />
        </div>

        <div class="product-info">
            <h1 class="product-name">{{ product.name }}</h1>

            <div class="product-price">
                <span class="current-price">￥{{ product.price }}</span>
                <!-- <span class="original-price">￥{{ product.originalPrice }}</span> -->
            </div>

            <div class="product-specs">
                <h3>选择规格：</h3>
                <div class="spec-options">
                    <button v-for="(spec, index) in product.specs" :key="index"
                        :class="{ selected: selectedSpec === spec }" @click="selectSpec(spec)">
                        {{ spec }}
                    </button>
                </div>
            </div>

            <div class="product-quantity">
                <h3>选择数量：</h3>
                <button @click="decreaseQuantity">-</button>
                <input type="number" v-model.number="quantity" min="1" />
                <button @click="increaseQuantity">+</button>
            </div>

            <div class="action-buttons">
                <button class="add-to-cart" @click="addToCart">加入购物车</button>
                <button class="buy-now" @click="buyNow">立即购买</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            product: null,
            selectedSpec: null,
            quantity: 1,
        };
    },
    methods: {
        fetchProductData(productId) {
            //   const products = {
            //     1: {
            //       image: "https://via.placeholder.com/300",
            //       name: "智利车厘子J级10斤礼盒装",
            //       price: 199.0,
            //       originalPrice: 259.0,
            //       specs: [
            //         "5斤(净重) 2级超大果",
            //         "5斤(净重) 3级巨无霸",
            //         "10斤(净重) J级大果"
            //       ],
            //     },
            //     2: {
            //       image: "https://via.placeholder.com/300/FF0000",
            //       name: "澳洲芒果礼盒装",
            //       price: 149.0,
            //       originalPrice: 199.0,
            //       specs: ["2斤装", "5斤装"],
            //     },
            //   };
            this.product = products[productId];
        },
        selectSpec(spec) {
            this.selectedSpec = spec;
        },
        decreaseQuantity() {
            if (this.quantity > 1) this.quantity--;
        },
        increaseQuantity() {
            this.quantity++;
        },
        addToCart() {
            if (!this.selectedSpec) {
                alert("请选择规格！");
                return;
            }
            alert(`已加入购物车：${this.product.name}，规格：${this.selectedSpec}，数量：${this.quantity}`);
        },
        buyNow() {
            if (!this.selectedSpec) {
                alert("请选择规格！");
                return;
            }
            alert(`立即购买：${this.product.name}，规格：${this.selectedSpec}，数量：${this.quantity}`);
        },
    },
    created() {
        const productId = this.$route.params.id;
        this.fetchProductData(productId);
    },
};
</script>

<style scoped>
.product-detail {
    display: flex;
    padding: 20px;
}

.product-image img {
    width: 300px;
    height: 300px;
    border: 1px solid #ccc;
    border-radius: 8px;
}

.product-info {
    margin-left: 20px;
    display: flex;
    flex-direction: column;
}

.product-name {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
}

.product-price {
    font-size: 20px;
    margin-bottom: 20px;
}

.current-price {
    color: red;
    font-weight: bold;
}

.original-price {
    text-decoration: line-through;
    margin-left: 10px;
    color: #888;
}

.product-specs h3,
.product-quantity h3 {
    margin-bottom: 5px;
}

.spec-options button {
    margin-right: 10px;
    padding: 5px 10px;
    border: 1px solid #ccc;
    background-color: #fff;
    cursor: pointer;
}

.spec-options button.selected {
    border-color: red;
    color: red;
}

.product-quantity {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.product-quantity button {
    width: 30px;
    height: 30px;
    text-align: center;
}

.product-quantity input {
    width: 50px;
    text-align: center;
    margin: 0 10px;
}

.action-buttons button {
    padding: 10px 20px;
    margin-right: 10px;
    border: none;
    cursor: pointer;
}

.add-to-cart {
    background-color: #f90;
    color: #fff;
}

.buy-now {
    background-color: red;
    color: #fff;
}
</style>