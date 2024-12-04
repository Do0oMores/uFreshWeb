<template>
    <div>
        <el-row style="margin-bottom: 20px; justify-content: center;">
            <el-col :span="24" sm="18" md="12" lg="8">
                <el-card class="user-card" shadow="hover">
                    <!-- 头像和用户名板块 -->
                    <div class="avatar-username-section">
                        <div class="avatar-container">
                            <el-upload class="avatar-upload" action="#" show-file-list="false"
                                :on-change="handleAvatarChange" :disabled="!isEditingAvatar">
                                <el-avatar size="120" :src="avatarUrl" alt="用户头像" class="avatar-img" />
                            </el-upload>
                            <div class="username-container">
                                <span class="username">{{ tableData.name }}</span>
                                <el-button v-if="!isEditingAvatar" @click="editAvatar" class="edit-button"
                                    icon="el-icon-edit" size="small">编辑</el-button>
                                <el-button v-else @click="saveAvatar" class="edit-button" type="primary"
                                    size="small">确认</el-button>
                            </div>
                        </div>
                    </div>

                    <!-- 个人资料信息板块 -->
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
                                <strong>电子邮件: </strong>
                                <el-input v-if="isEditingProfileInfo" v-model="tableData.email" placeholder="请输入电子邮件"
                                    class="input-field"></el-input>
                                <span v-else>{{ tableData.email }}</span>
                            </div>
                            <div>
                                <strong>密码: </strong>
                                <el-input v-if="isEditingProfileInfo" v-model="tableData.pwd" placeholder="请输入密码"
                                    class="input-field" type="password"></el-input>
                                <span v-else>{{ tableData.pwd }}</span>
                            </div>
                            <div>
                                <strong>注册时间: </strong>
                                <span>{{ tableData.registrationTime }}</span>
                            </div>

                            <!-- 验证码框  -->
                            <div v-if="isEditingProfileInfo">
                                <el-input v-model="captcha" placeholder="请输入验证码" class="input-field"
                                    style="margin-top: 10px;" />
                                <el-button @click="sendVerificationCode" class="send-captcha-btn" size="small"
                                    style="margin-top: 10px;">发送验证码</el-button>
                            </div>
                        </div>
                    </div>

                    <!-- 配送信息板块 -->
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
            isEditingAvatar: false, // 控制头像编辑状态
            isEditingProfileInfo: false, // 控制个人信息编辑状态
            isEditingDeliveryInfo: false, // 控制配送信息编辑状态
            avatarUrl: '', // 头像 URL
            captcha: '', // 验证码
            tableData: {
                name: '张三', // 用户名
                email: 'example@example.com', // 电子邮件
                pwd: '123456', // 密码
                registrationTime: '2024-01-01', // 注册时间
                address: '某地地址', // 配送地址
                phone: '12345678901' // 电话
            },
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
        handleAvatarChange(file) {
            if (file.status === 'success') {
                this.avatarUrl = URL.createObjectURL(file.raw);
            }
        },
        // 开始编辑头像
        editAvatar() {
            this.isEditingAvatar = true;
        },
        // 保存头像
        saveAvatar() {
            this.isEditingAvatar = false;
            this.$message.success('头像已保存');
        },
        // 编辑个人资料按钮点击
        editProfileInfo() {
            this.isEditingProfileInfo = true;
        },
        // 保存个人资料按钮点击
        saveProfileInfo() {
            this.isEditingProfileInfo = false;
            this.$message.success('个人资料已保存');
        },
        // 发送验证码
        sendVerificationCode() {
            this.$message.success('验证码已发送！');
        },
        // 编辑配送信息按钮点击
        editDeliveryInfo() {
            this.isEditingDeliveryInfo = true;
        },
        // 保存配送信息按钮点击
        saveDeliveryInfo() {
            this.isEditingDeliveryInfo = false;
            this.$message.success('配送信息已保存');
        },
        async fetchInformation() {
            try {
                const response = await axios.get('/api/fetch-information', {
                    params: {
                        userID: this.userId
                    }
                });
                if (response.data.code === 200) {
                    console.log(response.data.Data);
                    this.tableData = response.data.Data;
                } else {
                    ElMessage.error(response.data.msg);
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
            //console.log('Saved data:', this.tableData);
        },
        getUserId() {
            return sessionStorage.getItem('userID') || null;
        }
    }
};
</script>

<style scoped>
.el-card {
    padding: 20px;
    border-radius: 8px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
}

.username-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.username {
    font-size: 18px;
    font-weight: 600;
}

.edit-button {
    margin-left: 10px;
}

.profile-section,
.delivery-section {
    margin-top: 20px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    margin-bottom: 15px;
}

.profile-info,
.delivery-info {
    font-size: 14px;
}

.profile-info div,
.delivery-info div {
    margin-bottom: 10px;
}

.input-field {
    width: 100%;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

.send-captcha-btn {
    margin-top: 10px;
}

.edit-profile-info,
.edit-delivery-info {
    font-size: 14px;
}

.avatar-upload .el-avatar {
    cursor: pointer;
}

@media (max-width: 768px) {
    .el-col {
        padding: 0 15px;
    }
}
</style>