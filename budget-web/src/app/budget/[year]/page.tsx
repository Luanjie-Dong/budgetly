'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

interface transaction{
  Category:string,
  information:string,
  Type:string,
  date: Date,
  recieve: number,
  spend:number
}
interface total {
  recieve: number;
  spend: number;
}

interface budget {
  name:string,
  amount:number
}

interface monthly {
  month:string,
  receive: number;
  spend: number;
}

interface BudgetPageProps {
  params: Promise<{ year: number }>;
}

export default function Budget({ params }: BudgetPageProps) {
    const router = useRouter();
    const { year } = React.use(params);
    const [selectedYear, setSelectedYear] = useState(year)
    const [transactionData,setTransactionData] = useState<transaction[]>([])
    const [yearlyBudget,setYearlyBudget] = useState<budget[]>([])
    const [monthlyBudget,setMonthlyBudget] = useState<monthly[]>([])

    
    const transactions_endpoint = "http://127.0.0.1:1000/transactions"

    const handleViewDetails = (month: string, year:number) => {
      router.push(`/budget/${year}/${month}?year=${year}`);
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
          setYearlyBudget([]);
          setMonthlyBudget([]);
        } else {
          setTransactionData(jsonData);
        } 

      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
        setTransactionData([]);
        setYearlyBudget([]);
        setMonthlyBudget([]);
      }
    };

    useEffect(() => {
      get_transactions();
      
    },[selectedYear]);

    useEffect(() => {
      
      const total_spend = transactionData.reduce((total, item) => total + item.spend, 0);
      const total_receive = transactionData.reduce((total, item) => total + item.recieve, 0);
      const total_balance = total_receive - total_spend;
      console.log(transactionData)
      console.log(total_balance)
    
      setYearlyBudget([
        { name: "Total Spent", amount: total_spend },
        { name: "Total Receive", amount: total_receive },
        { name: "Overall Balance", amount: total_balance },
      ]);
    
      const groupedData = transactionData.reduce<Record<string, total>>((acc, item) => {
        const date = new Date(item.date);
      
        const year = date.getFullYear();
        const monthIndex = date.getMonth(); 
      
        const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        const formattedMonth = `${monthNames[monthIndex]} ${year}`;
      
        if (!acc[formattedMonth]) {
          acc[formattedMonth] = { recieve: 0, spend: 0 };
        }
        
        if (item.Category == "Spending"){
          acc[formattedMonth].spend += item.spend;
        }
          
        if (item.Category == "Income"){
        acc[formattedMonth].recieve += item.recieve;}

        if (item.Category == "Offset"){
          acc[formattedMonth].spend -= item.recieve;}
        
      
        return acc;
      }, {});
      
    
      const monthly_total = Object.entries(groupedData).map(([month, totals]) => ({
        month,
        receive: totals.recieve,
        spend: totals.spend,
      }));
      setMonthlyBudget(monthly_total);
    
    }, [transactionData]);
    
    

    return (
      <div className="">
        
        <h1 className="pt-28 text-center text-6xl">
        {selectedYear} Budget
        </h1>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-12">
        {yearlyBudget.map((budget, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-60 text-center transition-transform transform hover:scale-105 hover:shadow-2xl"
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {budget.name}
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              ${budget.amount.toLocaleString()}
            </p>
              </div>
              ))}
      </div>

      <div className="p-4 mt-4">
  <h1 className="text-center text-3xl font-semibold mb-6 dark:text-white">
    Monthly Summary
  </h1>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {monthlyBudget.map((log, index) => (
          
            <div
              key={index}
              className={`dark:from-gray-800 dark:to-gray-900 shadow-lg rounded-lg py-4 text-center transition-transform transform hover:scale-105 hover:shadow-2xl border border-gray-200 dark:border-gray-700 ${log.receive - log.spend >= 0 ? 'bg-green-100' : 'bg-red-100'}`}
            >
              <h2 className="text-lg font-bold text-gray-800  mb-4">
                {log.month}
              </h2>
              <div className="grid grid-cols-3">
                <p className="text-base text-green-500 font-medium mb-2">
                  Spend: <br></br> ${log.spend.toFixed(2)}
                </p>
                <p className="text-base text-blue-500 font-medium mb-2">
                  Receive:<br></br> ${log.receive.toFixed(2)}
                </p>
                <p className={`text-base font-medium ${log.receive - log.spend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  Balance:<br></br> ${(log.receive - log.spend).toFixed(2)}
                </p>
              </div>
              <button
                className="mt-4 inline-flex items-center justify-center bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition"
                onClick={() => handleViewDetails(log.month, selectedYear)}
              >
                <span className="mr-2">View Details</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )
        )}
      </div>
    </div>
      </div>
    );
  }