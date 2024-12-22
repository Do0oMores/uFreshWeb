<template>
    <div class="container">
        <h2 class="title">售后订单管理</h2>
        <el-row :gutter="20" class="search-bar">
            <el-col :span="4">
                <el-input v-model="username" placeholder="请输入订单号" clearable></el-input>
            </el-col>

            <el-col :span="4">
                <el-select v-model="status" placeholder="请选择售后类型" clearable>
                    <el-option label="退货" value="退货"></el-option>
                    <el-option label="换货" value="换货"></el-option>
                    <el-option label="退款" value="退款"></el-option>
                </el-select>
            </el-col>

            <el-col :span="4">
                <el-select v-model="status" placeholder="请选择售后进度" clearable>
                    <el-option label="已提交申请" value="已提交申请"></el-option>
                    <el-option label="审核中" value="审核中"></el-option>
                    <el-option label="处理中" value="处理中"></el-option>
                    <el-option label="已完成" value="已完成"></el-option>
                </el-select>
            </el-col>

            <el-col :span="2" class="search-actions">
                <el-button type="primary" @click="fetchData()">查询</el-button>
            </el-col>
        </el-row>

        <div class="table-container" v-if="isSelected">
            <el-table :data="ordertableData" stripe style="width: 100%">
                <el-table-column prop="after_sales_id" label="售后订单号" />
                <el-table-column prop="order_id" label="订单号" />
                <el-table-column prop="service_type" label="售后类型" />
                <el-table-column prop="reasons" label="售后原因" />
                <el-table-column prop="image" label="图片" />
                <el-table-column prop="progress" label="售后进度" />
            </el-table>
        </div>
    </div>

    <div v-if="!isSelected" class="container">
        <el-button type="primary" style="width:100%;" @click="back()" class="back-btn">
            {{ message }} 点击返回重新查询其他用户
        </el-button>
        <div class="table-container">
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column prop="name" label="姓名">
                    <template #default="scope">
                        <el-input v-if="editIndex === scope.$index" v-model="scope.row.user_name"
                            placeholder="姓名"></el-input>
                        <span v-else>{{ scope.row.user_name }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="email" label="电子邮件">
                    <template #default="scope">
                        <el-input v-if="editIndex === scope.$index" v-model="scope.row.email"
                            placeholder="电子邮件"></el-input>
                        <span v-else>{{ scope.row.email }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="电话">
                    <template #default="scope">
                        <el-input v-if="editIndex === scope.$index" v-model="scope.row.phone"
                            placeholder="电话"></el-input>
                        <span v-else>{{ scope.row.phone }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="is_admin" label="是否为管理员">
                    <template #default="scope">
                        <el-select v-if="editIndex === scope.$index" v-model="scope.row.admin_enabled"
                            placeholder="是否为管理员">
                            <el-option label="是" value="true"></el-option>
                            <el-option label="否" value="false"></el-option>
                        </el-select>
                        <span v-else>{{ scope.row.admin_enabled }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="register_time" label="注册日期">
                    <template #default="scope">
                        <span>{{ scope.row.register_time }}</span>
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
</template>

<script lang="ts">
import axios from 'axios';
import { ElMessage } from "element-plus";

interface TableData {
    order_id: string;
    user_name: string;
    status: string;
    total_price: string;
    created_time: string;
}

export default {
    data() {
        return {
            isSelected: true,
            username: "",
            tableData: [] as TableData[],
            editIndex: -1,
            ordertableData: [],
            email: "",
            phone: '',
            register_time: '',
            message: '',
            status: ''
        }
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            axios.post('/api/fetch-aftersales').then(response => {
                if (response.data.code == 200) {
                    this.tableData = response.data.data;
                } else {
                    ElMessage.error(response.data.message);
                }
            }).catch(error => {
                console.log(error);
                ElMessage.error("服务器错误，请求失败");
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
        },
        back() {
            this.isSelected = true
        },
        editRow(index: number) {
            this.editIndex = index;
        },
        saveRow(index: number) {

        },
    }
}
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

.back-btn {
    margin-top: 20px;
    font-size: 16px;
    background-color: #67C23A;
    border-color: #67C23A;
}

.back-btn:hover {
    background-color: #7ecf55;
    border-color: #7ecf55;
}

.edit-btn,
.save-btn {
    margin: 0 5px;
    padding: 6px 12px;
    border-radius: 5px;
}

.edit-btn {
    background-color: #F8B800;
    border-color: #F8B800;
    color: white;
}

.edit-btn:hover {
    background-color: #f9c436;
}

.save-btn {
    background-color: #67C23A;
    border-color: #67C23A;
    color: white;
}

.save-btn:hover {
    background-color: #7ecf55;
    border-color: #7ecf55;
}
</style>