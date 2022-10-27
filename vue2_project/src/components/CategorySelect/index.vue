<template>
  <!-- <div>
    <el-form :inline="true" >
    <el-form-item label="一级菜单">
      <el-select placeholder="请选择"   >
        <el-option ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="二级菜单">
      <el-select placeholder="请选择" >
        <el-option ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="三级菜单">
      <el-select placeholder="三级菜单">
        <el-option ></el-option>
      </el-select>
    </el-form-item>
    </el-form >
  </div> -->



  <div>
    <el-form :inline="true" :model="selInfo">
    <el-form-item label="一级菜单">
      <el-select placeholder="请选择"  v-model="selInfo.category1Id" @change="handeler" >
        <el-option :label="c1.name" :value="c1.id" v-for="(c1,index) in Category1List" :key="c1.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="二级菜单">
      <el-select placeholder="请选择" v-model="selInfo.category2Id" @change="handler2">
        <el-option :label="c2.name" :value="c2.id" v-for="(c2,index) in Category2List" :key="c2.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="三级菜单">
      <el-select placeholder="三级菜单" v-model="selInfo.category3Id" >
        <el-option :label="c3.name" :value="c3.id" v-for="(c3,index) in Category3List" :key="c3.id"></el-option>
      </el-select>
    </el-form-item>
    </el-form >
  </div>
</template>

<script>
import {reqCategory1List,reqCategory2List,reqCategory3List} from '../../api/attr/attr'
export default {
  name: "CategorySelect",
  data() {
    return {
      //存储一级分类的数据
      Category1List:[],
      Category2List:[],
      Category3List:[],
      //收集选中的id
      selInfo:{
        category1Id:'',
        category2Id:'',
        category3Id:'',
      }
    }
  },
  //组件挂载
  
  
  
  mounted() {
     //获取一级分类数据方法
     this.getCategoryList();
  },








  methods: {
    //获取一级分类数据方法
    async getCategoryList(){
      //获取一级分类的请求，不需要携带参数
      let result = await reqCategory1List()
      // console.log(result);
      if(result.code == 200){
        this.Category1List = result.data
      }
      
    },
    //获取二级分类数据
    async handeler(){
      const{category1Id} = this.selInfo
      let result = await reqCategory2List(category1Id)
      console.log(result);
      if(result.code == 200){
        this.Category2List = result.data
      }
    },
    //获取三级分类数据
    async handler2(){
      // alert(123)
      const {category2Id} = this.selInfo
      let result = await reqCategory3List(category2Id)
      // console.log(result);
      this.Category3List = await result.data
    }
  },
};
</script>

<style lang="scss" scoped>
</style>