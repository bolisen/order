<template>
  <div class="app-container">
    <el-form :inline="true" label-width="68px">
      <el-form-item>
        <el-button type="primary" size="mini" @click="handleAdd">新增</el-button>
        <el-button type="danger" size="mini" @click="handleRemoveAll">批量删除</el-button>
      </el-form-item>

      <el-select v-model="queryParams.type" placeholder="类型" size="small">
        <el-option label="全部" value="" />
        <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>

      <el-input v-model="queryParams.keyword" size="small" style="width: 200px" placeholder="名称" @keyup.enter.native="handleQuery" />

      <el-button type="primary" size="mini" @click="handleQuery">查询</el-button>
    </el-form>
    <el-table ref="multipleTable" :data="modelList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" @sort-change="handleSort">
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
      <el-table-column prop="salePrice" label="盈亏" align="center" />
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
        <el-form-item label="所属品牌" prop="brand_id">
          <el-select v-model="params.brand_id" filterable placeholder="请选择">
            <el-option
              v-for="item in brandList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="购入平台" prop="shop_type">
          <el-select v-model="params.shop_type" filterable placeholder="请选择">
            <el-option
              v-for="item in shopList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="尺码" prop="size">
          <el-input v-model="params.size" type="number" placeholder="请输入尺码" clearable />
        </el-form-item>
        <el-form-item label="入手价" prop="buy_price">
          <el-input v-model="params.buy_price" type="number" placeholder="请输入入手价" clearable />
        </el-form-item>
        <el-form-item label="出售价" prop="sale_price">
          <el-input v-model="params.sale_price" type="number" placeholder="请输入出售价" clearable />
        </el-form-item>
        <el-form-item label="运单号" prop="ship_num">
          <el-input v-model="params.ship_num" placeholder="请输入运单号" />
        </el-form-item>
        <el-form-item label="运费" prop="ship_fee">
          <el-input v-model="params.ship_fee" type="number" placeholder="请输入运费" clearable />
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
import { listShoe, getModel, addModel, updateModel, delModel } from '@/api/shoe'
import { listBrand } from '@/api/brand'
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
        brand_id: '',
        shop_type: '',
        size: '',
        buy_price: '',
        sale_price: '',
        ship_num: '',
        ship_fee: ''
      },
      // 表单校验
      rules: {
        brand_id: [{ required: true, message: '请选择品牌', trigger: 'blur' }],
        shop_type: [{ required: true, message: '请选择购入平台', trigger: 'blur' }],
        size: [{ required: true, message: '请输入尺码', trigger: 'blur' }],
        buy_price: [{ required: true, message: '请输入入手价', trigger: 'blur' }]
      },
      // 品牌类型
      brandList: [],
      // 平台列表
      shopList: ['毒', 'nice', '绿叉', '斗牛', '淘宝', '其他']
    }
  },
  created() {
    this.getList()
    this.getBrandList()
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true
      listShoe(this.queryParams).then(res => {
        this.modelList = res.data.rows
        this.total = res.data.total
        this.loading = false
      })
    },
    /** 获取品牌信息 */
    getBrandList() {
      listBrand({ show: 'all' }).then(res => {
        this.brandList = res.data.rows
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
        brand_id: '',
        shop_type: '',
        size: '',
        buy_price: '',
        sale_price: '',
        ship_num: '',
        ship_fee: ''
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
      this.$confirm('此操作将永久删除该数据, 是否继g续?', '提示', {
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
