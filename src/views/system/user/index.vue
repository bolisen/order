<template>
  <div class="app-container">
    <el-table
      ref="multipleTable"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column type="index" label="序号 " width="120" align="center"></el-table-column>
      <el-table-column prop="nickName" label="昵称" align="center"></el-table-column>
      <el-table-column prop="userName" label="真实姓名" align="center"></el-table-column>
      <el-table-column prop="mobile" label="手机号" align="center"></el-table-column>
      <el-table-column prop="parentName" label="邀请人" align="center"></el-table-column>
      <el-table-column prop="level" label="等级" align="center"></el-table-column>
      <el-table-column prop="label3Text" label="用户标签" align="center"></el-table-column>
      <el-table-column prop="label4Text" label="渠道标签" align="center"></el-table-column>
      <el-table-column prop="lastLogTime" label="最近随访" align="center" width="200"></el-table-column>
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
