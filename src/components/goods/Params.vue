<template>
    <div>
        <!--    面包屑导航区-->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card>
            <el-alert title="注意：只允许为第三级分类设置" type="warning" :closable="false" show-icon/>
            <el-row class="cat_row">
                <el-col>
                    <span>选择商品分类：</span>
                    <!--选择商品分类的级联-->
                    <el-cascader expand-trigger="hover" :options="catelist" :props="cateProps"  v-model="selectedKeys" @change="handleChange" size="mini"></el-cascader>
                </el-col>
            </el-row>
            <el-tabs v-model="activeName" @click="handleTabClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button size="mini" type="primary" :disabled="isBtnDisabled" @click="addParamsDialogVisible = true">添加属性</el-button>
                    <el-table :data="manyTableData" border stripe>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagRef" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"></el-input>
                                <el-button class="button-new-tag" v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button size="mini" type="primary" :disabled="isBtnDisabled" @click="addParamsDialogVisible = true">添加属性</el-button>
                    <el-table :data="onlyTableData" border stripe>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagRef" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"></el-input>
                                <el-button class="button-new-tag" v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!--对话框-->
        <el-dialog :title="titleText" :visible.sync="addParamsDialogVisible" width="50%" @close="addParamsDialogClosed">
            <el-form :model="addParamsForm" :rules="addParamsFormRules" ref="addParamsFormRef">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addParamsForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addParamsDialogVisible=false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>

        <!--修改对话框-->
        <el-dialog :title="titleText" :visible.sync="editParamsDialogVisible" width="50%" @close="editParamsDialogClosed">
            <el-form :model="editParamsForm" :rules="editParamsFormRules" ref="editParamsFormRef">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editParamsForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editParamsDialogVisible=false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'Params',
  data () {
    return {
      catelist: [],
      /* 级联选择框的配置对象 */
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: [],
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      addParamsDialogVisible: false,
      addParamsForm: {
        attr_name: ''
      },
      addParamsFormRules: {
        attr_name: [
          {required: true, message: '请输入动态参数名', trigger: 'blur'}
        ]
      },
      editParamsForm: {
        attr_name: ''
      },
      editParamsDialogVisible: false,
      editParamsFormRules: {
        attr_name: [
          {required: true, message: '请输入动态参数名', trigger: 'blur'}
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  computed: {
    isBtnDisabled () {
      return this.selectedKeys.length !== 3
    },
    /* 当前选中的三级分类的id */
    cateId () {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  },
  methods: {
    async getCateList () {
      const {data: res} = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.catelist = res.data
    },
    handleChange () {
      this.getParamsData()
    },
    handleTabClick () {
      this.getParamsData()
    },
    async getParamsData () {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      /* 证明选中的是三级分类 */
      const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: this.activeName}})
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        //  控制文本框的显示隐藏
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    addParamsDialogClosed () {
      this.$refs.addParamsFormRef.resetFields()
    },
    async addParams () {
      this.$refs.addParamsFormRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.post(`categories/${this.cateId}/attributes`, {attr_name: this.addParamsForm.attr_name, attr_sel: this.activeName})
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.addParamsDialogVisible = false
        await this.getParamsData()
      })
    },
    async showEditDialog (attrId) {
      const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`, {params: {attr_sel: this.activeName}})
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数失败')
      }
      this.editParamsForm = res.data
      this.editParamsDialogVisible = true
    },
    editParamsDialogClosed () {
      this.$refs.editParamsFormRef.resetFields()
    },
    editParams () {
      this.$refs.editParamsFormRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`, {attr_name: this.editParamsForm.attr_name, attr_sel: this.activeName})
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败')
        }
        this.$message.success('修改参数成功')
        await this.getParamsData()
        this.editParamsDialogVisible = false
      })
    },
    async deleteParams (attrId) {
      const result = await this.$confirm('是否删除该参数', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result !== 'confirm') {
        return this.$message.info('取消删除')
      }
      const {data: res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败')
      }
      this.$message.success('删除参数成功')
      await this.getParamsData()
    },
    /* 文本框失去焦点，或安溪啊enter都会触发 */
    async handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      await this.saveAttrVals(row)
    },
    showInput (row) {
      row.inputVisible = true
      /* 当页面上的元素被重新渲染之后，才会执行回调函数 */
      this.$nextTick(_ => {
        this.$refs.saveTagRef.$refs.input.focus()
      })
    },
    async saveAttrVals (row) {
      /* 发送请求 */
      const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败')
      }
      this.$message.success('修改参数项成功')
    },
    // 删除对应的参数可选项
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  }
}
</script>

<style lang="less" scoped>
.cat_row {
    margin-top: 15px;
}
.el-tag {
    margin: 10px;
}
.input-new-tag {
    width: 120px;
}
</style>
