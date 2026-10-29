import { useState, useEffect } from "react";
import { FaUser, FaClock } from "react-icons/fa";
import T from "../context/T";
import { freeCourseApi } from "../api/freeCourseApi";

const FreeCourses = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        freeCourseApi.getPublicFreeCourses()
            .then(d => { if (d.success) setCourses(d.courses || []); })
            .catch(console.error);
    }, []);

    // Koi bhi active course nahi hai toh component render hi mat karo
    if (courses.length === 0) return null;

    return (
        <div className="free-courses-banner">
            <div className="free-banner-header">
                <h2><T>Free Courses</T></h2>
                <p><T>Explore introductory courses related to your search to build foundational knowledge.</T></p>
            </div>
            <div className="free-courses-grid">
                {courses.map((course) => (
                    <div className="free-card" key={course.Id}>
                        <div className="free-card-img">
                            {course.Image
                                ? <img src={course.Image} alt={course.Title} />
                                : <div className="free-card-placeholder" />
                            }
                        </div>
                        <div className="free-card-content">
                            <h4>{course.Title}</h4>
                            <div className="free-meta">
                                {course.Learners && <span><FaUser /> {course.Learners}</span>}
                                {course.Duration && <span><FaClock /> {course.Duration}</span>}
                            </div>
                            <div className="free-card-btns">
                                <a
                                    href={course.ProgramUrl || "#"}
                                    className="btn-free-view"
                                >
                                    <T>View Program</T>
                                </a>
                                <a
                                    href={course.EnrollUrl || "#"}
                                    className="btn-free-enroll"
                                >
                                    <T>Enroll Now</T>
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FreeCourses;
