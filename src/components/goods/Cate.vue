<template>
    <div>
        <!--    面包屑导航区-->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片视图区域-->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <!--表格-->
            <tree-table class="treeTable" :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index border>
                <!--是否有效-->
                <template slot="isValid" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"/>
                    <i class="el-icon-delete" v-else style="color: red;"/>
                </template>
                <!--排序-->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else>三级</el-tag>
                </template>
                <!--操作-->
                <template slot="operation" slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                </template>
            </tree-table>
            <!--分页区-->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[3,5,10,15]" :page-size="queryInfo.pagesize" layout="total,sizes,prev,pager,next,jumper" :total="total"></el-pagination>
        </el-card>

        <!--添加分类的对话框-->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="80px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类" prop="cat_pid">
                    <!--options指定数据源-->
                    <!--props指定配置对象-->
                    <el-cascader class="parentCascader" expand-trigger="hover" :options="parentCateList" :props="cascaderProps" v-model="selectedKeys" @change="parentCateChange" clearable></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="addCate">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'Cate',
  data () {
    return {
      catelist: [],
      /* 查询条件 */
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      /* 总数据条数 */
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          /* 模板名称 */
          template: 'isValid'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operation'
        }
      ],
      /* 添加分类对话框的显示与隐藏 */
      addCateDialogVisible: false,
      /* 添加分类的表单数据对象 */
      addCateForm: {
        /* 分类名称 */
        cat_name: '',
        /* 父级分类ID */
        cat_pid: 0,
        /* 分类的等级 */
        cat_level: 0
      },
      /* 添加分类表单的验证规则 */
      addCateFormRules: {
        cat_name: [
          {required: true, message: '请输入分类名称', trigger: 'blur'}
        ]
      },
      /* 父级分类的数据列表 */
      parentCateList: [],
      /* 指定级联选择器的配置对象 */
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      /* 选中的父级分类的ID数组 */
      selectedKeys: []
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const {data: res} = await this.$http.get('categories', {params: this.queryInfo})
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.catelist = res.data.result
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    /* 点击按钮，展示添加分类的对话框 */
    showAddCateDialog () {
      /* 获取父级分类的数据列表 */
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    /* 获取父级分类的数据列表 */
    async getParentCateList () {
      const {data: res} = await this.$http.get('categories', {params: {type: 2}})
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类失败')
      }
      this.parentCateList = res.data
    },
    /* 选择项发生变化触发 */
    parentCateChange () {
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        /* 为当前分类的等级赋值 */
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const {data: res} = this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        await this.getCateList()
        this.$message.success('添加分类成功')
        this.addCateDialogVisible = false
      })
    },
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  }
}
</script>

<style scoped>
.treeTable{
    margin-top: 15px;
}
.parentCascader{
    width: 100%;
}
</style>
