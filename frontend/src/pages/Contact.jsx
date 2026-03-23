import { useState } from 'react';

const Contact = () => {
    const [status, setStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('Thank you! Your message has been sent. We will get back to you shortly.');
        e.target.reset();
        setTimeout(() => setStatus(''), 5000);
    };

    return (
        <div className="container py-2xl">
            <h1 className="text-center mb-xl text-primary-dark">Contact Us</h1>
            <p className="text-center text-muted max-w-lg mx-auto mb-2xl" style={{ maxWidth: '600px', margin: '0 auto 3rem' }}>
                Have a question about a product, customization, or wholesale order? We'd love to hear from you.
            </p>

            <div className="grid grid-cols-2 gap-3xl">
                <div className="contact-info">
                    <div className="card mb-lg p-xl">
                        <h3 className="mb-md">Get in Touch</h3>

                        <div className="contact-detail flex gap-md items-center mb-md">
                            <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--color-primary-light)', borderRadius: '50%', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <span>&#9993;</span>
                            </div>
                            <div>
                                <h4 className="m-0 text-sm italic text-muted">Email</h4>
                                <p className="m-0 font-medium">hello@twilightstar.in</p>
                            </div>
                        </div>

                        <div className="contact-detail flex gap-md items-center mb-md">
                            <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--color-primary-light)', borderRadius: '50%', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <span>&#9742;</span>
                            </div>
                            <div>
                                <h4 className="m-0 text-sm italic text-muted">Phone</h4>
                                <p className="m-0 font-medium">+91 98765 43210</p>
                            </div>
                        </div>

                        <div className="contact-detail flex gap-md items-center">
                            <div style={{ width: '40px', height: '40px', backgroundColor: '#25D366', borderRadius: '50%', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <span>WA</span>
                            </div>
                            <div>
                                <h4 className="m-0 text-sm italic text-muted">WhatsApp Support</h4>
                                <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="m-0 font-medium text-primary hover-underline">Chat with us</a>
                            </div>
                        </div>
                    </div>

                    <div className="card p-0 overflow-hidden" style={{ height: '300px' }}>
                        {/* Dummy Google Map Embed */}
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113945.37894200673!2d75.7145749!3d26.8853465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4adf4c57e281%3A0xce1c63a0cf22e09!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Twilight Star Location"
                        ></iframe>
                    </div>
                </div>

                <div className="contact-form-container card p-xl">
                    <h3 className="mb-lg">Send a Message</h3>
                    {status && <div className="text-success mb-md p-sm bg-surface" style={{ backgroundColor: '#e8f5e9' }}>{status}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Name</label>
                            <input type="text" className="form-control" required placeholder="Your Name" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" required placeholder="your.email@example.com" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Subject</label>
                            <select className="form-control">
                                <option>General Inquiry</option>
                                <option>Order Status</option>
                                <option>Customization Request</option>
                                <option>Wholesale</option>
                            </select>
                        </div>
                        <div className="form-group mb-xl">
                            <label className="form-label">Message</label>
                            <textarea className="form-control" rows="5" required placeholder="How can we help you?"></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary w-full">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
