interface FilterBarProps {
    categories: string[];
    types: string[];
    selectedCategory: string;
    selectedType: string;
    setSelectedCategory: (value: string) => void;
    setSelectedType: (value: string) => void;
  }
  
  export default function FilterBar({
    categories,
    types,
    selectedCategory,
    selectedType,
    setSelectedCategory,
    setSelectedType,
  }: FilterBarProps) {

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedCategory(e.target.value);
    };
  
    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedType(e.target.value);
    };
  
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-4">
        
        <div className="flex flex-col md:flex-row gap-4">
            {/* Category Filter */}
            <div className="w-full md:w-1/2">
                <label
                htmlFor="category"
                className="block text-sm font-medium dark:text-gray-300 mb-2"
                >
                Category
                </label>
                <select
                id="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="block w-full px-4 py-2 text-gray-800  dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <option value="">Select</option>
                {categories.map((category, index) => (
                    <option key={index} value={category}>
                    {category}
                    </option>
                ))}
                </select>
            </div>
    
            {/* Type Filter */}
            <div className="w-full md:w-1/2">
                <label
                htmlFor="type"
                className="block text-sm font-medium dark:text-gray-300 mb-2"
                >
                Type
                </label>
                <select
                id="type"
                value={selectedType}
                onChange={handleTypeChange}
                className="block w-full px-4 py-2 text-gray-800 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <option value="">Select</option>
                {types.map((type, index) => (
                    <option key={index} value={type}>
                    {type}
                    </option>
                ))}
                </select>
            </div>
            <button
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                onClick={() => {
                setSelectedCategory("");
                setSelectedType("");
                }}
            >
                Clear Filter
            </button>
            </div>
      </div>
    );
  }
  