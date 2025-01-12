'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useSearchParams } from "next/navigation";
import ChartDataLabels from "chartjs-plugin-datalabels";
import FilterBar from "./filter";
import TransactionBar from "./transaction";
import {
  Chart as ChartJS,
  CategoryScale,
  RadialLinearScale,
  ArcElement,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar , Pie} from 'react-chartjs-2';
import { generateChartData } from "./chart";

ChartJS.register(RadialLinearScale, ArcElement, CategoryScale,LinearScale,BarElement,Tooltip, Legend, ChartDataLabels);

interface transaction{
    category:string,
    Information:string,
    type:string,
    date: Date,
    recieve: number,
    spend:number
    key:string
  }

interface MonthPageProps {
  params: Promise<{ month: string }>;
}

interface summary {
  type: string,
  total: number,
}

interface budget {
  name:string,
  amount:number
}

interface GroupedTransaction {
  totalSpend: number;
  totalReceive: number;
  transactions: transaction[];
}

export default function Month({ params }: MonthPageProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedType, setSelectedType] = useState<string>("");
    const [transactionData,setTransactionData] = useState<transaction[]>([])
    const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});
    const [monthlyBudget,setMonthlyBudget] = useState<budget[]>([])
    const [selectedYear, setSelectedYear] = useState(0)
    const [currentData,setCurrentData] = useState<transaction[]>([])
    const { month } = React.use(params);
    const currentMonth = decodeURIComponent(month)
    const transactions_endpoint = "http://127.0.0.1:1000/get-transactions"
    const update_endpoint = "http://127.0.0.1:1000/modify-transactions"
    const searchParams = useSearchParams();
    const types = process.env.REACT_APP_SPENDING_TYPES?.split(',') || [];
    const categories = process.env.REACT_APP_SPENDING_CATEGORIES?.split(',') || [];
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
      ];

    const groupedTransactions: Record<string, GroupedTransaction> = currentData.reduce(
      (acc, transaction) => {
        const day = new Date(transaction.date).toLocaleDateString();
        if (!acc[day]) {
          acc[day] = { totalSpend: 0, totalReceive: 0, transactions: [] };
        }
        acc[day].transactions.push(transaction);
        acc[day].totalSpend += transaction.spend;
        acc[day].totalReceive += transaction.recieve;
        return acc;
      },
      {} as Record<string, GroupedTransaction>
    );
      
    const toggleDay = (day : string) => {
      setExpandedDays((prev) => ({
        ...prev,
        [day]: !prev[day], 
      }));
    };

    const get_transactions = async () => {
      try {
        const url = `${transactions_endpoint}?year=${encodeURIComponent(selectedYear)}`;
    
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const jsonData = await response.json();
        if (jsonData.length === 0) {
          setTransactionData([]);
        } else {
          setTransactionData(jsonData);
        } 
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
    };

    useEffect(() => {
      get_transactions();
      
    },[selectedYear]);

    useEffect(() => {
        const yearParam = searchParams.get('year');
        const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear(); 
        if (!isNaN(year)) {
          setSelectedYear(year); 
        }
      }, [searchParams]);

    useEffect(() => {
      const filteredData = transactionData.filter(
        (x) =>
          `${monthNames[new Date(x.date).getMonth()]} ${selectedYear}` === currentMonth
      );
      setCurrentData(filteredData);
    }, [transactionData, currentMonth, selectedYear]);

    const handleUpdate = async (transactionId: string, field: string, modify_value: string) => {
      try {
          setCurrentData((prev) =>
              prev.map((transaction) =>
                  transaction.key === transactionId
                      ? { ...transaction, [field]: modify_value }
                      : transaction
              )
          );
  
          const response = await fetch(update_endpoint, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  key: transactionId,
                  category: field, 
                  value: modify_value,
                  year : searchParams.get('year')
              }),
          });
  
          if (!response.ok) {
              const errorDetails = await response.json();
              throw new Error(errorDetails.message || "Failed to update transaction");
          }
  
          console.log("Transaction updated successfully");
      } catch (error) {
          console.error("Error updating transaction:", error);
      }
  };
  
  const { expensedata, savingdata , incomedata , options } = generateChartData(currentData);

  useEffect(() => {
    const total_spend = currentData.reduce((total, item) => {
      return item.category === "Spending" ? total + item.spend : total;
    }, 0);
    
    const total_receive = currentData.reduce((total, item) => {
      return item.category === "Income" ? total + item.recieve : total;
    }, 0);

    const total_offset= currentData.reduce((total, item) => {
      return item.category === "Offset" ? total + item.recieve : total;
    }, 0);

    const total_saving= currentData.reduce((total, item) => {
      return item.category === "Saving" ? total + item.spend : total;
    }, 0);

    const total_balance = total_receive - (total_spend - total_offset) - total_saving
    setMonthlyBudget([
      { name: "Total Spent", amount: total_spend - total_offset },
      { name: "Total Receive", amount: total_receive },
      { name: "Total Saving", amount: total_saving },
      { name: "Overall Balance", amount: total_balance },
    ]);
  },[currentData])
  

      
    return (
      <div className="py-28 flex flex-col justify-center items-center">
        <h1 className="text-6xl font-bold dark:text-white text-center mb-8">
            {currentMonth}
        </h1>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-12">
        {monthlyBudget.map((budget, index) => (
          <div
            key={index}
            className={` rounded-lg shadow-lg p-6 w-60 text-center transition-transform transform hover:scale-105 hover:shadow-2xl ${budget.amount < 0 ? "bg-red-200": "bg-green-200"}`}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {budget.name}
            </h3>
            <p className="text-lg text-gray-600">
              ${budget.amount.toLocaleString()}
            </p>
              </div>
              ))}
      </div>
        <div className="flex flex-wrap justify-center gap-8 p-4 h-80">
          {/* Income Breakdown */}
          <div className="w-80 text-center bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
            <p className="text-xl font-semibold mb-4">Income Breakdown</p>
            <div className="h-72"><Bar data={incomedata} options={{ maintainAspectRatio: false }}/></div>
          </div>

          {/* Expense Breakdown */}
          <div className="w-80 text-center bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
            <p className="text-xl font-semibold mb-4">Expense Breakdown</p>
            <Pie data={expensedata} options={options} className=""/>
          </div>

          {/* Saving Breakdown */}
          <div className="w-80 text-center bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
            <p className="text-xl font-semibold mb-4">Saving Breakdown</p>
            <Pie data={savingdata} options={options} />
          </div>
        </div>
        
        <div className="w-3/4">
            <h2 className="text-4xl font-semibold mt-24 mb-4 text-center">
            Transactions
            </h2>
            <hr className="mb-4"></hr>
            <FilterBar
              categories={categories}
              types={types}
              selectedCategory={selectedCategory}
              selectedType={selectedType}
              setSelectedCategory={setSelectedCategory}
              setSelectedType={setSelectedType}
            />
              
            <div className="space-y-4">

            {selectedCategory || selectedType ? (
              <div>
              {currentData
                .filter((transaction) => {
                  const matchesCategory = selectedCategory
                    ? transaction.category === selectedCategory
                    : true;
                  const matchesType = selectedType
                    ? transaction.type === selectedType
                    : true;
                  return matchesCategory && matchesType;
                })
                .map((transaction, index) => (
                  <TransactionBar
                    key={index}
                    transaction={transaction}
                    handleUpdate={handleUpdate}
                    index={index}
                    categories={categories}
                    types={types}
                  />
                ))}
            </div>
            ): (
              <div>{Object.entries(groupedTransactions).length > 0 ? (
                Object.entries(groupedTransactions).map(([day, information]) => (
                  <div key={day} className={`mb-6 rounded-lg p-4 shadow-md ${information.totalReceive - information.totalSpend < 0 ? "bg-red-100": "bg-green-100"}`}>
                    {/* Day Header */}
                    <div
                      className="flex justify-between items-center cursor-pointer gap-12"
                      onClick={() => toggleDay(day)}
                    >
                      <div className="flex gap-12 justify-center items-center text-black">
                        <p className="text-lg font-medium">
                          {day}
                        </p>
                        <p className="text-lg text-red-500 font-semibold ">
                          Spend: ${information.totalSpend.toFixed(2)}
                        </p>
                        <p className="text-lg text-green-500 font-semibold">
                          Receive: ${information.totalReceive.toFixed(2)}
                        </p>
                      </div>
                      {information.transactions.some((transaction) => !transaction.category || !transaction.type) && (
                        <p className="text-sm text-gray-600 mt-2">
                          <i className="fas fa-exclamation-circle text-yellow-500"></i> Some transactions are missing a category or type.
                        </p>
                      )}
                      <button className="text-blue-500 text-lg">
                        {expandedDays[day] ? "Hide Details" : "View Details"}
                      </button>
                    </div>
    
                {expandedDays?.[day] && (
                  <div className="mt-4 space-y-4">
                    {information.transactions.map((transaction, index) => (
                      <TransactionBar key={index} transaction={transaction} handleUpdate={handleUpdate} index={index}  categories={categories} types={types}/>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-lg text-gray-500">No transactions found for this month.</p>
          )}</div>
            )}
            
            </div>
        </div>
        </div>
      
      
    );
  }