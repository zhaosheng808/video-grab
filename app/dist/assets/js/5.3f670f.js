(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{744:function(t,e,n){"use strict";n.r(e);var a=n(813),i=n(779);for(var s in i)"default"!==s&&function(t){n.d(e,t,function(){return i[t]})}(s);var r=n(86),o=Object(r.a)(i.default,a.a,a.b,!1,null,null,null);e.default=o.exports},749:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=r(n(394)),i=r(n(48)),s=n(182);function r(t){return t&&t.__esModule?t:{default:t}}e.default={name:"top",props:["baseURL","title","username","useravatar","usermenu","icon","showBack","hiddenUserInfo","logo"],components:{},data:function(){var t=this;return{isUpdating:!1,dialogFormVisible:!1,form:{old_password:"",password1:"",password2:""},navList:[{name:"基础设置",index:"/home",keys:[]},{name:"媒体存储服务",index:"/mss",keys:["mss"]},{name:"媒体处理服务",index:"/mps",keys:["mps"]},{name:"媒体智能服务",index:"/mis",keys:["mis"]}],serviceList:[],rules:{old_password:{required:!0,message:"密码不能为空"},password1:{validator:function(t,e,n){e&&e.length>=6?n():n(new Error("密码不能小于6位"))},required:!0,trigger:"blur"},password2:{validator:function(e,n,a){n&&n!==t.form.password1?a(new Error("两次输入的密码不同")):n?a():a(new Error("密码不能为空"))},required:!0,trigger:"blur"}}}},computed:(0,i.default)({userimg:function(){return this.useravatar&&0!=this.useravatar.length?this.useravatar:n(782)},topNavList:function(){var t=this.navList,e=[],n=this.services||[];return t.forEach(function(t){if(t.keys.length>0)for(var a=0;a<t.keys.length;a++){var i=t.keys[a];if(n.indexOf(i)>-1){e.push(t);break}}else e.push(t)}),e}},(0,s.mapState)(["userId","services"])),created:function(){},methods:{handleCommand:function(t){if("changePassword"===t)this.change_password();else{var e=!0,n=!1,i=void 0;try{for(var s,r=(0,a.default)(this.usermenu);!(e=(s=r.next()).done);e=!0){var o=s.value;if(t===o.command)return void(location.href=o.url)}}catch(t){n=!0,i=t}finally{try{!e&&r.return&&r.return()}finally{if(n)throw i}}}},change_password:function(){this.form={old_password:"",password1:"",password2:""},this.resetForm("ruleForm"),this.dialogFormVisible=!0},handle_sure:function(){var t=this;this.validateForm("ruleForm",function(){var e=t.form.password1,n=t.userId,a={password:e};t.isUpdating=!0,t.$axios.put("/home/users/"+n+"/reset-password",a).then(function(e){t.isUpdating=!1,t.dialogFormVisible=!1,t.$message.success("操作成功！")}).catch(function(e){t.isUpdating=!1,t.$message.error(e)})})},resetForm:function(t){this.$refs[t]&&this.$refs[t].resetFields()},validateForm:function(t,e){this.$refs[t].validate(function(t){if(!t)return console.log("error submit!!"),!1;e&&"function"==typeof e&&e()})}}}},750:function(t,e,n){"use strict";n.r(e);var a=n(749),i=n.n(a);for(var s in a)"default"!==s&&function(t){n.d(e,t,function(){return a[t]})}(s);e.default=i.a},751:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"AppSelect",props:[],components:{},data:function(){return{isLoading:!1,isUpdating:!1,isDeleting:!1,dialogVisible:!1,dataList:[],multipleSelection:[],total:0,searchForm:{page:1,pageSize:100},form:{tag:"",fileData:null},projectInfo:null,applicationInfo:null,rules:{tag:{required:!0,message:"镜像tag不能为空"},fileData:{required:!0,message:"镜像文件不能为空"}}}},computed:{},methods:{show:function(t){this.dialogVisible=!0,this.projectInfo=t,this.handleSearch()},handleSearch:function(){this.searchForm.page=1,this.getDataList()},getDataList:function(){var t=this;this.isLoading=!0;var e=this.searchForm,n=this.projectInfo,a={name:e.keywords,page:e.page,size:e.pageSize};this.$axios({method:"get",url:"projects/"+n.name+"/applications",params:a}).then(function(e){t.isLoading=!1,t.total=e.total||0;var n=e.data||[];n.forEach(function(t){t.tag=t.tags[0]}),t.dataList=n}).catch(function(e){t.isLoading=!1})},handleSelectionChange:function(t){this.multipleSelection=t},handleDownload:function(){var t=this,e=this.multipleSelection,n=this.projectInfo;if(0!=e.length){var a=e.map(function(t){return{name:t.name,tag:t.tag}});if(0!=(a=a.filter(function(t){return t.tag})).length){var i={images:a};this.isUpdating=!0,this.$axios({method:"POST",url:"/projects/export?id="+n.id,data:i,responseType:"blob"}).then(function(e){var a=new Blob([e]),i=n.name+".zip";if(t.isUpdating=!1,"download"in document.createElement("a")){var s=document.createElement("a");s.download=i,s.style.display="none",s.href=URL.createObjectURL(a),document.body.appendChild(s),s.click(),URL.revokeObjectURL(s.href),document.body.removeChild(s)}else navigator.msSaveBlob(a,i)}).catch(function(e){t.isUpdating=!1,t.$message.error(e)})}else this.$message.warning("镜像列表为空！")}else this.$message.warning("请先选择一个项目！")},sureAgain:function(t,e){this.$confirm(t,"提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){e&&e()}).catch(function(){})},validateForm:function(t,e){this.$refs[t].validate(function(t){if(!t)return console.log("error submit!!"),!1;e&&"function"==typeof e&&e()})},resetFields:function(t){var e=this;this.$refs[t]&&this.$nextTick(function(){e.$refs[t].resetFields()})}}}},752:function(t,e,n){"use strict";n.r(e);var a=n(751),i=n.n(a);for(var s in a)"default"!==s&&function(t){n.d(e,t,function(){return a[t]})}(s);e.default=i.a},753:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"SubMenu",props:["menuData"]}},754:function(t,e,n){"use strict";n.r(e);var a=n(753),i=n.n(a);for(var s in a)"default"!==s&&function(t){n.d(e,t,function(){return a[t]})}(s);e.default=i.a},755:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=o(n(48)),i=o(n(788)),s=o(n(786)),r=n(182);function o(t){return t&&t.__esModule?t:{default:t}}e.default={name:"left",props:["menuItems"],components:{SubMenu:i.default,AppSelect:s.default},data:function(){return{isUpdating:!1}},computed:(0,a.default)({onRoutes:function(){var t=this.$route.path.split("/").slice(0,4).join("/");return"/mps/audiototext/setting"==t&&(t="/mps/audiototext/task"),t},filterNavItems:function(){var t=this,e=[];return this.navitems.forEach(function(n){(t.permissions.indexOf(n.key)>-1||!n.key)&&e.push(n)}),e}},(0,r.mapState)(["isCollapse"])),mounted:function(){},methods:{handleCollapseChange:function(){this.$store.commit("SET_COLLAPSE",!this.isCollapse)}}}},756:function(t,e,n){"use strict";n.r(e);var a=n(755),i=n.n(a);for(var s in a)"default"!==s&&function(t){n.d(e,t,function(){return a[t]})}(s);e.default=i.a},757:function(t,e,n){},758:function(t,e,n){},759:function(t,e,n){},760:function(t,e,n){},761:function(t,e,n){},762:function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("el-dialog",{attrs:{title:"导出项目","close-on-click-modal":!1,visible:t.dialogVisible,width:"520px"},on:{"update:visible":function(e){t.dialogVisible=e}}},[n("div",{directives:[{name:"loading",rawName:"v-loading",value:t.isLoading,expression:"isLoading"}],attrs:{"element-loading-spinner":"el-icon-loading","element-loading-text":"数据加载中..."}},[n("div",{staticClass:"operate-wrapper",staticStyle:{float:"right"}},[n("el-button",{attrs:{size:"small",type:"primary",loading:t.isUpdating,icon:"el-icon-download"},on:{click:t.handleDownload}},[t._v("导出")])],1),t._v(" "),n("el-table",{ref:"multipleTable",attrs:{data:t.dataList,border:"","row-key":"id","max-height":"400",stripe:"","tooltip-effect":"dark"},on:{"selection-change":t.handleSelectionChange}},[n("el-table-column",{attrs:{type:"selection",width:"40"}}),t._v(" "),n("el-table-column",{attrs:{prop:"name",label:"项目名称"}}),t._v(" "),n("el-table-column",{attrs:{prop:"tag",label:"镜像tag",width:"150"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-select",{staticStyle:{width:"120px"},attrs:{size:"mini",placeholder:"请选择tag"},model:{value:e.row.tag,callback:function(n){t.$set(e.row,"tag",n)},expression:"scope.row.tag"}},t._l(e.row.tags,function(t){return n("el-option",{key:t,attrs:{label:t,value:t}})}),1)]}}])})],1),t._v(" "),n("div",{staticClass:"pagination-wrapper"},[n("el-pagination",{attrs:{layout:"total, prev, pager, next, jumper","current-page":t.searchForm.page,"page-size":t.searchForm.pageSize,total:t.total},on:{"current-change":t.getDataList,"update:currentPage":function(e){return t.$set(t.searchForm,"page",e)},"update:current-page":function(e){return t.$set(t.searchForm,"page",e)}}})],1)],1)])},i=[];n.d(e,"a",function(){return a}),n.d(e,"b",function(){return i})},763:function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{},[t._l(t.menuData,function(e){return[e.children&&e.children.length>0?n("el-submenu",{key:e.index,staticClass:"submenu",attrs:{index:e.index}},[n("template",{slot:"title"},[1==e.type?[n("el-menu-item",{staticStyle:{padding:"0"},attrs:{index:e.index}},[n("div",{staticStyle:{width:"1px",height:"100%",display:"inline-block"}}),t._v(" "),n("span",{attrs:{title:e.name}},[t._v(t._s(e.name))])])]:[n("div",{staticStyle:{width:"1px",height:"100%",display:"inline-block"}}),t._v(" "),n("span",{attrs:{title:e.name}},[t._v(t._s(e.name))])]],2),t._v(" "),n("SubMenu",{attrs:{menuData:e.children}})],2):n("el-menu-item",{attrs:{index:e.index}},[n("div",{staticStyle:{width:"1px",height:"100%",display:"inline-block"}}),t._v(" "),n("span",{attrs:{title:e.name}},[t._v(t._s(e.name))])])]})],2)},i=[];n.d(e,"a",function(){return a}),n.d(e,"b",function(){return i})},764:function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"header"},[n("a",{staticClass:"header-logo limit-line1"},[t.logo?n("img",{staticClass:"logo-img",attrs:{src:t.logo,alt:""}}):t._e(),t._v(t._s(t.title))]),t._v(" "),n("div",{staticClass:"index-nav"},t._l(t.topNavList,function(e){return n("router-link",{key:e.index,attrs:{to:e.index}},[t._v(t._s(e.name)+"\n            ")])}),1),t._v(" "),t.hiddenUserInfo?t._e():n("el-dropdown",{staticClass:"header-user",on:{command:t.handleCommand}},[n("span",{staticClass:"el-dropdown-link"},[n("div",{staticClass:"useravatar"},[n("img",{attrs:{src:t.userimg}})]),t._v(" "),n("span",[t._v(t._s(t.username))]),t._v(" "),t.usermenu.length>0?n("i",{staticClass:"el-icon-arrow-down el-icon-caret-bottom"}):t._e()]),t._v(" "),n("el-dropdown-menu",{attrs:{slot:"dropdown"},slot:"dropdown"},t._l(t.usermenu,function(e){return n("el-dropdown-item",{key:e.command,attrs:{command:e.command}},[t._v(t._s(e.label)+"\n                ")])}),1)],1),t._v(" "),n("el-dialog",{attrs:{title:"修改密码",visible:t.dialogFormVisible,width:"500px","append-to-body":!0,"close-on-click-modal":!1},on:{"update:visible":function(e){t.dialogFormVisible=e}}},[n("el-form",{ref:"ruleForm",attrs:{model:t.form,"label-width":"90px",rules:t.rules}},[n("el-form-item",{attrs:{label:"新密码",prop:"password1"}},[n("el-input",{attrs:{type:"password",size:"small","show-password":"","auto-complete":"off"},model:{value:t.form.password1,callback:function(e){t.$set(t.form,"password1",e)},expression:"form.password1"}})],1),t._v(" "),n("el-form-item",{attrs:{label:"确认密码",prop:"password2"}},[n("el-input",{attrs:{type:"password",size:"small","show-password":"","auto-complete":"off"},model:{value:t.form.password2,callback:function(e){t.$set(t.form,"password2",e)},expression:"form.password2"}})],1)],1),t._v(" "),n("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[n("el-button",{attrs:{size:"small"},on:{click:function(e){t.dialogFormVisible=!1}}},[t._v("取 消")]),t._v(" "),n("el-button",{attrs:{size:"small",type:"primary",loading:t.isUpdating},on:{click:t.handle_sure}},[t._v("确 定")])],1)],1)],1)},i=[];n.d(e,"a",function(){return a}),n.d(e,"b",function(){return i})},765:function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"left"},[n("div",{staticClass:"collapse-button",on:{click:t.handleCollapseChange}},[t.isCollapse?n("i",{staticClass:"icon-right"}):n("i",{staticClass:"icon-left"}),t._v(" "),t.isCollapse?t._e():n("span",[t._v("收起侧边栏")])]),t._v(" "),n("el-menu",{staticClass:"el-menu-vertical-left",attrs:{"default-active":t.onRoutes,collapse:t.isCollapse,"text-color":"#AEAEAE","background-color":"#1E222D","active-text-color":"#ffffff","unique-opened":"",router:""}},[t._l(t.menuItems,function(e){return[e.subnavs&&e.subnavs.length>0?[n("el-submenu",{attrs:{index:e.index}},[n("template",{slot:"title"},[n("i",{class:e.icon}),t._v(" "),n("span",{attrs:{slot:"title"},slot:"title"},[t._v(t._s(e.name))])]),t._v(" "),t._l(e.subnavs,function(e){return n("el-menu-item",{key:e.index,attrs:{index:e.index},on:{click:function(n){return t.handleCommend(e)}}},[t._v("\n                        "+t._s(e.name)+"\n                        "),e.commends&&!t.isCollapse?n("el-dropdown",{attrs:{size:"medium"}},[t.isCollapse?t._e():n("i",{staticClass:"el-icon-more commend-icon"}),t._v(" "),n("el-dropdown-menu",{attrs:{slot:"dropdown"},slot:"dropdown"},t._l(e.commends,function(a){return n("el-dropdown-item",{key:a.commend,nativeOn:{click:function(n){return t.handleMenuCommend(a.commend,e)}}},[t._v(t._s(a.name)+"\n                                ")])}),1)],1):t._e()],1)})],2)]:[n("el-menu-item",{key:e.index,attrs:{index:e.index}},[n("i",{class:e.icon}),t._v(" "),n("span",{attrs:{slot:"title"},slot:"title"},[t._v(t._s(e.name))])])]]})],2)],1)},i=[];n.d(e,"a",function(){return a}),n.d(e,"b",function(){return i})},776:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=o(n(48)),i=o(n(789)),s=o(n(783)),r=n(182);function o(t){return t&&t.__esModule?t:{default:t}}e.default={name:"index",components:{Left:i.default,Top:s.default},props:["menuItems"],data:function(){return{permissions:[]}},computed:(0,a.default)({},(0,r.mapState)(["isCollapse"])),created:function(){},methods:{getUserInfo:function(){var t=this;this.$store.dispatch("FETCH_USER_INFO",{}).then(function(e){t.username=e.nickname}).catch(function(t){console.log(t)})},collapseChange:function(t){}}}},777:function(t,e,n){"use strict";n.r(e);var a=n(776),i=n.n(a);for(var s in a)"default"!==s&&function(t){n.d(e,t,function(){return a[t]})}(s);e.default=i.a},778:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=r(n(48)),i=r(n(826)),s=n(182);function r(t){return t&&t.__esModule?t:{default:t}}e.default={name:"index",components:{SecondIndex:i.default},props:["settings"],data:function(){return{activeIndex:"index",menuItems:[{name:"用户管理",index:"/home/user",isAdminPermission:!0,key:"",icon:"el-icon-s-custom",subnavs:[]},{name:"应用管理",index:"/home/application",key:"",icon:"el-icon-s-platform",subnavs:[]}]}},computed:(0,a.default)({filterMenuItems:function(){var t=this.menuItems,e=this.username;return t.filter(function(t){var n=!0;return"admin"!=e&&t.isAdminPermission&&(n=!1),n})}},(0,s.mapState)(["username"])),created:function(){},methods:{}}},779:function(t,e,n){"use strict";n.r(e);var a=n(778),i=n.n(a);for(var s in a)"default"!==s&&function(t){n.d(e,t,function(){return a[t]})}(s);e.default=i.a},780:function(t,e,n){"use strict";n(757)},781:function(t,e,n){"use strict";n(758)},782:function(t,e,n){t.exports=n.p+"assets/images/user.2da82f.png"},783:function(t,e,n){"use strict";n.r(e);var a=n(764),i=n(750);for(var s in i)"default"!==s&&function(t){n.d(e,t,function(){return i[t]})}(s);n(781),n(780);var r=n(86),o=Object(r.a)(i.default,a.a,a.b,!1,null,"30a50bf2",null);e.default=o.exports},784:function(t,e,n){"use strict";n(759)},785:function(t,e,n){"use strict";n(760)},786:function(t,e,n){"use strict";n.r(e);var a=n(762),i=n(752);for(var s in i)"default"!==s&&function(t){n.d(e,t,function(){return i[t]})}(s);n(785);var r=n(86),o=Object(r.a)(i.default,a.a,a.b,!1,null,"5063b170",null);e.default=o.exports},787:function(t,e,n){"use strict";n(761)},788:function(t,e,n){"use strict";n.r(e);var a=n(763),i=n(754);for(var s in i)"default"!==s&&function(t){n.d(e,t,function(){return i[t]})}(s);n(787);var r=n(86),o=Object(r.a)(i.default,a.a,a.b,!1,null,null,null);e.default=o.exports},789:function(t,e,n){"use strict";n.r(e);var a=n(765),i=n(756);for(var s in i)"default"!==s&&function(t){n.d(e,t,function(){return i[t]})}(s);n(784);var r=n(86),o=Object(r.a)(i.default,a.a,a.b,!1,null,null,null);e.default=o.exports},802:function(t,e,n){},807:function(t,e,n){"use strict";var a=function(){var t=this.$createElement,e=this._self._c||t;return e("div",{class:["app-body",{"is-collapse":this.isCollapse}]},[e("Left",{attrs:{menuItems:this.menuItems}}),this._v(" "),e("div",{staticClass:"app-content-wrapper"},[e("div",{staticClass:"app-content"},[e("transition",{attrs:{name:"move",mode:"out-in"}},[e("router-view")],1)],1)])],1)},i=[];n.d(e,"a",function(){return a}),n.d(e,"b",function(){return i})},813:function(t,e,n){"use strict";var a=function(){var t=this.$createElement;return(this._self._c||t)("SecondIndex",{attrs:{menuItems:this.filterMenuItems}})},i=[];n.d(e,"a",function(){return a}),n.d(e,"b",function(){return i})},825:function(t,e,n){"use strict";n(802)},826:function(t,e,n){"use strict";n.r(e);var a=n(807),i=n(777);for(var s in i)"default"!==s&&function(t){n.d(e,t,function(){return i[t]})}(s);n(825);var r=n(86),o=Object(r.a)(i.default,a.a,a.b,!1,null,null,null);e.default=o.exports}}]);