'use client'
import useGetParts from "@/app/_hooks/part-api/useGetParts";
import useUpdatePart from "@/app/_hooks/part-api/useUpdatePart";
import { partsAttributes } from "@/constants"
import { useEffect, useState } from "react";
import NewInvInput from '@/app/components/NewInvInput';
// import { uuidv4 } from '@/app/utility/uuidv4';

export default function InventoryPage() {
    const [partsData, setPartsData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const { data: partsDataFromApi, isLoading: partsDataLoading, error: partsDataError } = useGetParts(false, [refreshTrigger]);
    const {updatePart, error: updatePartsError, isLoading: updatePartsLaoding} = useUpdatePart();
    const [clickedPartId, setClickedPartId] = useState(null);
    const [updateMessage, setUpdateMessage] = useState(null);
    const [defaultPartInputFileds, setDefaultPartInputFields] = useState([{id: '', name:'', quantity:0, threshold:0}]);
    const [searchInput, setSearchInput] = useState('')

    const inventoryPerPage = 6;
    const indexOfLastInventory = currentPage * inventoryPerPage;
    const indexOfFirstInventory = indexOfLastInventory - inventoryPerPage;
    let currentInventory = partsData.slice(indexOfFirstInventory, indexOfLastInventory);
    let totalPages = Math.ceil(partsData.length / inventoryPerPage);

    useEffect(() => {
       const searchResultById = partsDataFromApi.filter((part) => part.id.includes(searchInput))
       const searchResultByName = partsDataFromApi.filter((part) => part.name.toLowerCase().includes(searchInput))
       const finalResult = [...searchResultById, ...searchResultByName]
       setPartsData(finalResult);
       setCurrentPage(1);
       currentInventory = partsData.slice(indexOfFirstInventory, indexOfLastInventory);
       totalPages = Math.ceil(partsData.length / inventoryPerPage);
    }, [searchInput])

    useEffect(() => {
        if (partsDataFromApi && partsDataFromApi.length > 0) {
            setPartsData(partsDataFromApi);
            const nextId = String(Number(partsDataFromApi[partsDataFromApi.length - 1]?.id.split('p')[1]) + 1);
            setDefaultPartInputFields(prev => prev[0].id === ''? [{...prev[0], id: 'p' + nextId}]: prev )
        }
    }, [partsDataFromApi, refreshTrigger]);

    const handleSearchPart = (e) => {
       setSearchInput(e.target.value);
    }

    const updateParts = async (part) => {
        try{
            setClickedPartId(part.id);
            setUpdateMessage('Updating...');
            await updatePart(part);
            setUpdateMessage('Updated!');

            setTimeout(() => {
                setUpdateMessage(null);
                setClickedPartId(null);
            }, 1000)

        } catch(error){
            console.error('error posting parts data to api : ', error)
        }
    }

    const deletePart = (newPart) => {
        setDefaultPartInputFields((prevData) => prevData.filter((part) => part.id !== newPart.id))
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleQuantityChange = (e, partId, delta = 0) => {
        const value = Math.max(0, parseInt(e.target.parentElement.querySelector('input[name="quantity"]').value) + delta)
        setPartsData((prevData) => prevData.map((part) => part.id === partId ? { ...part, quantity: value } : part))
    }


    const addDefaultPartInputFileds = () => {
        setDefaultPartInputFields(prev => {
          return [...prev, {id: prev.length >= 1? ('p' + (+prev[prev.length - 1]?.id.split('p')[1] + 1)) : ('p' + (+partsDataFromApi[partsDataFromApi.length - 1]?.id.split('p')[1] + 1)), name:'', quantity:0, threshold:0}]
        })
    }

    const handleAddNewInvData = (index, newInv) => {
        setDefaultPartInputFields(prev => {
          const invlist = [...prev];
            invlist[index] = newInv;
            return invlist;
       }
       )
    }

    const handleSubmit = async (defaultPartInputFileds) => {
        try {
            const response = await fetch('/api/parts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(defaultPartInputFileds)
            });

            if (response.ok) {
                setTimeout(() => {
                    setDefaultPartInputFields(prev => [{ id: 'p' + (+prev[prev.length - 1]?.id.split('p')[1] + 1), name: '', quantity: 0, threshold: 0 }]);
                    setRefreshTrigger(prev => prev + 1)
                }, 500)

            }
        } catch (error) {
            console.error('error posting parts data to api : ', error)
    }
   }

    return (
        <>

        <div className="w-full border-2 border-black m-4 p-6 rounded-xl">
            <h1 className="text-center pb-6 font-bold">Inventory</h1>
            <label className="input input-bordered flex items-center gap-2 max-w-screen-sm h-10 mb-5">
            <input type="text" className="grow" placeholder="Search Inventory by id or name" onChange = {handleSearchPart}/>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
            </label>
            <table className="table text-center">
                <thead>
                    <tr className="text-black border-2 border-black">
                        {partsAttributes.map((item, index) => <th className="text-gray-500 uppercase dark:text-white" key={index}>{item}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {currentInventory.map((part, index) => {
                        return (
                        <tr key={part.id}  className="border-gray-300 text-black font-medium dark:text-white">
                            <th className={ `${part.quantity < part.threshold? 'text-red-600' : 'text-black'} dark:text-white`}>{part.id}</th>
                            <td className={ `${part.quantity < part.threshold? 'text-red-600' : 'text-black'} dark:text-white`}>{part.name}</td>
                            <td className={ `${part.quantity < part.threshold? 'text-red-600' : 'text-black'} dark:text-white`}>{part.threshold}</td>
                            <td>
                                <div className="inline-flex">
                                    <button onClick={ (e) => handleQuantityChange(e, part.id, 1) } className="flex justify-center items-center text-2xl w-8 h-8 border-2 border-black hover:bg-gray-200">+</button>
                                    <input type="number" name="quantity" value={part.quantity} onChange={ (e) => handleQuantityChange(e, part.id)} className="text-center w-10 h-8 bg-gray-300 border-y-2 border-black daisy-custom-input"/>
                                    <button onClick={ (e) => handleQuantityChange(e, part.id, -1) } className="flex justify-center items-center text-2xl w-8 h-8 border-2 border-black hover:bg-gray-200">-</button>
                                    <button name="update" className="h-8 ml-4 px-2 border-2 border-black hover:bg-gray-200 w-24 text-center whitespace-nowrap" onClick={(e) => updateParts(part)}>{clickedPartId === part.id? (
                                    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                    </svg>) : ('Update')}</button>
                                    <p className='w-10 pl-6'>{(clickedPartId === part.id)? updateMessage : undefined}</p>
                                </div>
                            </td>
                        </tr>
                    )})}
                </tbody>
            </table>

            <div className="flex items-center justify-between mt-4">
                <div className="flex-1">
                    {currentPage > 1 && (<button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="mr-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg flex items-center justify-center">Previous</button>)}
                </div>
                <div className="flex flex-1 justify-end">
                    {currentPage < totalPages && (<button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="self-end ml-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg flex justify-center">Next</button>)}
                </div>
            </div>
        </div>
        {/* ========= */}
        <div className="w-full border-2 border-black mx-4 my-8 p-6 rounded-xl">
            <h1 className="text-center pb-6 font-bold">Add New Inventory</h1>
            <table className="table text-center">
                <thead>
                    <tr className="text-black border-2 border-black">
                        {partsAttributes.map((item, index) => <th className="text-gray-500 uppercase dark:text-white" key={index}>{item}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {defaultPartInputFileds.map((part, index) => {
                        return (
                        <NewInvInput part={part} deletePart={deletePart} clickedPartId={clickedPartId} index={index} addNewParts={(updatedPart) => handleAddNewInvData(index, updatedPart)}/>
                    )})}
                </tbody>
            </table>
            <div className='flex justify-between'>
                    <div className='flex'>
                        <button className="btn mt-6 " onClick={(e)=>addDefaultPartInputFileds()} >More inventory to add
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
                        </button>
                    </div>
                    <div>
                      <button className="btn mt-6" onClick={()=>handleSubmit(defaultPartInputFileds)} >Submit</button>
                    </div>
                </div>
        </div>
        </>
    )
}


