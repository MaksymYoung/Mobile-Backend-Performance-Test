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

    var data = {"OkPercent": 96.93877551020408, "KoPercent": 3.061224489795918};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9396782841823056, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.68, 500, 1500, "w_api_siteinfo"], "isController": false}, {"data": [1.0, 500, 1500, "S01_WikipediaAndroidSearch_T02_SearchE"], "isController": true}, {"data": [1.0, 500, 1500, "rest_page_summary"], "isController": false}, {"data": [1.0, 500, 1500, "w_api_prefix_search_e"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "w_api_prefix_search_epa"], "isController": false}, {"data": [1.0, 500, 1500, "w_api_prefix_search_epam"], "isController": false}, {"data": [1.0, 500, 1500, "thumb_question_book"], "isController": false}, {"data": [1.0, 500, 1500, "S01_WikipediaAndroidSearch_T07_ArticleCategories"], "isController": true}, {"data": [1.0, 500, 1500, "S01_WikipediaAndroidSearch_T06_ArticleSummary"], "isController": true}, {"data": [0.68, 500, 1500, "S01_WikipediaAndroidSearch_T01_OpenedApp"], "isController": true}, {"data": [1.0, 500, 1500, "w_api_article_categories"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "S01_WikipediaAndroidSearch_T08_ArticleMobileHtml"], "isController": true}, {"data": [0.9473684210526315, 500, 1500, "w_api_prefix_search_ep"], "isController": false}, {"data": [1.0, 500, 1500, "thumb_thebes_stater"], "isController": false}, {"data": [1.0, 500, 1500, "S01_WikipediaAndroidSearch_T05_SearchEpam"], "isController": true}, {"data": [0.9210526315789473, 500, 1500, "S01_WikipediaAndroidSearch_T04_SearchEpa"], "isController": true}, {"data": [0.9736842105263158, 500, 1500, "rest_page_mobile_html"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "S01_WikipediaAndroidSearch_T09_ArticleThumbnails"], "isController": true}, {"data": [0.9473684210526315, 500, 1500, "S01_WikipediaAndroidSearch_T03_SearchEp"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 196, 6, 3.061224489795918, 271.04081632653055, 50, 4244, 220.0, 445.7000000000001, 498.7499999999999, 896.530000000004, 1.3538997147139886, 16.0592039168975, 0.8572301202104071], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["w_api_siteinfo", 25, 6, 24.0, 266.99999999999994, 137, 793, 201.0, 576.4000000000001, 738.0999999999999, 793.0, 0.21234848935284675, 0.4567068545030621, 0.07175056378523924], "isController": false}, {"data": ["S01_WikipediaAndroidSearch_T02_SearchE", 19, 0, 0.0, 364.94736842105266, 226, 498, 357.0, 471.0, 498.0, 498.0, 0.16089832072963156, 0.7623070675645922, 0.11847395881849822], "isController": true}, {"data": ["rest_page_summary", 19, 0, 0.0, 87.5263157894737, 50, 325, 56.0, 174.0, 325.0, 325.0, 0.15561652811335436, 0.4309208505671813, 0.09862805346246775], "isController": false}, {"data": ["w_api_prefix_search_e", 19, 0, 0.0, 364.94736842105266, 226, 498, 357.0, 471.0, 498.0, 498.0, 0.16089832072963156, 0.7623070675645922, 0.11847395881849822], "isController": false}, {"data": ["w_api_prefix_search_epa", 19, 0, 0.0, 606.6842105263158, 316, 4244, 403.0, 503.0, 4244.0, 4244.0, 0.15503243441720044, 0.7285950695606054, 0.11445753947207375], "isController": false}, {"data": ["w_api_prefix_search_epam", 19, 0, 0.0, 346.0526315789474, 267, 477, 344.0, 433.0, 477.0, 477.0, 0.15344607581851366, 0.6337931794228813, 0.11343621034630356], "isController": false}, {"data": ["thumb_question_book", 19, 0, 0.0, 122.63157894736842, 52, 367, 113.0, 176.0, 367.0, 367.0, 0.15385238268755821, 1.472684243289202, 0.08233506417263857], "isController": false}, {"data": ["S01_WikipediaAndroidSearch_T07_ArticleCategories", 19, 0, 0.0, 222.52631578947367, 185, 295, 220.0, 292.0, 295.0, 295.0, 0.15863341487647464, 0.21977609467492673, 0.09016078853330885], "isController": true}, {"data": ["S01_WikipediaAndroidSearch_T06_ArticleSummary", 19, 0, 0.0, 87.5263157894737, 50, 325, 56.0, 174.0, 325.0, 325.0, 0.15561652811335436, 0.4309208505671813, 0.09862805346246775], "isController": true}, {"data": ["S01_WikipediaAndroidSearch_T01_OpenedApp", 25, 6, 24.0, 266.99999999999994, 137, 793, 201.0, 576.4000000000001, 738.0999999999999, 793.0, 0.21221149846783297, 0.45641222242736, 0.07170427584948262], "isController": true}, {"data": ["w_api_article_categories", 19, 0, 0.0, 222.52631578947367, 185, 295, 220.0, 292.0, 295.0, 295.0, 0.15863341487647464, 0.21977609467492673, 0.09016078853330885], "isController": false}, {"data": ["S01_WikipediaAndroidSearch_T08_ArticleMobileHtml", 19, 0, 0.0, 190.73684210526315, 95, 731, 163.0, 291.0, 731.0, 731.0, 0.15516917523499965, 6.745337076959827, 0.10425428961101538], "isController": true}, {"data": ["w_api_prefix_search_ep", 19, 0, 0.0, 400.1052631578947, 258, 525, 406.0, 508.0, 525.0, 525.0, 0.15755344378658973, 0.738345515220492, 0.11616489263562035], "isController": false}, {"data": ["thumb_thebes_stater", 19, 0, 0.0, 103.47368421052632, 66, 184, 101.0, 145.0, 184.0, 184.0, 0.1539421339620654, 6.785551834443337, 0.11184858170681315], "isController": false}, {"data": ["S01_WikipediaAndroidSearch_T05_SearchEpam", 19, 0, 0.0, 346.0526315789474, 267, 477, 344.0, 433.0, 477.0, 477.0, 0.15344483658124905, 0.6337880608812579, 0.11343529423047415], "isController": true}, {"data": ["S01_WikipediaAndroidSearch_T04_SearchEpa", 19, 0, 0.0, 606.6842105263158, 316, 4244, 403.0, 503.0, 4244.0, 4244.0, 0.15503243441720044, 0.7285950695606054, 0.11445753947207375], "isController": true}, {"data": ["rest_page_mobile_html", 19, 0, 0.0, 190.73684210526315, 95, 731, 163.0, 291.0, 731.0, 731.0, 0.15516917523499965, 6.745337076959827, 0.10425428961101538], "isController": false}, {"data": ["S01_WikipediaAndroidSearch_T09_ArticleThumbnails", 19, 0, 0.0, 226.10526315789474, 118, 551, 210.0, 306.0, 551.0, 551.0, 0.15373785268677126, 8.248135359604975, 0.19397393131963717], "isController": true}, {"data": ["S01_WikipediaAndroidSearch_T03_SearchEp", 19, 0, 0.0, 400.1052631578947, 258, 525, 406.0, 508.0, 525.0, 525.0, 0.15755344378658973, 0.738345515220492, 0.11616489263562035], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["429/Too Many Requests", 6, 100.0, 3.061224489795918], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 196, 6, "429/Too Many Requests", 6, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["w_api_siteinfo", 25, 6, "429/Too Many Requests", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
