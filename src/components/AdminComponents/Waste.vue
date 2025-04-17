<template>
    <div class="loss-goods-page">
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <span>商品损耗记录</span>
                </div>
            </template>

            <!-- 商品搜索和损耗输入表单 -->
            <el-form :model="form" label-width="120px" @submit.prevent="addLossRecord">
                <el-form-item label="商品名称">
                    <el-autocomplete v-model="form.goodsName" :fetch-suggestions="querySearch" placeholder="请输入商品名称"
                        @select="handleSelect" clearable style="width: 100%">
                        <template #default="{ item }">
                            <div class="goods-option">
                                <span>{{ item.name }}</span>
                                <span class="goods-stock">库存: {{ item.stock }}</span>
                            </div>
                        </template>
                    </el-autocomplete>
                </el-form-item>

                <el-form-item label="商品ID" v-if="form.goodsId">
                    <el-input v-model="form.goodsId" disabled />
                </el-form-item>

                <el-form-item label="损耗数量" prop="lossAmount">
                    <el-input-number v-model="form.lossAmount" :min="1" :step="1" :precision="2"
                        controls-position="right" />
                    <span class="unit">件</span>
                </el-form-item>

                <el-form-item label="损耗原因">
                    <el-select v-model="form.reason" placeholder="请选择损耗原因" clearable>
                        <el-option v-for="item in reasonOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>

                <el-form-item label="备注">
                    <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入备注信息" />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="addLossRecord">添加损耗记录</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>

            <!-- 损耗记录表格 -->
            <el-table :data="lossRecords" border style="width: 100%; margin-top: 20px">
                <el-table-column prop="goodsId" label="商品ID" width="100" />
                <el-table-column prop="goodsName" label="商品名称" />
                <el-table-column prop="lossAmount" label="损耗数量" width="120">
                    <template #default="{ row }">
                        {{ row.lossAmount }} 件
                    </template>
                </el-table-column>
                <el-table-column prop="reason" label="损耗原因" width="150">
                    <template #default="{ row }">
                        {{ getReasonLabel(row.reason) }}
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" />
                <el-table-column prop="createTime" label="记录时间" width="180" />
                <el-table-column label="操作" width="120">
                    <template #default="{ $index }">
                        <el-button type="danger" size="small" @click="deleteRecord($index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

