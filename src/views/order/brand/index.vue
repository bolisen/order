<template>
  <div class="app-container">
    <el-form :inline="true" label-width="68px">
      <el-form-item>
        <el-button type="primary" size="mini" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="modelList"  ref="multipleTable" tooltip-effect="dark" style="width: 100%">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="序号 " width="50" align="center" />
      <el-table-column prop="imgUrl" label="图片" align="center" />
      <el-table-column prop="name" label="名称" align="center" />
      <el-table-column prop="number" label="货号" align="center" />
      <el-table-column prop="type" label="类型" align="center" />
      <el-table-column prop="remark" label="备注" align="center" />
      <el-table-column prop="createTime" label="创建时间" align="center" width="180" />
      <el-table-column label="操作" align="center" class-name="small-padding" width="160">
        <template>
          <el-button size="mini" type="text" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete">删除</el-button>
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
            <img v-if="params.pic" :src="params.pic" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p>(建议尺寸为700*560,建议大小在2M以下）</p>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="params.type" filterable placeholder="请选择">
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
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
import { fetchList, addModel ,updateModel } from '@/api/brand'
export default {
  data() {
    return {
      modelList: [],
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 表单参数
      params: {
        name: '',
        pic: '',
        number: ''
      },
      // 表单校验
      rules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        number: [{ required: true, message: '货号不能为空', trigger: 'blur' }],
        pic: [{ required: true, message: '图片不能为空', trigger: 'blur' }],
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
      fetchList(this.queryParams).then(res => {
      })
    },
    // 格式化平台
    formatType(row, column) {
      if (row.shopType === 1) {
        row.shopType = '毒'
      }
      if (row.shopType === 2) {
        row.shopType = 'nice'
      }
      if (row.shopType === 3) {
        row.shopType = '绿叉'
      }
      if (row.shopType === 4) {
        row.shopType = '其他'
      }
      return row.shopType
    },
    // 格式化盈亏
    formatProfit(row) {
      const profit = row.salePrice - row.buyPrice - row.shipFee;
      if (profit > 0) {
        return '+' + profit
      } else {
        return '-' + profit
      }
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.params = {
        name: '',
        pic: '',
        number: ''
      }
      this.resetForm('params')
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '新增'
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
      this.$res['params'].validate(valid => {
        if (valid) {
          if (this.params.id != undefined) {
          } else {
            addModel(this.params).then( res => {
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
