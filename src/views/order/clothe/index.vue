<template>
  <div class="app-container">
    <el-form :inline="true" label-width="68px">
      <el-form-item>
        <el-button type="primary" size="mini" @click="handleAdd">新增</el-button>
        <el-button type="danger" size="mini" @click="handleRemoveAll">批量删除</el-button>
      </el-form-item>

      <el-input
        v-model="queryParams.keyword"
        size="small"
        style="width: 200px"
        placeholder="品牌名称"
        @keyup.enter.native="handleQuery"
      />
      <el-button type="primary" size="mini" @click="handleQuery">查询</el-button>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="modelList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @sort-change="handleSort"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="序号 " width="50" align="center" sortable="custom" />
      <el-table-column prop="name" label="名称" align="center" sortable="custom" />
      <el-table-column prop="buy_name" label="下单人" align="center" sortable="custom" />
      <el-table-column prop="mobile" label="手机" align="center" sortable="custom" />
      <el-table-column prop="address" label="地址" align="center" width="200" sortable="custom" />
      <el-table-column prop="ship" label="快递" align="center" width="80" sortable="custom" />
      <el-table-column prop="ship_num" label="运单编号" align="center" />
      <el-table-column prop="buy_price" label="入手价" align="center" sortable="custom" />
      <el-table-column prop="sale_price" label="出售价" align="center" :formatter="formatSalePrice" sortable="custom" />
      <el-table-column prop="ship_fee" label="运费" align="center" width="50" :formatter="formatShipFee" />
      <el-table-column prop="money" label="盈亏" align="center" sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.money>0" style="color: #fb0000"> {{ scope.row.money }}</span>
          <span v-else style="color: #2d891a"> {{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="下单时间" align="center" width="180" />
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
      <el-form ref="params" :model="params" :rules="rules" label-width="140px">
        <el-form-item label="所属款式" prop="brand_id">
          <el-select v-model="params.brand_id" filterable placeholder="请选择" value="">
            <el-option
              v-for="item in brandList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="下单人姓名" prop="buy_name">
          <el-input v-model="params.buy_name" placeholder="请输入下单人姓名" clearable />
        </el-form-item>
        <el-form-item label="尺码" prop="size">
          <el-input v-model="params.size" type="number" placeholder="请输入尺码" clearable />
        </el-form-item>
        <el-form-item label="下单人手机号" prop="mobile">
          <el-input v-model="params.mobile" placeholder="请输入下单人手机号" clearable />
        </el-form-item>
        <el-form-item label="入手价" prop="buy_price">
          <el-input v-model="params.buy_price" type="number" placeholder="请输入入手价" clearable />
        </el-form-item>
        <el-form-item label="省/市/区" prop="proCityArea">
          <el-cascader v-model="params.proCityArea" filterable :options="provinceList" :props="props" style="width: 100%" />
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="params.address" placeholder="不需要填写省市区" clearable />
        </el-form-item>
        <el-form-item label="快递公司" prop="ship">
          <el-input v-model="params.ship" placeholder="请输入快递名称" clearable />
        </el-form-item>
        <el-form-item label="运单号" prop="ship_num">
          <el-input v-model="params.ship_num" placeholder="请输入运单号" />
        </el-form-item>
        <el-form-item label="运费" prop="ship_fee">
          <el-input v-model="params.ship_fee" type="number" placeholder="请输入运费" clearable />
        </el-form-item>
        <el-form-item label="出售价" prop="sale_price">
          <el-input v-model="params.sale_price" type="number" placeholder="请输入出售价" clearable />
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
import { listShoe, getModel, addModel, updateModel, delModel } from '@/api/clothe'
import { listBrand } from '@/api/brand'
import { getArea } from '@/api/area'
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
        buy_name: '',
        mobile: '',
        size: '',
        proCityArea: '',
        address: '',
        ship: '',
        ship_num: '',
        ship_fee: '',
        buy_price: '',
        sale_price: ''
      },
      // 表单校验
      rules: {
        brand_id: [{ required: true, message: '请选择品牌', trigger: 'blur' }],
        buy_name: [{ required: true, message: '请输入下单人', trigger: 'blur' }],
        size: [{ required: true, message: '请输入尺码', trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            validator: function(rule, value, callback) {
              const reg = /^1(3|4|5|6|7|8)\d{9}$/
              if (!reg.test(value)) {
                callback(new Error('请输入正确的手机号！'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        proCityArea: [{ required: true, message: '请选择省市区', trigger: 'blur' }],
        buy_price: [
          { required: true, message: '请输入入手价', trigger: 'blur' },
          {
            validator: function(rule, value, callback) {
              const reg = /^[0-9]+(.[0-9]{2})?$/
              if (!reg.test(value)) {
                callback(new Error('请输入正确的价格！'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        sale_price: [
          {
            validator: function(rule, value, callback) {
              const reg = /^[0-9]+(.[0-9]{2})?$/
              if (!reg.test(value)) {
                callback(new Error('请输入正确的价格！'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      // 品牌类型
      brandList: [],
      // 省份列表
      provinceList: [],
      props: {
        label: 'name',
        value: 'id',
        children: 'children'
      }
    }
  },
  created() {
    this.getList()
    this.getBrandList()
    // 省份
    this.getProvence()
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
    // 格式化出售价
    formatSalePrice(row) {
      if (row.sale_price === '0.00' || row.sale_price == null) {
        row.sale_price = '未出售'
      }
      return row.sale_price
    },
    // 格式化运费
    formatShipFee(row) {
      if (row.ship_fee === '0.00' || row.ship_fee == null) {
        row.ship_fee = '无'
      }
      return row.ship_fee
    },
    // 格式化出售时间
    formatSaleTime(row) {
      if (!row.sale_time) {
        row.sale_time = '无'
      }
      return row.sale_time
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
        ship_fee: '',
        sale_time: ''
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
      if (column.prop !== 'money') {
        this.queryParams.sort = column.prop

        if (column.order === 'descending') {
          this.queryParams.order = 'desc'
        } else {
          this.queryParams.order = 'asc'
        }
        this.queryParams.pageNum = 1
        this.getList()
      }
    },

    getProvence() {
      getArea().then((res) => {
        if (res.code === 200) {
          this.provinceList = res.data
        }
      })
    }
  }
}
</script>
