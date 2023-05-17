<template>
   <el-form label-position="left" inline class="data-source-form" v-if="scopeRow.expand">
      <el-form-item >
         <span class="title">Connection</span>
      </el-form-item>
      <el-form-item label="SourceURL" class="content">
         <span v-if="!scopeRow.isEdit">{{ scopeRow.sourceurl }}</span>
         <el-input v-if="scopeRow.isEdit" size="small" v-model="scopeRow.sourceurl"></el-input>
      </el-form-item>
      <el-form-item label="URL" class="content">
         <span v-if="!scopeRow.isEdit">{{ scopeRow.url }}</span>
         <el-input v-if="scopeRow.isEdit" size="small" v-model="scopeRow.url"></el-input>
      </el-form-item>
       <el-form-item label="Port" class="content">
         <span v-if="!scopeRow.isEdit">{{ scopeRow.json_data.port }}</span>
         <el-input v-if="scopeRow.isEdit" size="small" v-model="scopeRow.json_data.port"></el-input>
      </el-form-item>
      <el-form-item label="DataBase" class="content">
         <span v-if="!scopeRow.isEdit">{{ scopeRow.database }}</span>
         <el-input v-if="scopeRow.isEdit" size="small" v-model="scopeRow.database"></el-input>
      </el-form-item>
      <el-form-item label="User" class="content">
         <span v-if="!scopeRow.isEdit">{{ scopeRow.user }}</span>
         <el-input v-if="scopeRow.isEdit" size="small" v-model="scopeRow.user"></el-input>
      </el-form-item>
      <el-form-item label="Password" class="content">
         <span v-if="!scopeRow.isEdit"><input type="password" v-model="scopeRow.password" style="background:transparent;border:0px transparent;"/></span>
         <el-input v-if="scopeRow.isEdit" size="small" type="password" v-model="scopeRow.password"></el-input>
      </el-form-item>
      <el-form-item label="SSL Mode" class="content">
         <span v-if="!scopeRow.isEdit">{{ scopeRow.json_data.sslMode }}</span>
         <el-select v-model="scopeRow.json_data.sslMode" placeholder="">
          <el-option
            v-for="item in sslModeItems"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-row>
        <el-button icon="el-icon-refresh" @click="checkSourceConnection(scopeRow)"></el-button>
      </el-row>
   </el-form>
</template>

<script>
export default {
  name: "compPostgres",
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
      if(row && row.access == 'proxy') {
        var localhostUrl  = window.location.origin;
        var proxyqueryType = '/api/databaseSource/postgres/connect';
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
</script>

<style>
.datasourceBlock {
  text-align: center;
  color: #2c3e50;
}
</style>
