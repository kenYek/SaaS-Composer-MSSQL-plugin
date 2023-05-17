(function(global) {
    if(global.scPlugin &&
        global.scPlugin.datasource &&
        global.scPlugin.datasource["mssql-cs"]){
        return;
    }
    commonUtil.createObjFromString(global,'scPlugin.datasource.mssql-cs',{});

    var datasource = {};

    datasource.dataBindingUI = function(sourceFormPane, targets) {
        var S = hteditor.getString;
        if (targets && targets[0] && targets[0]['sourceType']) {
            dataBindingUI.addSrouceTypeRow(sourceFormPane, targets[0]['sourceType']);
        }else{
            dataBindingUI.addSrouceTypeRow(sourceFormPane);
        }
        if (targets && targets[0] && targets[0]['formatType']) {
            dataBindingUI.addFormatTypeRow(sourceFormPane, targets[0]['formatType']);
        }else{
            dataBindingUI.addFormatTypeRow(sourceFormPane);
        }
        if (targets && targets[0] && targets[0]['scDataType']) {
            dataBindingUI.addDataTypeRow(sourceFormPane, targets[0]['scDataType']);
        }else{
            dataBindingUI.addDataTypeRow(sourceFormPane);
        }
        if (targets && targets[0] && targets[0]['sourceType']) {
            var target = '';
            if (targets && targets[0] && targets[0]['target']) {
                target = targets[0]['target'];
            }
            sourceFormPane.addRow([
                S('target'), {
                    id: 'target',
                    textField: {
                        text: target
                    }
                }
            ], [55, 0.1]);

            var targetTextArea = new ht.widget.TextArea();
            // scadaNodeComboBox.setValue(source);
            targetTextArea.setWidth(90);
            sourceFormPane.addRow([{
                element: S('Command')
            }], [1], 30);
            sourceFormPane.addRow([{
                id: 'rawSql',
                label: 'String',
                element: targetTextArea,
                unfocusable: true
            }], [1], 200);

            if (targets && targets[0] && targets[0]['rawSql']) {
                targetTextArea.setText(targets[0]['rawSql']);
            }
            // dataSourceUtil.sendHttpReqBySourceType(targets[0]['sourceType'], '/search', [], function(response) {
            //     var values = response,
            //         labels = response;
            //     targetListComboBox.setValues(values);
            //     targetListComboBox.setLabels(response);
            //     if (typeof(targets[0]['target']) != "undefined") {
            //         targetListComboBox.setValue(targets[0]['target']);
            //     } else {
            //         targetListComboBox.setValue(values[0]);
            //     }
            //     return true;
            // });
        }
    }

    datasource.applyDataBindingUI = function(sourceFormPane) {
        var targets = [];
        var paneRows = sourceFormPane.getRows();
        var target = {};
        for (var i = 0; i < paneRows.length; i++) {
            if (paneRows[i]['items']) {
                for (var j = 0; j < paneRows[i]['items'].length; j++) {
                    if(paneRows[i]['items'][j]['id']){
                        // target[paneRows[i]['items'][j]['id']] = sourceFormPane.v(paneRows[i]['items'][j]['id']);
                        if (sourceFormPane.v(paneRows[i]['items'][j]['id'])) {
                            target[paneRows[i]['items'][j]['id']] = sourceFormPane.v(paneRows[i]['items'][j]['id']);
                        }else {
                            var msg = paneRows[i]['items'][j]['id'] == 'target'?"ERROR: The target cannot be empty!!!":"ERROR: The command cannot be empty!!!"
                            editor.showMessage(msg,"error",3000);
                            throw msg
                        }
                    }
                }
            }
        }
        targets.push(target);
        return targets;
    };

    datasource.mapToValue = function(aniPropName, formatType, dataResult){
        //special property list
        //table
        if (['table.columns','table.dataSource'].indexOf(aniPropName) > -1) {
            return dataResult;
        }

         if (formatType == 'timeseries') {
            return dataRefreshUtil.refreshTimeSeriesData(dataResult);
        } else if (formatType == 'table') {
            return dataRefreshUtil.refreshTableData(dataResult);
        } else {
            return dataResult
        }
        return dataResult;
    };

    datasource.getValue = function (sourceName, reqTargets, callback) {
        // console.log('getValue',sourceName, reqTargets);

        var queryType = '/api/databaseSource/mssql/query';
        var sourceList = dataSourceUtil.getSourceListByOrg();
        var orgId = parseInt(commonUtil.getParamFromURL('org_id'));
        reqTargets = reqTargets.map(function (item, index, array){
            item.rawSql = dataRefreshUtil.variableSrv.replaceWithText(item.rawSql);
            return item;
        })
        for (var i = 0; i < sourceList.length; i++) {
            if (sourceName == sourceList[i]['name']) {
                //check plugin type
                //start send
                var xhttp;
                xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        if (typeof(callback) != "undefined") {
                            if(typeof(this.response) == 'string'){
                                var res = JSON.parse(this.response)
                                if(res.errCode == 0){
                                    callback(res.data);
                                }else{
                                    return false
                                }
                            }else{
                                var res = JSON.parse(this.response)
                                if(res.errCode == 0){
                                    callback(res.data);
                                }else{
                                    return false
                                }
                            }
                        }
                    }
                    return true;
                };
                const json_data = JSON.parse(sourceList[i].json_data);
                var localhostUrl  = json_data.sourceurl;
                xhttp.open("POST", localhostUrl + queryType, true);
                xhttp.timeout = 30000; 
                xhttp.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
                xhttp.ontimeout = function (e) {
                    
                };
                xhttp.send(JSON.stringify({
                    'type':sourceList[i].type,
                    'url':sourceList[i].url,
                    'password':sourceList[i].password,
                    'user':sourceList[i].user,
                    'database':sourceList[i].database,
                    'jsondata': sourceList[i].json_data,
                    'targets':reqTargets,
                    'org_id':orgId
                }));
                //end send
                break;
            }
        }
        return true;
    }

    datasource.setValue = function (sourceName, reqTargets, callback) {
        var sourceInfo = dataSourceUtil.getSourceInfo(sourceName);
        var EIToken = commonUtil.getCookie("EIToken");
        var orgId = parseInt(commonUtil.getParamFromURL('org_id'));
        var queryType = '/api/databaseSource/mssql/query';
        reqTargets = reqTargets.map(function (item, index, array){
            item.rawSql = dataRefreshUtil.variableSrv.replaceWithText(item.rawSql);
            return item;
        })
        //check plugin type
        //start send
        var xhttp;
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                if (typeof (callback) != "undefined") {
                    if (typeof (this.response) == 'string') {
                        var res = JSON.parse(this.response)
                        if (res.errCode == 0) {
                            callback(res.data);
                        } else {
                            return false
                        }
                    } else {
                        var res = JSON.parse(this.response)
                        if (res.errCode == 0) {
                            callback(res.data);
                        } else {
                            return false
                        }
                    }
                }
            }
            return true;
        };
        const json_data = JSON.parse(sourceInfo.json_data);
        var localhostUrl = json_data.sourceurl;
        xhttp.open("POST", localhostUrl + queryType, true);
        xhttp.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
        xhttp.timeout = 30000; 
        xhttp.ontimeout = function (e) {};
        xhttp.send(JSON.stringify({
            'type': sourceInfo.type,
            'url': sourceInfo.url,
            'password': sourceInfo.password,
            'user': sourceInfo.user,
            'database': sourceInfo.database,
            'jsondata': sourceInfo.json_data,
            'targets': reqTargets,
            'org_id':orgId
        }));
    }
    
    global.scPlugin.datasource["mssql-cs"] = datasource;
})(this);