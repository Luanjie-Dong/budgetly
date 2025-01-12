interface Transaction {
    Category: string;
    Information: string;
    Type: string;
    date: Date;
    recieve: number;
    spend: number;
    key: string;
  }
  
  interface TransactionProps {
    transaction: Transaction;
    handleUpdate: (key: string, field: string, value: string) => Promise<void>;
    index: number;
    categories: string[];
    types: string[];
  }
  
  export default function TransactionBar({ transaction, handleUpdate, index, categories, types}: TransactionProps) {

    return (
        <div
        key={index}
        className={`rounded-lg p-4 shadow hover:shadow-lg transition my-4 ${
            !transaction.Category || !transaction.Type ? "bg-yellow-50" : "bg-white dark:bg-gray-700"
        }`}
        >
        <div className="flex flex-wrap md:flex-nowrap items-center gap-4 justify-center">
            <p className="text-lg font-medium text-gray-600 dark:text-gray-300 w-28">
            {new Date(transaction.date).toLocaleDateString()}
            </p>
            <p className="text-lg text-red-500 font-semibold w-20">
            Spend: ${transaction.spend.toFixed(2)}
            </p>
            <p className="text-lg text-green-500 font-semibold w-20">
            Receive: ${transaction.recieve.toFixed(2)}
            </p>
            <div className="w-38">
            <label className="block text-lg text-center font-medium text-gray-700 dark:text-gray-300">
                Category
            </label>
            <select
                value={transaction.Category || ""}
                onChange={(e) =>
                handleUpdate(transaction.key, "Category", e.target.value)
                }
                className={`mt-1 block w-full px-3 py-1.5 text-gray-800 dark:text-gray-300 rounded-md ${
                transaction.Category === "Spending"
                    ? "bg-red-400 dark:bg-red-600"
                    : transaction.Category === "Income"
                    ? "bg-green-400 dark:bg-green-600"
                    : transaction.Category === "Saving"
                    ? "bg-blue-400 dark:bg-blue-600"
                    : "bg-gray-100 dark:bg-gray-700"
                }`}
            >
                <option value="">Select</option>
                {categories.map((category, index) => (
                <option key={index}>{category}</option>
                ))}
            </select>
            </div>
            <div className="w-38">
            <label className="block text-lg text-center font-medium text-gray-700 dark:text-gray-300">
                Type
            </label>
            <select
                value={transaction.Type || ""}
                onChange={(e) =>
                handleUpdate(transaction.key, "Type", e.target.value)
                }
                className="mt-1 block w-full px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-md text-center"
            >
                <option value="">Select</option>
                {types.map((type, index) => (
                <option key={index}>{type}</option>
                ))}
            </select>
            </div>
        </div>
        <div className="text-center p-4">
            <p className="text-lg text-gray-600 dark:text-gray-300 flex-grow">
            {transaction.Information}
            </p>
        </div>
        </div>
    )
}