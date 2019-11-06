<template>
  <div class="app-container">
    <el-form :inline="true" label-width="68px">
      <el-form-item>
        <el-button type="primary" size="mini" @click="handleAdd">新增</el-button>
        <el-button type="danger" size="mini" @click="handleRemoveAll">批量删除</el-button>
      </el-form-item>

      <el-select v-model="queryParams.type" placeholder="类型" size="small">
        <el-option label="全部" value="" />
        <el-option v-for="item in typeList" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>

      <el-input v-model="queryParams.keyword" size="small" style="width: 200px" placeholder="名称" @keyup.enter.native="handleQuery" />

      <el-button type="primary" size="mini" @click="handleQuery">查询</el-button>
    </el-form>
    <el-table ref="multipleTable" :data="modelList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" @sort-change="handleSort">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="序号 " width="50" align="center" />
      <el-table-column prop="pic" label="图片" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.pic!==null">
            <img :src="scope.row.pic" width="65" height="40">
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" align="center" sortable="custom" :sort-change="handleQuery" />
      <el-table-column prop="number" label="货号" align="center" />
      <el-table-column prop="type" label="类型" align="center" :formatter="formatType" sortable="custom" />
      <el-table-column prop="remark" label="备注" align="center" />
      <el-table-column prop="create_time" label="创建时间" align="center" width="180" sortable="custom" />
      <el-table-column label="操作" align="center" class-name="small-padding" width="160">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleRemove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>

    <!-- 添加或修改 -->
    <el-dialog :title="title" :visible.sync="open" width="40%">
      <el-form ref="params" :model="params" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="params.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="货号" prop="number">
          <el-input v-model="params.number" placeholder="请输入货号" />
        </el-form-item>
        <el-form-item label="图片" prop="imgUrl">
          <el-upload
            class="avatar-uploader"
            :action="$uploadUrl"
            :show-file-list="false"
            name="pic"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="params.pic" :src="params.pic" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
          <p>(建议尺寸为700*560,建议大小在2M以下）</p>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="params.type" filterable placeholder="请选择">
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="params.remark" placeholder="备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="submitForm">确 定</el-button>
        <el-button size="mini" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listBrand, getModel, addModel, updateModel, delModel } from '@/api/brand'
export default {
  data() {
    return {
      // 遮罩层
      loading: false,
      // 总条数
      total: 0,
      // 复选框id
      ids: [],
      // 多选数据
      multipleSelection: [],
      // 查询参数
      queryParams: {
        type: '',
        keyword: '',
        pageNum: 1,
        pageSize: 10,
        sort: '',
        order: ''
      },
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 列表
      modelList: [],
      // 表单参数
      params: {
        id: '',
        name: '',
        pic: '',
        number: '',
        type: '',
        remark: ''
      },
      // 表单校验
      rules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        number: [{ required: true, message: '货号不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '类型不能为空', trigger: 'blur' }]
      },
      // 类型列表
      typeList: [
        {
          id: 1,
          label: '衣服'
        },
        {
          id: 2,
          label: '裤子'
        },
        {
          id: 3,
          label: '鞋子'
        },
        {
          id: 4,
          label: '配饰'
        },
        {
          id: 5,
          label: '其他'
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true
      listBrand(this.queryParams).then(res => {
        this.modelList = res.data.rows
        this.total = res.data.total
        this.loading = false
      })
    },
    // 格式化平台
    formatType(row) {
      if (row.type === 1) {
        row.type = '衣服'
      }
      if (row.type === 2) {
        row.type = '裤子'
      }
      if (row.type === 3) {
        row.type = '鞋子'
      }
      if (row.type === 4) {
        row.type = '配饰'
      }
      if (row.type === 5) {
        row.type = '其他'
      }
      return row.type
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.params = {
        id: '',
        name: '',
        pic: '',
        number: '',
        type: '',
        remark: ''
      }
      this.resetForm('params')
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '新增'
    },
    /** 编辑按钮操作 */
    handleUpdate(row) {
      this.reset()
      getModel(row.id).then(res => {
        this.params = res.data
        this.open = true
        this.title = '编辑'
      })
    },
    /** 删除 */
    handleRemove(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delModel({ id: row.id }).then(res => {
          if (res.code === 200) {
            this.getList()
          }
          this.$message.success(res.msg)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 处理批量删除id选中
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /** 删除全部 */
    handleRemoveAll() {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 先清空ids
        this.ids = []
        const length = this.multipleSelection.length
        for (let i = 0; i < length; i++) {
          this.ids.push(this.multipleSelection[i].id)
        }
        if (this.ids.length <= 0) {
          this.$message.error('请至少选择一条删除！')
          return
        }
        // 数组转字符串
        const ids = this.ids.join(',')
        delModel({ id: ids }).then(res => {
          if (res.code === 200) {
            this.getList()
          }
          this.$message.success(res.msg)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /** 处理头像上传 */
    handleAvatarSuccess(res) {
      this.params.pic = res.data.imgUrl
    },
    /** 上传验证 */
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isGIF = file.type === 'image/gif'
      const isPNG = file.type === 'image/png'
      const isBMP = file.type === 'image/bmp'

      if (!isJPG && !isGIF && !isPNG && !isBMP) {
        this.$message.error('上传图片必须是JPG/GIF/PNG/BMP 格式!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return (isJPG || isBMP || isGIF || isPNG) && isLt2M
    },
    /** 表单提交 */
    submitForm: function() {
      this.$refs['params'].validate(valid => {
        if (valid) {
          if (this.params.id) {
            updateModel(this.params).then(res => {
              if (res.code === 200) {
                this.$message.success(res.msg)
                this.open = false
                this.getList()
              } else {
                this.$message.error(res.msg)
              }
            })
          } else {
            addModel(this.params).then(res => {
              if (res.code === 200) {
                this.$message.success(res.msg)
                this.open = false
                this.getList()
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        }
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 排序 */
    handleSort(column) {
      this.queryParams.sort = column.prop

      if (column.order === 'descending') {
        this.queryParams.order = 'desc'
      } else {
        this.queryParams.order = 'asc'
      }
      this.queryParams.pageNum = 1
      this.getList()
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
