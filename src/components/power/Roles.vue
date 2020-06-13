<template>
  <div>
     <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button @click="addRole" type='primary'>添加角色</el-button>
        </el-col>
      </el-row>
        <el-table :data='roleList' stripe>
          <el-table-column type='expand'>
            <template slot-scope='props'>
              <el-row class='vCenter' v-for="child in props.row.children" :key='child.id'>
                <el-col :span=5>
                  <el-tag closable @close='removeRightsById(props.row, child.id)'>{{ child.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span=19>
                  <el-row class='vCenter' v-for="cchild in child.children" :key='cchild.id'>
                    <el-col :span='6'>
                      <el-tag closable @close='removeRightsById(props.row, cchild.id)' type='success'>{{ cchild.authName }}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span='18'>
                      <el-tag closable @close='removeRightsById(props.row, ccchild.id)' type='warning' v-for="ccchild in cchild.children" :key='ccchild.id'>
                        {{ ccchild.authName }}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
            <el-table-column type='index'></el-table-column>
            <el-table-column label='角色名称' prop='roleName'></el-table-column>
            <el-table-column label='角色描述' prop='roleDesc'></el-table-column>
            <el-table-column width='300px'>
              <template slot-scope="scope">
                <el-button size='mini' @click="editRole(scope)" type='primary' icon="el-icon-edit">编辑</el-button>
                <el-button size='mini' @click="deleteRole(scope)" type='danger' icon="el-icon-edit">删除</el-button>
                <el-button size='mini' @click="settingRole(scope.row)" type='warning' icon="el-icon-edit">分配权限</el-button>
              </template>
            </el-table-column>
        </el-table>
    </el-card>

    <el-dialog title='权限分配' @close='closeDialog'
     :visible.sync='dialogVisible' width='50%'
     >
     <el-tree ref='tree' show-checkbox :data='rightsList'
     node-key='id' default-expand-all
     :default-checked-keys='defKeys' :props='treeProps'>
     </el-tree>
      <span slot='footer' class='dialog-footer'>
        <el-button @click='dialogVisible=false'>取消</el-button>
        <el-button @click="addRights" type='primary'>确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      dialogVisible: false,
      rightsList: [],
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      defKeys: [],
      roleID: ''
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async addRights() {
      const keys = [...this.$refs.tree.getCheckedKeys(), ...this.$refs.tree.getHalfCheckedKeys()].join(',')
      const { data: res } = await this.$axios.post(`roles/${this.roleID}/rights`, { rids: keys })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败!')
      }
      this.$message.success('分配成功!')
      this.getRoleList()
      this.dialogVisible = false
    },
    closeDialog() {
      this.defKeys = []
    },
    removeRightsById(row, rId) {
      this.$confirm('是否删除权限?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async val => {
          const { data: res } = await this.$axios.delete(`roles/${row.id}/rights/${rId}`)
          if (res.meta.status !== 200) {
            return this.$message.error('删除权限失败!')
          }
          this.$message.success('删除成功!')
          // this.getRoleList()
          row.children = res.data
        })
        .catch(err => console.log(err))
    },
    editRole() {},
    deleteRole() {},
    async settingRole(row) {
      this.roleID = row.id
      this.dialogVisible = true
      const { data: res } = await this.$axios.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败!')
      }
      this.rightsList = res.data
      this.getLeafKeys(row, this.defKeys)
      console.log(this.defKeys)
    },
    async getRoleList() {
      const { data: res } = await this.$axios.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败!')
      }
      this.roleList = res.data
    },
    addRole() {},
    getLeafKeys(node, arr) {
      if (node.children) {
        node.children.forEach(item => {
          this.getLeafKeys(item, arr)
        })
      } else {
        return arr.push(node.id)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.el-row{
  border-bottom: 1px solid #eee;
}
.contentFlex {
  display: flex;
  flex-wrap: wrap;
}
.vCenter {
  display: flex;
  align-items: center;
}
</style>
