(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d208e2c"],{a766:function(t,e,r){"use strict";r.r(e);var a=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",[r("el-breadcrumb",{attrs:{"separator-class":"el-icon-arrow-right"}},[r("el-breadcrumb-item",{attrs:{to:{path:"/home"}}},[t._v("首页")]),r("el-breadcrumb-item",[t._v("权限管理")]),r("el-breadcrumb-item",[t._v("权限列表")])],1),r("el-card",[r("el-table",{attrs:{data:t.rightLists,stripe:""}},[r("el-table-column",{attrs:{type:"index"}}),r("el-table-column",{attrs:{label:"权限名称",prop:"authName"}}),r("el-table-column",{attrs:{label:"路径",prop:"path"}}),r("el-table-column",{attrs:{label:"权限等级",prop:"level"},scopedSlots:t._u([{key:"default",fn:function(e){return[0==e.row.level?r("el-tag",[t._v("一级")]):1==e.row.level?r("el-tag",{attrs:{type:"success"}},[t._v("二级")]):2==e.row.level?r("el-tag",{attrs:{type:"danger"}},[t._v("三级")]):t._e()]}}])})],1)],1)],1)},s=[],l=(r("96cf"),r("1da1")),n={data:function(){return{rightLists:[]}},created:function(){this.getRightLists()},methods:{getRightLists:function(){var t=this;return Object(l["a"])(regeneratorRuntime.mark((function e(){var r,a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.$axios.get("rights/list");case 2:r=e.sent,a=r.data,200!==a.meta.status&&t.$message.error("获取列表失败!"),t.rightLists=a.data;case 6:case"end":return e.stop()}}),e)})))()}}},i=n,c=r("2877"),o=Object(c["a"])(i,a,s,!1,null,"f6519676",null);e["default"]=o.exports}}]);
//# sourceMappingURL=chunk-2d208e2c.c1346c79.js.map