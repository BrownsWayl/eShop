<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to='{ path: "/home" }'>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input @clear='getUserList' clearable v-model='queryInfo.query' placeholder="请输入...">
            <el-button @click='getUserList' slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="dialogVisible=true" type="primary">添加用户</el-button>
        </el-col>
      </el-row>

      <el-table :data="userList" stripe>
         <el-table-column type='index'></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model='scope.row.mg_state' @change="handleswitch(scope.$index, scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size='mini' type='primary' @click="showEditDialog(scope.row.id)">
              <i class="el-icon-edit"></i>
            </el-button>
            <el-button size='mini' type='danger' @click="handleDelete(scope.row.id)">
              <i class="el-icon-delete"></i>
            </el-button>
            <el-tooltip :enterable='false' effect='dark' content='设置角色' placement='top'>
              <el-button size='mini' type='warning' @click="handleSetting(scope.row)">
              <i class="el-icon-setting"></i>
            </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @size-change='handleSizeChange'
       @current-change='handleCurrentChange'
        :current-page='queryInfo.pagenum' :page-sizes='[1, 2, 5, 10]'
         :page-size='queryInfo.pagesize' layout='total, sizes, prev, pager, next, jumper'
          :total='total'>
      </el-pagination>
    </el-card>

    <el-dialog title='添加用户'
     :visible.sync='dialogVisible' width='50%'
     @close='addDialogClose'>
     <el-form ref='addFormRef' label-width='70px' :model='addForm' :rules='addFormRules'>
        <el-form-item label='名称' prop='username'>
          <el-input v-model='addForm.username'></el-input>
        </el-form-item>
        <el-form-item label='密码' prop='password'>
          <el-input v-model='addForm.password'></el-input>
        </el-form-item>
        <el-form-item label='邮箱' prop='email'>
          <el-input v-model='addForm.email'></el-input>
        </el-form-item>
        <el-form-item label='手机' prop='mobile'>
          <el-input v-model='addForm.mobile'></el-input>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
        <el-button @click='dialogVisible=false'>取消</el-button>
        <el-button type='primary' @click='addUser'>确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title='修改用户信息' @close='editDialogClose'
    :visible.sync='editDialogVisible' width='50%'>
      <el-form :rules='addFormRules' ref='editFormRef' :model='editForm' label-width='70px'>
        <el-form-item label='用户名'>
          <el-input disabled v-model='editForm.username'></el-input>
        </el-form-item>
        <el-form-item label='邮箱' prop='email'>
          <el-input v-model='editForm.email'></el-input>
        </el-form-item>
        <el-form-item label='手机' prop='mobile'>
          <el-input v-model='editForm.mobile'></el-input>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
        <el-button @click='editDialogVisible=false'>取消</el-button>
        <el-button type='primary' @click="editUser">确定</el-button>
      </span>
    </el-dialog>
      <!-- 分配角色 -->
    <el-dialog title='分配角色' @close='closeRoleDialog'
     :visible.sync='roleDialogVisible' width='50%'
     >
     <div>
       <p>当前的用户: {{ currentUserInfo.username }}</p>
       <p>当前的角色: {{ currentUserInfo.role_name }}</p>
       <el-select v-model="selectedRoleID" placeholder="请选择...">
        <el-option
         v-for="item in allRoles"
         :key="item.id"
         :label="item.roleName"
         :value="item.id">
        </el-option>
      </el-select>
     </div>
      <span slot='footer' class='dialog-footer'>
        <el-button @click='roleDialogVisible=false'>取消</el-button>
        <el-button @click="saveRole" type='primary'>确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^[a-zA0-9_-]+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的邮箱!'))
    }
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的手机号!'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      switchValue: true,
      dialogVisible: false,
      editDialogVisible: false,
      roleDialogVisible: false,
      currentUserInfo: {},
      selectedRoleID: '',
      allRoles: [],
      editForm: {},
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在3~10字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '密码长度在3~10字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    closeRoleDialog() {
      this.selectedRoleID = ''
    },
    async saveRole() {
      if (!this.selectedRoleID) {
        return this.$message.error('请选择要分配的角色!')
      }
      const { data: res } = await this.$axios.put(`users/${this.currentUserInfo.id}/role`, { rid: this.selectedRoleID })
      if (res.meta.status !== 200) {
        return this.$message.error('分配角色失败!')
      }
      this.$message.success('分配成功!')
      this.roleDialogVisible = false
      this.getUserList()
    },
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          this.$message.error('请输入有效的用户信息!')
          return
        }
        const { data: res } = await this.$axios.put('users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
        if (res.meta.status !== 200) {
          this.$message.error('更新用户信息失败!')
        }
        this.editDialogVisible = false
        this.$message.success('更新用户信息成功!')
        this.getUserList()
      })
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          this.$message.error('请输入有效的用户信息!')
          return
        }
        const { data: res } = await this.$axios.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败!')
        }
        this.dialogVisible = false
        this.$message.success('添加用户成功!')
        this.getUserList()
      })
    },
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async handleswitch(index, row) {
      const { data: res } = await this.$axios.put(`/users/${row.id}/state/${row.mg_state}`)
      console.log(res)
      if (res.meta.status !== 200) {
        row.mg_state = !row.mg_state
        return this.$message.error('更新失败!')
      }
      return this.$message.success('更新成功!')
    },
    async showEditDialog(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$axios.get(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户信息失败!')
      }
      this.editForm = res.data
    },
    handleDelete(id) {
      this.$confirm('是否确认删除此用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async val => {
        const { data: res } = await this.$axios.delete('users/' + id)
        if (res.meta.status !== 200) {
          this.$message.error('删除用户失败!')
        }
        this.$message.success('删除成功!')
        this.getUserList()
      })
        .catch(err => console.log(err))
    },
    async handleSetting(row) {
      this.currentUserInfo = row
      this.roleDialogVisible = true
      const { data: res } = await this.$axios.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败!')
      }
      this.allRoles = res.data
    },
    async getUserList() {
      const { data: list } = await this.$axios.get('users', {
        params: this.queryInfo
      })
      console.log(list)
      if (list.meta.status !== 200) {
        return this.$message.error('获取用户列表失败!')
      }
      this.userList = list.data.users
      this.total = list.data.total
    }
  }
}
</script>

<style lang="less" scoped>
</style>
