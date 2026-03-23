const Policies = () => {
    return (
        <div className="container py-2xl max-w-3xl" style={{ maxWidth: '800px' }}>
            <h1 className="text-center mb-2xl text-primary-dark">Store Policies</h1>

            <div className="card mb-xl p-xl">
                <h2 className="mb-md text-primary">Shipping Policy</h2>
                <p className="mb-sm text-muted"><strong>Processing Time:</strong> All our products are handcrafted. Standard items usually ship within 2-3 business days. Customizable items take 4-5 business days to craft before shipping.</p>
                <p className="mb-sm text-muted"><strong>Shipping Rates:</strong> We offer free shipping on all orders over ₹2000 across India. A standard shipping fee of ₹150 applies to orders below this amount.</p>
                <p className="text-muted"><strong>Delivery Time:</strong> Depending on your location, delivery takes between 3-7 business days after dispatch.</p>
            </div>

            <div className="card mb-xl p-xl">
                <h2 className="mb-md text-primary">Refund & Return Policy</h2>
                <p className="mb-sm text-muted">We want you to love your handcrafted items. If you are not entirely satisfied, you can return standard items within 7 days of delivery for a full refund or exchange.</p>
                <p className="mb-sm text-muted"><strong>Condition:</strong> Items must be returned in their original condition and packaging without signs of use.</p>
                <p className="text-muted"><strong>Customized Items:</strong> Please note that we <strong>cannot</strong> accept returns or exchanges for personalized or custom-engraved/embroidered items, unless they arrive damaged or defective.</p>
            </div>

            <div className="card p-xl">
                <h2 className="mb-md text-primary">Customization Terms</h2>
                <p className="mb-sm text-muted">We offer custom engraving for metal crafts and custom embroidery for textiles.</p>
                <p className="mb-sm text-muted">Please ensure all spelling is correct before placing your order. We will engrave/embroider exactly what is provided in the customization field.</p>
                <p className="text-muted">Customization adds 2-3 additional days to the standard crafting time.</p>
            </div>
        </div>
    );
};

export default Policies;
