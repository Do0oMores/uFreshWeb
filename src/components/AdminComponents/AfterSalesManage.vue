<template>
    <div class="container">
        <h2 class="title">售后订单管理</h2>
        <el-row :gutter="20" class="search-bar">
            <el-col :span="4">
                <el-input v-model="order_uuid" placeholder="请输入订单号" clearable></el-input>
            </el-col>

            <el-col :span="4">
                <el-select v-model="type" placeholder="请选择售后类型" clearable>
                    <el-option label="退货" value="退货"></el-option>
                    <el-option label="换货" value="换货"></el-option>
                </el-select>
            </el-col>

            <el-col :span="4">
                <el-select v-model="status" placeholder="请选择售后进度" clearable>
                    <el-option label="已提交" value="已提交"></el-option>
                    <el-option label="处理中" value="处理中"></el-option>
                    <el-option label="已完成" value="已完成"></el-option>
                    <el-option label="售后申请不通过" value="售后申请不通过"></el-option>
                </el-select>
            </el-col>

            <el-col :span="2" class="search-actions">
                <el-button type="primary" @click="selectAfterSales()">查询</el-button>
            </el-col>
        </el-row>

        <div class="table-container" v-if="isSelected">
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column prop="order_uuid" label="订单号" />
                <el-table-column prop="service_type" label="售后类型" />
                <el-table-column prop="reasons" label="售后原因" />
                <el-table-column prop="image" label="图片">
                    <template #default="scope">
                        <el-image v-if="scope.row.image" style="width: 80px; height: 80px; cursor: pointer"
                            :src="'http://localhost:8081' + scope.row.image"
                            :preview-src-list="['http://localhost:8081' + scope.row.image]" fit="cover"
                            :preview-teleported="true" :z-index="9999">
                            <template #error>
                                <div class="image-error">加载失败</div>
                            </template>
                        </el-image>
                        <span v-else>无图片</span>
                    </template>
                </el-table-column>
                <el-table-column prop="progress" label="售后进度" />
            </el-table>
        </div>
    </div>

    <div v-if="!isSelected" class="container">
        <el-button type="primary" style="width:100%;" @click="back()" class="back-btn">
            {{ message }} 点击返回重新查询其他售后订单
        </el-button>
        <div class="table-container">
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column prop="order_uuid" label="订单号">
                    <template #default="scope">
                        <span>{{ scope.row.order_uuid }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="service_type" label="售后类型">
                    <template #default="scope">
                        <span>{{ scope.row.service_type }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="reasons" label="售后原因">
                    <template #default="scope">
                        <span>{{ scope.row.reasons }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="image" label="图片">
                    <template #default="scope">
                        <el-image v-if="scope.row.image" style="width: 80px; height: 80px; cursor: pointer"
                            :src="'http://localhost:8081' + scope.row.image"
                            :preview-src-list="['http://localhost:8081' + scope.row.image]" fit="cover"
                            :preview-teleported="true" :z-index="9999">
                            <template #error>
                                <div class="image-error">加载失败</div>
                            </template>
                        </el-image>
                        <span v-else>无图片</span>
                    </template>
                </el-table-column>
                <el-table-column prop="progress" label="售后进度">
                    <template #default="scope">
                        <el-select v-if="editIndex === scope.$index" v-model="scope.row.progress" placeholder="售后进度">
                            <el-option label="打回订单" value="售后申请不通过"></el-option>
                            <el-option label="处理中" value="处理中"></el-option>
                            <el-option label="已完成" value="已完成"></el-option>
                        </el-select>
                        <span v-else>{{ scope.row.progress }}</span>
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
    order_uuid: string;
    service_type: string;
    reasons: string;
    image: string;
    progress: string;
}

export default {
    data() {
        return {
            isSelected: true,
            order_uuid: "",
            tableData: [] as TableData[],
            editIndex: -1,
            ordertableData: [],
            email: "",
            phone: '',
            register_time: '',
            message: '',
            status: '',
            type: ''
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
            const userData = this.tableData[index];
            axios.post('/api/admin-edit-aftersales', {
                progress: userData.progress,
                order_uuid: userData.order_uuid
            }).then(response => {
                if (response.data.code == 200) {
                    ElMessage.success(response.data.message);
                    this.editIndex = -1;
                } else {
                    ElMessage.error(response.data.message);
                }
            }).catch(error => {
                console.log(error);
                ElMessage.error("请求失败");
            });
        },
        async selectAfterSales() {
            try {
                const response = await axios.post("/api/selectAfterSales", {
                    order_uuid: this.order_uuid,
                    service_type: this.type,
                    progress: this.status
                });
                if (response.data.code === 200) {
                    this.tableData = response.data.data;
                    console.log(this.tableData);
                    this.isSelected = false;
                } else {
                    ElMessage.error(response.data.message);
                }
            } catch (error) {
                ElMessage.error("服务器错误，请稍后再试");
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
    /* overflow: hidden; */
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

:deep(.el-image-viewer__wrapper) {
    z-index: 9999 !important;
}

:deep(.el-image-viewer__mask) {
    z-index: 9998 !important;
}

:deep(.el-image-viewer__canvas) {
    z-index: 10000 !important;
}
</style>