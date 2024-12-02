import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Table, Button, Form, Spinner, Alert, InputGroup } from "react-bootstrap";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [searchCategory, setSearchCategory] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, [searchName, searchCategory]);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = {};
            if (searchName.trim()) params.name = searchName.trim();
            if (searchCategory.trim()) params.category = searchCategory.trim();

            const response = await axios.get("http://localhost:8080/api/v1/products", { params });
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
            setError("Error al cargar los productos. Por favor, inténtelo más tarde.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectChange = (id) => {
        setSelectedIds((prevSelectedIds) =>
            prevSelectedIds.includes(id)
                ? prevSelectedIds.filter((selectedId) => selectedId !== id)
                : [...prevSelectedIds, id]
        );
    };

    const handleDeleteSelected = async () => {
        if (!selectedIds.length) return;

        try {
            const queryString = selectedIds.map((id) => `ids=${id}`).join("&");

            await axios.delete(`http://localhost:8080/api/v1/products?${queryString}`);
            setSelectedIds([]);
            fetchProducts();
            alert("Productos eliminados exitosamente.");
        } catch (error) {
            console.error("Error deleting products:", error);
            alert("Error al eliminar productos.");
        }
    };

    const handleCreateProduct = () => {
        navigate("/product/new");
    };

    return (
        <div className="container mt-4">
            <h1>Catálogo de Productos</h1>

            <div className="mb-3">
                <InputGroup>
                    <Form.Control
                        type="text"
                        placeholder="Buscar por nombre"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                    <Form.Control
                        type="text"
                        placeholder="Buscar por categoría"
                        value={searchCategory}
                        onChange={(e) => setSearchCategory(e.target.value)}
                    />
                </InputGroup>
            </div>

            <div className="mb-3">
                <Button
                    variant="danger"
                    onClick={handleDeleteSelected}
                    disabled={selectedIds.length === 0}
                >
                    Eliminar seleccionados
                </Button>{" "}
                <Button variant="primary" onClick={handleCreateProduct}>
                    Nuevo Producto
                </Button>
            </div>

            {loading ? (
                <Spinner animation="border" />
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : products.length === 0 ? (
                <Alert variant="info">No se encontraron productos con los filtros aplicados.</Alert>
            ) : (
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Seleccionar</th>
                        <th>Nombre</th>
                        <th>Categorías</th>
                        <th>Precio</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>
                                <Form.Check
                                    type="checkbox"
                                    checked={selectedIds.includes(product.id)}
                                    onChange={() => handleSelectChange(product.id)}
                                />
                            </td>
                            <td>{product.name}</td>
                            <td>{product.categories.join(", ")}</td>
                            <td>${product.price.toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default ProductList;
