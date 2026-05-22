import React from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';

const FilterSection = ({ selectedCategory, setSelectedCategory, categories, showFreeOnly, setShowFreeOnly }) => {
  const allCategories = categories.includes('All') ? categories : ['All', ...categories];

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FaFilter className="text-purple-600 mr-2" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Filters</h3>
        </div>
        {(selectedCategory !== 'All' || showFreeOnly) && (
          <button
            onClick={() => { setSelectedCategory('All'); setShowFreeOnly(false); }}
            className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
          >
            <FaTimes size={10} />
            Reset
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            {allCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="freeOnly"
            checked={showFreeOnly}
            onChange={(e) => setShowFreeOnly(e.target.checked)}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
          />
          <label htmlFor="freeOnly" className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            Free events only
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
