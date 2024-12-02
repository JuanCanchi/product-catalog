import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";

const ProductForm = () => {
    const { id } = useParams();
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        categories: [],
        image: "",
    });
    const navigate = useNavigate();
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        if (id) {
            fetchProduct(id);
        }
    }, [id]);

    const fetchProduct = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/products/${id}`);
            setProduct(response.data);
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleCategoryChange = (e) => {
        const { value } = e.target;
        setProduct({
            ...product,
            categories: value.split(",").map((category) => category.trim()),
        });
    };

    const handleImageChange = (e) => {
        const { files } = e.target;
        if (files.length > 0) {
            const file = files[0];
            setProduct({ ...product, image: file.name });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const priceFloat = parseFloat(product.price);

        if (isNaN(priceFloat)) {
            console.error("El precio debe ser un número válido.");
            return;
        }

        const productData = {
            ...product,
            price: priceFloat,
            categories: product.categories,
            image_url: product.image,
        };

        try {
            if (id) {
                await axios.put(`http://localhost:8080/api/v1/products/${id}`, productData);
            } else {
                await axios.post("http://localhost:8080/api/v1/products", productData);
            }
            navigate("/");
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    return (
        <Container>
            <h2>{id ? "Editar Producto" : "Nuevo Producto"}</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formName" className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        placeholder="Nombre"
                        value={product.name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formDescription" className="mb-3">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="description"
                        placeholder="Descripción"
                        rows={3}
                        value={product.description}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formPrice" className="mb-3">
                    <Form.Label>Precio</Form.Label>
                    <Form.Control
                        type="number"
                        name="price"
                        placeholder="Precio"
                        value={product.price}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formCategories" className="mb-3">
                    <Form.Label>Categorías</Form.Label>
                    <Form.Control
                        type="text"
                        name="categories"
                        placeholder="Categorías (separadas por comas)"
                        value={product.categories.join(", ")}
                        onChange={handleCategoryChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formImage" className="mb-3">
                    <Form.Label>Imagen</Form.Label>
                    <Form.Control type="file" name="image" onChange={handleImageChange} />
                    {previewImage && (
                        <div className="mt-3">
                            <img
                                src={previewImage}
                                alt="Previsualización"
                                style={{ maxWidth: "200px", maxHeight: "200px" }}
                            />
                        </div>
                    )}
                </Form.Group>
                <Button variant="primary" type="submit">
                    {id ? "Actualizar Producto" : "Guardar Producto"}
                </Button>
                <Button variant="secondary" className="ms-2" onClick={() => navigate("/")}>
                    Cancelar
                </Button>
            </Form>
        </Container>
    );
};

export default ProductForm;
