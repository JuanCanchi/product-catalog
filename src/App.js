import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";

const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route exact path="/" element={<ProductList />} />
                    <Route path="/product/new" element={<ProductForm />} />
                    <Route path="/product/edit/:id" element={<ProductForm />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
