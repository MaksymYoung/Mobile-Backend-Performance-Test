/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9673684210526315, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.92, 500, 1500, "w_api_siteinfo"], "isController": false}, {"data": [0.96, 500, 1500, "S01_WikipediaAndroidSearch_T02_SearchE"], "isController": true}, {"data": [1.0, 500, 1500, "rest_page_summary"], "isController": false}, {"data": [0.96, 500, 1500, "w_api_prefix_search_e"], "isController": false}, {"data": [0.98, 500, 1500, "w_api_prefix_search_epa"], "isController": false}, {"data": [0.94, 500, 1500, "w_api_prefix_search_epam"], "isController": false}, {"data": [0.98, 500, 1500, "thumb_question_book"], "isController": false}, {"data": [1.0, 500, 1500, "S01_WikipediaAndroidSearch_T07_ArticleCategories"], "isController": true}, {"data": [1.0, 500, 1500, "S01_WikipediaAndroidSearch_T06_ArticleSummary"], "isController": true}, {"data": [0.92, 500, 1500, "S01_WikipediaAndroidSearch_T01_OpenedApp"], "isController": true}, {"data": [1.0, 500, 1500, "w_api_article_categories"], "isController": false}, {"data": [0.98, 500, 1500, "S01_WikipediaAndroidSearch_T08_ArticleMobileHtml"], "isController": true}, {"data": [0.94, 500, 1500, "w_api_prefix_search_ep"], "isController": false}, {"data": [1.0, 500, 1500, "thumb_thebes_stater"], "isController": false}, {"data": [0.94, 500, 1500, "S01_WikipediaAndroidSearch_T05_SearchEpam"], "isController": true}, {"data": [0.98, 500, 1500, "S01_WikipediaAndroidSearch_T04_SearchEpa"], "isController": true}, {"data": [0.98, 500, 1500, "rest_page_mobile_html"], "isController": false}, {"data": [0.96, 500, 1500, "S01_WikipediaAndroidSearch_T09_ArticleThumbnails"], "isController": true}, {"data": [0.94, 500, 1500, "S01_WikipediaAndroidSearch_T03_SearchEp"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 250, 0, 0.0, 274.512, 48, 990, 265.0, 459.8, 522.3999999999999, 682.6200000000003, 1.5579721434580749, 18.974999172327298, 1.0009666730283862], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["w_api_siteinfo", 25, 0, 0.0, 335.99999999999994, 178, 702, 287.0, 604.0000000000002, 690.6, 702.0, 0.194395197661037, 0.4486352606645205, 0.06568431483468631], "isController": false}, {"data": ["S01_WikipediaAndroidSearch_T02_SearchE", 25, 0, 0.0, 377.88, 248, 560, 361.0, 497.8, 542.5999999999999, 560.0, 0.1938630706359484, 0.9169420330032492, 0.14274683130811047], "isController": true}, {"data": ["rest_page_summary", 25, 0, 0.0, 101.72, 48, 234, 87.0, 174.80000000000007, 221.99999999999997, 234.0, 0.19370985363283458, 0.5362357889608629, 0.12277118653096646], "isController": false}, {"data": ["w_api_prefix_search_e", 25, 0, 0.0, 377.88, 248, 560, 361.0, 497.8, 542.5999999999999, 560.0, 0.19386457396321227, 0.9169491435063123, 0.14274793825025592], "isController": false}, {"data": ["w_api_prefix_search_epa", 25, 0, 0.0, 394.76, 265, 517, 399.0, 484.00000000000006, 510.7, 517.0, 0.1937218618995591, 0.9019190450868262, 0.14302121835553389], "isController": false}, {"data": ["w_api_prefix_search_epam", 25, 0, 0.0, 403.28000000000003, 235, 616, 398.0, 551.6, 599.1999999999999, 616.0, 0.1936993476205972, 0.8036933986293834, 0.14319375600467976], "isController": false}, {"data": ["thumb_question_book", 25, 0, 0.0, 172.27999999999997, 51, 529, 160.0, 375.00000000000045, 518.8, 529.0, 0.1926767423757813, 1.8439540567124724, 0.10311216291203922], "isController": false}, {"data": ["S01_WikipediaAndroidSearch_T07_ArticleCategories", 25, 0, 0.0, 248.88, 199, 356, 241.0, 309.8, 345.2, 356.0, 0.19388411933955316, 0.2676358206727003, 0.11019585689025382], "isController": true}, {"data": ["S01_WikipediaAndroidSearch_T06_ArticleSummary", 25, 0, 0.0, 101.72, 48, 234, 87.0, 174.80000000000007, 221.99999999999997, 234.0, 0.1937083527041686, 0.5362316340268092, 0.12277023525879435], "isController": true}, {"data": ["S01_WikipediaAndroidSearch_T01_OpenedApp", 25, 0, 0.0, 335.99999999999994, 178, 702, 287.0, 604.0000000000002, 690.6, 702.0, 0.19431511693883738, 0.448450446244666, 0.06565725630941184], "isController": true}, {"data": ["w_api_article_categories", 25, 0, 0.0, 248.88, 199, 356, 241.0, 309.8, 345.2, 356.0, 0.19388411933955316, 0.2676358206727003, 0.11019585689025382], "isController": false}, {"data": ["S01_WikipediaAndroidSearch_T08_ArticleMobileHtml", 25, 0, 0.0, 170.48000000000002, 68, 990, 129.0, 228.80000000000004, 765.5999999999995, 990.0, 0.1929712164133598, 8.388579384499009, 0.1296525360277261], "isController": true}, {"data": ["w_api_prefix_search_ep", 25, 0, 0.0, 406.03999999999996, 240, 609, 399.0, 525.0000000000001, 590.0999999999999, 609.0, 0.19441636208103275, 0.9142353482969127, 0.1433440950890427], "isController": false}, {"data": ["thumb_thebes_stater", 25, 0, 0.0, 133.8, 70, 420, 114.0, 229.20000000000016, 375.89999999999986, 420.0, 0.1925328075904134, 8.482687149108957, 0.13988711801490972], "isController": false}, {"data": ["S01_WikipediaAndroidSearch_T05_SearchEpam", 25, 0, 0.0, 403.28000000000003, 235, 616, 398.0, 551.6, 599.1999999999999, 616.0, 0.1936993476205972, 0.8036933986293834, 0.14319375600467976], "isController": true}, {"data": ["S01_WikipediaAndroidSearch_T04_SearchEpa", 25, 0, 0.0, 394.76, 265, 517, 399.0, 484.00000000000006, 510.7, 517.0, 0.19372036078479993, 0.9019120562835137, 0.14302011011065308], "isController": true}, {"data": ["rest_page_mobile_html", 25, 0, 0.0, 170.48000000000002, 68, 990, 129.0, 228.80000000000004, 765.5999999999995, 990.0, 0.1929712164133598, 8.388579384499009, 0.1296525360277261], "isController": false}, {"data": ["S01_WikipediaAndroidSearch_T09_ArticleThumbnails", 25, 0, 0.0, 306.08000000000004, 121, 949, 268.0, 595.8000000000006, 894.6999999999998, 949.0, 0.19227219590229497, 10.311287483464591, 0.24259343467359873], "isController": true}, {"data": ["S01_WikipediaAndroidSearch_T03_SearchEp", 25, 0, 0.0, 406.03999999999996, 240, 609, 399.0, 525.0000000000001, 590.0999999999999, 609.0, 0.19441636208103275, 0.9142353482969127, 0.1433440950890427], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 250, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
