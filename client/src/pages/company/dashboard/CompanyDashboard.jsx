import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidemenu, { SidebarItem } from "../../../Components/sidemenu/Sidemenu";
import { FaRegUser } from "react-icons/fa";
import { LuGraduationCap } from "react-icons/lu";
import { IoNewspaperOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";
import { GiDirectorChair } from "react-icons/gi";
import LoadingPage from "../../LoadingPage";
import { MdAutoGraph } from "react-icons/md";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { createContext } from 'react';
import CompanyDashHeader from './CompanyDashHeader'
import { getCompanyData , RESET_COMPANY_UTIL } from "../../../redux/features/company/utilService/companyUtilSlice";
import {
  SET_GLOBAL,
  getLoginStatus,
} from "../../../redux/features/common/globalSlice";

const CompanyDashboard = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const globalAuth = useSelector((state) => state.globalAuth);

  const { isLoggedIn, isLoading, isSuccess, company, message } =
    useSelector((state) => state.companyUtil);

    console.log(company);
    useEffect(() => {   
      if (
        isLoggedIn &&
        isSuccess &&
        globalAuth.isLoggedin &&
        globalAuth.userType === "company" &&
        company.role !== "suspended"
      ) {
        toast.success(
          `Welcome, ${
            company.personalDetail.firstName +
            " " +
            company.personalDetail.lastName
          }`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
      }
  
      else if (globalAuth.isLoggedin && globalAuth.isSuccess) {
  
        dispatch(getCompanyData());
  
      } 
  
      else if ( !globalAuth.isLoggedin && globalAuth.isSuccess && globalAuth.userType !== "company"
      ) {
        toast.info("Signed Out successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        // dispatch(SET_GLOBAL("college-staff"));
        navigate("/signin");
      }
      else{
        dispatch(getLoginStatus());
      }
    }, [getLoginStatus.isLoggedin, globalAuth.isSuccess , globalAuth.userType ,company]);


    const [sidemenuExpanded, setSidemenuExpanded] = useState(true);

  function sidemenuState(val) {
    setSidemenuExpanded(!val);
    // console.log(sidemenuExpanded);
  }

  const [apiURL , setAPIURL] = useState('')

  return (
    <div>
    {
    // company?.role && company.role === "Suspended" ? 
    // (
    //   <div className="h-screen w-screen  text-6xl flex justify-center items-center bg-slate-100 absolute z-50 top-0 left-0">
    //     You are Suspended, Contact Admin{" "}
    //   </div>
    // ) : 
    (
      <div
        className={`relative flex w-screen h-screen  ${
          isLoading && " opacity-50 "
        }`}
      >
        {/* {isLoading && <LoadingPage height="screen" width="screen" />} */}

        <div>
          <Sidemenu 
            sidemenuState={sidemenuState}
            emailID={company?.personalDetail.emailID}
            firstName={company?.personalDetail.firstName}
            lastName={company?.personalDetail.lastName}
            profileImgLink={company?.personalDetail.profilePicture}
          >
            <SidebarItem icon={<FaRegUser />} text="Profile" active />

            <SidebarItem
              icon={<LuGraduationCap size={16} />}
              text="Students"
            /> 

            <SidebarItem icon={<FaRegUser />} text="Job Posts"  />
            <SidebarItem icon={<FaRegUser />} text="Applicants"  />


            <SidebarItem icon={<FaRegClock />} text="Reset Password" active />
          </Sidemenu>
        </div>

        <div
          className={`flex flex-col  ${
            sidemenuExpanded ? "w-[85%]" : "w-[97%]"
          } absolute right-0 top-0 h-screen`}
        >
          {/* <StudentSidemenu/> */}
          <apiContext.Provider value= { {apiURL,setAPIURL}} >
          <CompanyDashHeader />
          <Outlet />
          </apiContext.Provider>
            
        </div>
      </div>
    )}
  </div>
  )
}
export const apiContext = createContext();

export default CompanyDashboard