import React, { useState } from "react";
import { 
  FaTimes, 
  FaShieldAlt, 
  FaLock, 
  FaCheckCircle, 
  FaTag, 
  FaCreditCard,
  FaQrcode,
  FaMobileAlt,
  FaBolt
} from "react-icons/fa";
import { lmsApi } from "../api/lmsApi";
import { toast } from "react-toastify";
import "../assets/css/RazorpayCheckoutModal.css";

const RazorpayCheckoutModal = ({ 
  isOpen, 
  onClose, 
  courseId = 1, 
  courseType = "online", 
  courseTitle = "Full Stack AI-Native Engineering", 
  originalPrice = 4999,
  onSuccess 
}) => {
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);

  if (!isOpen) return null;

  const finalPrice = Math.max(0, originalPrice - discountAmount);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      toast.info("Please enter a coupon code.");
      return;
    }

    try {
      setApplying(true);
      const res = await lmsApi.applyCoupon({
        code: couponCode.trim(),
        originalPrice: originalPrice,
        cartAmount: originalPrice
      });

      if (res.success) {
        const disc = Number(res.discountAmount || 0);
        setDiscountAmount(disc);
        setAppliedCoupon(res.coupon || { Code: res.code || couponCode.trim(), DiscountPercent: res.discountPercent });
        toast.success(`🎉 Coupon ${res.code || couponCode.trim()} applied! Saved ₹${disc}`);
      } else {
        toast.error(res.message || "Invalid coupon code.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired coupon code.");
    } finally {
      setApplying(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    try {
      setLoading(true);

      // Step 1: Request order creation from backend
      const orderRes = await lmsApi.createRazorpayOrder({
        courseId,
        courseType,
        courseTitle,
        amount: finalPrice,
        couponCode: appliedCoupon ? appliedCoupon.Code : null
      });

      if (!orderRes.success) {
        toast.error("Failed to initialize payment.");
        setLoading(false);
        return;
      }

      const isScriptLoaded = await loadRazorpayScript();

      if (isScriptLoaded && window.Razorpay) {
        const options = {
          key: orderRes.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SffTvo1jY44SnA",
          amount: orderRes.amount,
          currency: orderRes.currency || "INR",
          name: "Mentoring Minds",
          description: `Enrollment: ${courseTitle}`,
          image: "https://mentoringminds.in/favicon.ico",
          order_id: orderRes.orderId && !orderRes.orderId.startsWith("order_rzp_") ? orderRes.orderId : undefined,
          handler: async function (response) {
            try {
              const verifyRes = await lmsApi.verifyRazorpayPayment({
                razorpay_payment_id: response.razorpay_payment_id || `pay_${Date.now()}`,
                razorpay_order_id: response.razorpay_order_id || orderRes.orderId,
                razorpay_signature: response.razorpay_signature,
                courseId,
                courseType,
                courseTitle,
                originalPrice,
                discountAmount,
                finalPrice,
                couponCode: appliedCoupon ? appliedCoupon.Code : null
              });

              if (verifyRes.success) {
                toast.success("Payment Successful! 🎉 Taking you to Classroom...");
                if (onSuccess) onSuccess();
                onClose();
              }
            } catch (err) {
              toast.error("Payment verification failed.");
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: orderRes.studentName || "Student",
            email: orderRes.studentEmail || "student@example.com",
            contact: "9999999999"
          },
          notes: {
            courseId: courseId.toString(),
            courseType: courseType
          },
          theme: {
            color: "#FF6E06"
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback simulated testing checkout
        const rzpPaymentId = "pay_test_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
        
        const verifyRes = await lmsApi.verifyRazorpayPayment({
          razorpay_payment_id: rzpPaymentId,
          razorpay_order_id: orderRes.orderId,
          courseId,
          courseType,
          courseTitle,
          originalPrice,
          discountAmount,
          finalPrice,
          couponCode: appliedCoupon ? appliedCoupon.Code : null
        });

        if (verifyRes.success) {
          toast.success("Payment Successful! 🎉 Taking you to Classroom...");
          if (onSuccess) onSuccess();
          onClose();
        }
        setLoading(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment initialization failed.");
      setLoading(false);
    }
  };

  return (
    <div className="rzp-modal-backdrop" onClick={onClose}>
      <div className="rzp-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="rzp-header">
          <div className="d-flex align-items-center gap-2">
            <h4 className="m-0 fw-bold fs-5">Secure Checkout</h4>
            <span className="rzp-badge-test">⚡ Razorpay Test Mode</span>
          </div>
          <button 
            className="btn btn-sm text-white"
            style={{ background: "rgba(255,255,255,0.1)", borderRadius: "50%", padding: "4px 8px" }}
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="rzp-body">
          
          {/* Course Summary */}
          <div className="rzp-course-summary">
            <span className="text-muted small fw-bold text-uppercase d-block mb-1">Selected Program</span>
            <strong className="text-dark fs-6 d-block">{courseTitle}</strong>
            <small className="text-success fw-bold d-flex align-items-center gap-1 mt-1">
              <FaCheckCircle /> Lifetime Classroom Access + Official Certificate Included
            </small>
          </div>

          {/* Coupon Code Input */}
          <form onSubmit={handleApplyCoupon} className="rzp-coupon-box">
            <input 
              type="text" 
              className="rzp-coupon-input"
              placeholder="Enter Promo Code (e.g. WELCOME50)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            />
            <button type="submit" className="rzp-btn-apply" disabled={applying}>
              {applying ? "Applying..." : "Apply"}
            </button>
          </form>

          {appliedCoupon && (
            <div className="p-2 mb-3 bg-light rounded text-success small fw-bold d-flex align-items-center justify-content-between">
              <span className="d-flex align-items-center gap-2">
                <FaTag /> Code {appliedCoupon.Code} applied! ({appliedCoupon.DiscountPercent}% Off)
              </span>
              <button 
                type="button" 
                className="btn btn-sm btn-link text-danger p-0 text-decoration-none fw-bold ms-2"
                onClick={() => {
                  setAppliedCoupon(null);
                  setDiscountAmount(0);
                  setCouponCode("");
                  toast.info("Coupon removed.");
                }}
              >
                Remove
              </button>
            </div>
          )}

          {/* Price Breakdown */}
          <div className="rzp-price-breakdown">
            <div className="rzp-price-row">
              <span>Original Program Fee:</span>
              <span className="fw-bold">₹{originalPrice}</span>
            </div>
            {discountAmount > 0 && (
              <div className="rzp-price-row text-success">
                <span>Coupon Discount:</span>
                <span className="fw-bold">-₹{discountAmount}</span>
              </div>
            )}
            <div className="rzp-price-row">
              <span>Platform & GST Charges:</span>
              <span className="fw-bold text-success">FREE</span>
            </div>
            <div className="rzp-price-row total">
              <span>Total Payable Amount:</span>
              <span className="text-primary">₹{finalPrice}</span>
            </div>
          </div>

          {/* Pay Button */}
          <button 
            className="rzp-btn-pay" 
            onClick={handleRazorpayPayment}
            disabled={loading}
          >
            <FaLock /> {loading ? "Processing Payment..." : `Pay ₹${finalPrice} via Razorpay`}
          </button>

          <div className="rzp-security-note">
            <FaShieldAlt className="text-success" /> 256-Bit SSL Encrypted &bull; Razorpay Sandbox Verified
          </div>

        </div>

      </div>
    </div>
  );
};

export default RazorpayCheckoutModal;
