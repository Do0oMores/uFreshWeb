<template>
    <div v-if="isSelected">
        <el-form class="select-div">
            <h1 class="title">查询和编辑用户信息</h1>
            <el-form-item label="">
                <el-input type="text" v-model="username" placeholder="请输入用户名" autocomplete="off" class="input-field">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" style="width:100%;" @click="fetchData()" class="action-btn">
                    查询
                </el-button>
            </el-form-item>
        </el-form>
        <div>
            <el-table :data="usertableData" stripe style="width: 100%" class="user-table">
                <el-table-column prop="user_id" label="用户ID" width="180" />
                <el-table-column prop="user_name" label="用户名" width="180" />
                <el-table-column prop="email" label="电子邮件" />
                <el-table-column prop="phone" label="电话" />
                <el-table-column prop="admin_enabled" label="是否为管理员" />
                <el-table-column prop="register_time" label="注册日期" />
            </el-table>
        </div>
    </div>
    <div v-if="!isSelected">
        <el-button type="primary" style="width:100%;" @click="back()" class="back-btn">
            当前查询的用户是 [{{ username }}] 点击返回重新查询其他用户
        </el-button>
        <el-table :data="tableData" stripe style="width: 100%" class="edit-table">
            <el-table-column prop="id" label="ID">
                <template #default="scope">
                    <span>{{ scope.row.user_id }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名">
                <template #default="scope">
                    <el-input v-if="editIndex === scope.$index" v-model="scope.row.user_name" placeholder="姓名"></el-input>
                    <span v-else>{{ scope.row.user_name }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="email" label="电子邮件">
                <template #default="scope">
                    <el-input v-if="editIndex === scope.$index" v-model="scope.row.email" placeholder="电子邮件"></el-input>
                    <span v-else>{{ scope.row.email }}</span>
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
                    <el-select v-if="editIndex === scope.$index" v-model="scope.row.admin_enabled" placeholder="是否为管理员">
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
            <!-- <el-table-column prop="register_date" label="注册日期">
                <template #default="scope">
                    <el-date-picker v-if="editIndex === scope.$index" v-model="scope.row.register_time" type="date"
                        placeholder="选择日期"></el-date-picker>
                    <span v-else>{{ scope.row.register_time }}</span>
                </template>
            </el-table-column> -->
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button v-if="editIndex !== scope.$index" @click="editRow(scope.$index)"
                        class="edit-btn">编辑</el-button>
                    <el-button v-else type="primary" @click="saveRow(scope.$index)" class="save-btn">确认</el-button>
                </template>
            </el-table-column>
        </el-table>
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
                axios.post('/api/select-user', {
                    user_name: this.username
                }).then(response => {
                    if (response.data.code == 200) {
                        ElMessage.success(response.data.message);
                        this.tableData = response.data.data;
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
                    this.usertableData = response.data.Data;
                } else {
                    ElMessage.error(response.data.msg);
                }
            } catch (error) {
                ElMessage.error("服务器错误，请稍后再试")
            }
        }
    }
}
</script>

<style scoped>
.select-div {
    border-radius: 8px;
    margin: 0 auto;
    width: 380px;
    padding: 35px 40px;
    background: #fff;
    border: 1px solid #eaeaea;
    text-align: left;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
    font-family: 'Roboto', sans-serif;
}

.title {
    margin-bottom: 35px;
    text-align: center;
    color: #505458;
    font-size: 24px;
}

.input-field {
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.action-btn {
    font-size: 16px;
    font-weight: 600;
    background-color: #409EFF;
    border-color: #409EFF;
}

.action-btn:hover {
    background-color: #66b1ff;
    border-color: #66b1ff;
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

.user-table,
.edit-table {
    margin-top: 20px;
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