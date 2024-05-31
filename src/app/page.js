"use client";
import React, { useState } from 'react';

const Table = ({ header, mainData, perPageLimits }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageData, setPageData] = useState(mainData);
  const [sortOrder, setSortOrder] = useState("ASC");
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState(header.map(col => col.key));
  const [selectedRows, setSelectedRows] = useState([]);

  const toggleDropdown = () => setIsOpen(!isOpen);


  // sorting  function 
  const sorting = (col) => {
    let sorted;
    if (sortOrder === "ASC") {
      sorted = [...pageData].sort((a, b) =>
        a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
      );
      setSortOrder("DSC");
    } else {
      sorted = [...pageData].sort((a, b) =>
        a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
      );
      setSortOrder("ASC");
    }
    setPageData(sorted);
  };
  //  seacrh functionality 
  const filteredData = pageData.filter(item =>
    selectedColumns.some(key =>
      item[key].toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  // search functionality ending here 

  const perPageData = perPageLimits;
  const lastIndex = currentPage * perPageData;
  const firstIndex = lastIndex - perPageData;
  const records = filteredData.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredData.length / perPageData);
  const number = [...Array(npage).keys()].map(i => i + 1);


  // pagination starting here 

  const NextPage = () => {
    if (currentPage < npage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const PrePage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const changeCpage = (id) => {
    setCurrentPage(id);
  };
  // pagination ending here 

  
  //  custom rendering function  for styling 
  const styleHandling = (row, key) => {
    let style = {};
    const age = Number(row.age);
    if (key === 'age') {
      if (age > 38) {
        style.backgroundColor = 'green';
        style.color = 'yellow';
      }
      if (age === 49) {
        style.fontWeight = 'bold';
      }
    }
    if (key === 'first_name' && age === 49) {
      style.backgroundColor = 'red';
    }
    return style;
  };
  // ending here 
  const FiltereColumns = header.filter(col => selectedColumns.includes(col.key));
  
  
  // left checkbox function 

  const handleSelectAllRows = (e) => {
    if (e.target.checked) {
      setSelectedRows(records.map((row) => row.index));
    } else {
      setSelectedRows([]);
    }
    console.log(selectedRows)
  };

  const handleRowCheckboxChange = (index) => {
    console.log("hello",index)
    setSelectedRows((prevSelectedRows) =>
    prevSelectedRows.includes(index)
  
        ? prevSelectedRows.filter((id) => id !== index)
        : [...prevSelectedRows, index]
    );
   
  };
  // ending here left checkbox 


//  dropdown  selector  
  const handleColumnCheckboxChange = (event) => {
    const columnKey = event.target.value;
    setSelectedColumns((prevSelectedColumns) =>
      event.target.checked
        ? [...prevSelectedColumns, columnKey]
        : prevSelectedColumns.filter((key) => key !== columnKey)
    );
  };
  

  const renderOption = (col) => (
    <div key={col.key} className='flex items-center'>
      <input
        type='checkbox'
        id={col.key}
        value={col.key}
        checked={selectedColumns.includes(col.key)}
        onChange={handleColumnCheckboxChange}
        className='mr-2'
      />
      <label htmlFor={col.key}>{col.label}</label>
    </div>
  );
  // end here 

  return (
    <>
      <style>
        {`
          table, tr, th, td {
            border: 1px solid white;
            text-align: center;
            padding:10px;
          }
          tr:hover {
            background-color:yellow;
            color: black;
          }
          ul {
            list-style: none;
            display: flex;
            justify-content: center;
            padding: 0;
          }
          li {
            margin: 0 5px;
          }
          a {
            cursor: pointer;
            padding: 5px 10px;
            border: 1px solid black;
            border-radius: 5px;
            text-decoration: none;
          }
          a.disabled {
            pointer-events: none;
            color: grey;
            border-color: grey;
          }
        `}
      </style>
      <div className=' text-left flex justify-center items-center mt-10 '>
        <div>
          <button
            type='button'
            className='px-2 py-1 bg-black border rounded-md relative '
            onClick={toggleDropdown}
          >
            Column select &nbsp;{isOpen ? '🔼' : "🔽"}
          </button>
        </div>
        {isOpen && (
          <div className='absolute mt-10 top-1 left-[50px] w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 '>
            <div className='py-1'>
              {header.map((col) => (
                <label key={col.key} className='flex items-center px-4 py-2 text-black'>
                  {renderOption(col)}
                </label>
              ))}
            </div>
          </div>
        )}
        <div className=' text-black'>
          <div>
            <input
              placeholder='Search...'
              onChange={(e) => setSearch(e.target.value)}
              className='ml-2'
            />
          </div>
        </div>
      </div>
      <div className='flex justify-center mt-6'>
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedRows.length === records.length}
                  onChange={handleSelectAllRows}
                />
              </th>
              {FiltereColumns.map((column) => (
          <th key={column.key} onClick={() => column.sorted !== false && sorting(column.key)}>
            {column.label}
          </th>
        ))}
            </tr>
          </thead>
          <tbody>
            {records.map((row, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row.index)}
                    onChange={() => handleRowCheckboxChange(row.index)}
                  />
                </td>
                {FiltereColumns.map((column) => (
                  <td
                    key={column.key}
                    style={styleHandling(row, column.key)}
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav className='mt-10'>
        <ul>
          <li>
            <a href='#' className={currentPage === 1 ? 'disabled' : ''} onClick={PrePage}>Prev</a>
          </li>
          {number.map((n) => (
            <li key={n}>
              <a href='#' className={currentPage === n ? 'disabled' : ''} onClick={() => changeCpage(n)}>{n}</a>
            </li>
          ))}
          <li>
            <a href='#' className={currentPage === npage ? 'disabled' : ''} onClick={NextPage}>Next</a>
          </li>
        </ul>
      </nav>
    </>
  );
};

function Page() {
  const [perPageLimit, setPerPageLimit] = useState(5);

  function handleLastNameClick(row) {
    console.log(row);
    if (row && row.employee_id) {
      alert(`Employee ID: ${row.employee_id}`);
    } else {
      alert("Employee ID not found");
    }
  }

  const handlePerPageLimitChange = (event) => {
    setPerPageLimit(parseInt(event.target.value));
  };

  const columns = [
    { label: "ID", key: "index",sorted:false },
    { label: "First Name", key: "first_name", render: (id, row) => <span onClick={() => handleLastNameClick(row)}>{id}</span> },
    { label: "Email", key: "email" },
    { label: "Age", key: "age" },
    { label: "Employee ID", key: "employee_id", render: (id) => <a href={`#employee/${id}`}>{id}</a> },
    { label: "Gender", key: "gender", render: (text) => <span style={{ color: text === 'male' ? 'red' : 'blue' }}>{text}</span> },
  ];

  const data = [
    { "index": "26", "first_name": "Cheslie", "email": "cclayworthp@lulu.com", "age": "34", "employee_id": "37", "gender": "female" },
    { "index": "3", "first_name": "Robert", "email": "rhultberg2@wordpress.com", "age": "49", "employee_id": "4", "gender": "male" },
    { "index": "1", "first_name": "Doralynne", "email": "dlabitt0@disqus.com", "age": "28", "employee_id": "29677", "gender": "female" },
    { "index": "4", "first_name": "Creighton", "email": "crodriguez3@storify.com", "age": "39", "employee_id": "35770", "gender": "male" },
    { "index": "6", "first_name": "Shem", "email": "ssaladin5@amazon.co.jp", "age": "22", "employee_id": "32862", "gender": "male" },
    { "index": "7", "first_name": "Maddi", "email": "mcolnet6@google.fr", "age": "33", "employee_id": "98765", "gender": "female" },
    { "index": "13", "first_name": "Gilburt", "email": "gthorringtonc@google.ca", "age": "27", "employee_id": "y87bkew", "gender": "male" },
    { "index": "5", "first_name": "Emalee", "email": "eyendall4@businesswire.com", "age": "30", "employee_id": "bb222", "gender": "male" },
    { "index": "8", "first_name": "Clarie", "email": "cbrockwell7@reddit.com", "age": "31", "employee_id": "0987", "gender": "female" },
    { "index": "9", "first_name": "Norrie", "email": "nbraunstein8@fotki.com", "age": "40", "employee_id": "345678", "gender": "male" },
    { "index": "11", "first_name": "Anthia", "email": "acransona@washingtonpost.com", "age": "29", "employee_id": "345", "gender": "female" },
    { "index": "12", "first_name": "Casandra", "email": "csarverb@diigo.com", "age": "35", "employee_id": "9877", "gender": "male" },
    { "index": "14", "first_name": "Angelita", "email": "aaizicd@cpanel.net", "age": "41", "employee_id": "96666", "gender": "female" }
  ];

  return (
    <>
      <Table header={columns} mainData={data} perPageLimits={perPageLimit} />
      <div className='flex justify-center mt-4'>
        <label htmlFor="perPageLimit" >Items per page:</label>
        <select id="perPageLimit" value={perPageLimit} onChange={handlePerPageLimitChange} className='text-black align-middle'>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </div>
    </>
  );
}

export default Page;
