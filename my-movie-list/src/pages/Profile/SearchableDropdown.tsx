import React, { useState } from 'react';
import { Dropdown, FormControl } from 'react-bootstrap';
import "./SearchableDropdown.css";

interface SearchableDropdownProps {
    options: Array<string>
}

const SearchableDropdown = ({ options }: SearchableDropdownProps) => {
  const [filter, setFilter] = useState<string>('');
  const [selected, setSelected] = useState('');

  // Filter the options based on the input text
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Dropdown className='searchable-dropdown'>
      <Dropdown.Toggle  className='searchable-dropdown-button'>
        {'Select an option'}
      </Dropdown.Toggle>

      <Dropdown.Menu className='searchable-dropdown-menu'>
        <FormControl
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="Type to filter..."
          onChange={(e) => setFilter(e.target.value)}
          value={filter}
        />
        {filteredOptions.map((option, index) => (
          <Dropdown.Item 
            key={index} 
            onClick={() => { 
                setSelected(option); 
                setFilter(''); 
            }}
          >
            {option}
          </Dropdown.Item>
        ))}
        {filteredOptions.length === 0 && (
          <Dropdown.Item disabled>No results found</Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default SearchableDropdown;