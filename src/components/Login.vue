<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt class="src" />
      </div>
      <el-form ref="loginFormRef" :rules="loginRules" :model="loginForm" class="login_form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-goods"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button @click="submitLogin" type="primary">登录</el-button>
          <el-button @click="resetLoginForm" type="default">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '名称在3到10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15个字符之间', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    submitLogin() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) {
          console.log('请输入正确账号与密码')
          return
        }
        const {
          data: { data: dat, meta: met }
        } = await this.$axios.post('/login', this.loginForm)
        // console.log(dat)
        if (met.status === 200) {
          sessionStorage.setItem('token', dat.token)
          this.$message.success('登录成功!')
          this.$router.push('/home')
        } else {
          this.$message.error('账号或密码不正确!')
        }
      })
    }
  }
}
</script>
<style lang='less' scoped>
.login_container {
  background-color: #58a;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  border-radius: 3px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      border-radius: 50%;
      height: 100%;
      width: 100%;
      background-color: #eee;
    }
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
