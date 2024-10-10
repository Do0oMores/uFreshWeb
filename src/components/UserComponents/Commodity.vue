<template>
  <el-main>
    <div class="products">
      <div class="product" v-for="product in products" :key="product.product_id">
        <img :src="product.image" />
        <p>{{ product.name }}</p>
        <p>{{ product.description }}</p>
        <p class="price">${{ product.price }}</p>
        <button @click="addToCart(product.product_id)">加入购物车</button>
        <button @click="Reservation(product.product_id)">预约</button>
      </div>
    </div>
  </el-main>
</template>

<script>
import axios from 'axios';
import { ElMessage } from 'element-plus';

export default {
  data() {
    return {
      products: [],
      userId: null,
    };
  },
  created() {
    this.fetchProducts();
    this.userId = this.getUserId();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get('/api/commodity');
        if (response.data.code == 200) {
          this.products = response.data.Data;
          console.log(response.data.Data);
        }
      } catch (error) {
        ElMessage.error(response.data.msg)
      }
    },
    async addToCart(productId) {
      if (!this.userId) {
        ElMessage.error('您还未登录!');
        return;
      }
      try {
        const response = await axios.get('/api/add-to-cart', {
          params: {
            userId: this.userId,
            productId: productId,
            quantity: 1
          }
        });
        if (response.data.code == 200) {
          ElMessage.success(response.data.msg);
        } else {
          ElMessage.error(response.data.msg);
        }
      } catch (error) {
        console.log(error);
        ElMessage.error('添加到购物车失败!');
      }
    },
    getUserId() {
      return sessionStorage.getItem('userID') || null;
    },
    async Reservation(product_id) {
      if (!this.userId) {
        ElMessage.error('您还未登录');
        return;
      }
      try {
        const response = await axios.get('/api/add-reservation', {
          params: {
            userID: this.userId,
            productID: product_id,
            amount: 1
          }
        });
        if (response.data.code === 200) {
          ElMessage.success(response.data.msg);
        } else {
          ElMessage.error(response.data.msg);
        }
      } catch (error) {
        ElMessage.error('添加到预约失败')
      }
    }
  },
};
</script>

<style scoped>
.products {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
}

.product {
  background-color: #23b9b9;
  border: 1px solid #2d502d;
  border-radius: 8px;
  padding: 20px;
  width: 30%;
  box-sizing: border-box;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.product img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.product p {
  margin: 10px 0;
}

.product p:first-of-type {
  font-weight: bold;
  /* 商品名称加粗 */
}

.product:hover {
  transform: translateY(-5px);
  /* 鼠标悬停时上移 */
}

.product .price {
  font-size: 1.2em;
  font-weight: bold;
  color: #e74c3c;
  /* 价格的颜色 */
}

.product button {
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

.product button:hover {
  background: linear-gradient(90deg, #2980b9, #3498db);
  /* 按钮悬停时的渐变背景颜色 */
  transform: translateY(-3px);
  /* 鼠标悬停时上移 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  /* 按钮悬停时的阴影效果 */
}
</style>
