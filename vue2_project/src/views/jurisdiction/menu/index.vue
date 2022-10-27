<template>
    <div>
        <!-- expand-row-keys	可以通过该属性设置 Table 目前的展开行，需要设置 row-key 属性才能使用，该属性为展开行的 keys 数组。 -->
    <el-table
      border
      style="margin-bottom: 20px;"
      row-key="id"
      :data="menuList"
      :expand-row-keys="dafList"
    >
      <el-table-column
        prop="name"
        label="名称"
      />
      <el-table-column
        prop="code"
        label="权限值"
      />

      <el-table-column
        prop="toCode"
        label="跳转权限值"
      />

      <el-table-column label="操作">
        <template slot-scope="{row}">
          
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            :title="getAddTitle(row.level)"
            @click="addMemu(row)"
          />

          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            :title="row.level===4 ? '修改功能' : '修改菜单'"
            @click="update(row)"
          />

          <el-button
           type="danger"
            icon="el-icon-delete"
            size="mini"
            title="删除"
            @click="deleteMenu(row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogPermissionVisible" :title="dialogTitle"  @close="resetData">

      <el-form :model="permission"  label-width="120px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="permission.name"/>
        </el-form-item>
        
        <el-form-item label="功能权限值" prop="code">
          <el-input  v-model="permission.code" />
        </el-form-item>

        <el-form-item label="跳转路由权限值" prop="toCode" >
          <el-input v-model="permission.toCode"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetData">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
    </div>
</template>

<script>
export default {
        name:'Menu',
        data() {
            return {
                dialogPermissionVisible: false, // 是否显示菜单权限的Dialog
                //存储菜单列表
                menuList:[],
                //页面加载默认展开项数据
                dafList:[],
                //菜单对象
                permission:{
                    name:'',
                    code:'',
                    toCode:'',
                    level:0
                }
            }
        },
        //页面挂载
        mounted() {
            this.getMenuList();
        },

        methods: {
            async getMenuList(){
                const result = await this.$API.permission.getPermissionList()
                this.menuList = result.data.children
                this.dafList = [this.menuList[0].id]
            },
            //根据级别得到要显示的添加dialog的标题
            getAddTitle (level) {
                if (level===1 || level===2) {
                return '添加菜单'
                } else if (level===3){
                return '添加功能'
                }
            },
            //添加按钮的回调
            addMemu (row) {
                this.dialogPermissionVisible = true
                this.permission.pid = row.id
                this.permission.level = row.level + 1
                this.permission.type = this.permission.level===4 ? 2 : 1
            },
            //确定按钮的回调
            async addOrUpdate(){
                const { permission } = this
                const { id } = permission
                const result = await this.$API.permission[id ? 'updatePermission' : 'addPermission'](permission)
                this.$message.success(result.message || `${id ? '修改' : '添加'}成功!`)
                this.resetData()
                this.getMenuList()
            },
            //修改按钮
            update(row){
                this.dialogPermissionVisible = true
                this.permission = {...row}  
                this.permission.type = this.permission.level===4 ? 2 : 1
            },
            //删除
            deleteMenu(permission){
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                type: 'warning'
            }).then(async () => {
                const result = await this.$API.permission.removePermission(permission.id)
                this.$message.success(result.message || '删除成功!')
                this.getMenuList()
            }).catch((error) => {
                if (error==='cancel') {
                this.$message({
                type: 'info',
                message: '已取消删除'
            })
            }
            })
            },





            //重置数据
            resetData() {
                this.dialogPermissionVisible = false
                this.permission = {
                level: 0,
                name: '',
                code: '',
                toCode: ''
                }
            }



        },


        //计算属性
        computed:{
            //动态计算得到Dialog的标题
            dialogTitle () {
                const {id, level} = this.permission
                if (id) {
                return level===4 ? '修改功能' : '修改菜单'
            } else {
                return level===4 ? '添加功能' : '添加菜单'
                    }
            },
        }



    }
</script>

<style lang="scss" scoped>

</style>