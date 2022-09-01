<template>
    <div>
        <page-table
        :func="func"
        >
            <template v-slot:moreOpration="scope">
                <el-button type="warning" size="small" @click="editPermission(scope.data)">权限设置</el-button>
            </template>
        </page-table>
        <drawer
        :title="title"
        :visible.sync="drawer"
        direction="rtl"
        size="16.5%"
        >
            <div class="drawer-content">
                <div>
                    <tree 
                        :data="menuList" 
                        :props="treeProps"  
                        node-key="id" 
                        show-checkbox
                        :default-expanded-keys="checkedKey"
                        :default-checked-keys="checkedKey"
                        ref="tree"
                        check-strictly
                        >

                    </tree>
                </div>
                <div>
                    <el-button type="primary" size="small" @click="savePersmission">保存设置</el-button>
                </div>
            </div>
        </drawer>
    </div>
</template>
<script>
import pageTable from "@/components/page-table.vue"
import func from "./index.js"
import {Drawer,Tree} from "element-ui"
import { rolePermission, savePermission } from '@/apis/role/index.js'
import {mapState} from "vuex"
export default {
    name:"role",
    components:{
        pageTable,
        Drawer,
        Tree
    },
    data(){
        return {
            func,
            drawer:false,
            currentEditRole:"",
            currentRoleId:-1,
            treeProps:{
                children:"children",
                label:"cname"
            },
            checkedKey:[]
        }
    },
    created(){
        console.log(this.$store.state.roleMod)
    },
    methods:{
        editPermission(scope){
            this.drawer = true
            console.log(scope)
            this.currentEditRole = scope.row.name
            this.currentRoleId = scope.row.id
            rolePermission({id:scope.row.id}).then(res=>{
                console.log(res)
                this.checkedKey = res.data
                this.$refs.tree.setCheckedKeys(res.data)
            })
        },
        savePersmission(){
            if(this.currentRoleId==-1)return
            // 获取选中id
            let keys = this.$refs.tree.getCheckedKeys()
            let halfKeys = this.$refs.tree.getHalfCheckedKeys()
            let menuIdList = [...keys,...halfKeys]
            savePermission({menuIdList,roleId:this.currentRoleId}).then(res=>{
                console.log("保存权限",res)
                if(res.data){
                    this.drawer = false
                }
            })
        }
    },
    computed:{
        title(){
            return '权限设置-----'+this.currentEditRole
        },
        ...mapState({
            menuList:state=>state.roleMod.menuList
        })
    }

}
</script>
<style lang="less" scoped>
.drawer-content{
    display: flex;
    flex-direction: column;
    height: 100%;
    div:nth-child(1){
    }
    div:nth-child(2){
        margin: 100px 0 20px 20px;
    }
}
</style>