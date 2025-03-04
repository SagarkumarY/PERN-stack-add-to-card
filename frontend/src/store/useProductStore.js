import { create } from "zustand";
import axios from "axios";
import { toast } from 'react-hot-toast'



// ✅ Base url will be dynamic depending on environment
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : ""; 


// ✅ Zustand store for managing products
export const useProductStore = create((set, get) => ({
    // 🔹 Initial state
    products: [],
    loading: false,
    error: null,

    currentProduct: null,

    // form state
    formData: {
        name: "",
        price: "",
        image: "",
    },

    setFormData: (formData) => set({ formData }),
    resetFormData: () => set({ formData: { name: "", price: "", image: "" } }),

    // ✅ Function to create a new product
    addProduct: async (e) => {
        e.preventDefault();
        set({ loading: true })
        try {
            const { formData } = get();
            // check if all filed all file
            if (!formData.name || !formData.price || !formData.image) {
                toast.error("Please fill all fields")
                return;
            }
            await axios.post(`${BASE_URL}/api/products`, formData); // Create new product
            await get().fetchProducts();
            get().resetFormData();
            toast.success("Product added successfully");
            document.getElementById("add_product_modal").close()
        } catch (error) {
            console.error("Add Product Error:", error);
            toast.error("Error adding product")
        } finally {
            set({ loading: false }) // Stop loading
        }
    },


    // ✅ Function to fetch products from API
    fetchProducts: async () => {
        set({ loading: true, error: null }); // Start loading

        try {
            const response = await axios.get(`${BASE_URL}/api/products`); // Fetch products

            set({ products: response.data.data, error: null }); // ✅ Store data in state

        } catch (error) {
            console.error("Fetch Products Error:", error);

            // ✅ Correct error handling (Check if response exists)
            const status = error.response?.status;
            if (status === 429) {
                set({ error: "Rate limit exceeded", products: [] });
            } else {
                set({ error: "Something went wrong", products: [] });
            }
        } finally {
            set({ loading: false }); // Stop loading
        }
    },

    // ✅ Function to delete a product (backend handles logic)
    deleteProduct: async (id) => {
        set({ loading: true }); // 🔹 Start loading

        try {
            await axios.delete(`${BASE_URL}/api/products/${id}`); // 🔹 Send delete request
            set({ error: null });
            set(prev => ({ products: prev.products.filter(product => product.id !== id) }));
            toast.success("Product deleted successfully!");

        } catch (error) {
            console.error("❌ Delete Product Error:", error);
            toast.error("�� Failed to delete product. Please try again.");
            set({ error: "❌ Failed to delete product. Please try again." });
        } finally {
            set({ loading: false }); // 🔹 Stop loading
        }
    },


    // Fetch single product using id
    fetchProduct: async (id) => {
        set({ loading: true }); // Start loading


        try {
            const response = await axios.get(`${BASE_URL}/api/products/${id}`);
            set({ currentProduct: response.data.data, formData: response.data.data, error: null }); // Store data in state

        } catch (error) {
            console.error("Fetch Product Error:", error);
            set({ error: "Something went wrong", currentProduct: null }); // Store error in state
        } finally {
            set({ loading: false }); // Stop loading
        }
    },


    // Update product using id
    updateProduct: async (id) => {
        set({ loading: true }); // Start loading


        try {
            const { formData } = get();
            const response = await axios.put(`${BASE_URL}/api/products/${id}`, formData);
            set({ currentProduct: response.data.data })
            toast.success("Product updated successfully!");
        } catch (error) {
            console.error("Update Product Error:", error);
            toast.error("Failed to update product. Please try again.");

        } finally {
            set({ loading: false }); // Stop loading
        }
    },


}));