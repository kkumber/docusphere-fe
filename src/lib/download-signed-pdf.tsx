import api from '@/lib/api'

export const downloadSignedPdf = async (
  cloudPdfUrl: string,
  assignmentId: number,
  documentTitle: string,
) => {
  const response = await api.get('/api/download-signed-official', {
    params: {
      cloud_pdf_url: cloudPdfUrl,
      assignment_id: assignmentId,
    },
    responseType: 'blob', // important!
  })

  // create blob url
  const url = window.URL.createObjectURL(
    new Blob([response.data], { type: 'application/pdf' }),
  )
  const a = document.createElement('a')
  a.href = url
  a.download = `${documentTitle}.pdf` // filename for the download
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.URL.revokeObjectURL(url)
}
