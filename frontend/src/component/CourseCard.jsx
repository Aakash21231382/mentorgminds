import T from "../context/T";
import { FaDownload, FaMedal, FaGraduationCap, FaBook, FaStar, FaClock, FaUserTie, FaLaptopCode } from "react-icons/fa";
import { PiCertificateLight } from "react-icons/pi";
import Location from "../assets/images/Location.png";
import { useNavigate } from "react-router-dom";

// Icon name string se actual component return karo
const getIcon = (name) => {
    const map = {
        PiCertificateLight,
        FaMedal,
        FaGraduationCap,
        FaBook,
        FaStar,
        FaClock,
        FaUserTie,
        FaLaptopCode,
    };
    return map[name] || PiCertificateLight;
};

const CourseCard = ({ course }) => {
    const navigate = useNavigate();

    const ribbon      = course.ribbon      || course.Ribbon;
    const ribbonColor = course.ribbonColor || course.RibbonColor || 'blue';
    const logo        = course.logo        || course.Logo;
    const location    = course.location    || course.Location;
    const title       = course.title       || course.Title;
    const slug        = course.slug        || course.Slug;       // detail page slug
    const brochureUrl = course.brochureUrl || course.BrochureUrl;

    const features = course.features || [
        course.Feature1Text && { text: course.Feature1Text, iconName: course.Feature1Icon },
        course.Feature2Text && { text: course.Feature2Text, iconName: course.Feature2Icon },
    ].filter(Boolean);

    const handleViewProgram = () => {
        if (slug) navigate(`/course-detail/${slug}`);
    };

    const handleBrochure = () => {
        if (brochureUrl) window.open(brochureUrl, '_blank');
    };

    return (
        <div className="course-card">
            {ribbon && (
                <div className={`ribbon ribbon-${ribbonColor}`}>
                    <span>{ribbon}</span>
                </div>
            )}

            <div className="course-logo">
                {logo
                    ? <img src={logo} alt={title} />
                    : <div className="course-logo-placeholder" />}
            </div>

            <div className="course-location">
                <img src={Location} alt="Location" />
                <p>{location || '—'}</p>
            </div>

            <h3 className="course-title"><T>{title}</T></h3>

            <div className="course-features">
                {features.map((feature, index) => {
                    const Icon = feature.IconComponent || getIcon(feature.iconName);
                    return (
                        <div className="feature-item" key={index}>
                            <span className="feature-icon">
                                <Icon color={feature.color || "#424242"} size={16} />
                            </span>
                            <span><T>{feature.text}</T></span>
                        </div>
                    );
                })}
            </div>

            <div className="course-buttons">
                <button className="view-btn" onClick={handleViewProgram} disabled={!slug}>
                    <T>View Program</T>
                </button>
                <button className="brochure-btn" onClick={handleBrochure} disabled={!brochureUrl}>
                    <T>Brochure</T> <FaDownload size={13} />
                </button>
            </div>
        </div>
    );
};

export default CourseCard;
