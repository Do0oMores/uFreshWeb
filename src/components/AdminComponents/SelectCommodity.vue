<template>
  <div class="container">
    <h2 class="title">生鲜商品管理</h2>
    <el-row :gutter="20" class="search-bar">
      <el-col :span="4">
        <el-input v-model="productName" placeholder="请输入商品名" clearable></el-input>
      </el-col>
      <el-col :span="4">
        <el-select v-model="productType" placeholder="请选择商品类型" clearable>
          <el-option label="时令水果" value="时令水果"></el-option>
          <el-option label="品质肉禽" value="品质肉禽"></el-option>
          <el-option label="海鲜水产" value="海鲜水产"></el-option>
          <el-option label="蔬菜蛋品" value="蔬菜蛋品"></el-option>
          <el-option label="面点烘焙" value="面点烘焙"></el-option>
        </el-select>
      </el-col>

      <el-col :span="4">
        <el-date-picker v-model="productionDate" placeholder="请选择生产日期" type="date" clearable></el-date-picker>
      </el-col>

      <el-col :span="4">
        <el-date-picker v-model="expirationDate" placeholder="请选择过期日期" type="date" clearable></el-date-picker>
      </el-col>

      <el-col :span="4">
        <el-input v-model="manufacturer" placeholder="请输入生产商" clearable></el-input>
      </el-col>

      <el-col :span="2" class="search-actions">
        <el-button type="primary" @click="fetchData()">查询</el-button>
      </el-col>
    </el-row>

    <el-row class="button-group">
      <el-button type="primary" @click="addProduct()">新增</el-button>
      <el-button type="warning">修改</el-button>
      <el-button type="success">提交</el-button>
    </el-row>

    <div class="table-container">
      <el-table :data="commoditytableData" stripe style="width: 100%">
        <el-table-column prop="commodity_id" label="商品ID"/>
        <el-table-column prop="commodity_name" label="商品名"/>
        <el-table-column prop="description" label="描述信息" />
        <el-table-column prop="type" label="类别" />
        <el-table-column prop="price" label="单价" />
        <el-table-column prop="inventory" label="库存量" />
        <el-table-column prop="mfd" label="生产日期" />
        <el-table-column prop="exp" label="过期时间" />
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import router from '@/router';
import axios from 'axios';
import { ElMessage } from "element-plus";

interface TableData {
  product_id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  origin: string;
  production_date: string;
  support: string;
  create_time: string;
  shelf_life: number;
  type: string;
}

export default {
  data() {
    return {
      productName: "",
      productType: "",
      productionDate: "",
      manufacturer: "",
      expirationDate: "",
      isSelected: true,
      tableData: [] as TableData[],
      editIndex: -1,
      commoditytableData: []
    };
  },
  created() {
    this.fetchCommodities();
  },
  methods: {
    fetchData() {
      this.productName = this.productName.split(/[\t\r\f\n\s]+/g).join('');
      if (this.productName != "") {
        axios.get('/api/products', {
          params: {
            productName: this.productName
          }
        }).then(response => {
          if (response.data.code == 200) {
            ElMessage.success(response.data.msg);
            this.tableData = response.data.Data;
            setTimeout(() => {
              this.isSelected = false;
            }, 500);
          } else {
            ElMessage.error(response.data.msg);
          }
        }).catch(error => {
          console.log(error);
          ElMessage.error("请求失败");
        });
      } else {
        ElMessage.error("商品名不能为空");
      }
    },
    back() {
      this.isSelected = true;
    },
    editRow(index: number) {
      this.editIndex = index;
    },
    saveRow(index: number) {
      const productData = this.tableData[index];

      axios.get('/api/save-product', {
        params: {
          product_id: productData.product_id,
          name: productData.name,
          description: productData.description,
          price: productData.price,
          stock: productData.stock,
          origin: productData.origin,
          product_date: productData.production_date,
          support: productData.support,
          create_time: productData.create_time,
          shelf_life: productData.shelf_life,
          type: productData.type
        }
      })
        .then(response => {
          if (response.data.code == 200) {
            ElMessage.success("编辑已保存");
            this.editIndex = -1; // 退出编辑模式
          } else {
            ElMessage.error("保存失败：" + response.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
          ElMessage.error("请求失败");
        });
    },
    async fetchCommodities() {
      try {
        const response = await axios.post("/api/fetch-commodities");
        if (response.data.code === 200) {
          this.commoditytableData = response.data.data;
        } else {
          ElMessage.error(response.data.message);
        }
      } catch (error) {
        ElMessage.error("服务器错误，请稍后再试");
      }
    }, addProduct() {
      router.push("/admin/addcommodity")
    }
  },
};
</script>

<style scoped>
.container {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.search-bar {
  margin-bottom: 20px;
  margin-right: 3px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.search-bar .el-input,
.search-bar .el-select,
.search-bar .el-date-picker {
  width: 100%;
}

.search-actions {
  display: flex;
  justify-content: center;
  align-items: center;
}

.button-group {
  margin-top: 20px;
  display: flex;
  gap: 15px;
  justify-content: left;
}

.table-container {
  margin-top: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.el-table {
  border-radius: 8px;
  overflow: hidden;
}
</style>