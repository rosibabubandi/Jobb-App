import {Component} from 'react'
import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'

import {BsFillStarFill, BsFillBriefcaseFill} from 'react-icons/bs'
import {IoLocationSharp} from 'react-icons/io5'
import {HiOutlineExternalLink} from 'react-icons/hi'

import Header from '../Header'
import SimilarJobs from '../SimilarJobs'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobStatus: apiStatusConstants.initial,
    jobDetails: {},
    skills: [],
    lifeAtCompany: {},
    similarJobs: [],
  }

  componentDidMount() {
    this.getJob()
  }

  getJob = async () => {
    this.setState({jobStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const jobApiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(jobApiUrl, options)

    if (response.ok) {
      const responseJobData = await response.json()

      const jobData = responseJobData.job_details
      const jobMainDetails = {
        companyLogoUrl: jobData.company_logo_url,
        companyWebsiteUrl: jobData.company_website_url,
        employmentType: jobData.employment_type,
        id: jobData.id,
        jobDescription: jobData.job_description,
        location: jobData.location,
        packagePerAnnum: jobData.package_per_annum,
        rating: jobData.rating,
        title: jobData.title,
      }
      const jobSkills = jobData.skills.map(eachSkill => ({
        imageUrl: eachSkill.image_url,
        name: eachSkill.name,
      }))
      const companyLife = {
        description: jobData.life_at_company.description,
        imageUrl: jobData.life_at_company.image_url,
      }

      const jobsSimilar = responseJobData.similar_jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      this.setState({
        jobStatus: apiStatusConstants.success,
        jobDetails: jobMainDetails,
        skills: jobSkills,
        lifeAtCompany: companyLife,
        similarJobs: jobsSimilar,
      })
    } else {
      this.setState({jobStatus: apiStatusConstants.failure})
    }
  }

  getJobItemSuccessView = () => {
    const {jobDetails, skills, lifeAtCompany, similarJobs} = this.state

    return (
      <>
        <div className="job-details-success-container">
          <div className="company-logo-rating-container">
            <img
              src={jobDetails.companyLogoUrl}
              className="company-logo"
              alt="job details company logo"
            />
            <div className="job-title-rating-container">
              <h1 className="job-title">{jobDetails.title}</h1>
              <div className="rating-container">
                <BsFillStarFill className="rating-icon" />
                <p className="rating-number">{jobDetails.rating}</p>
              </div>
            </div>
          </div>
          <div className="location-type-lpa-container">
            <div className="location-type-container">
              <div className="location-type-each-container">
                <IoLocationSharp className="location-icon-job-icon" />
                <p className="job-para-styles">{jobDetails.location}</p>
              </div>
              <div className="location-type-each-container">
                <BsFillBriefcaseFill className="location-icon-job-icon" />
                <p className="job-para-styles">{jobDetails.employmentType}</p>
              </div>
            </div>
            <p className="package-description-text">
              {jobDetails.packagePerAnnum}
            </p>
          </div>
          <hr className="separator" />
          <div className="description-visit-container">
            <h1 className="package-description-text">Description</h1>
            <a
              href={jobDetails.companyWebsiteUrl}
              target="_blank"
              className="website-anchor-link"
              rel="noreferrer"
            >
              Visit <HiOutlineExternalLink className="external-link-icon" />
            </a>
          </div>
          <p className="job-para-styles">{jobDetails.jobDescription}</p>
          <div className="skills-main-container">
            <h1 className="package-description-text">Skills</h1>
            <ul className="skill-ul-container">
              {skills.map(eachSkill => (
                <li key={eachSkill.name} className="skill-li-container">
                  <img
                    src={eachSkill.imageUrl}
                    className="skill-image"
                    alt={eachSkill.name}
                  />
                  <p className="skill-text">{eachSkill.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="life-at-company-main-container">
            <div className="life-at-company-text-container">
              <h1 className="package-description-text">Life at Company</h1>
              <p className="job-para-styles">{lifeAtCompany.description}</p>
            </div>
            <img
              src={lifeAtCompany.imageUrl}
              className="life-at-company-image"
              alt="life at company"
            />
          </div>
        </div>
        <div className="similar-jobs-container">
          <h1 className="package-description-text">Similar Jobs</h1>
          <ul className="jobs-container">
            {similarJobs.map(eachJob => (
              <SimilarJobs key={eachJob.id} jobDetails={eachJob} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  getLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  getJobItem = () => {
    this.getJob()
  }

  getJobItemFailureView = () => (
    <div className="no-jobs-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="no-jobs-image"
        alt="failure view"
      />
      <h1 className="no-jobs-heading">Oops! Something Went Wrong</h1>
      <p className="no-jobs-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-button" onClick={this.getJobItem}>
        Retry
      </button>
    </div>
  )

  getAllJobItemViews = () => {
    const {jobStatus} = this.state

    switch (jobStatus) {
      case apiStatusConstants.inProgress:
        return this.getLoadingView()
      case apiStatusConstants.success:
        return this.getJobItemSuccessView()
      case apiStatusConstants.failure:
        return this.getJobItemFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-details-main-container">
          {this.getAllJobItemViews()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
