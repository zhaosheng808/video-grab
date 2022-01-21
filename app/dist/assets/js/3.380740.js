(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{742:function(e,t,i){"use strict";i.r(t);var s=i(811),n=i(773);for(var a in n)"default"!==a&&function(e){i.d(t,e,function(){return n[e]})}(a);var r=i(86),o=Object(r.a)(n.default,s.a,s.b,!1,null,"65e9c100",null);t.default=o.exports},772:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"Application",props:[""],data:function(){return{dialogVisible:!1,isUpdating:!1,isLoading:!1,searchForm:{size:10,page:1,keywords:""},serviceList:[],dataList:[],form:{name:"",description:"",systemName:"",services:[],clientAddressPatterns:[],clientAddressPatternsString:""},total:0,rules:{name:{required:!0,message:"请输入应用名称"},description:{required:!0,message:"请输入应用描述"},systemName:{required:!0,message:"请输入系统名称"}},multipleSelection:[]}},computed:{},created:function(){this.getDataList(),this.getServers()},mounted:function(){},methods:{getServers:function(){var e=this;this.$axios.get("/home/services").then(function(t){e.serviceList=t}).catch(function(t){e.$message.error(t)})},getDataList:function(){var e=this;this.isLoading=!0,this.$axios.get("/home/applications").then(function(t){e.dataList=t,e.isLoading=!1}).catch(function(t){e.$message.error(t),e.isLoading=!1})},handleSearch:function(){this.searchForm.page=1,this.getDataList()},pageChange:function(){this.getDataList()},handleAdd:function(){this.resetFields("ruleForm"),this.form={id:null,name:"",description:"",systemName:"",services:[],clientAddressPatterns:[],clientAddressPatternsString:""},this.dialogVisible=!0},handleEdit:function(e){this.resetFields("ruleForm");var t=(e.clientAddressPatterns||[]).join("\n");this.form={id:e.id,name:e.name,description:e.description,systemName:e.systemName,services:e.services||[],clientAddressPatterns:e.clientAddressPatterns||[],clientAddressPatternsString:t},this.dialogVisible=!0},handleSubmit:function(){var e=this;this.validateForm("ruleForm",function(){var t=e.form,i="POST",s="/home/applications";t.id&&(i="PUT",s="/home/applications/"+t.id);var n=(t.clientAddressPatternsString||"").split("\n").filter(function(e){return e}),a={name:t.name,description:t.description,services:t.services,clientAddressPatterns:n||[],systemName:t.systemName};e.isUpdating=!0,e.$axios({method:i,url:s,data:a}).then(function(t){e.isUpdating=!1,e.dialogVisible=!1,e.getDataList(),e.$message.success("操作成功！")}).catch(function(t){e.$message.error(t),e.isUpdating=!1})})},handleDel:function(e){var t=this;this.sureAgain("确认是否删除 "+e.name+" ?",function(){t.delAjax(e.id)})},delAjax:function(e){var t=this;this.projectID;this.$axios({method:"DELETE",url:"/home/applications/"+e}).then(function(e){t.getDataList(),t.$message.success("操作成功！")}).catch(function(e){t.$message.error(e)})},sureAgain:function(e,t){this.$confirm(e,"提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){t&&t()}).catch(function(){})},validateForm:function(e,t,i){this.$refs[e].validate(function(e){if(!e)return i&&"function"==typeof i&&i(),!1;t&&"function"==typeof t&&t()})},resetFields:function(e){var t=this;this.$refs[e]&&this.$nextTick(function(){t.$refs[e].resetFields()})}}}},773:function(e,t,i){"use strict";i.r(t);var s=i(772),n=i.n(s);for(var a in s)"default"!==a&&function(e){i.d(t,e,function(){return s[e]})}(a);t.default=n.a},811:function(e,t,i){"use strict";var s=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"app-page-content"},[i("div",{staticClass:"tab-search-header",staticStyle:{"margin-bottom":"10px"}},[i("div",{staticClass:"btn_group"},[i("el-button",{attrs:{type:"primary",size:"small"},on:{click:e.handleAdd}},[e._v("添加应用")])],1)]),e._v(" "),i("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.isLoading,expression:"isLoading"}],attrs:{data:e.dataList,"element-loading-spinner":"el-icon-loading","element-loading-text":"数据加载中...",stripe:""}},[i("el-table-column",{attrs:{prop:"id",label:"ID",width:"100"}}),e._v(" "),i("el-table-column",{attrs:{prop:"name",label:"应用名称"}}),e._v(" "),i("el-table-column",{attrs:{prop:"description",label:"应用描述"}}),e._v(" "),i("el-table-column",{attrs:{prop:"services",label:"服务"},scopedSlots:e._u([{key:"default",fn:function(t){return e._l(t.row.services,function(t){return i("el-tag",{key:t},[e._v(e._s(t.toUpperCase()))])})}}])}),e._v(" "),i("el-table-column",{attrs:{prop:"systemName",width:"150",label:"应用Key"}}),e._v(" "),i("el-table-column",{attrs:{label:"操作",width:"180"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("el-button",{attrs:{size:"mini",type:"text"},on:{click:function(i){return e.handleEdit(t.row,t.$index)}}},[e._v("编辑\n                ")]),e._v(" "),i("el-button",{staticClass:"danger-color",attrs:{size:"mini",type:"text"},on:{click:function(i){return e.handleDel(t.row,t.$index)}}},[e._v("删除\n                ")])]}}])})],1),e._v(" "),i("el-dialog",{attrs:{title:(e.form.id?"编辑":"添加")+"应用",visible:e.dialogVisible,width:"540px","close-on-click-modal":!1},on:{"update:visible":function(t){e.dialogVisible=t}}},[i("el-form",{ref:"ruleForm",attrs:{model:e.form,rules:e.rules,"label-width":"140px"}},[i("el-form-item",{attrs:{label:"应用名称：",prop:"name"}},[i("el-input",{attrs:{disabled:Boolean(e.form.id),maxlength:"20","show-word-limit":""},model:{value:e.form.name,callback:function(t){e.$set(e.form,"name",t)},expression:"form.name"}})],1),e._v(" "),i("el-form-item",{attrs:{label:"应用描述：",prop:"description"}},[i("el-input",{attrs:{type:"textarea",disabled:Boolean(e.form.id),autosize:{minRows:3},maxlength:"150","show-word-limit":""},model:{value:e.form.description,callback:function(t){e.$set(e.form,"description",t)},expression:"form.description"}})],1),e._v(" "),i("el-form-item",{attrs:{label:"应用Key：",prop:"systemName"}},[i("el-input",{attrs:{disabled:Boolean(e.form.id),maxlength:"20","show-word-limit":""},model:{value:e.form.systemName,callback:function(t){e.$set(e.form,"systemName",t)},expression:"form.systemName"}})],1),e._v(" "),i("el-form-item",{attrs:{label:"服务：",prop:"services"}},[i("el-checkbox-group",{model:{value:e.form.services,callback:function(t){e.$set(e.form,"services",t)},expression:"form.services"}},e._l(e.serviceList,function(t){return i("el-checkbox",{key:t,attrs:{label:t}},[e._v(e._s(t.toUpperCase())+"\n                    ")])}),1)],1),e._v(" "),i("el-form-item",{attrs:{label:"访问IP白名单：",prop:"clientAddressPatterns"}},[i("div",{staticClass:"grey-tip"},[e._v("如需添加多个，请使用换行进行分隔")]),e._v(" "),i("el-input",{attrs:{type:"textarea",autosize:{minRows:3}},model:{value:e.form.clientAddressPatternsString,callback:function(t){e.$set(e.form,"clientAddressPatternsString",t)},expression:"form.clientAddressPatternsString"}})],1)],1),e._v(" "),i("div",{attrs:{slot:"footer"},slot:"footer"},[i("el-button",{attrs:{size:"small"},on:{click:function(t){e.dialogVisible=!1}}},[e._v("取 消")]),e._v(" "),i("el-button",{attrs:{size:"small",type:"primary",loading:e.isUpdating},on:{click:e.handleSubmit}},[e._v("确 定")])],1)],1)],1)},n=[];i.d(t,"a",function(){return s}),i.d(t,"b",function(){return n})}}]);