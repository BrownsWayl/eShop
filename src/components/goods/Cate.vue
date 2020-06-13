<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button @click="showAddCatDialog" type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <template slot="isok" slot-scope="scope">
          <i
            style="color: lightgreen"
            v-if="scope.row.cat_deleted === false"
            class="el-icon-success"
          ></i>
          <i style="color: red" v-else-if="scope.row.cat_deleted === true" class="el-icon-error"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level == 0" size="mini">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level == 1" type="success" size="mini">二级</el-tag>
          <el-tag v-else-if="scope.row.cat_level == 2" type="warning" size="mini">三级</el-tag>
        </template>
        <template slot="operate" slot-scope="scope">
          <el-button size="mini" @click="editGoods(scope.row)" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button
            size="mini"
            @click="deleteGoods(scope.row)"
            type="danger"
            icon="el-icon-delete"
          >删除</el-button>
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <el-dialog title="添加分类" @close="closeDialog" :visible.sync="addCateDialogVisible" width="50%">
      <el-form label-width="100px" :model="addCatForm" ref="addCatFormRef" :rules="addCatFormRules">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCatForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            clearable
            :options="parentCatlist"
            v-model="selectedOptions"
            :show-all-levels="false"
            :props="cascaderProps"
            expand-trigger="hover"
            @change="parentCatChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible=false">取消</el-button>
        <el-button @click="addCat" type="primary">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addCatForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        checkStrictly: true
      },
      selectedOptions: [],
      parentCatlist: [],
      addCatFormRules: {
        cat_name: [
          { required: true, message: '名称不能为空!', trigger: 'blur' }
        ]
      },
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      addCateDialogVisible: false,
      cateList: [],
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operate'
        }
      ]
    }
  },
  created() {
    this.getCateLists()
  },
  methods: {
    async parentCatChange() {
      console.log(this.selectedOptions.length)
      if (this.selectedOptions.length > 0) {
        this.addCatForm.cat_pid = this.selectedOptions[
          this.selectedOptions.length - 1
        ]
        this.addCatForm.cat_level = this.selectedOptions.length
      }
    },
    showAddCatDialog() {
      this.addCateDialogVisible = true
      this.getParentCatList()
    },
    async getParentCatList() {
      if (this.parentCatlist.length === 0) {
        const { data: res } = await this.$axios.get('categories', {
          params: { type: 2 }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品目录失败!')
        }
        this.parentCatlist = res.data
      }
      console.log(this.parentCatlist)
    },
    async addCat() {
      // const { data: res } =
      this.$refs.addCatFormRef.validate(async valid => {
        const { data: res } = await this.$axios.post('categories', this.addCatForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品目录失败!')
        }
        this.$message.success('添加商品目录成功!')
      })
      // console.log(this.addCatForm)
      this.addCateDialogVisible = false
      this.getCateLists()
    },
    closeDialog() {
      this.selectedOptions = []
      this.addCatForm = { cat_name: '', cat_pid: 0, cat_level: 0 }
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateLists()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateLists()
    },
    async getCateLists() {
      const { data: res } = await this.$axios.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败!')
      }
      this.cateList = res.data.result
      this.total = res.data.total
      console.log(res.data)
    },
    editGoods(row) {},
    deleteGoods(row) {}
  }
}
</script>

<style lang="less" scoped>
.zk-table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
