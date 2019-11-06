<template>
  <div class="app-container">
    <el-form :inline="true" label-width="68px">
      <el-form-item>
        <el-button type="primary" size="mini" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="modelList"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="序号 " width="50" align="center" />
      <el-table-column prop="name" label="名称" align="center" />
      <el-table-column prop="clotheTypeId" label="货号" align="center" />
      <el-table-column prop="Size" label="尺码" align="center" />
      <el-table-column prop="shopType" label="来源平台" align="center" :formatter="formatType" />
      <el-table-column prop="buyPrice" label="入手价" align="center" />
      <el-table-column prop="salePrice" label="出售价" align="center" />
      <el-table-column prop="shipFee" label="运费" align="center" />
      <el-table-column prop="shipNum" label="运单编号" align="center" />
      <el-table-column prop="saleTime" label="出售时间" align="center" width="180" />
      <el-table-column prop="salePrice" label="盈亏" align="center" :formatter="formatProfit" />
      <el-table-column label="操作" align="center" class-name="small-padding" width="160">
        <template>
          <el-button size="mini" type="text" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
    </div>

    <!-- 添加或修改 -->
    <el-dialog :title="title" :visible.sync="open" width="50%">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入标签名称" />
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
import { fetchList } from '@/api/shoe'
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
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: '标签不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询列表 */
    getList() {
      fetchList(this.queryParams).then(res => {
        /* this.modelList = res.data.rows
                    this.total = res.data.total*/
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
      const profit = row.salePrice - row.buyPrice - row.shipFee
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
      this.form = {
        name: ''
      }
      this.resetForm('form')
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '新增'
    },
    /** 表单提交 */
    submitForm: function() {

    }
  }
}
</script>
