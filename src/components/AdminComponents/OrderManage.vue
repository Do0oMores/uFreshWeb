<template>
    <div class="container">
        <h2 class="title">订单管理</h2>
        <el-row :gutter="20" class="search-bar">
            <el-col :span="4">
                <el-input v-model="orderId" placeholder="请输入订单号" clearable></el-input>
            </el-col>

            <el-col :span="4">
                <el-input v-model="username" placeholder="请输入用户名" clearable></el-input>
            </el-col>

            <el-col :span="4">
                <el-select v-model="status" placeholder="请选择订单状态" clearable>
                    <el-option label="待处理" value="待处理"></el-option>
                    <el-option label="已确认" value="已确认"></el-option>
                    <el-option label="已完成" value="已完成"></el-option>
                    <el-option label="已取消" value="已取消"></el-option>
                </el-select>
            </el-col>

            <el-col :span="2" class="search-actions">
                <el-button type="primary" @click="selectOrders()">查询</el-button>
            </el-col>
        </el-row>

        <div class="table-container" v-if="isSelected">
            <el-table :data="ordertableData" stripe style="width: 100%">
                <el-table-column prop="order_id" label="订单号" />
                <el-table-column prop="user_name" label="用户名" />
                <el-table-column prop="status" label="订单状态" />
                <el-table-column prop="total_price" label="总价" />
                <el-table-column prop="created_time" label="创建时间" />
            </el-table>
        </div>
    </div>

    <div v-if="!isSelected" class="container">
        <el-button type="primary" style="width:100%;" @click="back()" class="back-btn">
            {{ message }} 点击返回重新查询其他用户
        </el-button>
        <div class="table-container">
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column prop="order_id" label="订单ID">
                    <template #default="scope">
                        <el-input v-if="editIndex === scope.$index" v-model="scope.row.order_id"
                            placeholder="订单ID"></el-input>
                        <span v-else>{{ scope.row.order_id }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="user_name" label="用户名">
                    <template #default="scope">
                        <el-input v-if="editIndex === scope.$index" v-model="scope.row.user_name"
                            placeholder="用户名"></el-input>
                        <span v-else>{{ scope.row.user_name }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="total_price" label="总价">
                    <template #default="scope">
                        <el-input v-if="editIndex === scope.$index" v-model="scope.row.total_price"
                            placeholder="电话"></el-input>
                        <span v-else>{{ scope.row.total_price }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="订单状态">
                    <template #default="scope">
                        <el-input v-if="editIndex === scope.$index" v-model="scope.row.status"
                            placeholder="订单状态"></el-input>
                        <span v-else>{{ scope.row.status }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="created_time" label="创建时间">
                    <template #default="scope">
                        <span>{{ scope.row.created_time }}</span>
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
    data: function () {
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
            status: '',
            orderId:''
        }
    },
    created() {
        this.fetchOrders();
    },
    methods: {
        fetchOrders() {
            axios.post('/api/fetch-orders').then(response => {
                if (response.data.code == 200) {
                    this.ordertableData = response.data.data;
                } else {
                    ElMessage.error(response.data.message)
                }
            }).catch()
        },
        editRow(index: number) {
            this.editIndex = index;
        },
        back() {
            this.isSelected = true
        },
        // saveRow(index: number) {
        //     const userData = this.tableData[index];
        //     axios.post('/api/admin-edit-order', {
        //         user_id: userData.user_id,
        //         user_name: userData.user_name,
        //         email: userData.email,
        //         phone: userData.phone,
        //         admin_enabled: userData.admin_enabled,
        //         register_time: userData.register_time
        //     }).then(response => {
        //         if (response.data.code == 200) {
        //             ElMessage.success(response.data.message);
        //             this.editIndex = -1;
        //         } else {
        //             ElMessage.error(response.data.message);
        //         }
        //     }).catch(error => {
        //         console.log(error);
        //         ElMessage.error("请求失败");
        //     });
        // },
        saveRow(index: number){

        },
        selectOrders(){
            this.orderId=this.orderId.split(/[\t\r\f\n\s]+/g).join('');
            this.username=this.username.split(/[\t\r\f\n\s]+/g).join('');
            if(this.orderId!=''||this.username!=''||this.status!=''){
                axios.post("/api/select_orders",{
                    order_id:this.orderId,
                    user_name:this.username,
                    status:this.status
                }).then(response=>{
                    if(response.data.code==200){
                        ElMessage.success("查询成功");
                        this.message=response.data.message;
                        this.tableData=response.data.data;
                        this.orderId='';
                        this.username='';
                        this.status='';
                        setTimeout(()=>{
                            this.isSelected = false;
                        },500);
                    }else{
                        ElMessage.error(response.data.message);
                    }
                }).catch(error=>{
                    console.log(error);
                    ElMessage.error("请求失败");
                })
            }else{
                ElMessage.error("请输入订单信息进行查询");
            }
        }
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