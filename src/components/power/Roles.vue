<template>
    <div>
        <!--    面包屑导航区-->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>角色管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
<!--        卡片视图-->
        <el-card>
<!--            添加角色按钮区域-->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addRolesDialogVisible=true">添加角色</el-button>
                </el-col>
            </el-row>
            <el-table :data="roleList" border stripe>
                <!-- 展开列-->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom',i1 === 0 ? 'bdtop' : '','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                            <!--一级权限-->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row,item1.id)">
                                    {{ item1.authName}}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="19">
                                <el-row :class="[i2 === 0 ? '':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">
                                            {{item2.authName}}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
<!--                索引列-->
                <el-table-column type="index" label="#" align="center"></el-table-column>
                <el-table-column label="角色名称" prop="roleName" align="center"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditRolesDialog(scope.row.id)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRoles(scope.row.id)">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!--添加角色对话框-->
        <el-dialog :visible.sync="addRolesDialogVisible" title="添加角色" @close="addRolesClosed" width="50%">
            <el-form :model="addRolesForm" :rules="addRolesFormRules" ref="addRolesFormRef" label-width="70px">
                <el-form-item label="角色名" prop="roleName">
                    <el-input v-model="addRolesForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addRolesForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addRoles">确定</el-button>
                <el-button type="error" @click="addRolesDialogVisible=false">取消</el-button>
            </span>
        </el-dialog>
        <!--编辑角色对话框-->
        <el-dialog :visible.sync="editRolesDialogVisible" title="添加角色" @close="editRolesClosed" width="50%">
            <el-form :model="editRolesForm" :rules="editRolesFormRules" ref="editRolesFormRef" label-width="70px">
                <el-form-item label="角色ID" prop="roleId">
                    <el-input v-model="editRolesForm.roleId" disabled></el-input>
                </el-form-item>
                <el-form-item label="角色名" prop="roleName">
                    <el-input v-model="editRolesForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editRolesForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editRoles">确定</el-button>
                <el-button type="error" @click="editRolesDialogVisible=false">取消</el-button>
            </span>
        </el-dialog>
        <!--分配权限对话框-->
        <el-dialog :visible.sync="setRightDialogVisible" title="添加角色" @close="setRightClosed" width="50%">
            <!--树形控件-->
            <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defkeys" ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="assignRights">确定</el-button>
                <el-button type="error" @click="setRightDialogVisible=false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'Roles',
  data () {
    return {
      roleList: [],
      addRolesForm: {},
      addRolesFormRules: {
        roleName: [
          {required: true, message: '请输入角色名', trigger: 'blur'},
          {min: 3, max: 10, message: '角色名长度在3~10个字符之间', trigger: 'blur'}
        ]
      },
      addRolesDialogVisible: false,
      editRolesForm: {},
      editRolesFormRules: {
        roleName: [
          {required: true, message: '请输入角色名', trigger: 'blur'},
          {min: 3, max: 10, message: '角色名长度在3~10个字符之间', trigger: 'blur'}
        ]
      },
      editRolesDialogVisible: false,
      setRightDialogVisible: false,
      rightsList: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      defkeys: [105, 116],
      roleId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const {data: res} = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data
    },
    addRoles () {
      this.$refs.addRolesFormRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.post('roles', this.addRolesForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功')
        await this.getRolesList()
        this.addRolesDialogVisible = false
      })
    },
    addRolesClosed () {
      this.$refs.addRolesFormRef.resetFields()
    },
    async deleteRoles (id) {
      const confirmResult = await this.$confirm('是否删除该角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除角色')
      }
      const {data: res} = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败')
      }
      this.$message.success('删除角色成功')
      await this.getRolesList()
    },
    async showEditRolesDialog (id) {
      const {data: res} = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      this.editRolesForm = res.data
      console.log(res.data)
      this.editRolesDialogVisible = true
    },
    editRoles () {
      this.$refs.editRolesFormRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.put('roles/' + this.editRolesForm.roleId, {roleName: this.editRolesForm.roleName, roleDesc: this.editRolesForm.roleDesc})
        if (res.meta.status !== 200) {
          return this.$message.error('修改用户失败')
        }
        this.editRolesDialogVisible = false
        await this.getRolesList()
        this.$message.success('修改用户成功')
      })
    },
    editRolesClosed () {
      this.$refs.editRolesFormRef.resetFields()
    },
    async removeRightById (role, id) {
      const result = await this.$confirm('是否删除该权限?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result !== 'confirm') {
        return this.$message.info('取消删除权限')
      }
      const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      role.children = res.data
    },
    async showSetRightDialog (role) {
      this.roleId = role.id
      const {data: res} = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      this.rightsList = res.data
      this.getLeafKeys(role, this.defkeys)
      this.setRightDialogVisible = true
    },
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    setRightClosed () {
      this.defkeys = []
    },
    async assignRights () {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr})
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      await this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
    .el-tag{
        margin: 7px;
    }
    .bdtop {
        border-top: 1px solid #eee;
    }
    .bdbottom {
        border-bottom: 1px solid #eee;
    }
</style>
