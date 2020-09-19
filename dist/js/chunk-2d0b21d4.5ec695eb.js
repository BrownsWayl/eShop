(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0b21d4"],{2374:function(e,t,r){"use strict";r.r(t);var n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("el-breadcrumb",{attrs:{"separator-class":"el-icon-arrow-right"}},[r("el-breadcrumb-item",{attrs:{to:{path:"/home"}}},[e._v("首页")]),r("el-breadcrumb-item",[e._v("商品管理")]),r("el-breadcrumb-item",[e._v("商品列表")])],1),r("el-card",[r("el-row",{attrs:{gutter:20}},[r("el-col",{attrs:{span:7}},[r("el-input",{attrs:{clearable:"",placeholder:"请输入..."},on:{clear:e.getGoodsList},model:{value:e.queryInfo.query,callback:function(t){e.$set(e.queryInfo,"query",t)},expression:"queryInfo.query"}},[r("el-button",{attrs:{slot:"append",icon:"el-icon-search"},on:{click:e.getGoodsList},slot:"append"})],1)],1),r("el-col",{attrs:{span:17}},[r("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.$router.push("/goods/add")}}},[e._v("添加商品")])],1)],1),r("el-table",{attrs:{data:e.goodsList,stripe:""}},[r("el-table-column",{attrs:{type:"index"}}),r("el-table-column",{attrs:{label:"商品名称",prop:"goods_name"}}),r("el-table-column",{attrs:{label:"商品价格",width:"95px",prop:"goods_price"}}),r("el-table-column",{attrs:{label:"商品数量",width:"75px",prop:"goods_number"}}),r("el-table-column",{attrs:{label:"创建时间",width:"140px",prop:"upd_time"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(e._f("dateFormat")(t.row.upd_time)))]}}])}),r("el-table-column",{attrs:{label:"操作",width:"140px"},scopedSlots:e._u([{key:"default",fn:function(t){return[r("el-button",{attrs:{size:"mini",icon:"el-icon-edit",type:"primary"},on:{click:function(r){return e.showEditDialog(t.row)}}}),r("el-button",{attrs:{size:"mini",icon:"el-icon-delete",type:"danger"},on:{click:function(r){return e.removeGoods(t.row.goods_id)}}})]}}])})],1),r("el-pagination",{attrs:{"current-page":e.queryInfo.pagenum,"page-sizes":[10,20,50],"page-size":e.queryInfo.pagesize,layout:"total, sizes, prev, pager, next, jumper",total:e.total},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1)],1)},a=[],o=(r("96cf"),r("1da1")),s={data:function(){return{queryInfo:{query:"",pagenum:1,pagesize:10},goodsList:[],total:0}},created:function(){this.getGoodsList()},methods:{removeGoods:function(e){var t=this;this.$confirm("是否删除此商品?","提示",{confirmButtonText:"确定",cancelButtonText:"取消"}).then(function(){var r=Object(o["a"])(regeneratorRuntime.mark((function r(n){var a,o;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return r.next=2,t.$axios.delete("goods/".concat(e));case 2:if(a=r.sent,o=a.data,200===o.meta.status){r.next=6;break}return r.abrupt("return",t.$message.error("删除商品失败!"));case 6:t.$message.success("删除商品成功!"),t.getGoodsList();case 8:case"end":return r.stop()}}),r)})));return function(e){return r.apply(this,arguments)}}()).catch((function(e){}))},handleSizeChange:function(e){this.queryInfo.pagesize=e,this.getGoodsList()},handleCurrentChange:function(e){this.queryInfo.pagenum=e,this.getGoodsList()},getGoodsList:function(){var e=this;return Object(o["a"])(regeneratorRuntime.mark((function t(){var r,n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.$axios.get("goods",{params:e.queryInfo});case 2:if(r=t.sent,n=r.data,200===n.meta.status){t.next=6;break}return t.abrupt("return",e.$message.error("获取商品列表失败!"));case 6:e.goodsList=n.data.goods,e.total=n.data.total;case 8:case"end":return t.stop()}}),t)})))()}}},i=s,u=r("2877"),c=Object(u["a"])(i,n,a,!1,null,"510267e8",null);t["default"]=c.exports}}]);
//# sourceMappingURL=chunk-2d0b21d4.5ec695eb.js.map