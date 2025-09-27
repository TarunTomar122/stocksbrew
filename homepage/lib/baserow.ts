export const BASEROW_CONFIG = {
  apiToken: process.env.BASEROW_API_TOKEN as string,
  baseUrl: 'https://api.baserow.io/api/database/rows/table',
  tableId: '564618',
  fields: {
    email: 'field_4530982',
    selectedStocks: 'field_4530983',
    subscriptionDate: 'field_4530984',
    status: 'field_4530985',
    market: 'field_4530986'
  }
}

export interface SubscriptionData {
  email: string
  selectedStocks: string[]
  subscriptionDate: string
  status: string
  market: string
}

export async function saveSubscriptionData(data: SubscriptionData) {
  try {
    const response = await fetch(`${BASEROW_CONFIG.baseUrl}/${BASEROW_CONFIG.tableId}/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${BASEROW_CONFIG.apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        [BASEROW_CONFIG.fields.email]: data.email,
        [BASEROW_CONFIG.fields.selectedStocks]: data.selectedStocks.join(','),
        [BASEROW_CONFIG.fields.subscriptionDate]: data.subscriptionDate,
        [BASEROW_CONFIG.fields.status]: data.status,
        [BASEROW_CONFIG.fields.market]: data.market
      })
    })

    if (!response.ok) {
      throw new Error('Failed to save subscription data')
    }

    return await response.json()
  } catch (error) {
    console.error('Error saving subscription data:', error)
    throw error
  }
}

export async function unsubscribeUser(email: string, reason?: string) {
  try {
    // First, find the user record
    const searchResponse = await fetch(`${BASEROW_CONFIG.baseUrl}/${BASEROW_CONFIG.tableId}/?search=${encodeURIComponent(email)}`, {
      headers: {
        'Authorization': `Token ${BASEROW_CONFIG.apiToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!searchResponse.ok) {
      throw new Error('Failed to find user')
    }

    const searchData = await searchResponse.json()
    const userRecord = searchData.results.find((record: any) => 
      record[BASEROW_CONFIG.fields.email] === email
    )

    if (!userRecord) {
      throw new Error('User not found')
    }

    // Update the user record to mark as unsubscribed
    const updateResponse = await fetch(`${BASEROW_CONFIG.baseUrl}/${BASEROW_CONFIG.tableId}/${userRecord.id}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Token ${BASEROW_CONFIG.apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        [BASEROW_CONFIG.fields.status]: 'unsubscribed'
      })
    })

    if (!updateResponse.ok) {
      throw new Error('Failed to update user status')
    }

    return await updateResponse.json()
  } catch (error) {
    console.error('Error unsubscribing user:', error)
    throw error
  }
} 