export default {
    setup() {
        const goodsList = ref([])

        // 损耗原因选项
        const reasonOptions = ref([
            { value: 'expired', label: '过期' },
            { value: 'damaged', label: '破损' },
            { value: 'stolen', label: '失窃' },
            { value: 'other', label: '其他' },
        ])

        // 表单数据
        const form = ref({
            goodsName: '',
            goodsId: '',
            lossAmount: 1,
            reason: '',
            remark: '',
        })

        // 损耗记录
        const lossRecords = ref([])

        // 获取商品列表
        const fetchCommodities = async () => {
            try {
                const response = await axios.post("/api/fetchWasteCommodities")
                if (response.data.code === 200) {
                    goodsList.value = response.data.data.map(item => ({
                        id: item.commodity_id,
                        name: item.commodity_name,
                        stock: item.inventory
                        // price: item.price || 0
                    }))
                } else if (response.data.code === 401) {
                    ElMessage.error(response.data.message)
                    window.location.href = '/login'
                } else {
                    ElMessage.error(response.data.message || '获取商品列表失败')
                }
            } catch (error) {
                console.error('获取商品列表出错:', error)
                ElMessage.error('获取商品列表失败，请稍后重试')
            }
        }

        // 获取损耗记录
        const fetchLossRecords = async () => {
            try {
                const response = await axios.post("/api/fetchLossRecords")
                if (response.data.code === 200) {
                    lossRecords.value = response.data.data.map(item => ({
                        goodsId: item.commodity_id,
                        goodsName: item.commodity_name,
                        lossAmount: item.loss_amount,
                        reason: item.reason,
                        remark: item.remark,
                        createTime: item.create_time || new Date().toLocaleString()
                    }))
                } else if (response.data.code === 401) {
                    ElMessage.error(response.data.message)
                    window.location.href = '/login'
                } else {
                    ElMessage.error(response.data.message || '获取损耗记录失败')
                }
            } catch (error) {
                console.error('获取损耗记录出错:', error)
                ElMessage.error('获取损耗记录失败，请稍后重试')
            }
        }

        // 加载数据
        onMounted(() => {
            fetchCommodities()
            fetchLossRecords()
        })

        // 商品搜索
        const querySearch = (queryString, cb) => {
            const results = queryString
                ? goodsList.value.filter((item) =>
                    item.name.toLowerCase().includes(queryString.toLowerCase())
                )
                : goodsList.value
            cb(
                results.map((item) => ({
                    value: item.name,
                    name: item.name,
                    id: item.id,
                    stock: item.stock,
                }))
            )
        }

        // 选择商品
        const handleSelect = (item) => {
            console.log('Selected item:', item)
            form.value.goodsId = item.id
            form.value.goodsName = item.name
        }

        // 添加损耗记录
        const addLossRecord = async () => {
            if (!form.value.goodsId) {
                ElMessage.warning('请选择商品')
                return
            }

            if (form.value.lossAmount <= 0) {
                ElMessage.warning('损耗数量必须大于0')
                return
            }

            const selectedGoods = goodsList.value.find(
                (item) => item.id === form.value.goodsId
            )

            // 检查库存是否足够
            if (selectedGoods.stock < form.value.lossAmount) {
                ElMessage.warning(`库存不足，当前库存为 ${selectedGoods.stock}`)
                return
            }

            try {
                const response = await axios.post("/api/addLossRecord", {
                    commodity_id: form.value.goodsId,
                    waste_amount: form.value.lossAmount,
                    waste_type: form.value.reason,
                    remarks: form.value.remark
                })

                if (response.data.code === 200) {
                    // 添加到本地记录
                    const newRecord = {
                        goodsId: form.value.goodsId,
                        goodsName: selectedGoods.name,
                        lossAmount: form.value.lossAmount,
                        reason: form.value.reason,
                        remark: form.value.remark,
                        createTime: new Date().toLocaleString(),
                    }
                    lossRecords.value.unshift(newRecord)
                    // 更新本地库存
                    selectedGoods.stock -= form.value.lossAmount
                    ElMessage.success(response.data.message);
                    resetForm()
                } else if (response.data.code === 401) {
                    ElMessage.error(response.data.message)
                    window.location.href = '/login'
                } else {
                    ElMessage.error(response.data.message || '添加损耗记录失败')
                }
            } catch (error) {
                console.error('添加损耗记录出错:', error)
                ElMessage.error('添加损耗记录失败，请稍后重试')
            }
        }

        // 删除记录
        const deleteRecord = async (index) => {
            try {
                await ElMessageBox.confirm('确定要删除这条损耗记录吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                })

                const record = lossRecords.value[index]
                const response = await axios.post("/api/deleteLossRecord", {
                    id: record.id
                })

                if (response.data.code === 200) {
                    const goods = goodsList.value.find(
                        (item) => item.id === record.goodsId
                    )
                    if (goods) {
                        goods.stock += record.lossAmount
                    }

                    lossRecords.value.splice(index, 1)
                    ElMessage.success('删除成功')
                } else if (response.data.code === 401) {
                    ElMessage.error(response.data.message)
                    window.location.href = '/login'
                } else {
                    ElMessage.error(response.data.message || '删除损耗记录失败')
                }
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('删除损耗记录出错:', error)
                    ElMessage.error('删除损耗记录失败，请稍后重试')
                }
            }
        }

        const resetForm = () => {
            form.value = {
                goodsName: '',
                goodsId: '',
                lossAmount: 1,
                reason: '',
                remark: '',
            }
        }

        const getReasonLabel = (value) => {
            const reason = reasonOptions.value.find((item) => item.value === value)
            return reason ? reason.label : value
        }

        return {
            goodsList,
            reasonOptions,
            form,
            lossRecords,
            querySearch,
            handleSelect,
            addLossRecord,
            resetForm,
            deleteRecord,
            getReasonLabel,
        }
    },
}
</script>


<style scoped>
.loss-goods-page {
    padding: 20px;
}

.box-card {
    max-width: 1200px;
    margin: 0 auto;
}

.card-header {
    font-size: 18px;
    font-weight: bold;
}

.goods-option {
    display: flex;
    justify-content: space-between;
}

.goods-stock {
    color: #999;
    font-size: 12px;
}

.unit {
    margin-left: 10px;
    color: #666;
}

.el-input-number {
    width: 150px;
}
</style>