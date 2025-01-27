import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import styled from "styled-components";
import EmailVerification from "./EmailVerification";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/;
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  async function handleEmailSignUp(e) {
    e.preventDefault();
    if (loading) return;

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Try to sign up
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
            full_name: formData.fullName,
            avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              formData.fullName
            )}`,
          },
        },
      });

      if (error) {
        throw error;
      }

      // If we get an identities array and it's empty, the email exists
      if (data?.user?.identities && data.user.identities.length === 0) {
        setErrors((prev) => ({
          ...prev,
          email: "This email is already registered",
        }));
        return;
      }

      // If we got this far, it's a new signup
      if (data?.user) {
        setSuccess(true);
        setShowVerification(true);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrors((prev) => ({
        ...prev,
        general: error.message || "Failed to create account. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn(e) {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/app/cities`,
        },
      });
      if (error) throw error;
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: error.message,
      }));
    }
  }

  if (showVerification) {
    return <EmailVerification email={formData.email} />;
  }

  return (
    <Container>
      <FormCard>
        <Title>
          Welcome,
          <SubTitle>create your account</SubTitle>
        </Title>

        <Form onSubmit={handleEmailSignUp}>
          <InputGroup>
            <Input
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
            />
            {errors.fullName && <ErrorText>{errors.fullName}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <Input
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
            />
            {errors.username && <ErrorText>{errors.username}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            {errors.email && <ErrorText>{errors.email}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
            {errors.password && <ErrorText>{errors.password}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <ErrorText>{errors.confirmPassword}</ErrorText>
            )}
          </InputGroup>

          {errors.general && <GeneralError>{errors.general}</GeneralError>}
          {success && (
            <SuccessMessage>
              Registration successful! Check your email to confirm your account.
            </SuccessMessage>
          )}

          <SubmitButton disabled={loading}>
            {loading ? "Creating Account..." : "Create Account →"}
          </SubmitButton>

          <Divider>
            <DividerText>or</DividerText>
          </Divider>

          <GoogleButton onClick={handleGoogleSignIn} type="button">
            <GoogleIcon viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </GoogleIcon>
            Continue with Google
          </GoogleButton>
        </Form>

        <SignInText>
          Already have an account?{" "}
          <SignInLink onClick={() => navigate("/login")}>Sign in</SignInLink>
        </SignInText>
      </FormCard>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--color-dark--1);
  padding: 2rem;
`;

const FormCard = styled.div`
  background-color: #90ee90;
  padding: 2.5rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 24px;
  color: #323232;
  margin-bottom: 0.5rem;
`;

const SubTitle = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Input = styled.input`
  padding: 0.8rem 1rem;
  border: 2px solid ${(props) => (props.error ? "#e74c3c" : "#323232")};
  border-radius: 6px;
  background-color: beige;
  font-size: 16px;
  color: #323232;
  box-shadow: 4px 4px #323232;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.error ? "#e74c3c" : "#2d8cf0")};
  }
`;

const ErrorText = styled.span`
  color: #e74c3c;
  font-size: 13px;
  margin-top: 4px;
  padding: 8px;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 4px;
  border: 1px solid #e74c3c;
  display: block;
`;

const GeneralError = styled.div`
  color: #e74c3c;
  background-color: rgba(231, 76, 60, 0.1);
  border: 1px solid #e74c3c;
  padding: 0.8rem;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
  margin: 1rem 0;
`;

const SuccessMessage = styled.div`
  color: #2ecc71;
  background-color: rgba(46, 204, 113, 0.1);
  border: 1px solid #2ecc71;
  padding: 0.8rem;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
  margin: 1rem 0;
`;

const SubmitButton = styled.button`
  padding: 0.8rem;
  border: 2px solid #323232;
  border-radius: 6px;
  background-color: beige;
  color: #323232;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 4px 4px #323232;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px #323232;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;

  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #323232;
  }
`;

const DividerText = styled.span`
  padding: 0 1rem;
  color: #323232;
  font-size: 14px;
`;

const GoogleButton = styled(SubmitButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const GoogleIcon = styled.svg`
  width: 20px;
  height: 20px;
`;

const SignInText = styled.p`
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-top: 1.5rem;
`;

const SignInLink = styled.span`
  color: #2d8cf0;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    color: #1a7bd9;
  }
`;

export default SignupForm;
