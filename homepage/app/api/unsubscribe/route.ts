import { NextResponse } from 'next/server'

const BASEROW_BASE_URL = 'https://api.baserow.io/api/database/rows/table'
const TABLE_ID = '564618'
const FIELDS = {
  email: 'field_4530982',
  status: 'field_4530985'
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body || {}

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const apiToken = process.env.BASEROW_API_TOKEN
    if (!apiToken) {
      return NextResponse.json({ error: 'Missing BASEROW_API_TOKEN' }, { status: 500 })
    }

    // Find the record first
    const searchRes = await fetch(`${BASEROW_BASE_URL}/${TABLE_ID}/?search=${encodeURIComponent(email)}`, {
      headers: {
        'Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!searchRes.ok) {
      const text = await searchRes.text()
      return NextResponse.json({ error: 'Failed to search user', details: text }, { status: 502 })
    }

    const searchData = await searchRes.json()
    const userRecord = (searchData?.results || []).find((record: any) => record[FIELDS.email] === email)
    if (!userRecord) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update status to unsubscribed
    const updateRes = await fetch(`${BASEROW_BASE_URL}/${TABLE_ID}/${userRecord.id}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        [FIELDS.status]: 'unsubscribed'
      })
    })

    if (!updateRes.ok) {
      const text = await updateRes.text()
      return NextResponse.json({ error: 'Failed to update user', details: text }, { status: 502 })
    }

    const data = await updateRes.json()
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ error: 'Unexpected error', details: String(error) }, { status: 500 })
  }
}


