(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{741:function(t,e,i){"use strict";i.r(e);var s=i(810),a=i(771);for(var n in a)"default"!==n&&function(t){i.d(e,t,function(){return a[t]})}(n);var r=i(86),o=Object(r.a)(a.default,s.a,s.b,!1,null,"be76aac2",null);e.default=o.exports},770:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"Service",props:[""],data:function(){return{dialogVisible:!1,isUpdating:!1,searchForm:{size:10,page:1,keywords:""},dataList:[],form:{name:"",description:"",systemName:"",services:[],client_address_patterns:[]},total:0,rules:{name:{required:!0,message:"请输入应用名称"},description:{required:!0,message:"请输入应用描述"},systemName:{required:!0,message:"请输入系统名称"}},multipleSelection:[]}},computed:{},created:function(){this.getDataList()},mounted:function(){},methods:{getDataList:function(){var t=this;this.$axios.get("/home/services").then(function(e){t.dataList=e}).catch(function(e){t.$message.error(e)})},handleSearch:function(){this.searchForm.page=1,this.getDataList()},pageChange:function(){this.getDataList()},handleAdd:function(){this.resetFields("ruleForm"),this.form={id:null,name:"",description:"",systemName:"",services:[],clientAddressPatterns:[]},this.dialogVisible=!0},handleEdit:function(t){this.resetFields("ruleForm"),this.form={id:t.id,name:t.name,description:t.description,systemName:t.systemName,services:t.services||[],clientAddressPatterns:t.clientAddressPatterns||[]},this.dialogVisible=!0},handleSubmit:function(){var t=this;this.validateForm("ruleForm",function(){var e=t.form;t.isUpdating=!0;var i="POST",s="/home/applications";e.id&&(i="PUT",s="/home/applications/"+e.id);var a={name:e.name,description:e.description,services:e.services,clientAddressPatterns:e.clientAddressPatterns,systemName:e.systemName};t.$axios({method:i,url:s,data:a}).then(function(e){t.isUpdating=!1,t.dialogVisible=!1,t.getDataList(),t.$message.success("操作成功！")}).catch(function(e){t.$message.error(e),t.isUpdating=!1})})},handleDel:function(t){var e=this;this.sureAgain("确认是否删除 "+t.name+" ?",function(){e.delAjax(t.id)})},delAjax:function(t){var e=this;this.projectID;this.$axios({method:"DELETE",url:"/home/applications/"+t}).then(function(t){e.getDataList(),e.$message.success("操作成功！")}).catch(function(t){e.$message.error(t)})},sureAgain:function(t,e){this.$confirm(t,"提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){e&&e()}).catch(function(){})},validateForm:function(t,e,i){this.$refs[t].validate(function(t){if(!t)return i&&"function"==typeof i&&i(),!1;e&&"function"==typeof e&&e()})},resetFields:function(t){var e=this;this.$refs[t]&&this.$nextTick(function(){e.$refs[t].resetFields()})}}}},771:function(t,e,i){"use strict";i.r(e);var s=i(770),a=i.n(s);for(var n in s)"default"!==n&&function(t){i.d(e,t,function(){return s[t]})}(n);e.default=a.a},810:function(t,e,i){"use strict";var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"app-page-content"},[i("div",{staticClass:"tab-search-header",staticStyle:{"margin-bottom":"10px"}},[i("div",{staticClass:"btn_group"},[i("el-button",{attrs:{type:"primary",size:"small"},on:{click:t.handleAdd}},[t._v("添加应用")])],1)]),t._v(" "),i("el-table",{attrs:{data:t.dataList,stripe:""}},[i("el-table-column",{attrs:{prop:"id",label:"ID",width:"100"}}),t._v(" "),i("el-table-column",{attrs:{prop:"name",label:"应用名称"}}),t._v(" "),i("el-table-column",{attrs:{prop:"description",label:"应用描述"}}),t._v(" "),i("el-table-column",{attrs:{prop:"systemName",label:"系统名称"}}),t._v(" "),i("el-table-column",{attrs:{label:"操作",width:"180"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("el-button",{attrs:{size:"mini",type:"text"},on:{click:function(i){return t.handleEdit(e.row,e.$index)}}},[t._v("编辑\n                    ")]),t._v(" "),i("el-button",{staticClass:"danger-color",attrs:{size:"mini",type:"text"},on:{click:function(i){return t.handleDel(e.row,e.$index)}}},[t._v("删除\n                    ")])]}}])})],1),t._v(" "),i("el-dialog",{attrs:{title:(t.form.id?"编辑":"添加")+"应用",visible:t.dialogVisible,width:"540px","close-on-click-modal":!1},on:{"update:visible":function(e){t.dialogVisible=e}}},[i("el-form",{ref:"ruleForm",attrs:{model:t.form,rules:t.rules,"label-width":"100px"}},[i("el-form-item",{attrs:{label:"应用名称：",prop:"name"}},[i("el-input",{attrs:{disabled:Boolean(t.form.id),maxlength:"20","show-word-limit":""},model:{value:t.form.name,callback:function(e){t.$set(t.form,"name",e)},expression:"form.name"}})],1),t._v(" "),i("el-form-item",{attrs:{label:"应用描述：",prop:"description"}},[i("el-input",{attrs:{type:"textarea",autosize:{minRows:3},maxlength:"150","show-word-limit":""},model:{value:t.form.description,callback:function(e){t.$set(t.form,"description",e)},expression:"form.description"}})],1),t._v(" "),i("el-form-item",{attrs:{label:"系统名称：",prop:"systemName"}},[i("el-input",{attrs:{maxlength:"20","show-word-limit":""},model:{value:t.form.systemName,callback:function(e){t.$set(t.form,"systemName",e)},expression:"form.systemName"}})],1)],1),t._v(" "),i("div",{attrs:{slot:"footer"},slot:"footer"},[i("el-button",{attrs:{size:"small"},on:{click:function(e){t.dialogVisible=!1}}},[t._v("取 消")]),t._v(" "),i("el-button",{attrs:{size:"small",type:"primary",loading:t.isUpdating},on:{click:t.handleSubmit}},[t._v("确 定")])],1)],1)],1)},a=[];i.d(e,"a",function(){return s}),i.d(e,"b",function(){return a})}}]);