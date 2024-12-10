<template>
  <el-main>
    <!-- 商品轮播图 -->
    <el-carousel :interval="5000" arrow="always" style="margin-bottom: 20px;">
      <el-carousel-item v-for="(product, index) in products" :key="product.product_id">
        <img :src="product.image" alt="product.name" style="width: 100%; height: 400px; object-fit: cover; border-radius: 8px;" />
      </el-carousel-item>
    </el-carousel>

    <!-- 商品展示 -->
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
/* 轮播图样式 */
.el-carousel {
  margin-bottom: 30px;
}

.el-carousel-item img {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 商品展示 */
.products {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.product {
  background-color: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  padding: 20px;
  width: 30%;
  box-sizing: border-box;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.product img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 10px;
}

.product p {
  margin: 10px 0;
  color: #555;
}

.product p:first-of-type {
  font-weight: bold;
  font-size: 1.2em;
  color: #333;
}

.product:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.product .price {
  font-size: 1.4em;
  font-weight: bold;
  color: #e74c3c;
}

.product button {
  background: linear-gradient(90deg, #4caf50, #2e7d32);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  margin: 5px;
  transition: background 0.3s, transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.product button:hover {
  background: linear-gradient(90deg, #2e7d32, #4caf50);
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}
</style>