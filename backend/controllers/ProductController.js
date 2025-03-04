import { sql } from "../config/db.js"; // Import the database connection

// ✅ Function to fetch all products
export const getProducts = async (req, res) => {
    try {
        // Fetch all products ordered by creation date (descending order)
        const products = await sql`SELECT * FROM products ORDER BY created_at DESC`;

        // console.log("Fetched products:", products);
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.error("❌ Error fetching products:", error);
        res.status(500).json({ success: false, message: "Error fetching products" });
    }
};

// ✅ Function to fetch a single product by ID
export const getProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: "Missing product ID" });
        }

        // Fetch product by ID
        const product = await sql`SELECT * FROM products WHERE id = ${id}`;

        if (product.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        console.log("Fetched product:", product[0]);
        res.status(200).json({ success: true, data: product[0] });
    } catch (error) {
        console.error("❌ Error fetching product:", error);
        res.status(500).json({ success: false, message: "Error fetching product" });
    }
};

// ✅ Function to create a new product
export const createProduct = async (req, res) => {
    try {
        const { name, image, price } = req.body;

        if (!name || !image || !price) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Insert new product into database and return the created product
        const newProduct = await sql`
            INSERT INTO products (name, image, price)
            VALUES (${name}, ${image}, ${price})
            RETURNING *;
        `;

        console.log("Created product:", newProduct[0]);
        res.status(201).json({ success: true, data: newProduct[0] });
    } catch (error) {
        console.error("❌ Error creating product:", error);
        res.status(500).json({ success: false, message: "Error creating product" });
    }
};

// ✅ Function to update an existing product
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, image, price } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: "Missing product ID" });
        }

        if (!name && !image && !price) {
            return res.status(400).json({ success: false, message: "At least one field is required to update" });
        }

        // Update product fields if provided, and return the updated product
        const updatedProduct = await sql`
            UPDATE products 
            SET 
                name = COALESCE(${name}, name), 
                image = COALESCE(${image}, image), 
                price = COALESCE(${price}, price)
            WHERE id = ${id} 
            RETURNING *;
        `;

        if (updatedProduct.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        console.log("Updated product:", updatedProduct[0]);
        res.status(200).json({ success: true, data: updatedProduct[0] });
    } catch (error) {
        console.error("❌ Error updating product:", error);
        res.status(500).json({ success: false, message: "Error updating product" });
    }
};

// ✅ Function to delete a product by ID
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: "Missing product ID" });
        }

        // Delete product and return the deleted item (to confirm deletion)
        const deletedProduct = await sql`
            DELETE FROM products WHERE id = ${id} RETURNING *;
        `;

        if (deletedProduct.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        console.log("Deleted product with ID:", id);
        res.status(200).json({ success: true, message: "Product deleted" });
    } catch (error) {
        console.error("❌ Error deleting product:", error);
        res.status(500).json({ success: false, message: "Error deleting product" });
    }
};
