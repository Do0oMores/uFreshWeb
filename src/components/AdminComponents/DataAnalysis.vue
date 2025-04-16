<template>
  <div class="data-analysis-container">

    <el-row :gutter="20" class="mt-20">
      <!-- 商品销量扇形图 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>生鲜商品销量占比</span>
              <el-tag type="success">实时</el-tag>
            </div>
          </template>
          <v-chart class="chart" :option="pieOption" autoresize />
        </el-card>
      </el-col>

      <!-- 订单数量趋势折线图 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>近30天订单数量趋势</span>
              <el-select v-model="lineDateRange" size="small" style="width: 120px">
                <el-option label="近7天" value="7" />
                <el-option label="近30天" value="30" />
                <el-option label="近90天" value="90" />
              </el-select>
            </div>
          </template>
          <v-chart class="chart" :option="lineOption" autoresize />
        </el-card>
      </el-col>

      <!-- 商品库存柱状图 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>商品库存数量</span>
              <el-button size="small" @click="refreshStock">刷新</el-button>
            </div>
          </template>
          <v-chart class="chart" :option="barOption" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <!-- 数据汇总卡片 -->
    <el-row :gutter="20" class="mt-20">
      <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card shadow="hover" class="data-card">
          <div class="data-card-content">
            <div class="data-value">¥ 24,560</div>
            <div class="data-label">今日销售额</div>
            <el-icon class="data-icon" color="#67C23A">
              <TrendCharts />
            </el-icon>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card shadow="hover" class="data-card">
          <div class="data-card-content">
            <div class="data-value">1,256</div>
            <div class="data-label">今日订单数</div>
            <el-icon class="data-icon" color="#409EFF">
              <Document />
            </el-icon>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card shadow="hover" class="data-card">
          <div class="data-card-content">
            <div class="data-value">86%</div>
            <div class="data-label">库存周转率</div>
            <el-icon class="data-icon" color="#E6A23C">
              <DataLine />
            </el-icon>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card shadow="hover" class="data-card">
          <div class="data-card-content">
            <div class="data-value">4.8</div>
            <div class="data-label">平均评分</div>
            <el-icon class="data-icon" color="#F56C6C">
              <Star />
            </el-icon>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, LineChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import {
  TrendCharts,
  Document,
  DataLine,
  Star
} from '@element-plus/icons-vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

use([
  CanvasRenderer,
  PieChart,
  LineChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

export default {
  components: {
    VChart,
    TrendCharts,
    Document,
    DataLine,
    Star
  },
  setup() {
    const lineDateRange = ref('30')

    onMounted(()=>{
      fetchInventoryData()
    })

    // 商品销量扇形图配置
    const pieOption = ref({
      title: {
        text: '销量占比',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['蔬菜', '水果', '肉类', '海鲜', '乳制品']
      },
      series: [
        {
          name: '销量占比',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 335, name: '蔬菜' },
            { value: 310, name: '水果' },
            { value: 234, name: '肉类' },
            { value: 135, name: '海鲜' },
            { value: 1548, name: '乳制品' }
          ]
        }
      ]
    })

    // 生成随机数据
    const generateRandomData = (days, min, max) => {
      return Array.from({ length: days }, () =>
        Math.floor(Math.random() * (max - min + 1)) + min
      )
    }

    // 订单数量趋势折线图配置
    const lineOption = computed(() => {
      const days = parseInt(lineDateRange.value)
      const dates = Array.from({ length: days }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - days + i + 1)
        return `${date.getMonth() + 1}/${date.getDate()}`
      })

      return {
        title: {
          text: '订单趋势',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: dates
        },
        yAxis: {
          type: 'value',
          name: '订单数'
        },
        series: [
          {
            name: '订单数量',
            type: 'line',
            data: generateRandomData(days, 50, 200),
            smooth: true,
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(64, 158, 255, 0.5)' // 起始颜色
                }, {
                  offset: 1, color: 'rgba(64, 158, 255, 0.1)' // 结束颜色
                }]
              }
            },
            itemStyle: {
              color: '#409EFF'
            }
          }
        ]
      }
    })

    // 商品库存柱状图配置
    const barOption = ref({
      title: {
        text: '库存数量',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: '库存量'
      },
      yAxis: {
        type: 'category',
        data: [],
        axisLabel: {
          interval: 0,
          rotate: 0
        }
      },
      series: [
        {
          name: '库存',
          type: 'bar',
          data: [],
          itemStyle: {
            color: function (params) {
              // 自定义颜色，库存低的显示红色
              const colorList = ['#F56C6C', '#E6A23C', '#67C23A']
              if (params.value < 100) {
                return colorList[0]
              } else if (params.value < 150) {
                return colorList[1]
              } else {
                return colorList[2]
              }
            }
          }
        }
      ]
    })

    // 刷新库存数据
    const refreshStock = () => {
      fetchInventoryData()
    }

    // 商品库存数据
    const inventoryData = ref([])

    // 从后端获取库存数据
    const fetchInventoryData = async () => {
      try {
        const response = await axios.post("/api/getCommoditiesInventory");
        if (response.data.code === 200) {
          inventoryData.value = response.data.data;
        } else {
          ElMessage.error(response.data.message);
        }
        updateBarChart()
      } catch (error) {
        console.error('获取库存数据失败:', error)
      }
    }

    // 更新柱状图数据
    const updateBarChart = () => {
      const commodities = inventoryData.value.map(item => item.commodity_name)
      const inventories = inventoryData.value.map(item => item.inventory)

      barOption.value.yAxis.data = commodities
      barOption.value.series[0].data = inventories
      barOption.value = { ...barOption.value }
    }

    return {
      lineDateRange,
      pieOption,
      lineOption,
      barOption,
      refreshStock
    }
  }
}
</script>

<style scoped>
.data-analysis-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.mt-20 {
  margin-top: 20px;
}

.chart {
  height: 300px;
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.data-card {
  margin-bottom: 20px;
}

.data-card-content {
  position: relative;
  padding: 10px;
}

.data-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.data-label {
  font-size: 14px;
  color: #909399;
}

.data-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 40px;
  opacity: 0.3;
}
</style>