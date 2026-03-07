import api from './api'

export const downloadMonthlyReport = async () => {
  const response = await api.get('/api/download/monthly-report', {
    responseType: 'blob',
  })
  const url = window.URL.createObjectURL(
    new Blob([response.data], { type: 'application/pdf' }),
  )
  const a = document.createElement('a')
  a.href = url
  a.download = 'monthly-report.pdf'
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.URL.revokeObjectURL(url)
}
