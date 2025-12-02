import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';  // You can add styling in App.css

const API_BASE_URL = 'http://localhost:5075/api/products'; // Replace with your .NET API URL

function App() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: 0 });
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({ id: null, name: '', price: 0 });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("test");
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message || 'Failed to fetch products.');
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditedProduct({ ...editedProduct, [name]: value });
  };

  const createProduct = async () => {
    try {
      await axios.post(API_BASE_URL, newProduct);
      setNewProduct({ name: '', price: 0 }); // Clear the form
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error('Error creating product:', error);
      setError(error.response?.data || error.message || 'Failed to create product.');
    }
  };

  const startEditing = (product) => {
    setEditingProductId(product.id);
    setEditedProduct({ ...product }); // Initialize editedProduct with the product being edited
  };

  const cancelEditing = () => {
    setEditingProductId(null);
    setEditedProduct({ id: null, name: '', price: 0 }); // Reset editedProduct
  };

  const updateProduct = async () => {
    try {
      await axios.put(`${API_BASE_URL}/${editedProduct.id}`, editedProduct);
      setEditingProductId(null);
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      setError(error.response?.data || error.message || 'Failed to update product.');
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      setError(error.response?.data || error.message || 'Failed to delete product.');
    }
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error...: {error}</div>;
  }

  return (
    <div className="App">
      <h1>Product Management</h1>

      {/* Error Display */}
      {error && <div className="error-message">{error}</div>}

      {/* Product List */}
      <h2>Product List</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {editingProductId === product.id ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={editedProduct.name}
                  onChange={handleEditInputChange}
                />
                <input
                  type="number"
                  name="price"
                  value={editedProduct.price}
                  onChange={handleEditInputChange}
                />
                <button onClick={updateProduct}>Save</button>
                <button onClick={cancelEditing}>Cancel</button>
              </>
            ) : (
              <>
                {product.name} - ${product.price}
                <button onClick={() => startEditing(product)}>Edit</button>
                <button onClick={() => deleteProduct(product.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Create Product Form */}
      <h2>Create New Product</h2>
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={newProduct.name}
        onChange={handleInputChange}
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={newProduct.price}
        onChange={handleInputChange}
      />
      <button onClick={createProduct}>Create</button>
    </div>
  );
}

export default App;