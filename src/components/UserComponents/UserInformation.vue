<template>
    <div>
        <el-row style="margin-bottom: 20px; justify-content: center;">
            <!-- 头像卡片 -->
            <el-col :span="24" sm="18" md="12" lg="8">
                <el-card class="user-card" shadow="hover">
                    <!-- 头像和用户名板块 -->
                    <div class="avatar-username-section">
                        <div class="avatar-container">
                            <el-upload class="avatar-upload" action="/api/upload" show-file-list="false"
                                :on-change="handleAvatarChange" :disabled="!isEditingAvatar" multiple
                                :file-list="fileList" :before-upload="beforeAvatarUpalod">
                                <el-avatar size="120" :src="'http://localhost:8081' + avatarUrl" alt="用户头像" class="avatar-img"
                                    id="imageContainer" />
                            </el-upload>
                            <div class="username-container">
                                <span class="username">{{ tableData.user_name }}</span>
                                <el-button v-if="!isEditingAvatar" @click="editAvatar" class="edit-button"
                                    icon="el-icon-edit" size="small">编辑</el-button>
                                <el-button v-else @click="saveAvatar" class="edit-button" type="primary"
                                    size="small">确认</el-button>
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>

            <!-- 个人资料卡片 -->
            <el-col :span="24" sm="18" md="12" lg="8">
                <el-card class="user-card" shadow="hover">
                    <div class="profile-section">
                        <div class="section-header">
                            <strong>个人资料</strong>
                            <el-button v-if="!isEditingProfileInfo" @click="editProfileInfo" class="edit-profile-info"
                                size="small">编辑个人信息</el-button>
                            <el-button v-else @click="saveProfileInfo" class="edit-profile-info" type="primary"
                                size="small">确认</el-button>
                        </div>
                        <div class="profile-info">
                            <div>
                                <strong>用户名: </strong>
                                <el-input v-if="isEditingProfileInfo" v-model="tableData.user_name" placeholder="请输入用户名"
                                    class="input-field"></el-input>
                                <span v-else>{{ tableData.user_name }}</span>
                            </div>
                            <div>
                                <strong>电子邮件: </strong>
                                <el-input v-if="isEditingProfileInfo" v-model="tableData.email" placeholder="请输入电子邮件"
                                    class="input-field"></el-input>
                                <span v-else>{{ tableData.email }}</span>
                            </div>
                            <div>
                                <strong>密码: </strong>
                                <el-input v-if="isEditingProfileInfo" v-model="tableData.password" placeholder="请输入密码"
                                    class="input-field" type="password"></el-input>
                                <span v-else>{{ tableData.password }}</span>
                            </div>
                            <div>
                                <strong>注册时间: </strong>
                                <span>{{ tableData.register_time }}</span>
                            </div>

                            <!-- 验证码框 -->
                            <div v-if="isEditingProfileInfo">
                                <el-input v-model="captcha" placeholder="请输入验证码" class="input-field"
                                    style="margin-top: 10px;" />
                                <el-button @click="sendVerificationCode" class="send-captcha-btn" size="small"
                                    style="margin-top: 10px;">发送验证码</el-button>
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>

            <!-- 配送信息卡片 -->
            <el-col :span="24" sm="18" md="12" lg="8">
                <el-card class="user-card" shadow="hover">
                    <div class="delivery-section">
                        <div class="section-header">
                            <strong>配送信息</strong>
                            <el-button v-if="!isEditingDeliveryInfo" @click="editDeliveryInfo"
                                class="edit-delivery-info" size="small">编辑配送信息</el-button>
                            <el-button v-else @click="saveDeliveryInfo" class="edit-delivery-info" type="primary"
                                size="small">确认</el-button>
                        </div>
                        <div class="delivery-info">
                            <div>
                                <strong>地址: </strong>
                                <el-input v-if="isEditingDeliveryInfo" v-model="tableData.address" placeholder="请输入地址"
                                    class="input-field"></el-input>
                                <span v-else>{{ tableData.address }}</span>
                            </div>
                            <div>
                                <strong>电话: </strong>
                                <el-input v-if="isEditingDeliveryInfo" v-model="tableData.phone" placeholder="请输入电话"
                                    class="input-field"></el-input>
                                <span v-else>{{ tableData.phone }}</span>
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import axios from 'axios';
import { ElMessage } from 'element-plus';

