<template>
    <div>
        <el-container>
            <!-- 侧边栏 -->
            <el-aside class="sidebar">
                <h2 class="sidebar-title">HaXian管理系统</h2>
                <el-menu
                    default-active="1"
                    @select="handleSelect"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                    background-color="#1f2937"
                    class="menu">
                    <el-menu-item index="1">
                        <el-icon><Document /></el-icon>
                        <span>用户管理</span>
                    </el-menu-item>
                    <el-menu-item index="2">
                        <el-icon><Location /></el-icon>
                        <span>生鲜商品管理</span>
                    </el-menu-item>
                    <el-menu-item index="3">
                        <el-icon><Setting /></el-icon>
                        <span>订单管理</span>
                    </el-menu-item>
                    <el-menu-item index="4">
                        <el-icon><IconMenu /></el-icon>
                        <span>预约订单</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>

            <!-- 主容器 -->
            <el-container>
                <!-- 顶部导航 -->
                <el-header class="header">
                    <div class="header-right">
                        <el-dropdown @command="handleCommand" class="user-dropdown">
                            <span class="el-dropdown-link">
                                {{ g_username }}
                                <el-icon><ArrowDown /></el-icon>
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
                <el-main class="main-content">
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
    ArrowDown
} from '@element-plus/icons-vue'

export default {
    name: 'Home',
    components: {
        Document,
        IconMenu,
        Location,
        Setting,
        ArrowDown
    },
    data() {
        return {
            g_username: GlobalVar.username,
        }
    },
    methods: {
        handleSelect(key: string, keyPath: string[]) {
            // console.log(key, keyPath)
            if (key == "1") {
                this.$router.push('/admin/selectbill')
            } else if (key == "2") {
                this.$router.push('/admin/selectresidue')
            } else if (key == "3") {
                this.$router.push('/admin/printconsumptionorders')
            } else if (key == "4") {
                this.$router.push('/admin/reservation')
            }
        },
        handleCommand(command: string | number | object) {
            if (command == "quit") {
                ElMessage.success("您已成功退出系统")
                setTimeout(() => {
                    this.$router.push('/login')
                }, 1000);
            }
        }
    }
}
</script>

<style scoped>
body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background-image: url("../pic/UserIndexBackgroundImage/index3.jpg");
    background-size: cover;
    background-attachment: fixed;
    background-position: center;
    color: #333;
}

/* 侧边栏样式 */
.sidebar {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 220px;
    background-color: #1f2937;
    color: #fff;
    padding: 10px;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease-in-out;
}

.sidebar-title {
    color: #c8ebff;
    text-align: center;
    font-size: 1.4em;
    margin: 20px 0;
}

.menu .el-menu-item {
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.menu .el-menu-item:hover {
    background-color: #39414e;
    transform: translateX(5px);
}

/* 顶部导航样式 */
.header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 64px;
    padding: 0 20px;
    background-color: #1f2937;
    color: #c8ebff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
