module.exports = {

"[project]/src/app/budget/[month]/chart.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "generateChartData": (()=>generateChartData)
});
const generateChartData = (currentData)=>{
    const groupDataByCategory = (data, targetCategory)=>{
        const grouped = data.filter((item)=>item.category === targetCategory).reduce((summary, item)=>{
            if (!summary[item.type]) {
                summary[item.type] = 0;
            }
            if (targetCategory == "Income" || targetCategory == "Offset") {
                summary[item.type] += item.recieve;
            } else {
                summary[item.type] += item.spend;
            }
            return summary;
        }, {});
        const labels = Object.keys(grouped);
        const amounts = Object.values(grouped);
        return {
            labels,
            amounts
        };
    };
    const { labels: expenselabels, amounts: expenseamounts } = groupDataByCategory(currentData, "Spending");
    const { labels: savinglabels, amounts: savingamounts } = groupDataByCategory(currentData, "Saving");
    const { labels: incomelabels, amounts: incomeamounts } = groupDataByCategory(currentData, "Income");
    const { labels: offsetlabels, amounts: offsetamounts } = groupDataByCategory(currentData, "Offset");
    const adjustedExpenseAmounts = expenselabels.map((label, index)=>{
        const offsetIndex = offsetlabels.indexOf(label);
        if (offsetIndex !== -1) {
            return expenseamounts[index] - offsetamounts[offsetIndex];
        }
        return expenseamounts[index];
    });
    const expensedata = {
        labels: expenselabels,
        datasets: [
            {
                label: "Expense Breakdown",
                data: adjustedExpenseAmounts,
                backgroundColor: [
                    "rgba(255, 99, 132, 0.5)",
                    "rgba(54, 162, 235, 0.5)",
                    "rgba(255, 206, 86, 0.5)",
                    "rgba(75, 192, 192, 0.5)",
                    "rgba(153, 102, 255, 0.5)"
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)"
                ],
                borderWidth: 1
            }
        ]
    };
    const savingdata = {
        labels: savinglabels,
        datasets: [
            {
                label: "Savings Breakdown",
                data: savingamounts,
                backgroundColor: [
                    "rgba(255, 99, 132, 0.5)",
                    "rgba(54, 162, 235, 0.5)",
                    "rgba(255, 206, 86, 0.5)",
                    "rgba(75, 192, 192, 0.5)",
                    "rgba(153, 102, 255, 0.5)"
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)"
                ],
                borderWidth: 1
            }
        ]
    };
    const incomedata = {
        labels: incomelabels,
        datasets: [
            {
                label: "Savings Breakdown",
                data: incomeamounts,
                backgroundColor: [
                    "rgba(255, 99, 132, 0.5)",
                    "rgba(54, 162, 235, 0.5)",
                    "rgba(255, 206, 86, 0.5)",
                    "rgba(75, 192, 192, 0.5)",
                    "rgba(153, 102, 255, 0.5)"
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)"
                ],
                borderWidth: 1
            }
        ]
    };
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top"
            },
            datalabels: {
                color: "#fff",
                font: {
                    size: 14
                },
                formatter: (value, context)=>{
                    const label = context.chart.data.labels[context.dataIndex];
                    return `$${value.toFixed(2)}`;
                }
            }
        }
    };
    return {
        expensedata,
        savingdata,
        incomedata,
        options
    };
};
}}),
"[project]/src/app/budget/[month]/page.tsx [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
const e = new Error(`Could not parse module '[project]/src/app/budget/[month]/page.tsx'

Expected ',', got 'className'`);
e.code = 'MODULE_UNPARSEABLE';
throw e;}}),
"[project]/src/app/budget/[month]/page.tsx [app-rsc] (ecmascript, Next.js server component, client modules ssr)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),

};

//# sourceMappingURL=src_app_budget_%5Bmonth%5D_5e58c7._.js.map