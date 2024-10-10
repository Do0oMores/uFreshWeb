<template>
    <div>
        <el-container>
            <el-aside style="display: flex; flex-direction: column; height: 100vh; width: 200px;">
                <el-menu default-active="1" @select="handleSelect" style="flex: 1;" text-color="#fff"
                    active-text-color="#ffd04b" background-color="#545c64">
                    <h2 style="color: rgb(200, 235, 255); text-align: center; margin-bottom: 15px; margin-top: 10px;">
                        HaXian管理系统</h2>
                    <el-menu-item index="1">
                        <el-icon>
                            <Document />
                        </el-icon>
                        <span>用户管理</span>
                    </el-menu-item>
                    <el-menu-item index="2">
                        <el-icon>
                            <Location />
                        </el-icon>
                        <span>生鲜商品管理</span>
                    </el-menu-item>
                    <el-menu-item index="3">
                        <el-icon>
                            <Setting />
                        </el-icon>
                        <span>订单管理</span>
                    </el-menu-item>
                    <el-menu-item index="4">
                        <el-icon><icon-menu /></el-icon>
                        <span>预约订单</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-container>
                <el-header style="background-color: #545c64;">
                    <div style="margin-left: auto; width: 70px; margin-top: 20px;">
                        <el-dropdown @command="handleCommand" style="color: #a0cfff;">
                            <span class="el-dropdown-link">
                                {{ g_username }}
                                <el-icon class="el-icon--right">
                                    <arrow-down />
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
                <el-main>
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

<style>
.flex-grow {
    flex-grow: 1;
}

body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  background-image: url("../pic/UserIndexBackgroundImage/index3.jpg");
  background-size: cover;
}
</style>