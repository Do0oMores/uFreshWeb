<template>
  <div>
    <el-container style="height: 100vh;">
      <el-aside
        :style="{ width: isSidebarVisible ? (isCollapsed ? '64px' : '220px') : '0px', transition: 'width 0.3s' }"
        class="sidebar" :class="{ collapsed: isCollapsed }">
        <el-menu :collapse="isCollapsed" @select="handleSelect" text-color="#fff" active-text-color="#ffd04b"
          background-color="#1f2937" class="menu">
          <el-menu-item>
            <img src="../pic/icon/menu_cat.png">
          </el-menu-item>
          <el-tooltip content="选购" placement="right">
            <el-menu-item index="1">
              <el-icon>
                <Document />
              </el-icon>
              <span v-if="!isCollapsed">选购</span>
            </el-menu-item>
          </el-tooltip>
          <el-tooltip content="购物车" placement="right">
            <el-menu-item index="2">
              <el-icon>
                <Location />
              </el-icon>
              <span v-if="!isCollapsed">购物车</span>
            </el-menu-item>
          </el-tooltip>
          <el-tooltip content="我的订单" placement="right">
            <el-menu-item index="3">
              <el-icon>
                <Setting />
              </el-icon>
              <span v-if="!isCollapsed">我的订单</span>
            </el-menu-item>
          </el-tooltip>
          <el-tooltip content="查询商品信息" placement="right">
            <el-menu-item index="4">
              <el-icon>
                <IconMenu />
              </el-icon>
              <span v-if="!isCollapsed">查询商品信息</span>
            </el-menu-item>
          </el-tooltip>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header class="header">
          <el-button type="primary" @click="toggleSidebarVisibility" class="toggle-btn">
            <el-icon>
              <IconMenu />
            </el-icon>
          </el-button>
          <div class="header-title">欢迎来到 <b>优鲜商城</b></div>
          <div class="user-info">
            <el-avatar size="120" :src="'http://localhost:8081' + avatarUrl" class="user-avatar">
            </el-avatar>
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                {{ Username }}
                <el-icon>
                  <ArrowDown />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="toUserInformation">个人信息</el-dropdown-item>
                  <el-dropdown-item @click="toOlderOrders">历史订单</el-dropdown-item>
                  <el-dropdown-item @click="toNotificationCenter">消息中心</el-dropdown-item>
                  <el-dropdown-item command="quit">退出系统</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <el-main class="main-content">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import axios from 'axios';
import global from '@/stores/global';
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
  ArrowDown
} from '@element-plus/icons-vue'
import { ElMessage,ElNotification } from 'element-plus';

export default {
  name: "SidebarWithTooltip",
  components: {
    Document,
    IconMenu,
    Location,
    Setting,
    ArrowDown
  },
  data() {
    return {
      Username: global.username,
      isCollapsed: true,
      isSidebarVisible: true,
      avatarUrl: '',
    }
  },
  created() {
    this.$router.push('/user/commodity');
    this.fetchAvatarUrl();
    this.fetchNotificationCount();
  },
  methods: {
    handleSelect(key, keyPath) {
      if (key == "1") {
        this.$router.push('/user/commodity')
      } else if (key == "2") {
        this.$router.push('/user/shoppingcart')
      } else if (key == "3") {
        this.$router.push('/user/myorders')
      } else if (key == "4") {
        this.$router.push('/user/commodityorigin')
      }
    },
    toUserInformation() {
      this.$router.push('/user/userinformation')
    },
    toOlderOrders(){
      this.$router.push('/user/oldorders')
    },
    toNotificationCenter() {
      this.$router.push('/notification')
    },
    getUserId() {
      return sessionStorage.getItem('userID') || null;
    },
    handleCommand(command) {
      if (command == "quit") {
        ElMessage.success("您已退出登录")
        setTimeout(() => {
          this.$router.push('/login')
        }, 1000);
      }
    },
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
    },
    toggleSidebarVisibility() {
      this.isSidebarVisible = !this.isSidebarVisible;
    },
    fetchAvatarUrl() {
      const userId = this.getUserId();
      if (userId) {
        axios.post('/api/indexAvatarImageSync', { user_id: userId })
          .then(response => {
            if (response.data && response.data.avatarUrl) {
              this.avatarUrl = response.data.avatarUrl;
            }
          })
          .catch(error => {
            console.error('获取头像失败:', error);
          });
      }
    },
    fetchNotificationCount() {
      const userId = this.getUserId();
      if (userId) {
        axios.post('/api/getNotificationCount', { user_id: userId })
          .then(response => {
            if (response.data.code===200) {
              ElNotification({
                title: '消息通知',
                message: `您有 ${response.data.data} 条新消息`,
                type: 'info',
                duration: 5000,
                position: 'top-right',
              });
            }
          })
          .catch(error => {
            console.error('获取通知数量失败:', error);
          });
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
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
  color: #333;
}

.menu .el-menu-item img {
  width: 30px;
  height: 30px;
  margin-right: 10px;
  object-fit: contain;
}

.sidebar {
  background-color: #1f2937;
  color: #fff;
  transition: all 0.3s ease-in-out;
}

.menu .el-menu-item {
  transition: background-color 0.3s ease;
}

.menu .el-menu-item:hover {
  background-color: #39414e;
}

.menu.collapsed .el-menu-item span {
  display: none;
}

.header {
  background-color: #1f2937;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  color: #a0cfff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.header-title {
  font-size: 1.6em;
  font-weight: bold;
  color: #f0f8ff;
}

.user-info {
  display: flex;
  align-items: center;
  color: #a0ffd9;
}

.user-avatar {
  margin-right: 10px;
  border: 2px solid #a0cfff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.main-content {
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
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
