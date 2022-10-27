<template>
  <div>
    <el-form inline :mode="tempSearchObj">
      <el-form-item>
        <el-input placeholder="角色名称" v-model="tempSearchObj.roleName" />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="search"
        >查询</el-button
      >
      <el-button @click="resetSearch">清空</el-button>
    </el-form>

    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="addRole">添加</el-button>
      <el-button
        type="danger"
        :disabled="selectedIds.length === 0"
        @click="removeAllRole"
        >批量删除</el-button
      >
    </div>

    <el-table
      border
      stripe
      style="width: 960px"
      :data="roleList"
      @selection-change="handeler"
      v-loading="loading"
    >
      <el-table-column type="selection" width="55" />

      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>

      <el-table-column label="角色名称" prop="roleName"></el-table-column>

      <el-table-column label="操作" width="300" align="center">
        <template slot-scope="{ row }">
          <el-button
            size="mini"
            type="info"
            icon="el-icon-info"
            title="分配权限"
             @click="$router.push(`/acl/role/auth/${row.id}?roleName=${row.roleName}`)"
          />
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            title="修改角色"
            @click="updateRole(row)"
          />
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            title="删除角色"
            @click="deletedRole(row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <!-- :current-page="1" -->
    <el-pagination
      @size-change="handler"
      @current-change="getRoleList"
      :total="total"
      :page-size="3"
      :page-sizes="[3, 5, 7]"
      style="padding: 20px 0"
      layout="prev, pager, next, jumper, sizes, total"
    />

    <el-dialog :title="newRole.id?'修改用户':'添加用户'" :visible.sync="dialogFormVisible">
      <el-form style="width: 80%" :model="newRole">
        <el-form-item label="角色名称">
          <el-input autocomplete="off" v-model="newRole.roleName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//引入请求函数
import {
  reqRoleList,
  reqDeleteRole,
  reqAddOrUpdateTradeMark,
  reqAllRemove,
} from "../../../api/role/role";

export default {
  name: "Role",
  data() {
    return {
      //定义当前多少页，一页多少个
      page: 1,
      limit: 3,
      total: 0,
      //存储角色列表
      roleList: [],
      //收集输入搜索
      tempSearchObj: { roleName: "" },
      //发请求的条件参数数据
      searchObj: { roleName: "" },
      dialogFormVisible: false,
      //收集新增用户的名称
      newRole: {},
      //收集批量删除的数据
      selectedIds: [],

      //加载状态
      loading:true
    };
  },

  //页面挂载
  mounted() {
    //获取角色列表
    this.getRoleList();
  },

  methods: {
    async getRoleList(pager = 1) {
      //整理参数
      this.page = pager;
      //加载状态
      this.loading = true
      const { page, limit } = this;
      let res = await reqRoleList(page, limit, this.searchObj);
      this.loading = false
      // console.log(res);
      if (res.code == 20000) {
        this.roleList = res.data.items;
        this.total = res.data.total;
      }
      
    },
    //一页展示多少条
    handler(limit) {
      this.limit = limit;
      this.getRoleList();
    },
    //删除角色按钮
    deletedRole(row) {
      this.$confirm(`您是否要删除${row.roleName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await reqDeleteRole(row.id);
          this.getRoleList();

          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //搜索按钮
    search() {
      this.searchObj = { ...this.tempSearchObj };
      this.getRoleList();
    },
    //重置查询搜索按钮
    resetSearch() {
      this.tempSearchObj = { roleName: "" };
      this.searchObj = { roleName: "" };
      this.getRoleList();
    },
    //添加
    addRole() {
      this.dialogFormVisible = true;
      this.newRole = {};
    },

    //确定按钮
    async addOrUpdateRole() {
      this.dialogFormVisible = false;
      let result = await reqAddOrUpdateTradeMark(this.newRole);
      this.$notify({
        title: this.newRole.id ? "修改角色" : "添加角色",
        message: this.newRole.id ? "恭喜您，修改成功" : "恭喜您,添加成功",
        offset: 100,
        type: "success",
      });
      this.getRoleList();
      this.newRole = {};
    },

    //表单选择状态按钮
    handeler(selection) {
      // console.log(selection);
      this.selectedIds = selection.map((item) => item.id);
    },
    //批量删除
    removeAllRole() {
      this.$confirm("确定删除吗?")
        .then(async () => {
          await reqAllRemove(this.selectedIds);
          this.$message.success("删除成功");
          this.getRoleList();
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    },
    //修改角色
    updateRole(row){
      this.dialogFormVisible = true
      this.newRole = {...row}
    },
    
  },
};
</script>

<style lang="scss" scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>