<template>
    <div>
        <el-row style="margin-bottom: 20px;">
            <el-col :span="24">
                <el-card>
                    <div>
                        <div>
                            <strong>姓名: </strong>
                            <el-input v-if="editIndex === 0" v-model="tableData.name" placeholder="姓名"></el-input>
                            <span v-else>{{ tableData.name }}</span>
                        </div>
                        <div>
                            <strong>电话: </strong>
                            <el-input v-if="editIndex === 0" v-model="tableData.phone" placeholder="电话"></el-input>
                            <span v-else>{{ tableData.phone }}</span>
                        </div>
                        <div>
                            <strong>密码: </strong>
                            <el-input v-if="editIndex === 0" v-model="tableData.pwd" placeholder="更改密码"></el-input>
                            <span v-else>{{ tableData.pwd }}</span>
                        </div>
                        <div>
                            <el-button v-if="editIndex !== 0" @click="editRow(0)">编辑</el-button>
                            <el-button v-else type="primary" @click="saveRow(0)">确认</el-button>
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
            try{
                const response=await axios.get('/api/edit-user',{
                    params:{
                        userName:this.tableData.name,
                        userPhone:this.tableData.phone,
                        userPwd:this.tableData.pwd,
                        userID: this.userId
                    }
                });
                if(response.data.code===200){
                    ElMessage.success(response.data.msg)
                }else{
                    ElMessage.error(response.data.msg)
                }
            }catch(error){
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
}

.el-card div {
    margin-bottom: 10px;
}
</style>