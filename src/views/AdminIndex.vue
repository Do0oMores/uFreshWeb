<template>
    <div>
        <el-container style="height: 100vh;">
            <!-- 侧边栏 -->
            <el-aside
                :style="{ width: isSidebarVisible ? (isCollapsed ? '64px' : '220px') : '0px', transition: 'width 0.3s' }"
                class="sidebar">
                <h2 class="ufresh-title">优鲜管理系统</h2>
                <el-menu default-active="1" @select="handleSelect" text-color="#fff" active-text-color="#ffd04b"
                    background-color="#2c3e50" class="menu" :collapse="isCollapsed">
                    <el-menu-item index="1">
                        <el-icon>
                            <Document />
                        </el-icon>
                        <span v-if="!isCollapsed">用户管理</span>
                    </el-menu-item>

                    <!-- 生鲜商品管理子菜单 -->
                    <el-menu-item index="2">
                        <el-icon>
                            <Location />
                        </el-icon>
                        <span v-if="!isCollapsed" class="submenu-title">生鲜商品管理</span>
                    </el-menu-item>

                    <el-menu-item index="3">
                        <el-icon>
                            <Setting />
                        </el-icon>
                        <span v-if="!isCollapsed">订单管理</span>
                    </el-menu-item>
                    <el-menu-item index="4">
                        <el-icon>
                            <IconMenu />
                        </el-icon>
                        <span v-if="!isCollapsed">售后订单管理</span>
                    </el-menu-item>
                    <el-menu-item index="5">
                        <el-icon>
                            <DataLine />
                        </el-icon>
                        <span v-if="!isCollapsed">数据统计</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>

            <!-- 主容器 -->
            <el-container style="height: 100%;">
                <!-- 顶部导航 -->
                <el-header class="header" style="height: 60px;">
                    <el-button type="primary" @click="toggleSidebarVisibility" class="toggle-btn">
                        <el-icon>
                            <IconMenu />
                        </el-icon>
                    </el-button>
                    <div class="header-right">
                        <el-dropdown @command="handleCommand" class="user-dropdown">
                            <span class="el-dropdown-link">
                                {{ g_username }}
                                <el-icon>
                                    <ArrowDown />
                                </el-icon>
                            </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item command="quit">退出系统</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </el-header>

                <!-- 主内容区 -->
                <el-main class="main-content" style="height: calc(100% - 60px); overflow-y: auto;">
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script lang="ts">
import GlobalVar from "../stores/global";
import { ElMessage } from "element-plus";
import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
    ArrowDown,
    DataLine
} from '@element-plus/icons-vue'

export default {
    name: 'Home',
    components: {
        Document,
        IconMenu,
        Location,
        Setting,
        ArrowDown,
        DataLine
    },
    data() {
        return {
            g_username: GlobalVar.username,
            isSidebarVisible: true,
            isCollapsed: false
        }
    },
    methods: {
        handleSelect(key: string, keyPath: string[]) {
            if (key == "1") {
                this.$router.push('/admin/usermanage')
            } else if (key == "2") {
                this.$router.push('/admin/commoditymanage')
            } else if (key == "3") {
                this.$router.push('/admin/ordermanage')
            } else if (key == "4") {
                this.$router.push('/admin/aftersalesmanage')
            } else if (key == '5') {
                this.$router.push('/admin/dataanalysis')
            }
        },
        handleCommand(command: string | number | object) {
            if (command == "quit") {
                ElMessage.success("您已成功退出系统")
                setTimeout(() => {
                    this.$router.push('/login')
                }, 1000);
            }
        },
        toggleSidebarVisibility() {
            this.isSidebarVisible = !this.isSidebarVisible;
        },
        toggleCollapse() {
            this.isCollapsed = !this.isCollapsed;
        },
        goToAddProductPage() {
            this.$router.push('/admin/addcommodity');
        },
        goToSearchProductPage() {
            this.$router.push('/search-product');
        }
    }
}
</script>

<style scoped>
body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background: linear-gradient(to right, #2c3e50, #4b6cb7);
    background-size: cover;
    background-attachment: fixed;
    background-position: center;
    color: #333;
    height: 100%;
}

.ufresh-title {
    color: #5aff4b;
    font-family: 'Arial', sans-serif;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    margin: 20px 0;
    background: linear-gradient(90deg, #bcff5f, #d7fe7b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

/* 侧边栏样式 */
.sidebar {
    background-color: #2c3e50;
    color: #fff;
    transition: width 0.3s;
    box-shadow: 3px 0 6px rgba(0, 0, 0, 0.1);
}

.menu .el-menu-item {
    transition: background-color 0.3s ease, transform 0.3s ease;
    padding-left: 20px;
}

.menu .el-menu-item:hover {
    background-color: #34495e;
    transform: translateX(5px);
}

/* 顶部导航样式 */
.header {
    background-color: #1f2937;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    color: #a0cfff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.header-right {
    display: flex;
    align-items: center;
}

.user-dropdown {
    color: #c8ebff;
    cursor: pointer;
    font-size: 1em;
    transition: color 0.3s ease;
}

.user-dropdown:hover {
    color: #ffd04b;
}

.toggle-btn {
    background-color: #2c3e50;
    border: none;
    color: white;
    padding: 10px;
    font-size: 20px;
    transition: transform 0.2s ease;
}

.toggle-btn:hover {
    transform: rotate(90deg);
}

/* 主内容区样式 */
.main-content {
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    margin: 20px;
    animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>