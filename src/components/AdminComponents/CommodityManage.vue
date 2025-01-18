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
        <el-date-picker v-model="productionDate" placeholder="请选择生产日期" type="date" clearable
          value-format="YYYY-MM-DD"></el-date-picker>
      </el-col>

      <el-col :span="4">
        <el-date-picker v-model="expirationDate" placeholder="请选择过期日期" type="date" clearable
          value-format="YYYY-MM-DD"></el-date-picker>
      </el-col>

      <el-col :span="4">
        <el-input v-model="support" placeholder="请输入生产商" clearable></el-input>
      </el-col>

      <el-col :span="2" class="search-actions">
        <el-button type="primary" @click="fetchData()">查询</el-button>
      </el-col>
    </el-row>

    <el-row class="button-group">
      <el-button type="primary" @click="addProduct()">新增</el-button>
    </el-row>

    <div v-if="isSelected" class="table-container">
      <el-table :data="currentPageData" stripe style="width: 100%">
        <el-table-column prop="commodity_id" label="商品ID" />
        <el-table-column label="商品图片">
          <template #default="{ row }">
            <img :src="'http://localhost:8081' + row.image" alt="商品图片"
              style="width: 100px; height: 100px; object-fit: cover; border: 1px solid #ccc; border-radius: 8px;" />
          </template>
        </el-table-column>
        <el-table-column prop="commodity_name" label="商品名" />
        <el-table-column prop="description" label="描述信息" />
        <el-table-column prop="type" label="类别" />
        <el-table-column prop="price" label="单价" />
        <el-table-column prop="inventory" label="库存量" />
        <el-table-column prop="mfd" label="生产日期" />
        <el-table-column prop="exp" label="过期时间" />
        <el-table-column prop="support" label="生产商" />
        <el-table-column prop="status" label="商品状态" />
        <el-table-column prop="tag" label="商品标签" />
      </el-table>
      <el-pagination background layout="prev, pager, next, jumper, sizes" :page-size="pageSize"
        :current-page="currentPage" :total="commoditytableData.length" @size-change="handleSizeChange"
        @current-change="handlePageChange" />
    </div>

    <div v-if="!isSelected" class="container">
      <el-button type="primary" style="width:100%;" @click="back()" class="back-btn">
        {{ message }} 点击返回重新查询其它商品
      </el-button>
      <div class="table-container">
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column prop="commodity_id" label="商品ID">
            <template #default="scope">
              <span>{{ scope.row.commodity_id }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="image" label="商品图片">
            <template #default="scope">
              <div v-if="editIndex === scope.$index">
                <el-upload :auto-upload="false" :before-upload="beforeImageUpload"
                  :on-change="uploadImage" show-file-list="false" name="file">
                  <el-button type="primary" icon="el-icon-upload">上传图片</el-button>
                </el-upload>
              </div>
              <img v-else :src="scope.row.image ? 'http://localhost:8081' + scope.row.image : ''" alt="商品图片"
                style="width: 100px; height: 100px; object-fit: cover;" />
            </template>
          </el-table-column>
          <el-table-column prop="name" label="商品名">
            <template #default="scope">
              <el-input v-if="editIndex === scope.$index" v-model="scope.row.commodity_name"
                placeholder="商品名"></el-input>
              <span v-else>{{ scope.row.commodity_name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述信息">
            <template #default="scope">
              <el-input v-if="editIndex === scope.$index" v-model="scope.row.description" placeholder="描述信息"></el-input>
              <span v-else>{{ scope.row.description }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价">
            <template #default="scope">
              <el-input v-if="editIndex === scope.$index" v-model="scope.row.price" placeholder="单价"></el-input>
              <span v-else>{{ scope.row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="类别">
            <template #default="scope">
              <el-select v-if="editIndex === scope.$index" v-model="scope.row.type" placeholder="类别">
                <el-option label="时令水果" value="时令水果"></el-option>
                <el-option label="品质肉禽" value="品质肉禽"></el-option>
                <el-option label="海鲜水产" value="海鲜水产"></el-option>
                <el-option label="蔬菜蛋品" value="蔬菜蛋品"></el-option>
                <el-option label="面点烘焙" value="面点烘焙"></el-option>
              </el-select>
              <span v-else>{{ scope.row.type }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="inventory" label="库存量">
            <template #default="scope">
              <el-input v-if="editIndex === scope.$index" v-model="scope.row.inventory" placeholder="库存量"></el-input>
              <span v-else>{{ scope.row.inventory }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="mfd" label="生产日期">
            <template #default="scope">
              <el-input v-if="editIndex === scope.$index" v-model="scope.row.mfd" placeholder="生产日期"></el-input>
              <span v-else>{{ scope.row.mfd }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="exp" label="过期时间">
            <template #default="scope">
              <el-input v-if="editIndex === scope.$index" v-model="scope.row.exp" placeholder="过期时间"></el-input>
              <span v-else>{{ scope.row.exp }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="商品状态">
            <template #default="scope">
              <el-select v-if="editIndex === scope.$index" v-model="scope.row.status" placeholder="商品状态">
                <el-option label="已上架" value="已上架"></el-option>
                <el-option label="已下架" value="已下架"></el-option>
                <el-option label="缺货" value="缺货"></el-option>
              </el-select>
              <span v-else>{{ scope.row.status }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="tag" label="商品标签">
            <template #default="scope">
              <el-select v-if="editIndex === scope.$index" v-model="scope.row.tag" placeholder="商品标签">
                <el-option label="热销中" value="热销中"></el-option>
                <el-option label="打折促销" value="打折促销"></el-option>
                <el-option label="库存紧张" value="库存紧张"></el-option>
                <el-option label="即将售罄" value="即将售罄"></el-option>
              </el-select>
              <span v-else>{{ scope.row.tag }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button v-if="editIndex !== scope.$index" @click="editRow(scope.$index)"
                class="edit-btn">编辑</el-button>
              <el-button v-else type="primary" @click="saveRow(scope.$index)" class="save-btn">确认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import router from '@/router';
import axios from 'axios';
import { ElMessage } from "element-plus";

interface TableData {
  commodity_id: string;
  name: string;
  description: string;
  price: number;
  inventory: number;
  mfd: string;
  exp: string;
  status: string;
  tag: string;
  type: string;
  image: string;
}

export default {
  data() {
    return {
      productName: "",
      productType: "",
      productionDate: "",
      support: "",
      expirationDate: "",
      isSelected: true,
      tableData: [] as TableData[],
      editIndex: -1,
      commoditytableData: [],
      message: '',
      currentPage: 1,
      pageSize: 10,
    };
  },
  computed: {
    currentPageData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.commoditytableData.slice(start, end);
    }
  },
  created() {
    this.fetchCommodities();
  },
  methods: {
    fetchData() {
      this.productName = this.productName.split(/[\t\r\f\n\s]+/g).join('');
      this.support = this.support.split(/[\t\r\f\n\s]+/g).join('');
      if (this.productName != "" || this.productType != '' || this.productionDate != '' || this.expirationDate != '' || this.support != '') {
        axios.post('/api/select-commodities', {
          commodity_name: this.productName,
          type: this.productType,
          mfd: this.productionDate,
          exp: this.expirationDate,
          support: this.support
        }).then(response => {
          if (response.data.code === 200) {
            ElMessage.success("查询成功");
            this.message = response.data.message;
            this.tableData = response.data.data;
            this.productName = '';
            this.productType = '';
            this.productionDate = '';
            this.expirationDate = '';
            this.support = '';
            setTimeout(() => {
              this.isSelected = false;
            }, 500);
          } else {
            ElMessage.error(response.data.message);
          }
        }).catch(error => {
          console.log(error);
          ElMessage.error("请求失败");
        });
      } else {
        ElMessage.error("请输入商品信息进行查询");
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
      axios.post('/api/edit-commodity', {
        commodity_id: productData.commodity_id,
        commodity_name: productData.name,
        description: productData.description,
        price: productData.price,
        type: productData.type,
        inventory: productData.inventory,
        mfd: productData.mfd,
        exp: productData.exp,
        status: productData.status,
        tag: productData.tag,
      })
        .then(response => {
          if (response.data.code == 200) {
            ElMessage.success("编辑已保存");
          } else {
            ElMessage.error("保存失败：" + response.data.msg);
          }
          this.editIndex = -1;
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
          console.log(this.commoditytableData);
        } else {
          ElMessage.error(response.data.message);
        }
      } catch (error) {
        ElMessage.error("服务器错误，请稍后再试");
      }
    }, addProduct() {
      router.push("/admin/addcommodity")
    },
    handlePageChange(page: number) {
      this.currentPage = page;
    },
    handleSizeChange(size: number) {
      this.pageSize = size;
      this.currentPage = Math.min(this.currentPage, Math.ceil(this.commoditytableData.length / size));
    },
    async uploadImage(file: { raw: File }, row: TableData): Promise<void> {
      try {
        const formData = new FormData();
        formData.append("file", file.raw);
        formData.append("commodity_id", row.commodity_id);

        console.log('FormData:', formData);
        const response = await axios.post("/api/upload-commodity-image", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });

        if (response.data.success) {
          row.image = response.data.url;
          ElMessage.success("图片上传成功");
        } else {
          ElMessage.error("上传图片失败：" + response.data.msg);
        }
      } catch (error) {
        ElMessage.error("上传图片发生错误");
        console.error(error);
      }
    },
    beforeImageUpload(file: File) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG && !isPNG) {
        ElMessage.error('上传格式只能是JPG PNG格式！');
        return false; // 阻止上传
      }
      if (!isLt2M) {
        ElMessage.error('上传头像图片大小不能超过2MB！');
        return false; // 阻止上传
      }
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