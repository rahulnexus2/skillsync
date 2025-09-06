import React from "react";

import {
  useForm,
} from "react-hook-form";

export const Signup = () => {
  const { 
    register, 
    handleSubmit, 
    watch, 
    formState: { errors } 
  } = useForm();

    const onSubmit=(data)=>{
      console.log(data);
    }
  return (<>
  <form onSubmit={handleSubmit(onSubmit)}>
    <label >Enter your username</label>
    <input type="text"  placeholder="" {...register({username:{minLength:10}})}/>

  </form>
  
  </>);
};


