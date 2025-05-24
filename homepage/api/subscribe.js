export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Forward the request to EC2
        const response = await fetch('http://3.86.189.0:5000/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
        });
        
        // Get the response data
        const data = await response.json();
        
        // Forward the status and response from EC2
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Subscription error:', error);
        res.status(500).json({ 
            error: 'Failed to process subscription',
            message: error.message 
        });
    }
} 