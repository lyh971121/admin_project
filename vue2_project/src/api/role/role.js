import request from '@/utils/request'

//获取角色列表
export const reqRoleList = (page,limit,searchObj) => request({url:`/admin/acl/role/${page}/${limit}`,params:searchObj,method:'get'})

//删除按钮的请求
export const reqDeleteRole = (id) => request({url:`/admin/acl/role/remove/${id}`,method:'delete'})

//添加的请求
// export const reqAddRole = (role) =>request({url:'/admin/acl/role/save',data:role,method:'post'})

export const reqAddOrUpdateTradeMark = (role) => {
  if(role.id){
      //修改操作
      return request({url:'/admin/acl/role/update',method:'put',data:role})
  }else{
      return request({url:'/admin/acl/role/save',data:role,method:'post'})
  }
}

//批量删除
export const reqAllRemove = (ids) => request({url:`/admin/acl/role/batchRemove`,data:'ids',method:'delete'})