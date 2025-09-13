import React,{useState} from 'react'
import Select from 'react-select'

const AdminAbout = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const options=[
    {value:"createJob",label:"CreateJob"},
    {value:"applicationreview",label:"ApplicationReview"},
    {value:"createQuiz",label:"CreateQuiz"},


  ]
  return (
    <div>
      <h1>this  is about section</h1>
      
    </div>
  )
}

export default AdminAbout
