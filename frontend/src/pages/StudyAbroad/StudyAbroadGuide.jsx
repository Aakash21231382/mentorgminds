import React from "react";
import { studyAbroadData } from "../../data/studyAbroadData";
import "../../assets/css/studyaborad/StudyAbroadGuide.css";
import T from "../../context/T";

const StudyAbroadGuide = () => {
  const {
    header,
    whyStudyAbroad,
    programsAndCourses,
    bestCountries,
    bestUniversities,
    eligibility,
    admissionProcess,
    documentsRequired,
    intakes,
  } = studyAbroadData;

  return (
    <div className="study-guide-container container">
      {/* Header Section */}
      <h1 className="main-title">
        <T>{header.titlePrefix}</T>
        <span className="highlight-oranged">
          <T>{header.titleHighlight}</T>
        </span>
      </h1>

      <div className="sub-header">
        <T>{header.subheading}</T>
      </div>

      {header.descriptions.map((desc, idx) => (
        <p key={idx} className="text-paragraph">
          <T>{desc}</T>
        </p>
      ))}

      {/* Why Study Abroad */}
      <h2 className="section-title">
        <T>{whyStudyAbroad.title}</T>
      </h2>

      <p className="text-paragraph">
        <T>{whyStudyAbroad.intro}</T>
      </p>

      <p className="text-paragraph">
        <strong>
          <T>{whyStudyAbroad.highlight}</T>
        </strong>
      </p>

      <p className="text-paragraph">
        <T>{whyStudyAbroad.outro}</T>
      </p>

      {whyStudyAbroad.reasons.map((reason, idx) => (
        <div key={idx}>
          <div className="sub-section-title">
            <T>{reason.title}</T>
          </div>

          <p className="text-paragraph">
            <T>{reason.desc}</T>
          </p>
        </div>
      ))}

      {/* Top Study Abroad Programs & Courses */}
      <h2 className="section-title">
        <T>{programsAndCourses.title}</T>
      </h2>

      <p className="text-paragraph">
        <T>{programsAndCourses.intro1}</T>
      </p>

      <p className="text-paragraph">
        <T>{programsAndCourses.intro2}</T>
      </p>

      <p className="text-paragraph">
        <T>{programsAndCourses.tableIntro}</T>
      </p>

      <div className="guide-table-responsive">
        <table className="guide-table">
          <thead>
            <tr>
              <th>
                <T>Study Level</T>
              </th>

              <th>
                <T>Popular Programs</T>
              </th>

              <th>
                <T>Top Universities</T>
              </th>
            </tr>
          </thead>

          <tbody>
            {programsAndCourses.table.map((row, idx) => (
              <tr key={idx}>
                <td>
                  <strong>
                    <T>{row.level}</T>
                  </strong>
                </td>

                <td>
                  <ul className="guide-list">
                    {row.programs.map((prog, pIdx) => (
                      <li key={pIdx}>
                        <T>{prog}</T>
                      </li>
                    ))}
                  </ul>
                </td>

                <td>
                  <ul className="guide-list">
                    {row.universities.map((uni, uIdx) => (
                      <li key={uIdx}>
                        {uni.link ? (
                          <a href={uni.link} className="guide-link">
                            <T>{uni.name}</T>
                          </a>
                        ) : (
                          <T>{uni.name}</T>
                        )}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="note-box">
        <strong>
          <T>Note:</T>
        </strong>{" "}
        <T>{programsAndCourses.note}</T>
      </div>

      {/* Best Countries */}
      <h2 className="section-title">
        <T>{bestCountries.title}</T>
      </h2>

      <p className="text-paragraph">
        <T>{bestCountries.intro}</T>
      </p>

      <p className="text-paragraph">
        <T>{bestCountries.tableIntro}</T>
      </p>

      <div className="guide-table-responsive">
        <table className="guide-table">
          <thead>
            <tr>
              <th>
                <T>Country</T>
              </th>

              <th>
                <T>Why Indian Students Choose This Destination</T>
              </th>
            </tr>
          </thead>

          <tbody>
            {bestCountries.countries.map((item, idx) => (
              <tr key={idx}>
                <td>
                  <strong>
                    <T>{item.country}</T>
                  </strong>
                </td>

                <td>
                  <T>{item.reason}</T>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Read More Table */}
      <div className="guide-table-responsive">
        <table className="guide-table">
          <thead>
            <tr>
              <th colSpan="3">
                <T>Read More:</T>
              </th>
            </tr>
          </thead>

          <tbody>
            {Array.from({
              length: Math.ceil(bestCountries.readMoreLinks.length / 3),
            }).map((_, rIdx) => (
              <tr key={rIdx}>
                {bestCountries.readMoreLinks
                  .slice(rIdx * 3, rIdx * 3 + 3)
                  .map((linkItem, cIdx) => (
                    <td key={cIdx}>
                      <a href={linkItem.link} className="guide-link">
                        <T>{linkItem.title}</T>
                      </a>
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Best Universities */}
      <h2 className="section-title">
        <T>{bestUniversities.title}</T>
      </h2>

      <p className="text-paragraph">
        <T>{bestUniversities.intro}</T>
      </p>

      <p className="text-paragraph">
        <T>{bestUniversities.listIntro}</T>
      </p>

      <div className="guide-table-responsive">
        <table className="guide-table">
          <thead>
            <tr>
              <th>
                <T>QS World University Rankings 2026</T>
              </th>

              <th>
                <T>University Name</T>
              </th>

              <th>
                <T>Country</T>
              </th>
            </tr>
          </thead>

          <tbody>
            {bestUniversities.rankings.map((uni, idx) => (
              <tr key={idx}>
                <td>{uni.rank}</td>

                <td>
                  {uni.link ? (
                    <a href={uni.link} className="guide-link">
                      <T>{uni.name}</T>
                    </a>
                  ) : (
                    <T>{uni.name}</T>
                  )}
                </td>

                <td>
                  <T>{uni.country}</T>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Eligibility & Requirements */}
      <h2 className="section-title">
        <T>{eligibility.title}</T>
      </h2>

      <p className="text-paragraph">
        <T>{eligibility.intro1}</T>
      </p>

      <p className="text-paragraph">
        <T>{eligibility.intro2}</T>
      </p>

      <p className="text-paragraph">
        <T>{eligibility.intro3}</T>
      </p>

      <p className="text-paragraph">
        <strong>
          <T>{eligibility.breakdownIntro}</T>
        </strong>
      </p>

      <div className="sub-section-title">
        <T>{eligibility.subTitle}</T>
      </div>

      <p className="text-paragraph">
        <T>{eligibility.subIntro}</T>
      </p>

      <div className="guide-table-responsive">
        <table className="guide-table">
          <thead>
            <tr>
              <th>
                <T>Criteria</T>
              </th>

              <th>
                <T>Undergraduate (UG)</T>
              </th>

              <th>
                <T>Postgraduate (PG)</T>
              </th>
            </tr>
          </thead>

          <tbody>
            {eligibility.criteriaTable.map((row, idx) => (
              <tr key={idx}>
                <td>
                  <strong>
                    <T>{row.criteria}</T>
                  </strong>
                </td>

                <td>
                  <T>{row.ug}</T>
                </td>

                <td>
                  <T>{row.pg}</T>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="note-box">
        <strong>
          <T>Note:</T>
        </strong>{" "}
        <T>{eligibility.note}</T>
      </div>

      <div className="sub-section-title">
        <T>{eligibility.englishTestsTitle}</T>
      </div>

      <p className="text-paragraph">
        <T>{eligibility.englishTestsIntro}</T>
      </p>

      <ul className="guide-list">
        {eligibility.englishTests.map((test, idx) => (
          <li key={idx} className="test-item">
            {test.link ? (
              <a href={test.link} className="guide-link">
                <strong>
                  <T>{test.name}</T>
                </strong>
              </a>
            ) : (
              <strong>
                <T>{test.name}</T>
              </strong>
            )}

            {" : "}

            <T>{test.desc}</T>
          </li>
        ))}
      </ul>

      {/* Admission Process */}
      <h2 className="section-title">
        <T>{admissionProcess.title}</T>
      </h2>

      <p className="text-paragraph">
        <T>{admissionProcess.intro1}</T>
      </p>

      <p className="text-paragraph">
        <T>{admissionProcess.intro2}</T>
      </p>

      <p className="text-paragraph">
        <T>{admissionProcess.intro3}</T>
      </p>

      <ol className="steps-list">
        {admissionProcess.steps.map((step, idx) => (
          <li key={idx} className="step-item">
            <div className="step-title">
              <T>{step.step}</T>
            </div>

            <div className="step-desc">
              <T>{step.desc}</T>
            </div>
          </li>
        ))}
      </ol>

      {/* Documents Required */}
      <h2 className="section-title">
        <T>{documentsRequired.title}</T>
      </h2>

      <p className="text-paragraph">
        <T>{documentsRequired.intro1}</T>
      </p>

      <p className="text-paragraph">
        <T>{documentsRequired.intro2}</T>
      </p>

      <div className="guide-table-responsive">
        <table className="guide-table">
          <thead>
            <tr>
              <th>
                <T>Document Category</T>
              </th>

              <th>
                <T>Documents Included</T>
              </th>
            </tr>
          </thead>

          <tbody>
            {documentsRequired.table.map((doc, idx) => (
              <tr key={idx}>
                <td>
                  <strong>
                    <T>{doc.category}</T>
                  </strong>
                </td>

                <td>
                  <T>{doc.documents}</T>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Application Timelines & Intakes */}
      <h2 className="section-title">
        <T>{intakes.title}</T>
      </h2>

      <p className="text-paragraph">
        <T>{intakes.intro1}</T>
      </p>

      <p className="text-paragraph">
        <T>{intakes.intro2}</T>
      </p>

      <p className="text-paragraph">
        <T>{intakes.tableIntro}</T>
      </p>

      <div className="guide-table-responsive">
        <table className="guide-table">
          <thead>
            <tr>
              <th>
                <T>Country</T>
              </th>

              <th>
                <T>Major Intakes</T>
              </th>
            </tr>
          </thead>

          <tbody>
            {intakes.table.map((row, idx) => (
              <tr key={idx}>
                <td>
                  <strong>
                    <T>{row.country}</T>
                  </strong>
                </td>

                <td>
                  <T>{row.intakes}</T>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-paragraph">
        <T>{intakes.outro}</T>
      </p>
    </div>
  );
};

export default StudyAbroadGuide;
