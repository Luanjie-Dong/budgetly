import React from 'react';

interface ChartDataProps {
  currentData: {
    type: string;
    category: string;
    spend: number;
    recieve: number
  }[];
}

export const generateChartData = (currentData: ChartDataProps['currentData']) => {
    const groupDataByCategory = (data: typeof currentData, targetCategory: string) => {
        const grouped = data
          .filter((item) => item.category === targetCategory) 
          .reduce((summary, item) => {
            if (!summary[item.type]) {
              summary[item.type] = 0;
            }

            if (targetCategory == "Income" || targetCategory == "Offset"){
                summary[item.type] += item.recieve;
            }
            else{   
                summary[item.type] += item.spend;
            }
            
            return summary;
          }, {} as Record<string, number>);
      
        const labels = Object.keys(grouped);
        const amounts = Object.values(grouped);
      
        return { labels, amounts };
      };

    const { labels: expenselabels, amounts: expenseamounts } = groupDataByCategory(currentData, "Spending");
    const { labels: savinglabels, amounts: savingamounts } = groupDataByCategory(currentData, "Saving");
    const { labels: incomelabels, amounts: incomeamounts } = groupDataByCategory(currentData, "Income");
    const { labels: offsetlabels, amounts: offsetamounts } = groupDataByCategory(currentData, "Offset");

    const adjustedExpenseAmounts = expenselabels.map((label, index) => {
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
          "rgba(255, 99, 132, 0.5)", // Red
          "rgba(54, 162, 235, 0.5)", // Blue
          "rgba(255, 206, 86, 0.5)", // Yellow
          "rgba(75, 192, 192, 0.5)", // Green
          "rgba(153, 102, 255, 0.5)", // Purple
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)", // Red
          "rgba(54, 162, 235, 1)", // Blue
          "rgba(255, 206, 86, 1)", // Yellow
          "rgba(75, 192, 192, 1)", // Green
          "rgba(153, 102, 255, 1)", // Purple
        ],
        borderWidth: 1,
      },
    ],
  };

  const savingdata = {
    labels: savinglabels,
    datasets: [
      {
        label: "Savings Breakdown",
        data: savingamounts,
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)", // Red
          "rgba(54, 162, 235, 0.5)", // Blue
          "rgba(255, 206, 86, 0.5)", // Yellow
          "rgba(75, 192, 192, 0.5)", // Green
          "rgba(153, 102, 255, 0.5)", // Purple
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)", // Red
          "rgba(54, 162, 235, 1)", // Blue
          "rgba(255, 206, 86, 1)", // Yellow
          "rgba(75, 192, 192, 1)", // Green
          "rgba(153, 102, 255, 1)", // Purple
        ],
        borderWidth: 1,
      },
    ],
  };

  const incomedata = {
    labels: incomelabels,
    datasets: [
      {
        label: "Savings Breakdown",
        data: incomeamounts,
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)", // Red
          "rgba(54, 162, 235, 0.5)", // Blue
          "rgba(255, 206, 86, 0.5)", // Yellow
          "rgba(75, 192, 192, 0.5)", // Green
          "rgba(153, 102, 255, 0.5)", // Purple
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)", // Red
          "rgba(54, 162, 235, 1)", // Blue
          "rgba(255, 206, 86, 1)", // Yellow
          "rgba(75, 192, 192, 1)", // Green
          "rgba(153, 102, 255, 1)", // Purple
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as "top", 
      },
      datalabels: {
        color: "#fff",
        font: {
          size: 14,
        },
        formatter: (value: number, context: any) => {
          const label = context.chart.data.labels[context.dataIndex];
          return `$${value.toFixed(2)}`;
        },
      },
    },
  };

  return { expensedata, savingdata, incomedata , options };
};
