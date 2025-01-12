'use client'
import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { PolarArea , Pie} from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);


interface overview {
  name: string,
  amount: number
}

export default function Home() {
  const [overviewData, setOverviewData] = useState<overview[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalFinance,setModalFinance] = useState("")
  const [isModalAmount,setModalAmount] = useState(0)

  const overview_endpoint = "http://127.0.0.1:1000/overview"
  const total = overviewData.reduce((sum,item) => sum + item.amount,0);

  const fetchData = async () => {
    try {
      const response = await fetch(overview_endpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const jsonData = await response.json();
      setOverviewData(jsonData);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } 
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const update_finance = async () => {
    try {
      const response = await fetch(overview_endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: isModalFinance,
          amount: isModalAmount,
        }),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Update successful:', result);
        fetchData();
        setIsModalOpen(false);
      } else {
        console.error('Update failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const labels = overviewData.map((item) => item.name);
  const amounts = overviewData.map((item) => item.amount);

  const data = {
    labels: labels, 
    datasets: [
      {
        label: 'Financial Overview',
        data: amounts, 
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)', // Red
          'rgba(54, 162, 235, 0.5)', // Blue
          'rgba(255, 206, 86, 0.5)', // Yellow
          'rgba(75, 192, 192, 0.5)', // Green
          'rgba(153, 102, 255, 0.5)', // Purple
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)', // Red
          'rgba(54, 162, 235, 1)', // Blue
          'rgba(255, 206, 86, 1)', // Yellow
          'rgba(75, 192, 192, 1)', // Green
          'rgba(153, 102, 255, 1)', // Purple
        ],
        borderWidth: 1,
      },
    ],
  };

  
  

  return (
    <div className=" pt-28">
      <div className="flex flex-wrap items-center justify-center bg-red-400 text-white rounded-lg shadow-md p-6 w-96 mx-auto">
        <h2 className="text-3xl font-bold mb-2">Total Amount</h2>
        <p className="text-3xl font-extrabold">${total.toLocaleString()}</p>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-12">
        {overviewData.map((finance, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-40 text-center transition-transform transform hover:scale-105 hover:shadow-2xl"
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {finance.name}
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              ${finance.amount.toLocaleString()}
            </p>
            <button
              className="mt-4 mx-auto flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-500 transition"
              onClick={() => {setIsModalOpen(true), setModalFinance(finance.name), setModalAmount(finance.amount)}}
            >
              <img src="/edit.webp" alt="Edit" className="w-5 h-5" />
              Edit
            </button>
                </div>
              ))}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 relative max-w-md w-full">
            <button
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              onClick={() => setIsModalOpen(false)}
            >
              &#x2715;
            </button>

            <h1 className="text-xl text-center mb-4 font-bold text-gray-800 dark:text-white">
              Editing: {isModalFinance}
            </h1>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Amount
                </label>
                <input
                  type="number"
                  value={isModalAmount}
                  onChange={(e) => setModalAmount(Number(e.target.value))}
                  placeholder="Enter new amount"
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
                onClick={() => {
                  update_finance()
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
       <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4" style={{ width: '300px', margin: '20px auto', textAlign: 'center' }}>
        <Pie data={data} />
      </div>
      
    </div>
  );
}
