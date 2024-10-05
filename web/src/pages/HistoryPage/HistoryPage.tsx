import { Metadata } from '@redwoodjs/web'

import HistoriesCell from 'src/components/HistoriesCell'

const HistoryPage = () => {
  return (
    <>
      <Metadata title="History" description="History of job runs" />
      <HistoriesCell />
    </>
  )
}

export default HistoryPage
