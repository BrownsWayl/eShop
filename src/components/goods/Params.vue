<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert show-icon title="只允许三级目录设置参数!" type="warning" :closable="false"></el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader
            clearable
            :options="catlist"
            v-model="selectedOptions"
            :show-all-levels="false"
            :props="cascaderProps"
            expand-trigger="hover"
            @change="catChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            @click="dialogVisible=true"
            :disabled="isButtonDisabled"
            type="primary"
            size="small"
          >添加参数</el-button>
          <el-table :data="manyTableData" stripe>
            <el-table-column type="expand">
              <template>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  icon="el-icon-edit"
                  type="primary"
                  @click="showEditDialog(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  icon="el-icon-delete"
                  type="danger"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button
            @click="dialogVisible=true"
            :disabled="isButtonDisabled"
            type="primary"
            size="small"
          >添加属性</el-button>
          <el-table :data="onlyTableData" stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  icon="el-icon-edit"
                  type="primary"
                  @click="showEditDialog(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  icon="el-icon-delete"
                  type="danger"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      :title="this.activeName === 'many'? '添加动态参数':'添加静态属性'"
      @close="closeDialog"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form :rules="formRules" :model="form" ref="formRef" label-width="110px">
        <el-form-item prop="attr_name" :label="this.activeName === 'many'? '动态属性' :'静态属性'">
          <el-input v-model="form.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="this.activeName === 'many'? '修改动态参数':'修改静态属性'"
      @close="editCloseDialog"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form :rules="formRules" :model="editForm" ref="editFormRef" label-width="80px">
        <el-form-item prop="attr_name" :label="this.activeName === 'many'? '动态属性' :'静态属性'">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible=false">取消</el-button>
        <el-button @click="editParams" type="primary">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      catlist: [],
      dialogVisible: false,
      editDialogVisible: false,
      activeName: 'many',
      selectedOptions: [],
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      manyTableData: [],
      onlyTableData: [],
      form: {},
      editForm: {},
      formRules: {
        attr_name: [
          { required: true, message: '内容不能为空!', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCatList()
  },
  computed: {
    isButtonDisabled() {
      if (this.selectedOptions.length !== 3) {
        return true
      }
      return false
    },
    catID() {
      if (this.selectedOptions.length === 3) {
        return this.selectedOptions[this.selectedOptions.length - 1]
      }
      return null
    }
  },
  methods: {
    removeParams(id) {
      this.$confirm('是否删除此元素?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async val => {
          const { data: res } = await this.$axios.delete(
            `categories/${this.catID}/attributes/${id}`
          )
          if (res.meta.status !== 200) {
            return this.$message.error('删除属性失败!')
          }
          this.$message.success('删除属性成功!')
          this.getParamsData()
        })
        .catch(err => console.log(err))
    },
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请输出有效的表单数据!')
        }
        const {
          data: res
        } = await this.$axios.put(
          `categories/${this.catID}/attributes/${this.editForm.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改属性失败!')
        }
        this.$message.success('修改属性成功!')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    async showEditDialog(row) {
      this.editDialogVisible = true
      const {
        data: res
      } = await this.$axios.get(
        `categories/${this.catID}/attributes/${row.attr_id}`,
        { params: { attr_sel: this.activeName } }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取属性失败!')
      }
      this.editForm = res.data
    },
    closeDialog() {
      this.$refs.formRef.resetFields()
    },
    editCloseDialog() {
      this.$refs.editFormRef.resetFields()
    },
    handleTabClick() {
      this.getParamsData()
      console.log(this.activeName)
    },
    catChange() {
      if (this.selectedOptions.length !== 3) {
        this.selectedOptions = []
        return
      }
      this.getParamsData()
    },
    async getParamsData() {
      const { data: res } = await this.$axios.get(
        `categories/${this.catID}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取属性失败!')
      }
      console.log(res.data)
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    async getCatList() {
      const { data: res } = await this.$axios.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败!')
      }
      this.catlist = res.data
      console.log(this.catlist)
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
</style>
