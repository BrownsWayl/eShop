<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input clearable @clear="getGoodsList" v-model="queryInfo.query" placeholder="请输入...">
            <el-button @click="getGoodsList" icon="el-icon-search" slot="append"></el-button>
          </el-input>
        </el-col>
        <el-col :span="17">
          <el-button @click="$router.push('/goods/add')" type="primary">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格" width="95px" prop="goods_price"></el-table-column>
        <el-table-column label="商品数量" width="75px" prop="goods_number"></el-table-column>
        <el-table-column label="创建时间" width="140px" prop="upd_time">
          <template slot-scope="scope">{{ scope.row.upd_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="140px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="showEditDialog(scope.row)"
            ></el-button>
            <el-button
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="removeGoods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodsList: [],
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    /*    jumpToCate() {
      this.$router.push('/categories')
    }, */
    removeGoods(id) {
      this.$confirm('是否删除此商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async val => {
          const { data: res } = await this.$axios.delete(`goods/${id}`)
          if (res.meta.status !== 200) {
            return this.$message.error('删除商品失败!')
          }
          this.$message.success('删除商品成功!')
          this.getGoodsList()
        })
        .catch(err => console.log(err))
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getGoodsList()
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getGoodsList()
    },
    async getGoodsList() {
      const { data: res } = await this.$axios.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败!')
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
      console.log(res)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
