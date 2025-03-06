const axios = require('axios');

const PRINTFUL_API_URL = 'https://api.printful.com/orders';  
const API_KEY = process.env.API_KEY;

const testCases = [
    {
        description: 'Test di Base - Dati corretti',
        data: {
            recipient: {
                name: "Mario Rossi",
                address1: "Via Roma 123",
                city: "Milano",
                state_code: "MI",
                country_code: "IT",
                zip: "20100",
                email: "mario.rossi@example.com",
                phone: "1234567890"
            },
            items: [
                {
                    product_id: 371384193,  
                    external_variant_id: "6776e6b22c6b94", 
                    variant_id: 11577,
                    quantity: 1
                }
            ],
            source: "store"
        },
        expectedStatus: 200
    },
    {
        description: 'Test di Errori nei Dati - Mancano i Dati',
        data: {
            recipient: {
                name: "Mario Rossi",
                address1: "Via Roma 123",
                city: "Milano",
                state_code: "MI",
                country_code: "IT",
                zip: "20100",
                email: "mario.rossi@example.com",
                phone: "1234567890"
            },
            source: "store"
        },
        expectedStatus: 400
    },
    {
        description: 'Test con Varianti Non Valide',
        data: {
            recipient: {
                name: "Mario Rossi",
                address1: "Via Roma 123",
                city: "Milano",
                state_code: "MI",
                country_code: "IT",
                zip: "20100",
                email: "mario.rossi@example.com",
                phone: "1234567890"
            },
            items: [
                {
                    product_id: 371589854,
                    external_variant_id: 1234567890, 
                    quantity: 1
                }
            ],
            source: "store"
        },
        expectedStatus: 500
    },
    {
        description: 'Test con Quantità Negativa',
        data: {
            recipient: {
                name: "Mario Rossi",
                address1: "Via Roma 123",
                city: "Milano",
                state_code: "MI",
                country_code: "IT",
                zip: "20100",
                email: "mario.rossi@example.com",
                phone: "1234567890"
            },
            items: [
                {
                    product_id: 371589854,
                    external_variant_id: 4675476684,
                    quantity: -1  
                }
            ],
            source: "store"
        },
        expectedStatus: 400
    },
    {
        description: 'Test con Dati Incompleti nel Corpo della Richiesta',
        data: {
            recipient: {
                name: "Mario Rossi",
                address1: "Via Roma 123",
                city: "Milano",
                state_code: "MI",
                country_code: "IT",
                zip: "20100",
                phone: "1234567890"
            },
            items: [
                {
                    product_id: 371589854,
                    external_variant_id: 4675476684,
                    quantity: 1
                }
            ],
            source: "store"
        },
        expectedStatus: 400
    },
    {
        description: 'Test con Dati Corrotti o Formato Errato',
        data: {
            recipient: "Mario Rossi",
            items: "invalid_data",
            source: "store"
        },
        expectedStatus: 400
    }
];

async function runTests() {
    for (const testCase of testCases) {
        try {
            console.log(`Eseguendo test: ${testCase.description}`);

            
            const response = await axios.post(PRINTFUL_API_URL, testCase.data, {
                headers: {
                    Authorization: `Bearer ${API_KEY}`, 
                }
            });

            if (response.status === testCase.expectedStatus) {
                console.log(`Test PASSED: Status ${response.status}`);
            } else {
                console.error(`Test FAILED: Expected status ${testCase.expectedStatus}, but got ${response.status}`);
            }
        } catch (error) {
            if (error.response && error.response.status === testCase.expectedStatus) {
                console.log(`Test PASSED: Status ${error.response.status}`);
            } else {
                console.error(`Test FAILED: Expected status ${testCase.expectedStatus}, but got ${error.response ? error.response.status : 'no response'}`);
            }
        }
    }
}

runTests();
