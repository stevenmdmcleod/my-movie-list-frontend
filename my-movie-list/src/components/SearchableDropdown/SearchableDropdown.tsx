import React, { useState } from 'react';
import { Dropdown, FormControl } from 'react-bootstrap';
import "./SearchableDropdown.css";

interface SearchableDropdownProps {
    options: Array<string>,
    setSelected: (option: string) => void
}

// Options is an array of strings
// SetSelected is a function that will be run with the selected option passed to it. 
// For an example of use check out /pages/Profile/EditProfile on the handleSelectedGenre function.
// It is passed to SearchableDropdown and used to assign the selected option from the dropdown to a useState setter function in the parent component.
const SearchableDropdown = ({ options, setSelected }: SearchableDropdownProps) => {
  const [filter, setFilter] = useState<string>('');

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