<template>
  <el-main>
    <el-carousel :interval="5000" arrow="always" style="margin-bottom: 20px;">
      <el-carousel-item v-for="(product, index) in products" :key="product.product_id">
        <img :src="'http://localhost:8081' + product.image" alt="product.name" style="width: 100%; height: 400px; object-fit: cover; border-radius: 8px;" />
      </el-carousel-item>
    </el-carousel>

    <div class="products">
      <div class="product" v-for="product in products" :key="product.product_id">
        <img :src="'http://localhost:8081' + product.image" class="product-image" />
        <p class="product-name">{{ product.commodity_name }}</p>
        <div class="product-tags">
          <span class="product-tag">{{ product.tag }}</span>
        </div>
        <p class="price">￥{{ product.price }}</p>
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
        const response = await axios.post('/api/getUserIndexCommodity');
        if (response.data.code == 200) {
          this.products = response.data.data;
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.product {
  background-color: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.product:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.product-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 10px;
}

.product-name {
  font-weight: bold;
  font-size: 1.2em;
  color: #333;
  margin-bottom: 8px;
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

.price {
  font-size: 1.4em;
  font-weight: bold;
  color: #e74c3c;
  margin-bottom: 10px;
}
</style>