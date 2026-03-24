import { useState } from 'react'
import api from '../api/axios'

// Razorpay script must be in index.html:
// <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

const CheckoutModal = ({ product, user, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handlePay = async () => {
    setLoading(true)
    setError('')

    try {
      // Step 1 — create order on our backend
      const { data } = await api.post('/payment/create-order', {
        productId: product._id,
      })

      // Step 2 — open Razorpay payment modal
      const options = {
        key:         data.keyId,
        amount:      data.amount,
        currency:    data.currency,
        name:        'HASTKLA',
        description: data.productName,
        order_id:    data.razorpayOrderId,
        prefill: {
          name:    data.buyerName,
          email:   data.buyerEmail,
          contact: data.buyerPhone,
        },
        theme:  { color: '#C4622D' },
        image:  '/logo.png',

        handler: async (response) => {
          // Step 3 — payment done, verify on backend
          try {
            await api.post('/payment/verify', {
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId:           data.orderId,
            })
            setLoading(false)
            onSuccess()
            onClose()
          } catch {
            setError('Payment verification failed. Contact support.')
            setLoading(false)
          }
        },

        modal: {
          ondismiss: () => {
            setError('Payment cancelled.')
            setLoading(false)
          },
        },
      }

      const rzp = new window.Razorpay(options)

      rzp.on('payment.failed', (response) => {
        setError(`Payment failed: ${response.error.description}`)
        setLoading(false)
      })

      rzp.open()

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.')
      setLoading(false)
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="modal-box" style={{ maxWidth: 420 }}>

        {/* Product summary */}
        <div style={{ display:'flex', alignItems:'center', gap:'0.9rem', background:'var(--warm)', borderRadius:12, padding:'1rem', marginBottom:'1.5rem' }}>
          <div style={{ width:56, height:56, borderRadius:12, background:'var(--clay)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8rem', flexShrink:0, overflow:'hidden' }}>
            {product.images?.[0]
              ? <img src={product.images[0]} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              : product.emoji}
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:'0.92rem', marginBottom:'0.1rem' }}>{product.name}</div>
            <div style={{ fontSize:'0.72rem', color:'var(--muted)' }}>by {product.seller?.name}</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:600, color:'var(--clay)', fontSize:'1.4rem', lineHeight:1 }}>
              ₹{product.price?.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Accepted payment methods */}
        <div style={{ background:'var(--cream)', border:'1px solid var(--border)', borderRadius:10, padding:'0.9rem 1rem', marginBottom:'1.4rem' }}>
          <div style={{ fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--muted)', marginBottom:'0.6rem' }}>
            Accepted payment methods
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'0.45rem' }}>
            {['UPI', 'PhonePe', 'Google Pay', 'Paytm', 'Net Banking', 'Credit Card', 'Debit Card', 'EMI', 'Wallet'].map(m => (
              <span key={m} style={{ background:'var(--warm)', border:'1px solid var(--border)', borderRadius:20, padding:'2px 9px', fontSize:'0.7rem', fontWeight:600, color:'var(--muted)' }}>
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background:'#fce7e7', border:'1px solid #f0b0b0', borderRadius:8, padding:'0.6rem 0.9rem', fontSize:'0.82rem', color:'var(--err)', marginBottom:'1rem' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Actions */}
        <div style={{ display:'flex', gap:'0.7rem' }}>
          <button className="btn btn-warm btn-full" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-clay btn-full btn-lg" onClick={handlePay} disabled={loading}>
            {loading
              ? <><span className="spinner" style={{ borderTopColor:'#fff' }} /> Opening…</>
              : `Pay ₹${product.price?.toLocaleString('en-IN')} →`}
          </button>
        </div>

        <p style={{ textAlign:'center', fontSize:'0.68rem', color:'var(--muted)', marginTop:'0.8rem' }}>
          🔒 Secure payment by Razorpay · PCI DSS certified
        </p>
      </div>
    </div>
  )
}

export default CheckoutModal
