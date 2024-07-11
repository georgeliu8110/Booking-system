import { storage } from '@/app/lib/firebase/config';
import { ref, uploadBytes} from 'firebase/storage';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ImageUpload from './ImageUpload';

export default function AppDetails({setCustomerInput, customerInput}) {

  const [image, setImage] = useState(null);

  const detailInputHandler = (e) => {
    setCustomerInput((prev) => ({ ...prev, detail: e.target.value}));
  }

  const handleImageUpload = () => {
    const imageRef = ref(storage, `images/${uuidv4()}`);
    uploadBytes(imageRef, image)
  }

  return (
    <>
    <h1 className="text-3xl font-bold py-20">TELL US MORE</h1>
    <textarea className="textarea textarea-bordered min-w-full pb-10 mb-10" placeholder="Please tell us more about your plumbing issues (optional)" onChange={detailInputHandler} value={customerInput.detail}></textarea>
    <ImageUpload setCustomerInput={setCustomerInput} customerInput={customerInput}/>
    </>
  )
}