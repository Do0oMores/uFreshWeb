<template>
    <div>
        <div v-if="isSelected">
            <el-form class="select-div">
                <h1 class="title">查询商品溯源信息</h1>
                <el-form-item label="">
                    <el-input type="text" v-model="productName" placeholder="预查询商品" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width:100%;" @click="fetchData()">
                        查询
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div v-if="!isSelected">
            <el-button type="primary" style="width:100%;" @click="back()">
                当前查询的商品是 [{{ productName }}] 点击返回重新查询其他商品
            </el-button>
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column prop="name" label="商品名" width="180" />
                <el-table-column prop="description" label="描述信息" />
                <el-table-column prop="price" label="单价" />
                <el-table-column prop="origin" label="来源地" />
                <el-table-column prop="production_date" label="生产日期" />
                <el-table-column prop="support" label="制造商" />
                <el-table-column prop="create_time" label="入库时间" />
                <el-table-column prop="shelf_life" label="保质期(天)" />
                <el-table-column prop="type" label="类别" />
            </el-table>
        </div>
    </div>
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
                axios.get('/api/commodityorigin?productName=' + this.productName).then(response => {
                    console.log(response.data);
                    if (response.data.code == 200) {
                        ElMessage.success(response.data.msg);
                        this.tableData = response.data.Data;
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
.select-div {
    border-radius: 10px;
    margin: 0px auto;
    width: 350px;
    padding: 30px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    text-align: left;
    box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
}

.title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
}
</style>