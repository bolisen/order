<template>
  <div class="app-container">
    <el-table
      ref="multipleTable"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column type="index" label="序号 " width="120" align="center"></el-table-column>
      <el-table-column prop="nickName" label="名称" align="center"></el-table-column>
      <el-table-column prop="nickName" label="货号" align="center"></el-table-column>
      <el-table-column prop="userName" label="尺码" align="center"></el-table-column>
      <el-table-column prop="userName" label="来源平台" align="center"></el-table-column>
      <el-table-column prop="mobile" label="入手价" align="center"></el-table-column>
      <el-table-column prop="parentName" label="出售价" align="center"></el-table-column>
      <el-table-column prop="label3Text" label="运费" align="center"></el-table-column>
      <el-table-column prop="parentName" label="运单编号" align="center"></el-table-column>
      <el-table-column prop="label4Text" label="出售时间" align="center"></el-table-column>
      <el-table-column prop="label4Text" label="盈亏" align="center"></el-table-column>
      <el-table-column prop="lastLogTime" label="操作" align="center" width="200"></el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="params.pageNum"
      :limit.sync="params.pageSize"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      total: 0,
      params: {
        pageNum: 1,
        pageSize: 10
      }
    }
  }
}
</script>
