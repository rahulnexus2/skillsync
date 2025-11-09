import React from 'react'
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from 'jwt-decode';


export const JobCreation = () => {

  const {
      register,
      handleSubmit,
      setError,
      formState: { errors },
    } = useForm();

    const navigate=useNavigate();
    const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/admin/createjob",
        data
      );
      
      alert(res.data.message);

    }catch (err) {
      const backendErrors = err.response?.data?.errors;
      const globalErrors = err.response?.data?.message;
      if (backendErrors) {
        Object.keys(backendErrors).forEach((field) => {
          setError(field, { type: "server", message: backendErrors[field] });
        });
      } else if (globalErrors) {
        setError("root", { type: "server", message: globalErrors });
      }
    };
  return (
    <div>
       <form onSubmit={handleSubmit(onSubmit)}>
      <label >job title</label>
      <input type="text" placeholder='enter job title'{...register("jobTitile",{
        required:{value:true,message:"job title cannot be empty"},
        maxLength:{value:12,message:"job title cannot exceed 12 characters"}
      })} />
      {errors.jobTitle&&(
        <p>{errors.jobTitle.message}</p>
      )}


      <label >company Name</label>
      <input type="text" placeholder='enter company name' {...register("company",{
        required:{value:true,message:"company name should be specified"}
      })} />
      
      {errors.company&&(
        <p>{errors.company.message}</p>
      )}


      <label > add jobDescription</label>
      <input type="text" placeholder='add jobDescription'{...register("jobDescription",{
        required:{value:true,message:"job description is compulsary"}
      })}/>
      {errors.jobDescription&&(
        <p>{errors.jobDescription.message}</p>
      )}

      <label > add jobType</label>
      <input type="text" placeholder='add  eg remote, fulltime ,internship'{...register("jobType",{
        required:{value:true,message:"jobType must be specified"}
      })}/>
      {errors.jobType&&(
        <p>{errors.jobType.message}</p>
      )}

      <label > add jobLocation</label>
      <input type="text" placeholder='add  eg remote, fulltime ,internship'{...register("location",{
        required:{value:true,message:"jobLocation must be specified"}
      })}/>
      {errors.joblocation&&(
        <p>{errors.location.message}</p>
      )}

      <label > Required skills</label>
      <input type="text" placeholder='add  eg remote, fulltime ,internship'{...register("skills",{
        required:{value:true,message:"jobskills must be specified"}
      })}/>
      {errors.skills&&(
        <p>{errors.skills.message}</p>
      )}

      <label >application deadline </label>
      <input type="text" placeholder='add  eg remote, fulltime ,internship'{...register("deadline",{
        required:{value:true,message:"deadline must be specified"}
      })}/>
      {errors.deadline&&(
        <p>{errors.deadline.message}</p>
      )}

           {errors.root && (<p>
             {errors.root.message}
           </p>)}
            <button
             type="submit">submit</button>
           </form>
    </div>
  )
}

}