export default {
    data() {
        return {
            isEditingAvatar: false,
            isEditingProfileInfo: false,
            isEditingDeliveryInfo: false, 
            avatarUrl: '',
            captcha: '',
            tableData: [],
            editIndex: -1,
            userId: null
        };
    },
    created() {
        this.userId = this.getUserId();
        if (this.userId) {
            this.fetchInformation();
        } else {
            ElMessage.error("用户ID未找到，请重新登录");
            this.$router.push('/login');
        }
    },
    methods: {
        async handleAvatarChange(file) {
            console.log(this.userId);
            if (file.status === 'success') {

                this.avatarUrl = URL.createObjectURL(file.raw);

                const formData = new FormData();
                formData.append('file', file.raw);
                formData.append('user_id', this.userId);

                try {
                    const response = await axios.post('/api/upload', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                    const data = response.data;
                    if (data.code === 200) {
                        ElMessage.success(data.message);
                        this.avatarUrl = data.data;
                    } else {
                        ElMessage.error(data.message);
                    }
                } catch (error) {
                    console.log(error);
                    ElMessage.error('上传失败');
                }
            } else {
                console.log("文件未上传")
            }
        },
        // 开始编辑头像
        async editAvatar() {
            this.isEditingAvatar = true;
        },
        // 保存头像
        async saveAvatar() {
            this.isEditingAvatar = false;
            this.$message.success('头像已保存');
        },
        // 编辑个人资料按钮点击
        editProfileInfo() {
            this.isEditingProfileInfo = true;
        },
        // 保存个人资料按钮点击
        async saveProfileInfo() {
            this.isEditingProfileInfo = false;
            try {
                axios.post('/api/verify', {
                    email: this.email,
                    code: this.captcha
                }).then((response => {
                    const data = response.data;
                    const statusCode = Object.keys(data)[0];
                    if (statusCode === "200") {
                        try {
                            axios.post('/api/save-user', {
                                user_id: this.userId,
                                user_name: this.tableData.user_name,
                                password: this.tableData.password,
                                email: this.tableData.email
                            }).then((response => {
                                const data = response.data;
                                const statusCode = Object.keys(data)[0];
                                const message = data[statusCode];
                                if (statusCode === "200") {
                                    ElMessage.success(message)
                                } else {
                                    ElMessage.error(message)
                                }
                            }))
                        }
                        catch (error) {
                            console.log(error.$message);
                            ElMessage.error("服务器错误，请稍后再试")
                        }
                    }
                }))
            } catch (error) {
                console.log(error.$message);
                ElMessage.error("服务器错误，请稍后再试")
            }
        },
        // 发送验证码
        async sendVerificationCode() {
            try {
                const response = await axios.post('/api/mail', {
                    email: this.tableData.email
                });
                const data = response.data;
                const statusCode = Object.keys(data)[0];
                const message = data[statusCode];
                if (statusCode === "200") {
                    ElMessage.success(message)
                } else {
                    ElMessage.error(message)
                }
            } catch (error) {
                ElMessage.error("服务器错误，请稍后再试");
            }
        },
        // 编辑配送信息按钮点击
        editDeliveryInfo() {
            this.isEditingDeliveryInfo = true;
        },
        // 保存配送信息按钮点击
        async saveDeliveryInfo() {
            this.isEditingDeliveryInfo = false;
            try {
                axios.post('/api/save-shipping', {
                    user_id: this.userId,
                    address: this.tableData.address,
                    phone: this.tableData.phone
                }).then((response => {
                    const data = response.data;
                    const statusCode = Object.keys(data)[0];
                    const message = data[statusCode];
                    if (statusCode === "200") {
                        ElMessage.success(message)
                    } else {
                        ElMessage.error(message)
                    }
                }))
            } catch (error) {
                ElMessage.error("服务器错误，请稍后再试")
            }
        },
        async fetchInformation() {
            try {
                const response = await axios.post('/api/fetch-information', {
                    user_id: this.userId
                });
                const data = response.data;
                if (data.code === 200) {
                    console.log(data.data);
                    this.tableData = data.data;
                    this.avatarUrl = data.data.avatar_url;
                    console.log(this.avatarUrl);
                } else {
                    ElMessage.error(data.msg);
                }
            } catch (error) {
                ElMessage.error("服务器错误，请稍后再试");
            }
        },
        editRow(index) {
            this.editIndex = index;
        },
        async saveRow() {
            try {
                const response = await axios.get('/api/edit-user', {
                    params: {
                        userName: this.tableData.name,
                        userPhone: this.tableData.phone,
                        userPwd: this.tableData.pwd,
                        userID: this.userId
                    }
                });
                if (response.data.code === 200) {
                    ElMessage.success(response.data.msg)
                } else {
                    ElMessage.error(response.data.msg)
                }
            } catch (error) {
                ElMessage.error('服务器错误，请稍后再试')
            }
            this.editIndex = -1;
        },
        getUserId() {
            return sessionStorage.getItem('userID') || null;
        },
        beforeAvatarUpalod(file) {
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG && !isPNG) {
                this.$message.error('上传格式只能是JPG PNG格式！');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过2MB！')
            }
        }
    }
};
</script>

