<template>
    <div>
        <el-form class="select-div">
            <h1 class="title">所有预约订单</h1>
            <el-form-item>
                <el-button type="primary" style="width:100%;" @click="fetchData()">
                    查询
                </el-button>
            </el-form-item>
        </el-form>
    </div>
    <div>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="reservation_id" label="预约号" width="180" />
            <el-table-column prop="userId" label="预约用户" width="180" />
            <el-table-column prop="productId" label="预约商品" />
            <el-table-column prop="amount" label="预约数量" />
            <el-table-column prop="date" label="预约时间" />
            <el-table-column prop="status" label="预约状态" />
            <el-table-column label="操作" width="180">
                <template #default="scope">
                    <el-button type="primary" @click="changeStatus(scope.row)">更改状态</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts">
import axios from 'axios';
import { ElMessage } from "element-plus";

export default {
    data() {
        return {
            tableData: []
        }
    },
    methods: {
        fetchData() {
            axios.get('/api/reservation').then(response => {
                if (response.data.code == 200) {
                    this.tableData = response.data.Data;
                    ElMessage.success(response.data.msg);
                } else {
                    ElMessage.error(response.data.msg);
                }
            }).catch(error => {
                console.log(error);
                ElMessage.error("请求失败");
            });
        },
        changeStatus(row: any) {
            axios.get('/api/update-reservation-status', {
                params: {
                    reservation_id: row.reservation_id,
                    status: row.status
                }
            }).then(response => {
                if (response.data.code == 200) {
                    ElMessage.success(response.data.msg);
                    row.status = response.data.status;
                } else {
                    ElMessage.error(response.data.msg);
                }
            }).catch(error => {
                console.log(error);
                ElMessage.error("请求失败");
            });
        }
    }
}
</script>

<style scoped>
.select-div {
    border-radius: 10px;
    margin: 0px auto;
    width: 370px;
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