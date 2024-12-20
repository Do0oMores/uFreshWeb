<template>
    <div class="container">
        <h2 class="title">用户管理</h2>
        <el-row :gutter="20" class="search-bar">
            <el-col :span="4">
                <el-input v-model="username" placeholder="请输入用户名" clearable></el-input>
            </el-col>

            <el-col :span="4">
                <el-input v-model="email" placeholder="请输入电子邮件" clearable></el-input>
            </el-col>

            <el-col :span="4">
                <el-input v-model="phone" placeholder="请输入电话" clearable></el-input>
            </el-col>

            <el-col :span="4">
                <el-date-picker v-model="register_time" placeholder="注册日期" type="date" clearable value-format="YYYY-MM-DD"></el-date-picker>
            </el-col>

            <el-col :span="2" class="search-actions">
                <el-button type="primary" @click="fetchData()">查询</el-button>
            </el-col>
        </el-row>

        <div class="table-container" v-if="isSelected">
            <el-table :data="usertableData" stripe style="width: 100%">
                <el-table-column prop="user_id" label="用户ID" />
                <el-table-column prop="user_name" label="用户名" />
                <el-table-column prop="email" label="电子邮件" />
                <el-table-column prop="phone" label="电话" />
                <el-table-column prop="admin_enabled" label="是否为管理员" />
                <el-table-column prop="register_time" label="注册日期" />
            </el-table>
        </div>
    </div>

    <div v-if="!isSelected" class="container">
        <el-button type="primary" style="width:100%;" @click="back()" class="back-btn">
            {{ message }} 点击返回重新查询其他用户
        </el-button>
        <div class="table-container">
            <el-table :data="tableData" stripe style="width: 100%">
                <!-- <el-table-column prop="id" label="ID">
                    <template #default="scope">
                        <span>{{ scope.row.user_id }}</span>
                    </template>
                </el-table-column> -->
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
    user_id: string;
    user_name: string;
    email: string;
    phone: string;
    admin_enabled: string;
    register_time: string;
}

export default {
    setup() {
        const user_id = "";
    },
    data() {
        return {
            isSelected: true,
            username: "",
            tableData: [] as TableData[],
            editIndex: -1,
            usertableData: [],
            email: "",
            phone: '',
            register_time: '',
            message: ''
        };
    },
    created() {
        this.fetchUsers();
    },
    methods: {
        fetchData() {
            // 用户名中不能有空格
            this.username = this.username.split(/[\t\r\f\n\s]+/g).join('');
            this.email = this.email.split(/[\t\r\f\n\s]+/g).join('');
            this.phone = this.phone.split(/[\t\r\f\n\s]+/g).join('');
            // 判断用户名是否为空
            if (this.username != "" || this.email != '' || this.phone != '' || this.register_time != '') {
                axios.post('/api/select-user', {
                    user_name: this.username,
                    email: this.email,
                    phone: this.phone,
                    register_time: this.register_time
                }).then(response => {
                    if (response.data.code == 200) {
                        ElMessage.success("查询成功");
                        this.tableData = response.data.data;
                        this.message = response.data.message;
                        this.username = '';
                        this.email = '';
                        this.phone = '';
                        this.register_time = '';
                        setTimeout(() => {
                            this.isSelected = false;
                        }, 500);
                    } else {
                        ElMessage.error(response.data.message)
                    }
                }).catch(error => {
                    console.log(error);
                    ElMessage.error("请求失败");
                });
            } else {
                ElMessage.error("请填入需要查询的数据");
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
            axios.post('/api/admin-edit-user', {
                user_id: userData.user_id,
                user_name: userData.user_name,
                email: userData.email,
                phone: userData.phone,
                admin_enabled: userData.admin_enabled,
                register_time: userData.register_time
            }).then(response => {
                if (response.data.code == 200) {
                    ElMessage.success(response.data.message);
                    this.editIndex = -1; // 退出编辑模式
                } else {
                    ElMessage.error(response.data.message);
                }
            }).catch(error => {
                console.log(error);
                ElMessage.error("请求失败");
            });
        },
        async fetchUsers() {
            try {
                const response = await axios.post("/api/fetch-users");
                if (response.data.code === 200) {
                    this.usertableData = response.data.data;
                } else {
                    ElMessage.error(response.data.message);
                }
            } catch (error) {
                ElMessage.error("服务器错误，请稍后再试")
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
