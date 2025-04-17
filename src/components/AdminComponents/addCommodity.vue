<template>
  <div class="add-product">
    <h1>添加商品</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-item">
        <label for="productImage">商品图片</label>
        <input type="file" id="productImage" @change="handleImageUpload" />
        <div v-if="productImagePreview" class="image-preview">
          <img :src="productImagePreview" alt="商品图片预览" />
        </div>
      </div>

      <div class="form-item">
        <label for="productName">商品名</label>
        <input type="text" id="productName" v-model="product.commodity_name" required />
      </div>

      <div class="form-item">
        <label for="productCategory">商品类别</label>
        <select id="productCategory" v-model="product.type" required>
          <option value="" disabled>请选择类别</option>
          <option value="时令水果">时令水果</option>
          <option value="品质肉禽">品质肉禽</option>
          <option value="海鲜水产">海鲜水产</option>
          <option value="蔬菜蛋品">蔬菜蛋品</option>
          <option value="面点烘焙">面点烘焙</option>
        </select>
      </div>

      <div class="form-item">
        <label>商品规格</label>
        <div class="specs-container">
          <div v-for="(spec, index) in product.specs" :key="index" class="spec-item">
            <input type="text" v-model="spec.spec" placeholder="规格名称(如:500g)" required />
            <input type="number" v-model="spec.price" placeholder="价格" min="0" step="0.01" required />
            <button type="button" @click="removeSpec(index)" class="remove-btn">删除</button>
          </div>
          <button type="button" @click="addSpec" class="add-btn">添加规格</button>
        </div>
      </div>

      <div class="form-item">
        <label for="productStock">商品库存</label>
        <input type="number" id="productStock" v-model="product.inventory" required />
      </div>

      <div class="form-item">
        <label for="productDescription">商品介绍</label>
        <textarea id="productDescription" v-model="product.description" required></textarea>
      </div>

      <div class="form-item">
        <label for="productSupplier">商品供应商</label>
        <input type="text" id="productSupplier" v-model="product.support" required />
      </div>

      <div class="form-item">
        <label for="productManufactureDate">商品生产日期</label>
        <input type="date" id="productManufactureDate" v-model="product.mfg" required />
      </div>

      <div class="form-item">
        <label for="productShelfLife">商品保质期</label>
        <input type="date" id="productShelfLife" v-model="product.exp" required />
      </div>

      <div class="form-item">
        <button type="submit">提交</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { ElMessage } from 'element-plus';

export default {
  data() {
    return {
      product: {
        commodity_name: '',
        type: '',
        inventory: '',
        description: '',
        support: '',
        mfg: '',
        exp: '',
        specs: [
          { spec: '', price: '' }
        ]
      },
      productImage: null,
      productImagePreview: null
    };
  },
  methods: {
    addSpec() {
      this.product.specs.push({ spec: '', price: '' });
    },

    removeSpec(index) {
      if (this.product.specs.length > 1) {
        this.product.specs.splice(index, 1);
      } else {
        ElMessage.warning('至少保留一个规格');
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.productImage = file;
        this.productImagePreview = URL.createObjectURL(file);
      }
    },
    async handleSubmit() {
      // 验证规格数据
      for (const spec of this.product.specs) {
        if (!spec.spec || !spec.price) {
          ElMessage.warning('请填写完整的规格信息');
          return;
        }
      }

      const formData = new FormData();
      formData.append('file', this.productImage);

      // 将规格数据转为JSON字符串
      formData.append('specs', JSON.stringify(this.product.specs));

      // 添加其他字段
      Object.keys(this.product).forEach((key) => {
        if (key !== 'specs') {
          formData.append(key, this.product[key]);
        }
      });

      try {
        const response = await axios.post('/api/addCommodityData', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        const data = response.data;
        if (data.code === 200) {
          ElMessage.success(data.message);
        } else {
          ElMessage.error(data.message);
        }
      } catch (error) {
        console.error(error);
        ElMessage.error('提交失败');
      }
      this.resetForm();
    },
    resetForm() {
      this.product = {
        commodity_name: '',
        type: '',
        price: '',
        inventory: '',
        description: '',
        support: '',
        mfg: '',
        exp: '',
        specs: [{ name: '', price: '' }]
      };
      this.productImage = null;
      this.productImagePreview = null;
    }
  },
  resetForm() {
    this.product = {
      productName: '',
      productCategory: '',
      productPrice: '',
      productStock: '',
      productDescription: '',
      productSupplier: '',
      productManufactureDate: '',
      productShelfLife: ''
    };
    this.productImage = null;
    this.productImagePreview = null;
  }
}
</script>

<style scoped>
.add-product {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.form-item {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

input[type="text"],
input[type="number"],
input[type="date"],
select,
textarea {
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

textarea {
  height: 100px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.image-preview img {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 4px;
  margin-top: 10px;
}
</style>