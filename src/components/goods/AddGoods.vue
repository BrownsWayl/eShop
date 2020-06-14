<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert type="info" :closable="false" show-icon center title="添加商品信息"></el-alert>
      <el-steps align-center :active="active" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form label-position="top" :rules="addFormRules" :model="addForm" ref="addFormRef">
        <el-tabs
          v-model="activeName"
          :before-leave="beforeTabLeave"
          @tab-click="tabChange"
          tab-position="left"
        >
          <el-tab-pane name="0" label="基本信息">
            <el-form-item prop="goods_name" label="商品名称">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item prop="goods_price" label="商品价格">
              <el-input type="number" v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item prop="goods_weight" label="商品重量">
              <el-input type="number" v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item prop="goods_number" label="商品数量">
              <el-input type="number" v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                clearable
                :options="catList"
                v-model="selectedOptions"
                :props="cascaderProps"
                expand-trigger="hover"
                @change="catChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="1" label="商品参数">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_valsArray">
                <el-checkbox
                  border
                  :checked="false"
                  :label="name"
                  v-for="(name, indx) in item.attr_valsArray"
                  :key="indx"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="2" label="商品属性">
            <el-form-item :label="item.attr_name" v-for="(item, i) in onlyTableData" :key="i">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="3" label="商品图片">
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              list-type="picture"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="filelist"
              :headers="headerObj"
              :on-success="fileUploaded"
            >
              <el-button type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件,不能超过500KB</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品内容">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button class="btnadd" @click="addGoods" type="primary">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="图片预览" width="50%" :visible.sync="dialogVisible">
      <img :src="previewPath" alt class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      manyTableData: [],
      onlyTableData: [],
      active: 0,
      dialogVisible: false,
      headerObj: {
        Authorization: sessionStorage.getItem('token')
      },
      filelist: [],
      activeName: 0,
      catList: [],
      selectedOptions: [],
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      previewPath: '',
      addForm: {
        pics: [],
        goods_cat: [],
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCateLists()
  },
  methods: {
    addGoods() {
      this.$refs.addFormRef.validate(async val => {
        if (!val) {
          return this.$message.error('请填写必要的表单数据项!')
        }
        this.manyTableData.forEach(el => {
          const sttrs = {
            attr_id: el.attr_id,
            attr_value: el.attr_vals
          }
          this.addForm.attrs.push(sttrs)
        })
        this.onlyTableData.forEach(el => {
          const info = { attr_id: el.attr_id, attr_value: el.attr_vals }
          this.addForm.attrs.push(info)
        })
        console.log(this.addForm)
        const { data: res } = await this.$axios.post('goods', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败!')
        }
        this.$message.success('提交成功!')
        this.$router.push('/goods')
      })
    },
    fileUploaded(res) {
      this.addForm.pics.push({ pic: res.data.tmp_path })
      console.log(this.addForm.pics)
    },
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.dialogVisible = true
    },
    handleRemove(file) {
      console.log(file)
      this.addForm.pics = this.addForm.pics.filter(obj => {
        return obj.pic !== file.response.data.tmp_path
      })
      console.log(this.addForm.pics)
    },
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.selectedOptions.length !== 3) {
        this.$message.error('请先填写完本页信息!')
        return false
      }
    },
    catChange() {
      if (this.selectedOptions.length !== 3) {
        this.selectedOptions = []
      }
      this.addForm.goods_cat = this.selectedOptions.join(',')
    },
    async getCateLists() {
      const { data: res } = await this.$axios.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败!')
      }
      this.catList = res.data
      console.log(res.data)
    },
    async tabChange() {
      this.active = +this.activeName
      if (this.activeName === '1') {
        const id = this.selectedOptions[this.selectedOptions.length - 1]
        const { data: res } = await this.$axios.get(
          `categories/${id}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品属性失败!')
        }
        this.manyTableData = res.data
        res.data.forEach(element => {
          element.attr_valsArray = element.attr_vals
            ? element.attr_vals.split(',')
            : []
        })
        console.log(res.data)
      } else if (this.activeName === '2') {
        const id = this.selectedOptions[this.selectedOptions.length - 1]
        const { data: res } = await this.$axios.get(
          `categories/${id}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品属性失败!')
        }
        this.onlyTableData = res.data
        console.log(res.data)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnadd {
  margin-top: 15px;
}
</style>
