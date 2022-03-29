import { useState } from "react";
import Axios from "axios";
import { BrowserRouter, Route, Switch } from "react-router-dom";

function RequestForm() {
  const [requestDate, setRequestDate] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [dob, setDOB] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [property, setProperty] = useState("");
  const [employeeList, setEmployeeList] = useState([]);

  const addEmployee = () => {
    Axios.post("http://localhost:3001/create", {
      requestDate: requestDate,
      joiningDate: joiningDate,
      employeeId: employeeId,
      dob: dob,
      employeeName: employeeName,
      designation: designation,
      department: department,
      property: property,
    }).then(() => {
      console.log("success");
    });
  };


  return (
    <div className="Information">
    <label>Request Date:</label>
    <input
      type="date"
      onChange={(event) => {
        setRequestDate(event.target.value);
      }}
    ></input>
    <label>Joining Date:</label>
    <input
      type="date"
      onChange={(event) => {
        setJoiningDate(event.target.value);
      }}
    ></input>
    <label>Employee Id:</label>
    <input
      type="text"
      onChange={(event) => {
        setEmployeeId(event.target.value);
      }}
    ></input>
    <label>Date of Birth:</label>
    <input
      type="date"
      onChange={(event) => {
        setDOB(event.target.value);
      }}
    ></input>
    <label>Employee Name:</label>
    <input
      type="text"
      onChange={(event) => {
        setEmployeeName(event.target.value);
      }}
    ></input>
    <label>Designation:</label>
    <input
      type="text"
      onChange={(event) => {
        setDesignation(event.target.value);
      }}
    ></input>
    <label>Department:</label>
    <input
      type="text"
      onChange={(event) => {
        setDepartment(event.target.value);
      }}
    ></input>
    <label>Property:</label>
    <input
      type="text"
      onChange={(event) => {
        setProperty(event.target.value);
      }}
    ></input>
    <button onClick={addEmployee}>Submit</button>
  </div>
  )
}

export default RequestForm;