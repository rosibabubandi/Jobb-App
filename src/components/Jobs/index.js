import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'

import Header from '../Header'
import AllJobs from '../AllJobs'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
  noJobs: 'NO_JOBS',
}

class Jobs extends Component {
  state = {
    profileState: apiStatusConstants.initial,
    profileFullDetails: {},
    searchInput: '',
    employmentTypeList: [],
    salaryRange: '',
    allJobsState: apiStatusConstants.initial,
    allJobsData: [],
  }

  componentDidMount = () => {
    this.getProfile()
    this.getJobs()
  }

  getProfile = async () => {
    this.setState({profileState: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const profileApi = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(profileApi, options)
    if (response.ok) {
      const profileData = await response.json()
      const profileDetails = profileData.profile_details
      const finalProfileDetails = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }
      this.setState({
        profileState: apiStatusConstants.success,
        profileFullDetails: finalProfileDetails,
      })
    } else {
      this.setState({profileState: apiStatusConstants.failure})
    }
  }

  getJobs = async () => {
    this.setState({allJobsState: apiStatusConstants.inProgress})
    const {searchInput, employmentTypeList, salaryRange} = this.state

    const employmentType = employmentTypeList.join(',')
    const jwtToken = Cookies.get('jwt_token')

    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${salaryRange}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(jobsApiUrl, options)

    if (response.ok) {
      const jobsAllData = await response.json()

      if (jobsAllData.total > 0) {
        const jobsData = jobsAllData.jobs.map(eachJob => ({
          companyLogoUrl: eachJob.company_logo_url,
          employmentType: eachJob.employment_type,
          id: eachJob.id,
          jobDescription: eachJob.job_description,
          location: eachJob.location,
          packagePerAnnum: eachJob.package_per_annum,
          rating: eachJob.rating,
          title: eachJob.title,
        }))
        this.setState({
          allJobsState: apiStatusConstants.success,
          allJobsData: jobsData,
        })
      } else {
        this.setState({allJobsState: apiStatusConstants.noJobs})
      }
    } else {
      this.setState({allJobsState: apiStatusConstants.failure})
    }
  }

  getLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  getProfileFailureView = () => (
    <button type="button" className="retry-button" onClick={this.getProfile}>
      Retry
    </button>
  )

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearchInput = () => {
    this.getJobs()
  }

  onCheckEmployment = event => {
    const employmentType = event.target.value
    const {employmentTypeList} = this.state

    let employmentCount = 0

    employmentTypeList.forEach(employment => {
      if (employment === employmentType) {
        employmentCount += 1
      }
    })

    if (employmentCount === 0) {
      this.setState(
        prevState => ({
          employmentTypeList: [...prevState.employmentTypeList, employmentType],
        }),
        this.getJobs,
      )
    }
  }

  getEmploymentType = () =>
    employmentTypesList.map(eachEmployment => (
      <li
        key={eachEmployment.employmentTypeId}
        className="employment-type-li-container"
      >
        <input
          id={eachEmployment.employmentTypeId}
          type="checkbox"
          value={eachEmployment.employmentTypeId}
          onChange={this.onCheckEmployment}
        />
        <label
          htmlFor={eachEmployment.employmentTypeId}
          className="jobs-label-element"
        >
          {eachEmployment.label}
        </label>
      </li>
    ))

  onCheckSalary = event => {
    this.setState({salaryRange: event.target.value}, this.getJobs)
  }

  getSalaryRange = () =>
    salaryRangesList.map(eachSalary => (
      <li
        key={eachSalary.salaryRangeId}
        className="employment-type-li-container"
      >
        <input
          id={eachSalary.salaryRangeId}
          type="radio"
          value={eachSalary.salaryRangeId}
          onChange={this.onCheckSalary}
          name="salary"
        />
        <label
          htmlFor={eachSalary.salaryRangeId}
          className="jobs-label-element"
        >
          {eachSalary.label}
        </label>
      </li>
    ))

  getProfileSuccessView = () => {
    const {profileFullDetails} = this.state

    return (
      <div className="user-profile-container">
        <img
          src={profileFullDetails.profileImageUrl}
          className="profile-image"
          alt="profile"
        />
        <h1 className="profile-name">{profileFullDetails.name}</h1>
        <p className="profile-description">{profileFullDetails.shortBio}</p>
      </div>
    )
  }

  getProfileView = () => {
    const {profileState} = this.state

    switch (profileState) {
      case apiStatusConstants.inProgress:
        return this.getLoadingView()
      case apiStatusConstants.success:
        return this.getProfileSuccessView()
      case apiStatusConstants.failure:
        return this.getProfileFailureView()
      default:
        return null
    }
  }

  getProfileAndFiltersView = () => (
    <div className="profile-filters-container">
      <div className="small-search-container">
        <input
          type="search"
          className="input-container"
          placeholder="Search"
          onChange={this.onChangeSearchInput}
        />
        <button
          type="button"
          className="search-button"
          testid="searchButton"
          onClick={this.onClickSearchInput}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
      {this.getProfileView()}
      <hr className="separator" />
      <div className="employment-type-container">
        <h1 className="employment-type-text">Type of Employment</h1>
        <ul className="employment-type-ul-inside">
          {this.getEmploymentType()}
        </ul>
      </div>
      <hr className="separator" />
      <div className="employment-type-container">
        <h1 className="employment-type-text">Salary Range</h1>
        <ul className="employment-type-ul-inside">{this.getSalaryRange()}</ul>
      </div>
    </div>
  )

  getNoJobsView = () => (
    <div className="no-jobs-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        className="no-jobs-image"
        alt="no jobs"
      />
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="no-jobs-description">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  getJobsFailureView = () => (
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
      <button type="button" className="retry-button" onClick={this.getJobs}>
        Retry
      </button>
    </div>
  )

  getJobsSuccessView = () => {
    const {allJobsData} = this.state

    return (
      <ul className="jobs-container">
        {allJobsData.map(eachJob => (
          <AllJobs key={eachJob.id} jobDetails={eachJob} />
        ))}
      </ul>
    )
  }

  getAllJobsView = () => {
    const {allJobsState} = this.state

    switch (allJobsState) {
      case apiStatusConstants.inProgress:
        return this.getLoadingView()
      case apiStatusConstants.noJobs:
        return this.getNoJobsView()
      case apiStatusConstants.success:
        return this.getJobsSuccessView()
      case apiStatusConstants.failure:
        return this.getJobsFailureView()
      default:
        return null
    }
  }

  getJobsView = () => (
    <div className="jobs-view-container">
      <div className="medium-search-container">
        <input
          type="search"
          className="input-container"
          placeholder="Search"
          onChange={this.onChangeSearchInput}
        />
        <button
          type="button"
          className="search-button"
          testid="searchButton"
          onClick={this.onClickSearchInput}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
      {this.getAllJobsView()}
    </div>
  )

  render() {
    return (
      <>
        <Header />
        <div className="job-main-container">
          {this.getProfileAndFiltersView()}
          {this.getJobsView()}
        </div>
      </>
    )
  }
}

export default Jobs