<style scoped>
.el-card {
    padding: 20px;
    border-radius: 12px;
    background-color: #ffffff;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    transition: box-shadow 0.3s ease;
}

.el-card:hover {
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
}

.card-content {
    padding: 10px;
}

.avatar-username-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.avatar-container {
    display: flex;
    align-items: center;
}

.avatar-img {
    border-radius: 50%;
    border: 2px solid #409EFF;
    margin-right: 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.username-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.username {
    font-size: 18px;
    font-weight: 600;
    color: #333;
}

.edit-button {
    margin-left: 10px;
    font-size: 14px;
    color: #409EFF;
    border: 1px solid #409EFF;
    border-radius: 4px;
    padding: 5px 10px;
    transition: background-color 0.3s ease;
}

.edit-button:hover {
    background-color: #409EFF;
    color: white;
}

.profile-section,
.delivery-section {
    margin-top: 25px;
    padding: 15px;
    border-radius: 8px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 15px;
    color: #555;
}

.profile-info,
.delivery-info {
    font-size: 14px;
    color: #666;
}

.profile-info div,
.delivery-info div {
    margin-bottom: 12px;
}

.input-field {
    width: 100%;
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 14px;
    transition: border-color 0.3s ease;
}

.input-field:focus {
    border-color: #409EFF;
}

.send-captcha-btn {
    margin-top: 10px;
    padding: 6px 12px;
    background-color: #409EFF;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.send-captcha-btn:hover {
    background-color: #338cca;
}

.edit-profile-info,
.edit-delivery-info {
    font-size: 14px;
    color: #409EFF;
    border: 1px solid #409EFF;
    padding: 4px 8px;
    border-radius: 4px;
}

.edit-profile-info:hover,
.edit-delivery-info:hover {
    background-color: #409EFF;
    color: white;
}

.avatar-upload .el-avatar {
    cursor: pointer;
    transition: transform 0.3s ease;
}

.avatar-upload .el-avatar:hover {
    transform: scale(1.1);
}

@media (max-width: 768px) {
    .el-col {
        padding: 0 15px;
    }

    .el-card {
        padding: 15px;
    }

    .avatar-img {
        width: 100px;
        height: 100px;
    }
}
</style>