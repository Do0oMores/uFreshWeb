<template>
    <div v-if="isSelected">
        <el-form class="select-div">
            <h1 class="title">查询和编辑用户信息</h1>
            <el-form-item label="">
                <el-input type="text" v-model="username" placeholder="预查询用户名" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" style="width:100%;" @click="fetchData()">
                    查询
                </el-button>
            </el-form-item>
        </el-form>
        <div>
            <el-table :data="usertableData" stripe style="width: 100%">
                <el-table-column prop="id" label="用户ID" width="180" />
                <el-table-column prop="name" label="用户名" width="180" />
                <el-table-column prop="phone" label="电话" />
                <el-table-column prop="is_admin" label="是否为管理员" />
                <el-table-column prop="register_date" label="注册日期" />
            </el-table>
        </div>
    </div>
    <div v-if="!isSelected">
        <el-button type="primary" style="width:100%;" @click="back()">
            当前查询的用户是 [{{ username }}] 点击返回重新查询其他用户
        </el-button>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="id" label="ID" width="180">
                <template #default="scope">
                    <el-input v-if="editIndex === scope.$index" v-model="scope.row.id" placeholder="ID"></el-input>
                    <span v-else>{{ scope.row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="180">
                <template #default="scope">
                    <el-input v-if="editIndex === scope.$index" v-model="scope.row.name" placeholder="姓名"></el-input>
                    <span v-else>{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="phone" label="电话">
                <template #default="scope">
                    <el-input v-if="editIndex === scope.$index" v-model="scope.row.phone" placeholder="电话"></el-input>
                    <span v-else>{{ scope.row.phone }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="is_admin" label="是否为管理员">
                <template #default="scope">
                    <el-select v-if="editIndex === scope.$index" v-model="scope.row.is_admin" placeholder="是否为管理员">
                        <el-option label="是" value="是"></el-option>
                        <el-option label="否" value="否"></el-option>
                    </el-select>
                    <span v-else>{{ scope.row.is_admin }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="register_date" label="注册日期">
                <template #default="scope">
                    <el-date-picker v-if="editIndex === scope.$index" v-model="scope.row.register_date" type="date"
                        placeholder="选择日期"></el-date-picker>
                    <span v-else>{{ scope.row.register_date }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button v-if="editIndex !== scope.$index" @click="editRow(scope.$index)">编辑</el-button>
                    <el-button v-else type="primary" @click="saveRow(scope.$index)">确认</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts">
import axios from 'axios';
import { ElMessage } from "element-plus";

interface TableData {
    id: string;
    name: string;
    phone: string;
    is_admin: string;
    register_date: string;
}

export default {
    data() {
        return {
            isSelected: true,
            username: "",
            tableData: [] as TableData[],
            editIndex: -1,
            usertableData: [],
        };
    },
    created() {
        this.fetchUsers();
    },
    methods: {
        fetchData() {
            // 用户名中不能有空格
            this.username = this.username.split(/[\t\r\f\n\s]+/g).join('');
            // 判断用户名是否为空
            if (this.username != "") {
                axios.get('/api/current?username=' + this.username).then(response => {
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
                    ElMessage.error("请求失败");
                });
            } else {
                ElMessage.error("用户名不能为空");
            }
        },
        back() {
            this.isSelected = true
        },
        editRow(index: number) {
            this.editIndex = index;
        },
        saveRow(index: number) {
            // 获取当前编辑行的数据
            const userData = this.tableData[index];

            // 发起请求传递编辑后的数据
            axios.get('/api/save-user', {
                params: {
                    userID: userData.id,
                    name: userData.name,
                    phone: userData.phone,
                    isAdmin: userData.is_admin,
                    registerDate: userData.register_date
                }
            }).then(response => {
                if (response.data.code == 200) {
                    ElMessage.success(response.data.msg);
                    this.editIndex = -1; // 退出编辑模式
                } else {
                    ElMessage.error(response.data.msg);
                }
            }).catch(error => {
                console.log(error);
                ElMessage.error("请求失败");
            });
        },
        async fetchUsers() {
            try{
                const response=await axios.get("/api/fetch-users");
                if(response.data.code===200){
                    this.usertableData=response.data.Data;
                }else{
                    ElMessage.error(response.data.msg);
                }
            }catch(error){
                ElMessage.error("服务器错误，请稍后再试")
            }
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
