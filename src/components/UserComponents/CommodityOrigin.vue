<template>
    <el-container class="container">
        <el-header class="header">
            <h1 class="title">查询商品信息</h1>
        </el-header>
        <el-main>
            <el-card v-if="isSelected" class="search-card">
                <el-form>
                    <el-form-item>
                        <el-input v-model="productName" placeholder="请输入商品名称" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="fetchData" class="search-button">
                            查询
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-card>

            <el-card v-if="!isSelected" class="result-card">
                <el-button type="primary" @click="back" class="back-button">
                    当前查询的商品是 [{{ productName }}] 点击返回重新查询其他商品
                </el-button>
                <el-table :data="tableData" stripe border class="table">
                    <el-table-column prop="commodity_name" label="商品名" width="80" />
                    <el-table-column prop="description" label="描述信息" width="200" />
                    <el-table-column prop="mfd" label="生产日期" width="120" />
                    <el-table-column prop="support" label="制造商" width="120"/>
                    <el-table-column prop="exp" label="保质期" width="120"/>
                    <el-table-column prop="type" label="类别" width="120"/>
                </el-table>
            </el-card>
        </el-main>
    </el-container>
</template>

<script lang="ts">
import axios from 'axios';
import { ElMessage } from "element-plus";
export default {
    data: function () {
        return {
            isSelected: true,
            productName: "",
            tableData: []
        };
    },
    methods: {
        fetchData() {
            this.productName = this.productName.split(/[\t\r\f\n\s]+/g).join('');
            if (this.productName != "") {
                axios.post('/api/getCommodityOrigin',{
                    commodity_name: this.productName
                }).then(response => {
                    console.log(response.data);
                    if (response.data.code == 200) {
                        this.tableData = response.data.data;
                        setTimeout(() => {
                            this.isSelected = false;
                        }, 500);
                    } else {
                        ElMessage.error(response.data.msg)
                    }
                }).catch(error => {
                    console.log(error);
                });
            } else {
                ElMessage.error("商品名不能为空");
            }
        },
        back() {
            this.isSelected = true
        }
    }
}
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    background: #f5f7fa;
}

.header {
    width: 100%;
    text-align: center;
    padding: 20px;
    font-size: 24px;
    font-weight: bold;
    color: #303133;
}

.search-card {
    width: 400px;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.search-button {
    width: 100%;
}

.result-card {
    width: 90%;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
}

.back-button {
    margin-bottom: 15px;
    width: 100%;
}

.table {
    width: 100%;
    border-radius: 5px;
    overflow: hidden;
}
</style>