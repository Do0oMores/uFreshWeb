<template>
    <div>
        <div v-if="isSelected">
            <el-form class="select-div">
                <h1 class="title">查询和编辑商品详细信息</h1>
                <el-form-item label="">
                    <el-input type="text" v-model="productName" placeholder="预查询商品" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width:100%;" @click="fetchData()">
                        查询
                    </el-button>
                </el-form-item>
            </el-form>
            <div>
                <el-table :data="commoditytableData" stripe style="width: 100%">
                    <el-table-column prop="product_id" label="商品ID" width="180" />
                    <el-table-column prop="name" label="商品名" width="180" />
                    <el-table-column prop="description" label="描述信息" />
                    <el-table-column prop="price" label="单价" />
                    <el-table-column prop="stock" label="库存量" />
                </el-table>
            </div>
        </div>
        <div v-if="!isSelected">
            <el-button type="primary" style="width:100%;" @click="back()">
                当前查询的商品是 [{{ productName }}] 点击返回重新查询其他商品
            </el-button>
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column prop="product_id" label="商品ID" width="180">
                    <template #default="scope">
                        <el-input v-if="editIndex === scope.$index" v-model="scope.row.product_id"
                            placeholder="商品ID"></el-input>
                        <span v-else>{{ scope.row.product_id }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="商品名" width="180">
                    <template #default="scope">
                        <el-input v-if="editIndex === scope.$index" v-model="scope.row.name"
                            placeholder="商品名"></el-input>
                        <span v-else>{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="description" label="描述信息">
                    <template #default="scope">
                        <el-input v-if="editIndex === scope.$index" v-model="scope.row.description"
                            placeholder="描述信息"></el-input>
                        <span v-else>{{ scope.row.description }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="price" label="单价">
                    <template #default="scope">
                        <el-input v-if="editIndex === scope.$index" v-model="scope.row.price"
                            placeholder="单价"></el-input>
                        <span v-else>{{ scope.row.price }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="stock" label="库存量">
                    <template #default="scope">
                        <el-input v-if="editIndex === scope.$index" v-model="scope.row.stock"
                            placeholder="库存量"></el-input>
                        <span v-else>{{ scope.row.stock }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="origin" label="来源地">
                    <template #default="scope">
                        <el-input v-if="editIndex === scope.$index" v-model="scope.row.origin"
                            placeholder="来源地"></el-input>
                        <span v-else>{{ scope.row.origin }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="production_date" label="生产日期">
                    <template #default="scope">
                        <el-date-picker v-if="editIndex === scope.$index" v-model="scope.row.production_date"
                            type="date" placeholder="选择日期"></el-date-picker>
                        <span v-else>{{ scope.row.production_date }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="support" label="制造商">
                    <template #default="scope">
                        <el-input v-if="editIndex === scope.$index" v-model="scope.row.support"
                            placeholder="制造商"></el-input>
                        <span v-else>{{ scope.row.support }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="入库时间">
                    <template #default="scope">
                        <el-date-picker v-if="editIndex === scope.$index" v-model="scope.row.create_time" type="date"
                            placeholder="选择日期"></el-date-picker>
                        <span v-else>{{ scope.row.create_time }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="shelf_life" label="保质期(天)">
                    <template #default="scope">
                        <el-input v-if="editIndex === scope.$index" v-model="scope.row.shelf_life"
                            placeholder="保质期"></el-input>
                        <span v-else>{{ scope.row.shelf_life }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="类别">
                    <template #default="scope">
                        <el-input v-if="editIndex === scope.$index" v-model="scope.row.type"
                            placeholder="类别"></el-input>
                        <span v-else>{{ scope.row.type }}</span>
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
    </div>
</template>

<script lang="ts">
import axios from 'axios';
import { ElMessage } from "element-plus";

interface TableData {
    product_id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    origin: string;
    production_date: string;
    support: string;
    create_time: string;
    shelf_life: number;
    type: string;
}

export default {
    data() {
        return {
            isSelected: true,
            productName: "",
            tableData: [] as TableData[],
            editIndex: -1,
            commoditytableData: []
        };
    },
    created() {
        this.fetchCommodities();
    },
    methods: {
        fetchData() {
            this.productName = this.productName.split(/[\t\r\f\n\s]+/g).join('');
            if (this.productName != "") {
                axios.get('/api/products', {
                    params: {
                        productName: this.productName
                    }
                }).then(response => {
                    if (response.data.code == 200) {
                        ElMessage.success(response.data.msg);
                        this.tableData = response.data.Data;
                        setTimeout(() => {
                            this.isSelected = false;
                        }, 500);
                    } else {
                        ElMessage.error(response.data.msg);
                    }
                }).catch(error => {
                    console.log(error);
                    ElMessage.error("请求失败");
                });
            } else {
                ElMessage.error("商品名不能为空");
            }
        },
        back() {
            this.isSelected = true;
        },
        editRow(index: number) {
            this.editIndex = index;
        },
        saveRow(index: number) {
            const productData = this.tableData[index];

            axios.get('/api/save-product', {
                params: {
                    product_id: productData.product_id,
                    name: productData.name,
                    description: productData.description,
                    price: productData.price,
                    stock: productData.stock,
                    origin: productData.origin,
                    product_date: productData.production_date,
                    support: productData.support,
                    create_time: productData.create_time,
                    shelf_life: productData.shelf_life,
                    type: productData.type
                }
            })
                .then(response => {
                    if (response.data.code == 200) {
                        ElMessage.success("编辑已保存");
                        this.editIndex = -1; // 退出编辑模式
                    } else {
                        ElMessage.error("保存失败：" + response.data.msg);
                    }
                })
                .catch(error => {
                    console.log(error);
                    ElMessage.error("请求失败");
                });
        },
        async fetchCommodities() {
            try {
                const response = await axios.get("/api/fetch-commodities");
                if (response.data.code === 200) {
                    this.commoditytableData=response.data.Data;
                }else{
                    ElMessage.error(response.data.msg);
                }
            }catch(error){
                ElMessage.error("服务器错误，请稍后再试");
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