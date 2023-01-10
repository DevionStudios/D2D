import React, { useState } from "react";
import {
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBBtn,
  MDBIcon,
  MDBInput,
} from "mdb-react-ui-kit";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/router";
import Spinner from "../Spinner";

const AuthTab = () => {
  const router = useRouter();
  const [justifyActive, setJustifyActive] = useState("tab1");
  const [signUpPassword, setSignUpPassword] = useState();
  const [signUpEmail, setSignUpEmail] = useState();
  const [signUpUsername, setSignUpUsername] = useState();
  const [signInPassword, setSignInPassword] = useState();
  const [signInEmail, setSignInEmail] = useState();
  const [validationCode, setValidationCode] = useState();
  const [isValidated, setIsValidated] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const processSignUp = async () => {
    toast.success("Request Sent!");
    // validate signUpPassword format
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{4,}$/;
    var reE =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!re.test(signUpPassword)) {
      console.log("error");
      toast.error(
        "Password Must Contain At Least 4 Characters, One Uppercase, One Lowercase, One Number And One Special Case Character"
      );
      return;
    }
    if (!reE.test(signUpEmail)) {
      toast.error("Invalid Email Detected!");
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/signup`,
        {
          email: signUpEmail,
          username: signUpUsername,
          password: signUpPassword,
        },
        { withCredentials: true }
      );
      if (res.status == 201) {
        const jwtToken = "admin_jwt=" + res.data.jwt;
        document.cookie = jwtToken + ";path=/";
        toast.success("Account Created Successfully");
        router.push("/admin");
      } else {
        toast.error("Error Occured! Check If You Already Have An Account!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error Occured! Check If You Already Have An Account!");
    }
  };

  const processSignIn = async () => {
    toast.success("Request Sent!");
    // validate signUpPassword format
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{4,}$/;
    var reE =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!re.test(signInPassword)) {
      console.log("error");
      toast.error(
        "Password Must Contain At Least 4 Characters, One Uppercase, One Lowercase, One Number And One Special Case Character"
      );
      return;
    }
    if (!reE.test(signInEmail)) {
      toast.error("Invalid Email Detected!");
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/signin`,
        {
          email: signInEmail,
          password: signInPassword,
        },
        { withCredentials: true }
      );
      if (res.status == 200) {
        const jwtToken = "admin_jwt=" + res.data.jwt;
        document.cookie = jwtToken + ";path=/";
        toast.success("Signed In Successfully");
        router.push("/admin");
      } else {
        console.log(res);
        toast.error("Error Occured! Something Went Wrong!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error Occured! Something Went Wrong!");
    }
  };

  const sendCode = async () => {
    toast.success("Request Sent!");
    var re = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
    if (!re.test(signUpEmail)) {
      toast.error("Invalid Email Detected!");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/verification/generate`,
        { email: signUpEmail },
        { withCredentials: true }
      );
      // !remove console.log(response.data);
      if (response.status == "200") {
        toast.success("Verification Code Sent");
        setIsSent(true);
        setIsValidated(false);
      }
    } catch (e) {
      toast.error("Unable To Send Verification Code");
      // !remove console.log(e);
    }
  };

  const verifyCode = async () => {
    toast.success("Request Sent!");
    var re = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
    if (!re.test(signUpEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/verification/compare`,
        { email: signUpEmail, code: validationCode },
        { withCredentials: true }
      );
      // !remove console.log(response.data);
      if (response.status == "200") {
        toast.success("Email Verified");
        setIsSent(true);
        setIsValidated(true);
      }
    } catch (e) {
      toast.error("Please enter a valid code!");
      // !remove console.log(e);
    }
  };
  const handleJustifyClick = (value) => {
    if (value === justifyActive) {
      return;
    }

    setJustifyActive(value);
  };

  return (
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
      <MDBTabs
        pills
        justify
        className="mb-3 d-flex flex-row justify-content-between"
      >
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleJustifyClick("tab1")}
            active={justifyActive === "tab1"}
            style={{ color: "white" }}
          >
            Login
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleJustifyClick("tab2")}
            active={justifyActive === "tab2"}
            style={{ color: "white" }}
          >
            Register
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>
        <MDBTabsPane show={justifyActive === "tab1"}>
          <h2 className="my-5 w-100 text-center">Log In</h2>
          <label>Email</label>
          <MDBInput
            wrapperClass="mb-4"
            id="form1"
            type="email"
            style={{ backgroundColor: "white", color: "black" }}
            onChange={(e) => {
              setSignInEmail(e.target.value);
            }}
            value={signInEmail}
          />
          <label>Password</label>
          <MDBInput
            wrapperClass="mb-4"
            id="form2"
            type="password"
            onChange={(e) => {
              setSignInPassword(e.target.value);
            }}
            value={signInPassword}
            style={{ backgroundColor: "white", color: "black" }}
          />
          <MDBBtn className="mb-4 w-100" onClick={() => processSignIn()}>
            Sign in
          </MDBBtn>
          <div className="d-flex justify-content-between mb-4">
            <Link href="/auth/forgot">Forgot Password?</Link>
          </div>
        </MDBTabsPane>

        <MDBTabsPane show={justifyActive === "tab2"}>
          <h2 className="my-5 w-100 text-center">Register</h2>
          <label>Username (Min : 3, Max:20)</label>
          <MDBInput
            wrapperClass="mb-4"
            id="form1"
            type="text"
            value={signUpUsername}
            onChange={(e) => {
              setSignUpUsername(e.target.value);
            }}
            style={{ backgroundColor: "white", color: "black" }}
          />
          <label>Email</label>
          <MDBInput
            wrapperClass="mb-4"
            id="form1"
            type="email"
            value={signUpEmail}
            style={{ backgroundColor: "white", color: "black" }}
            onChange={(e) => {
              setSignUpEmail(e.target.value);
            }}
          />
          <label>Password</label>
          <MDBInput
            wrapperClass="mb-4"
            id="form1"
            type="password"
            value={signUpPassword}
            style={{ backgroundColor: "white", color: "black" }}
            onChange={(e) => {
              setSignUpPassword(e.target.value);
            }}
          />
          {isSent && (
            <>
              <label>Validation Code</label>
              <MDBInput
                wrapperClass="mb-4"
                id="form1"
                type="password"
                value={validationCode}
                style={{ backgroundColor: "white", color: "black" }}
                onChange={(e) => {
                  setValidationCode(e.target.value);
                }}
              />
            </>
          )}
          <MDBBtn className="mb-4 w-100" onClick={() => sendCode()}>
            {isSent ? "Resend Code" : "Send Code"}
          </MDBBtn>
          {isSent && (
            <MDBBtn className="mb-4 w-100" onClick={() => verifyCode()}>
              Verify Code
            </MDBBtn>
          )}
          <MDBBtn
            className="mb-4 w-100"
            onClick={() => processSignUp()}
            disabled={!(isValidated && isSent)}
          >
            {isValidated && isSent ? "Sign Up" : "Verify Email First"}
          </MDBBtn>
        </MDBTabsPane>
      </MDBTabsContent>
      <Toaster />
    </MDBContainer>
  );
};

export default AuthTab;
