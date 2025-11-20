
async function testStoicEndpoint() {
    try {
        const response = await fetch('http://localhost:3000/api/stoic', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'user', content: 'What is the nature of the universe?' }]
            }),
        });

        if (!response.ok) {
            console.error('Response not ok:', response.status, response.statusText);
            return;
        }

        // Simple text fetch to verify content
        const text = await response.text();
        console.log('Full response text:', text);

    } catch (error) {
        console.error('Error:', error);
    }
}

testStoicEndpoint();
