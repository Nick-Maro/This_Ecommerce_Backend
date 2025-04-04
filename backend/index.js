const axios = require('axios');


const API_KEY = process.env.API_KEY;


const BACKEND_URL = 'http://localhost:3000/api/products';  

async function getProductList() {
    try {
        const response = await axios.get(BACKEND_URL);
        return response.data; 
    } catch (error) {
        console.error('Errore nel recupero della lista dei prodotti:', error.response?.data || error.message);
        throw error;
    }
}

async function createOrder(productId, externalVariantId, recipient) {
    try {
        const orderResponse = await axios.post('https://api.printful.com/orders', {
            recipient, 
            "items": [
                {
                  "external_variant_id": "123456789",  
                  "quantity": 1,                        
                  "product_id": 987654321,               
                  "variant_id": 987654322,               
                  "retail_price": 19.99                  
                }
              ],
            source: "store" 
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`, 
            }
        });

        
        console.log('Ordine creato con successo:', orderResponse.data);
    } catch (error) {
        
        console.error('Errore durante la creazione dell\'ordine:', error.response?.data || error.message);
    }
}

async function main() {
    try {
        
        const products = await getProductList();

        
        const product = products[0];
        const variant = product.variants[0];

        
        const recipient = {
            name: 'Mario Rossi',
            address1: 'Via Roma 123',
            city: 'Milano',
            state_code: 'MI',
            country_code: 'IT',
            zip: '20100'
        };

       
        await createOrder(product.id, variant.external_variant_id, recipient);
    } catch (error) {
        console.error('Errore generale:', error.message);
    }
}


main();
