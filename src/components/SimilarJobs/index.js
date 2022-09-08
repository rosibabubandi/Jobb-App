import {BsFillStarFill, BsFillBriefcaseFill} from 'react-icons/bs'
import {IoLocationSharp} from 'react-icons/io5'

import './index.css'

const SimilarJobs = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = jobDetails

  return (
    <li className="each-job-container">
      <div className="company-logo-rating-container">
        <img
          src={companyLogoUrl}
          className="company-logo"
          alt="similar job company logo"
        />
        <div className="job-title-rating-container">
          <h1 className="job-title">{title}</h1>
          <div className="rating-container">
            <BsFillStarFill className="rating-icon" />
            <p className="rating-number">{rating}</p>
          </div>
        </div>
      </div>
      <h1 className="package-description-text">Description</h1>
      <p className="job-para-styles">{jobDescription}</p>
      <div className="location-type-lpa-container">
        <div className="location-type-container">
          <div className="location-type-each-container">
            <IoLocationSharp className="location-icon-job-icon" />
            <p className="job-para-styles">{location}</p>
          </div>
          <div className="location-type-each-container">
            <BsFillBriefcaseFill className="location-icon-job-icon" />
            <p className="job-para-styles">{employmentType}</p>
          </div>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobs
