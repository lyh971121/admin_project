import {reqCategory1List,reqCategory2List,reqCategory3List} from '@/api/attr/attr'
//品牌分类的仓库
//存储数据
const state = {
  //收集一二三级分类的id
  ids:{
    c1Id:'',
    c2Id:'',
    c3Id:'',
  },
  //存储一级分类的数据
  c1List:[],
  c2List:[],
  c3List:[]
}

//唯一修改state的地方
const mutations = {
  
}
