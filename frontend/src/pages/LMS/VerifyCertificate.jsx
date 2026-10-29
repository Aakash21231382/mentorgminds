import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  FaCheckCircle, 
  FaPrint, 
  FaLinkedin, 
  FaMedal, 
  FaGraduationCap, 
  FaExclamationTriangle,
  FaArrowLeft
} from "react-icons/fa";
import { lmsApi } from "../../api/lmsApi";
import NavLogo from "../../assets/images/NavLogo1.png";
import T from "../../context/T";
import "../../assets/css/lms/VerifyCertificate.css";

const VerifyCertificate = () => {
  const { certNumber } = useParams();
  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCertificate();
  }, [certNumber]);

  const fetchCertificate = async () => {
    try {
      setLoading(true);
      const res = await lmsApi.verifyCertificate(certNumber);
      if (res.success && res.certificate) {
        setCertificate(res.certificate);
      } else {
        setError("Certificate not found or expired.");
      }
    } catch (err) {
      setError("Unable to verify this certificate.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareLinkedIn = () => {
    const certUrl = window.location.href;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certUrl)}`;
    window.open(linkedInUrl, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="certificate-verify-page justify-content-center">
        <div className="text-center py-5">
          <div className="spinner-border text-warning mb-3" role="status" />
          <h4><T>Verifying Official Mentoring Minds Credential...</T></h4>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="certificate-verify-page justify-content-center">
        <div className="text-center bg-white p-5 rounded-4 shadow-sm border max-w-md">
          <FaExclamationTriangle className="text-danger display-3 mb-3" />
          <h2 className="text-danger"><T>Invalid Credential</T></h2>
          <p className="text-muted"><T>{error || "This certificate could not be verified in the Mentoring Minds registry."}</T></p>
          <Link to="/" className="btn btn-warning mt-3">
            <FaArrowLeft /> <T>Return Home</T>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="certificate-verify-page">

      {/* Verified Status Pill */}
      <div className="cert-top-verify-banner">
        <FaCheckCircle className="fs-5" />
        <span><T>Official Verified Credential</T> • {certificate.CertificateNumber}</span>
      </div>

      {/* Certificate Main Card */}
      <div className="certificate-card-frame">
        <div className="certificate-inner-border">
          
          {/* Corner ornaments */}
          <div className="cert-corner-decor cert-corner-top-left" />
          <div className="cert-corner-decor cert-corner-top-right" />
          <div className="cert-corner-decor cert-corner-bottom-left" />
          <div className="cert-corner-decor cert-corner-bottom-right" />

          {/* Logo */}
          <img src={NavLogo} alt="Mentoring Minds" className="cert-logo" />

          <h1 className="cert-title-text"><T>Certificate of Completion</T></h1>
          <p className="cert-subtitle"><T>Mentoring Minds Executive Education & Learning Academy</T></p>

          <p className="cert-presented-to"><T>This is proudly presented to</T></p>
          <h2 className="cert-student-name">{certificate.StudentName}</h2>

          <p className="cert-description">
            <T>for successfully completing the comprehensive professional program and demonstrating proficiency in</T>{" "}
            <span className="cert-course-name">{certificate.CourseTitle}</span>.
          </p>

          {/* Footer: Signatures & Seal */}
          <div className="cert-footer-row">
            <div className="cert-signature-box">
              <div className="cert-sig-line" />
              <div className="cert-sig-title">Dr. Alok Verma</div>
              <div className="cert-sig-sub"><T>Head of Academics</T></div>
            </div>

            <div className="cert-badge-center">
              <div className="cert-gold-seal">
                <FaMedal />
              </div>
              <div className="cert-id-tag">ID: {certificate.CertificateNumber}</div>
              <small className="text-muted">Issued on: {new Date(certificate.IssueDate).toLocaleDateString()}</small>
            </div>

            <div className="cert-signature-box">
              <div className="cert-sig-line" />
              <div className="cert-sig-title">Mentoring Minds Board</div>
              <div className="cert-sig-sub"><T>Director of Certifications</T></div>
            </div>
          </div>

        </div>
      </div>

      {/* Action Buttons */}
      <div className="cert-actions-bar">
        <button className="cert-action-btn print" onClick={handlePrint}>
          <FaPrint /> <T>Print / Download PDF</T>
        </button>

        <button className="cert-action-btn share" onClick={handleShareLinkedIn}>
          <FaLinkedin /> <T>Share on LinkedIn</T>
        </button>

        <Link to="/my-learning" className="cert-action-btn bg-dark text-white">
          <FaGraduationCap /> <T>My Dashboard</T>
        </Link>
      </div>

    </div>
  );
};

export default VerifyCertificate;
