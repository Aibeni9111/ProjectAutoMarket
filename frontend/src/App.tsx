import { useEffect, useState } from 'react'
import { api } from './lib/api'
import type { AxiosResponse } from 'axios'

type Health = string;

export default function App() {
    const [health, setHealth] = useState('checking...')

    useEffect(() => {
        let mounted = true
        ;(async () => {
            try {
                const res: AxiosResponse<Health> = await api.get('/health')
                if (mounted) setHealth(res.data)
            } catch {
                if (mounted) setHealth('failed')
            }
        })()
        return () => { mounted = false }
    }, [])

    return (
        <div style={{fontFamily:'system-ui', padding:24}}>
            <h1>AutoMarket</h1>
            <p>Backend health: <b>{health}</b></p>
            <p><a href="/api/swagger" target="_blank" rel="noreferrer">Open Swagger</a></p>
        </div>
    )
}
