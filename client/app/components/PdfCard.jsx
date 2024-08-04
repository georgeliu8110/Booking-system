import {useState, useEffect} from 'react'
import {CgFileDocument} from 'react-icons/cg'
import {HiOutlineDownload, HiOutlinePrinter} from 'react-icons/hi'
import {FiShare2} from 'react-icons/fi'
import AdminAppInvoice from './AdminAppInvoice'
import {PDFDownloadLink} from '@react-pdf/renderer'
import {BlobProvider} from '@react-pdf/renderer'
import { saveAs } from "file-saver";

const PdfCard = ({title, appointment, appDetail}) => {

    const [loading, setLoading] = useState(false)
    const [invoiced, setInvoiced ] = useState(false)

    useEffect(() => {
      if (appointment.status === 'Invoiced') {
          setInvoiced(true);
      }
  }, [appointment.status]);

    const styles = {
        container : {  width:'450px',  borderRadius : '5px',  padding:'15px 12px',  display:'flex',  flexDirection:'column',  gap:'15px',  boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)"},
        flex : { width:'100%', display:'flex', gap:'5px', alignItems:'center' },
        bold : { fontSize:'13px', fontWeight: 600},
        thin : {  fontSize:'15px',  color:'#6f6f6f',  fontWeight: 500 },
        btn:{ borderRadius : '3px', border:'1px solid gray', display : 'flex', alignItems :'center', gap:'2px', padding : '3px', fontSize:'11px', color:'#4f4f4f', fontWeight: 600, cursor:'pointer', userSelect:'none'}
    }

    const handleShare = async (blob) => {
      await saveAs(blob, `invoice.pdf`);
      window.location.href = `mailto:?subject=${encodeURIComponent(`Invoice`)}&body=${encodeURIComponent(`Kindly find attached invoice`)}`;
  }

    const handlePrint = (url) => {
      const printWindow = window.open(url, '_blank');
      printWindow.onload = () => {
        printWindow.print();
      };
    };

    const uploadPDFToFirebase = async (blob) => {

      setLoading(true);
      const formData = new FormData();
      formData.append('invoice', blob);
      formData.append('invoiceBalance', 300);
      formData.append('appId', appointment.appId);
      formData.append('email', appointment.email);

       try {
        const response = await fetch('/api/invoice', {
          method: 'POST',
          body: formData,
        })
        if (!response.ok) {
          throw Error('Failed to upload PDF');
        }
        const data = await response.json();
        console.log('PDF uploaded successfully', data)

        const statusRes = await fetch('/api/updateStatus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: appointment.email,
            appId: appointment.appId,
            status: 'Invoiced',
          }
          )
        })
        setInvoiced(true);

      } catch (error) {
        console.error('Failed to upload PDF', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
        <div style={styles.flex}>
            <CgFileDocument color='#90e0ef' size={20}/>
            <span style={styles.bold}>{title}</span>
        </div>

        <BlobProvider document={<AdminAppInvoice appointment={appointment} appDetail={appDetail}/>}>
              {({ url, blob }) => (
                <button className='btn btn-secondary my-10 mx-10' onClick={() => uploadPDFToFirebase(blob)} disabled={invoiced}>
                  {!loading ? 'Generate Invoice for This Appointment' : <span className="loading loading-dots loading-md"></span>}
                 </button>
              )}
            </BlobProvider>
        {invoiced && (
          <>
          <div role="alert" className="alert alert-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Invoice has been generated! Please select below options to handle the invoice</span>
        </div>
          <div style={{...styles.flex, ...{justifyContent:'space-between'}}}>
           <PDFDownloadLink document={<AdminAppInvoice appointment={appointment} appDetail={appDetail}/>} fileName='invoice.pdf'>
           <button className="btn btn-primary">
            <HiOutlineDownload size={14}/>
                <span>Download</span>
            </button>
            </PDFDownloadLink>

            <BlobProvider document={<AdminAppInvoice appointment={appointment} appDetail={appDetail}/>}>
              {({ url, blob }) => (
                <button className="btn btn-primary" onClick={() => handlePrint(url)} >
                  <div className='flex gap-2 w-20 items-center justify-center'>
                    <HiOutlinePrinter size={14}/>
                    <span>Print</span>
                  </div>
                 </button>
              )}
            </BlobProvider>

            <BlobProvider document={<AdminAppInvoice appointment={appointment} appDetail={appDetail}/>}>
              {({ url, blob }) => (
                <button className="btn btn-primary">
                <div onClick={() => handleShare(url, blob)} className='flex gap-2 w-20 items-center justify-center'>
                    <FiShare2 size={14} />
                    <span>Share</span>
                </div>
                </button>
              )}
            </BlobProvider>
        </div>
          </>
          )}
    </div>
  )
}

export default PdfCard