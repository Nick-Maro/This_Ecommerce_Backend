require('dotenv').config(); 
const express = require('express');
const axios = require('axios');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.API_KEY;


app.use(cors()); 
app.use(express.json()); 


app.get('/api/products', async (req, res) => {
    try {
        const response = await axios.get('https://api.printful.com/store/products', {
            headers: {
                Authorization: `Bearer ${API_KEY}`
            }
        });

       
        res.status(200).json(response.data.result);
    } catch (error) {
        console.error('Errore durante il recupero dei prodotti:', error.message);
        res.status(500).json({
            error: 'Non è stato possibile recuperare i prodotti. Riprova più tardi.'
        });
    }
});

app.post('/api/create-order', async (req, res) => {
    try {
        console.log('Dati ricevuti dal frontend:', req.body);  

        const { recipient, items, source } = req.body;

        
        if (!recipient || !items || !source) {
            console.error('Dati incompleti:', req.body);
            return res.status(400).json({ error: 'Dati incompleti per l\'ordine.' });
        }

        
        const formattedItems = items.map(item => ({
            product_id: item.product,
            external_variant_id: item.external_variant_id,  
            variant_id: item.variant_id,  
            quantity: item.quantity,
        }));

        
        const response = await axios.post('https://api.printful.com/orders', {
            recipient,
            items: formattedItems,
            source
        }, {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
            }
        });

        console.log('Risposta da Printful:', response.data);
        res.status(200).json(response.data);

    } catch (error) {
        console.error('Errore durante l\'invio dell\'ordine:', error.message);

        
        if (error.response) {
            console.error('Errore da Printful:', error.response.data);
            res.status(500).json({ message: 'Errore da Printful', error: error.response.data });
        } else {
            res.status(500).json({ message: 'Errore interno del server', error: error.message });
        }
    }
});



app.get('/api/products/:id', async (req, res) => {
    const productId = req.params.id;

    try {
       
        const response = await axios.get(`https://api.printful.com/sync/products/${productId}`, {
            headers: {
                Authorization: `Bearer ${API_KEY}`
            }
        });

        const productData = response.data.result.sync_product;

       
        const variants = response.data.result.sync_variants.map(variant => ({
            id: variant.id, 
            size: variant.name.split(' / ')[1], 
            price: parseFloat(variant.retail_price), 
            image: variant.product.image, 
            variant_id: variant.variant_id,
            external_variant_id: variant.external_id,
        }));

       
        res.status(200).json({
            id: productData.id,
            name: productData.name,
            description: productData.description || 'Descrizione non disponibile',
            price: parseFloat(productData.retail_price), 
            thumbnail_url: productData.thumbnail_url, 
            variants: variants, 
        });
    } catch (error) {
        console.error('Errore durante il recupero del prodotto:', error.message);
        if (error.response) {
            console.error('Errore da Printful:', error.response.data);
            res.status(500).json({ message: 'Errore da Printful', error: error.response.data });
        } else {
            res.status(500).json({ message: 'Errore interno del server', error: error.message });
        }
    }
});





app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});
