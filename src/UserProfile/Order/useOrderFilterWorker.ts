import { useEffect, useRef, useState } from 'react'
import { filterOrders, type ProfileOrderItem } from './orderUtils'
import OrderFilterWorker from './orderFilter.worker.ts?worker'

const createWorker = () => {
  return new OrderFilterWorker()
}

export const useOrderFilterWorker = <T extends ProfileOrderItem>(
  orders: T[],
  statusFilter: string,
  keyword: string,
) => {
  const workerRef = useRef<Worker | null>(null)
  const [filteredOrders, setFilteredOrders] = useState<T[]>(() =>
    filterOrders(orders, statusFilter, keyword),
  )

  useEffect(() => {
    if (!workerRef.current) {
      workerRef.current = createWorker()
    }
    const worker = workerRef.current
    const handleMessage = (event: MessageEvent<T[]>) => {
      setFilteredOrders(event.data)
    }
    worker.addEventListener('message', handleMessage)
    worker.postMessage({ orders, statusFilter, keyword })
    return () => {
      worker.removeEventListener('message', handleMessage)
    }
  }, [orders, statusFilter, keyword])

  useEffect(() => {
    return () => {
      workerRef.current?.terminate()
      workerRef.current = null
    }
  }, [])

  return filteredOrders
}
