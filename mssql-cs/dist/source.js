
(function(funcName, baseObj) {
    // The public function name defaults to window.docReady
    // but you can pass in your own object and own function name and those will be used
    // if you want to put them in a different namespace
    funcName = funcName || "docReady";
    baseObj = baseObj || window;
    var readyList = [];
    var readyFired = false;
    var readyEventHandlersInstalled = false;

    // call this when the document is ready
    // this function protects itself against being called more than once
    function ready() {
        if (!readyFired) {
            // this must be set to true before we start calling callbacks
            readyFired = true;
            for (var i = 0; i < readyList.length; i++) {
                // if a callback here happens to add new ready handlers,
                // the docReady() function will see that it already fired
                // and will schedule the callback to run right after
                // this event loop finishes so all handlers will still execute
                // in order and no new ones will be added to the readyList
                // while we are processing the list
                readyList[i].fn.call(window, readyList[i].ctx);
            }
            // allow any closures held by these functions to free
            readyList = [];
        }
    }

    function readyStateChange() {
        if ( document.readyState === "complete" ) {
            ready();
        }
    }

    // This is the one public interface
    // docReady(fn, context);
    // the context argument is optional - if present, it will be passed
    // as an argument to the callback
    baseObj[funcName] = function(callback, context) {
        if (typeof callback !== "function") {
            throw new TypeError("callback for docReady(fn) must be a function");
        }
        // if ready has already fired, then just schedule the callback
        // to fire asynchronously, but right away
        if (readyFired) {
            setTimeout(function() {callback(context);}, 1);
            return;
        } else {
            // add the function and context to the list
            readyList.push({fn: callback, ctx: context});
        }
        // if document already ready to go, schedule the ready function to run
        if (document.readyState === "complete") {
            setTimeout(ready, 1);
        } else if (!readyEventHandlersInstalled) {
            // otherwise if we don't have event handlers installed, install them
            if (document.addEventListener) {
                // first choice is DOMContentLoaded event
                document.addEventListener("DOMContentLoaded", ready, false);
                // backup is window load event
                window.addEventListener("load", ready, false);
            } else {
                // must be IE
                document.attachEvent("onreadystatechange", readyStateChange);
                window.attachEvent("onload", ready);
            }
            readyEventHandlersInstalled = true;
        }
    }
})("docReady", window);
var compMssqlCs={
    template:`<el-form label-position="left" inline="" class="data-source-form" v-if="scopeRow.expand" data-v-e529bd94="">
   <el-form-item data-v-e529bd94="">
      <span class="title" data-v-e529bd94="">Connection</span>
   </el-form-item>
   <el-form-item label="Source URL" class="content" data-v-e529bd94="">
      <span v-if="!scopeRow.isEdit" data-v-e529bd94="">{{ scopeRow.json_data.sourceurl }}</span>
      <el-input v-if="scopeRow.isEdit" size="small" v-model="scopeRow.json_data.sourceurl" data-v-e529bd94=""></el-input>
   </el-form-item>
   <el-form-item label="URL" class="content" data-v-e529bd94="">
      <span v-if="!scopeRow.isEdit" data-v-e529bd94="">{{ scopeRow.url }}</span>
      <el-input v-if="scopeRow.isEdit" size="small" v-model="scopeRow.url" data-v-e529bd94=""></el-input>
   </el-form-item>
    <el-form-item label="Port" class="content" data-v-e529bd94="">
      <span v-if="!scopeRow.isEdit" data-v-e529bd94="">{{ scopeRow.json_data.port }}</span>
      <el-input v-if="scopeRow.isEdit" size="small" v-model="scopeRow.json_data.port" data-v-e529bd94=""></el-input>
   </el-form-item>
   <el-form-item label="DataBase" class="content" data-v-e529bd94="">
      <span v-if="!scopeRow.isEdit" data-v-e529bd94="">{{ scopeRow.database }}</span>
      <el-input v-if="scopeRow.isEdit" size="small" v-model="scopeRow.database" data-v-e529bd94=""></el-input>
   </el-form-item>
   <el-form-item label="User" class="content" data-v-e529bd94="">
      <span v-if="!scopeRow.isEdit" data-v-e529bd94="">{{ scopeRow.user }}</span>
      <el-input v-if="scopeRow.isEdit" size="small" v-model="scopeRow.user" data-v-e529bd94=""></el-input>
   </el-form-item>
   <el-form-item label="Password" class="content" data-v-e529bd94="">
      <span v-if="!scopeRow.isEdit" data-v-e529bd94=""><input type="password" v-model="scopeRow.password" style="background:transparent;border:0px transparent;" data-v-e529bd94=""></span>
      <el-input v-if="scopeRow.isEdit" size="small" type="password" v-model="scopeRow.password" data-v-e529bd94=""></el-input>
   </el-form-item>
   <el-form-item label="SSL Mode" class="content" data-v-e529bd94="">
      <span v-if="!scopeRow.isEdit" data-v-e529bd94="">{{ scopeRow.json_data.sslMode }}</span>
      <el-select v-model="scopeRow.json_data.sslMode" placeholder="" data-v-e529bd94="">
       <el-option v-for="item in sslModeItems" :key="item.value" :label="item.label" :value="item.value" data-v-e529bd94="">
       </el-option>
     </el-select>
   </el-form-item>
   <el-row data-v-e529bd94="">
     <el-button icon="el-icon-refresh" @click="checkSourceConnection(scopeRow)" data-v-e529bd94=""></el-button>
   </el-row>
</el-form>`,
  name: "compMssqlCs",
  props: {
      langTrans: {
         type: Function
      },
      msgBox: {
         type: Function
      },
      row: {
        type: Object
      }
  },
  data() {
    return {
      scopeRow: this.row,
      sslModeItems:[
        {
          value: 'disable',
          label: 'disable'
        },
        {
          value: 'require',
          label: 'require'
        },
        {
          value: 'verify-ca',
          label: 'verify-ca'
        },
        {
          value: 'verify-full',
          label: 'verify-full'
        }
      ]
    }
  },
  mounted() {
    this.scopeRow.access = 'proxy'
  },
  watch:{
    //   scopeRow (val){
    //       this.$emit('sync-row-data', val)
    //   }
  },
  methods: {
    handleClick(row) {
      console.log(row);
    },
    checkSourceConnection(row) {
      // console.log('this.$route',this.$route);
      var orgId = parseInt(this.$route.params.orgId);
       var me = this;
      if(row && !row.url) {
         return false;
      }
      if(row && row.access == 'proxy' && row.json_data && row.json_data.sourceurl) {
        var localhostUrl  = row.json_data.sourceurl;
        var proxyqueryType = '/api/databaseSource/mssql/connect';
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
              respData = JSON.parse(this.response);
              if(respData && respData.errCode == 0){
                console.log('connect success',this.response);
                me.msgBox({message: me.langTrans('dataSource.message.connectSuccess'), type: 'success', duration: 2000});
             // Typical action to be performed when the document is ready:
             // document.getElementById("demo").innerHTML = xhttp.responseText;
              } else {
                me.msgBox({message: me.langTrans('dataSource.message.connectFail'), type: 'error', duration: 2000});
              }
            } else {
            }
        };
        xhttp.open("POST", localhostUrl + proxyqueryType, true);
        xhttp.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
      //   xhttp.send(JSON.stringify({'url': row.url}));
        xhttp.send(JSON.stringify({
         'type':'postgres',
         'sourceurl':row.sourceurl,
         'url':row.url,
         'password':row.password,
         'user':row.user,
         'database':row.database,
         'org_id':orgId,
         'jsondata': JSON.stringify(row.json_data)
        }));
      }
    },
    dataValidation(row) {
      var me = this;
      if (!row.json_data.port) {
        me.msgBox({message: this.$t('dataSource.message.emptyPort'), type: 'warning', duration: 2000})
        return false
      }
      if (row.database === '') {
        me.msgBox({message: this.$t('dataSource.message.emptyDatabase'), type: 'warning', duration: 2000})
        return false
      }
      if (row.user === '') {
        me.msgBox({message: this.$t('dataSource.message.emptyUser'), type: 'warning', duration: 2000})
        return false
      }
      if (row.password === '') {
        me.msgBox({message: this.$t('dataSource.message.emptyPassword'), type: 'warning', duration: 2000})
        return false
      }
      if (!row.json_data.sslMode) {
        me.msgBox({message: this.$t('dataSource.message.emptySslMode'), type: 'warning', duration: 2000})
        return false
      }
      return true;
    }
  }
}
;

docReady(function(){
    var css = `.datasourceBlock {
  text-align: center;
  color: #2c3e50;}
`;
    var head = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    if(style.styleSheet){
        style.styleSheet.cssText = css;
    }else{
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
});
