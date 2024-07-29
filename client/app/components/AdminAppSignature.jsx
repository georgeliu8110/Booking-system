import SignatureCanvas from 'react-signature-canvas';
import { useState, useRef } from 'react';

export default function AdminAppSignature({saveSingatureHandler, loading, success}) {

  const signRef = useRef(null);

  const handleClear = () => {
    signRef.current.clear();
  }

  const handleSave = () => {
    const dataUrl = signRef.current.getCanvas().toBlob((blob) => {
       saveSingatureHandler(blob)
    }, 'image/png');

  }

  return (
    <div className='flex'>
      <div className='border-black border-solid border-2'>
        <SignatureCanvas
          penColor='black'
          ref={signRef}
          canvasProps={{width: 400, height: 200, className: 'sigCanvas'}}/>
      </div>
      <div className='mx-3 '>
        <button class="btn btn-active btn-secondary mb-3 w-16" onClick={handleClear}>Clear</button>
        <button class="btn btn-active btn-secondary w-16 " onClick={handleSave}>{loading ? <span className="loading loading-dots loading-sm"></span> : 'Save'}</button>
      </div>
    </div>
  )
}