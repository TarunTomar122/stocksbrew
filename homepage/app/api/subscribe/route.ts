import { NextResponse } from 'next/server'

const BASEROW_BASE_URL = 'https://api.baserow.io/api/database/rows/table'
const TABLE_ID = '564618'
const FIELDS = {
  email: 'field_4530982',
  selectedStocks: 'field_4530983',
  subscriptionDate: 'field_4530984',
  status: 'field_4530985',
  market: 'field_4530986'
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, selectedStocks, market = 'indian' } = body || {}

    if (!email || !Array.isArray(selectedStocks) || selectedStocks.length === 0) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const apiToken = process.env.BASEROW_API_TOKEN
    if (!apiToken) {
      return NextResponse.json({ error: 'Missing BASEROW_API_TOKEN' }, { status: 500 })
    }

    const res = await fetch(`${BASEROW_BASE_URL}/${TABLE_ID}/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        [FIELDS.email]: email,
        [FIELDS.selectedStocks]: selectedStocks.join(', '),
        [FIELDS.subscriptionDate]: new Date().toISOString().split('T')[0],
        [FIELDS.status]: 'active',
        [FIELDS.market]: market
      })
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: 'Failed to save subscription', details: text }, { status: 502 })
    }

    const data = await res.json()
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ error: 'Unexpected error', details: String(error) }, { status: 500 })
  }
}


