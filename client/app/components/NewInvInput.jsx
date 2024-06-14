import { useState, useEffect } from 'react';

export default function NewInvInput({part, deletePart, clickedPartId, addNewParts}) {

  const [quantityInput, setQuantityInput] = useState(part.quantity);
  const [thresholdInput, setThresholdInput] = useState(part.threshold);
  const [nameInput, setNameInput] = useState(part.name);

  useEffect(() => {
    addNewParts({id: part.id, name: nameInput, quantity: quantityInput, threshold: thresholdInput})
  }, [quantityInput, thresholdInput, nameInput])

  const handleIncrement = (e) => {
    setQuantityInput(prev => (prev || 0) + 1);
  }

  const handleDecrement = (e) => {
    setQuantityInput(prev => Math.max(0, (prev || 0) - 1));
  }

  const handleNameChange = (e) => {
    setNameInput(e.target.value);
  }

  const handleThresholdChange = (e) => {
    setThresholdInput(e.target.value);
  }

  const handleQuantityChange = (e) => {
    setQuantityInput(Number(e.target.value));
  }

  return (
    <tr key={part.id}  className="border-gray-300 text-black font-medium">
                            <th>{part.id}</th>
                            <td >
                              <input type="text" name="part_name" placeholder='part name' onChange={handleNameChange} className="text-center h-8 bg-gray-300 border-2 border-black daisy-custom-input"/>
                            </td>
                            <td className={ part.quantity < part.threshold? 'text-red-600' : 'text-black'}>
                              <input type="number" name="part_threshold" placeholder='threshold' onChange={handleThresholdChange} className="text-center h-8 bg-gray-300 border-2 border-black daisy-custom-input"/>
                            </td>
                            <td>
                                <div className="inline-flex">
                                    <button onClick={ handleIncrement } className="flex justify-center items-center text-2xl w-8 h-8 border-2 border-black hover:bg-gray-200">+</button>
                                    <input type="number" name="part_quantity" value={quantityInput} onChange={handleQuantityChange} className="text-center w-10 h-8 bg-gray-300 border-y-2 border-black daisy-custom-input"/>
                                    <button onClick={ handleDecrement } className="flex justify-center items-center text-2xl w-8 h-8 border-2 border-black hover:bg-gray-200">-</button>
                                    <button name="update" className="h-8 ml-4 px-2 border-2 border-black hover:bg-gray-200 w-24 text-center whitespace-nowrap" onClick={(e) => deletePart(part)}>{clickedPartId === part.id? (
                                    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                    </svg>) : ('Delete')}</button>
                                </div>
                            </td>
                        </tr>
  )
}

