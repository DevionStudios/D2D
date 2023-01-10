import React, { useState } from "react";
import {
  MDBContainer,
  MDBInput,
  MDBCheckbox,
  MDBBtn,
  MDBIcon,
} from "mdb-react-ui-kit";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/router";

function ForgotTab() {
  const [isVerified, setIsVerified] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [validationCode, setValidationCode] = useState();
  const router = useRouter();

  const resetPassword = async () => {
    // validate password format
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{4,}$/;
    if (!re.test(password)) {
      toast.error(
        "Password must be at least 4 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
      return;
    }

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/resetpassword`,
        {
          email: email,
          password: password,
        },
        { withCredentials: true }
      );
      console.log(res.data);
      const jwtToken = "admin_jwt=" + res.data.jwt;
      document.cookie = jwtToken + ";path=/";
      toast.success("Password Reset Successful!");
      router.push("/auth/access");
    } catch (error) {
      toast.error("Error Occured! Please retry!");
    }
  };

  const sendVerificationCode = async () => {
    var re = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
    if (!re.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/verification/generate`,
        { email: email },
        { withCredentials: true }
      );
      console.log(response.data);
      toast.success("Verification Code Sent");
      setIsSent(true);
      setIsVerified(false);
    } catch (e) {
      toast.error("Unable To Send Verification Code");
      console.log(e);
    }
  };

  const verifyVerificationCode = async () => {
    var re = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
    if (!re.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/verification/compare`,
        { email: email, code: validationCode },
        { withCredentials: true }
      );
      console.log(response.data);
      if (response.status == "200") {
        toast.success("Email Verified");
        setIsSent(true);
        setIsVerified(true);
      }
    } catch (e) {
      toast.error("Please enter a valid code!");
      console.log(e);
    }
  };
  return (
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
      <h1 className="mb-5 w-100 text-center">Forgot Password</h1>
      <label>Email</label>
      <MDBInput
        wrapperClass="mb-4"
        id="form1"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ backgroundColor: "white", color: "black" }}
      />
      <label>New Password</label>
      <MDBInput
        wrapperClass="mb-4"
        id="form2"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ backgroundColor: "white", color: "black" }}
      />
      {isSent && (
        <>
          <label>Verification Code</label>
          <MDBInput
            wrapperClass="mb-4"
            id="form2"
            type="text"
            value={validationCode}
            onChange={(e) => setValidationCode(e.target.value)}
            style={{ backgroundColor: "white", color: "black" }}
          />
        </>
      )}
      <MDBBtn className="mb-4" onClick={() => sendVerificationCode()}>
        {isSent ? "Resend Code" : "Send Code"}
      </MDBBtn>
      {isSent && (
        <MDBBtn className="mb-4" onClick={() => verifyVerificationCode()}>
          Verify
        </MDBBtn>
      )}
      <MDBBtn
        className="mb-4"
        onClick={() => resetPassword()}
        disabled={!(isVerified && isSent)}
      >
        {isVerified && isSent ? "Reset Password" : "Verify First"}
      </MDBBtn>
      <div className="w-100 p-1 text-justify text-center">
        <h6 className="p-3 my-5">
          Go To{" "}
          <Link href="/auth/access" className=" text-primary">
            Sign In
          </Link>{" "}
          Page
        </h6>
      </div>
      <Toaster />
    </MDBContainer>
  );
}

export default ForgotTab;
