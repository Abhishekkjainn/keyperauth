import { useState, useRef, useEffect, use } from 'react';
import { useParams } from 'react-router-dom';
import Loader from './loader';
import ErrorPage from './error';
import { useNavigate } from 'react-router-dom';

export default function Authpage() {
  const [activeTab, setActiveTab] = useState('signin'); // Tracks active tab
  const [phone, setPhone] = useState(Array(10).fill('')); // Stores phone digits
  const inputRefs = useRef([]); // Refs for OTP inputs
  const hiddenInputRef = useRef(null); // Ref for hidden autofill input
  const { target, apikey } = useParams();
  // const [loading, setLoading] = useState(true); // Loader state
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [finalphone, setFinalPhone] = useState('');
  const [passerror, setPasserror] = useState('');

  const [regusername, setRegusername] = useState('');
  const [regpass, setRegpass] = useState('');
  const [regemail, setRegEmail] = useState('');

  const navigate = useNavigate(); // For navigation

  //Fetches the api for
  const fetchApiKeyData = async (apikey) => {
    console.log(apikey);
    var API_URL = `https://keyperapi.vercel.app/apikey/${apikey}`;

    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch API Key data');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Invalid API Key');
      }
      setData(result.data); // Store data in state
    } catch (error) {
      setError('Error fetching API Key data'); // Store error in state
    } finally {
      setLoading(false); // Hide loader after fetching
    }
  };

  // Handles input change for OTP fields
  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // Allow only digits
    const newPhone = [...phone];
    newPhone[index] = value;
    setPhone(newPhone);
    if (value && index < 9) inputRefs.current[index + 1].focus(); // Move to next input
  };

  function redirectToDecodedURI(encodedURI, token) {
    let decodedURI = decodeURIComponent(encodedURI);

    // Ensure there's a '/' before appending the path
    if (!decodedURI.endsWith('/')) {
      decodedURI += '/';
    }

    decodedURI += `authkeyper/checktoken/${token}/${apikey}`;
    window.location.replace(decodedURI);
  }

  // Handles backspace key
  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !phone[index] && index > 0) {
      inputRefs.current[index - 1].focus(); // Move to previous input
    }
  };

  // Handles paste event
  const handlePaste = (event) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData('text').replace(/\D/g, ''); // Remove non-digits
    if (pasteData.length === 10) {
      setPhone(pasteData.split(''));
      inputRefs.current[9].focus(); // Focus last input
    }
  };

  // Handles autofill
  useEffect(() => {
    const hiddenInput = hiddenInputRef.current;
    if (hiddenInput) {
      const handleAutofill = (event) => {
        const autofillValue = event.target.value.replace(/\D/g, ''); // Remove non-digits
        if (autofillValue.length === 10) {
          setPhone(autofillValue.split(''));
          inputRefs.current[9].focus(); // Focus last input
        }
      };
      hiddenInput.addEventListener('input', handleAutofill);
      return () => hiddenInput.removeEventListener('input', handleAutofill); // Cleanup
    }
  }, []);

  useEffect(() => {
    fetchApiKeyData(apikey);
  }, [apikey]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="errordiv">
        {error ? (
          <ErrorPage
            error={error}
            retryFunction={() => fetchApiKeyData(apikey)}
          />
        ) : (
          <p>Data Loaded Successfully</p>
        )}
      </div>
    );
  }

  function handleEmailchange(email) {
    setEmail(email);
  }

  function handlePasswordchange(password) {
    setPassword(password);
  }

  function handleregusername(name) {
    setRegusername(name);
  }

  function handleregemail(email) {
    setRegEmail(email);
  }

  function handleregpassword(password) {
    setRegpass(password);
  }

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validates if the input is a valid phone number
  const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^\d{10}$/; // Adjust the regex based on your requirements
    return phoneRegex.test(phone);
  };
  const decideUsername = (phone, email) => {
    var desiredusername = '';
    if (isValidPhoneNumber(phone)) {
      setUsername(phone);
      desiredusername = phone;
    } else if (isValidEmail(email)) {
      setUsername(email);
      desiredusername = email;
    } else {
      setPasserror('Please enter a valid email or phone number.');
    }
  };

  // const handleSignIn = async (phone, email, password, target, apikey) => {
  //   setLoading(true);

  //   var desiredusername = '';
  //   if (isValidPhoneNumber(phone)) {
  //     setUsername(phone);
  //     desiredusername = phone;
  //   } else if (isValidEmail(email)) {
  //     setUsername(email);
  //     desiredusername = email;
  //   } else {
  //     setPasserror('Please enter a valid email or phone number.');
  //   }
  //   console.log(desiredusername);
  //   if (!desiredusername) {
  //     console.log(desiredusername);
  //     return; // Exit if username is not set due to invalid input
  //   }
  //   // username = decideUsername(email, phone);
  //   const apiurl = `http://localhost:6969/signin/username/${desiredusername}/password/${password}/apikey/${apikey}`;
  //   const response = await fetch(apiurl, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   });
  //   setLoading(false);
  //   console.log(response);

  //   if (!response.ok) {
  //     // Handle different error status codes
  //     if (response.status === 401) {
  //       setPasserror('Authentication failed. Incorrect password.');
  //     } else if (response.status === 404) {
  //       setPasserror('No user found with the provided username.');
  //     } else if (response.status === 400) {
  //       setPasserror('Please Check if Email or Phone is Correct.');
  //     } else {
  //       setPasserror('Something went wrong. Please try again.');
  //     }
  //     return;
  //   }

  //   const result = await response.json();
  //   console.log(result);

  //   const token = result.token;
  //   console.log(token);
  //   redirectToDecodedURI(target, token);
  // };

  const handleSignIn = async (phone, email, password, target, apikey) => {
    setLoading(true);

    let desiredusername = '';
    if (isValidPhoneNumber(phone)) {
      setUsername(phone);
      desiredusername = phone;
    } else if (isValidEmail(email)) {
      setUsername(email);
      desiredusername = email;
    } else {
      setPasserror('Please enter a valid email or phone number.');
      setLoading(false);
      return;
    }

    console.log('Desired username:', desiredusername);
    if (!desiredusername) {
      console.error('No valid username provided.');
      setLoading(false);
      return;
    }

    const apiurl = `https://keyperapi.vercel.app/signin/username/${desiredusername}/password/${password}/apikey/${apikey}`;
    try {
      const response = await fetch(apiurl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('API Response:', response);

      if (!response.ok) {
        // Handle different error status codes
        const errorData = await response.json();
        console.error('API Error:', errorData);

        if (response.status === 401) {
          setPasserror('Authentication failed. Incorrect password.');
        } else if (response.status === 404) {
          setPasserror('No user found with the provided username.');
        } else if (response.status === 400) {
          setPasserror('Please check if email or phone is correct.');
        } else {
          setPasserror('Something went wrong. Please try again.');
        }
        setLoading(false);
        return;
      }

      const result = await response.json();
      console.log('API Result:', result);

      if (!result.success) {
        setPasserror(result.message || 'Authentication failed.');
        setLoading(false);
        return;
      }

      const token = result.token;
      console.log('Token received:', token);

      // Redirect using the token
      redirectToDecodedURI(target, token);
    } catch (error) {
      console.error('Network or API error:', error);
      setPasserror('Network error. Please try again.');
      setLoading(false);
    }
  };

  const handleRegister = async (phone, email, password, name) => {
    setLoading(true);
    // console.log('API URL:', apiurl);
    console.log(
      'username:',
      name,
      'email:',
      email,
      'phone:',
      phone,
      'password:',
      password
    );

    // Validate phone number
    if (!isValidPhoneNumber(phone)) {
      setPasserror('Please enter a valid phone number.');
      setLoading(false);
      return;
    }

    // Validate email
    if (!isValidEmail(email)) {
      setPasserror('Please enter a valid email.');
      setLoading(false);
      return;
    }

    try {
      const apiurl = `https://keyperapi.vercel.app/registeruser/name/${name}/email/${encodeURIComponent(
        email
      )}/phone/${phone}/password/${encodeURIComponent(password)}`;
      const response = await fetch(apiurl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      setLoading(false);
      console.log(result);

      if (!response.ok) {
        if (response.status === 409) {
          setPasserror(
            result.message.includes('Email')
              ? 'The Provided Email is Already Registered.'
              : 'The Provided Phone is Already Registered.'
          );
        } else if (response.status === 500) {
          setPasserror(
            `Internal Server Error, Please Try Again. ${result.error}`
          );
        } else {
          setPasserror(
            result.message || 'Something went wrong. Please try again.'
          );
        }
        return;
      }

      if (!result.success) {
        setPasserror(result.message || 'Registration failed.');
        return;
      }

      // If registration is successful, navigate to home ('/')
      setPasserror('');
      setLoading(false);
      setRegEmail('');
      setRegpass('');
      setRegusername('');
      window.location.reload();
      // setActiveTab('signin');
    } catch (error) {
      setPasserror('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="authentication">
      <div className="authdiv">
        <div className="companydetails">
          <div className="logoandswitch">
            <img
              src={data.imageurl}
              alt="Company Logo"
              className="companylogo"
            />
            <div className="switchtoregister">
              <div className="switch-container">
                <button
                  className={`switch-btn ${
                    activeTab === 'signin' ? 'active' : ''
                  }`}
                  onClick={() => setActiveTab('signin')}
                >
                  Sign In
                </button>
                <button
                  className={`switch-btn ${
                    activeTab === 'register' ? 'active' : ''
                  }`}
                  onClick={() => setActiveTab('register')}
                >
                  Register
                </button>
              </div>
            </div>
          </div>
          <div className="companyname">
            {activeTab === 'signin' ? 'Welcome back to ' : 'Join '}
            <span className="compname">{data.platformname}</span>
          </div>
          <div className="compdesc">
            {activeTab === 'signin'
              ? 'Sign in to continue.'
              : 'Create an account to get started.'}
          </div>
        </div>

        {/* Sign In Form */}
        {activeTab === 'signin' && (
          <div className="authform">
            <div className="legend">Enter Your Phone Number</div>
            <div className="phoneinput">
              {phone.map((digit, index) => (
                <input
                  key={index}
                  type="tel"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="otp-input"
                  aria-label={`Digit ${index + 1}`}
                  placeholder="X"
                />
              ))}
            </div>
            <input
              type="tel"
              ref={hiddenInputRef}
              style={{ opacity: 0, position: 'absolute', left: '-9999px' }}
              aria-hidden="true"
              name="phone"
              autoComplete="tel"
              onPaste={handlePaste}
            />
            <div className="seperator">
              <div className="side1"></div>
              <div className="tag">Or Enter Email Id</div>
              <div className="side2"></div>
            </div>
            <div className="legend">Enter EmailId</div>
            <input
              type="text"
              className="emailinput"
              name="email"
              placeholder="johndoe@gmail.com"
              autoComplete="email"
              value={email}
              onChange={(e) => handleEmailchange(e.target.value)}
            />
            <div className="legend">Enter Password</div>
            <input
              type="password"
              className="passwordinput"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => handlePasswordchange(e.target.value)}
            />
            <div className="forgetpassword">Forgot Password?</div>
            {passerror == '' ? (
              <div className="nothing"></div>
            ) : (
              <div className="passerror">{passerror}</div>
            )}
            <div className="buttonsection">
              <div className="button2" onClick={() => setActiveTab('register')}>
                Register Yourself
              </div>
              <div
                className="button1"
                onClick={() => {
                  const combinedPhone = phone.join('');
                  console.log(combinedPhone);
                  handleSignIn(combinedPhone, email, password, target, apikey);
                }}
              >
                <img src="/signin.png" alt="" className="signinicon" /> Sign In
              </div>
            </div>
          </div>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <div className="authform">
            <div className="legend">Enter Your Full Name</div>
            <input
              type="text"
              className="emailinput"
              name="nameinput"
              placeholder="John Doe"
              onChange={(e) => {
                handleregusername(e.target.value);
                console.log('Updated regusername:', e.target.value);
              }}
            />
            <div className="legend">Enter Your Phone Number</div>
            <div className="phoneinput">
              {phone.map((digit, index) => (
                <input
                  key={index}
                  type="tel"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => {
                    handleChange(index, e.target.value);
                    console.log(e.target.value);
                  }}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="otp-input"
                  aria-label={`Digit ${index + 1}`}
                  placeholder="X"
                />
              ))}
            </div>
            <div className="legend">Enter EmailId</div>
            <input
              type="text"
              className="emailinput"
              name="email"
              placeholder="johndoe@gmail.com"
              autoComplete="email"
              onChange={(e) => {
                // setRegEmail(e.target.value);
                handleregemail(e.target.value);
                console.log('Updated regemail:', e.target.value);
              }}
            />
            <div className="legend">Enter Password</div>
            <input
              type="password"
              className="passwordinput"
              name="password"
              autoComplete="new-password"
              onChange={(e) => {
                handleregpassword(e.target.value);
                console.log(e.target.value);
              }}
            />
            <div className="passerror">{passerror}</div>
            <div className="buttonsection">
              <div className="button2" onClick={() => setActiveTab('signin')}>
                Sign In
              </div>
              <div
                className="button1"
                onClick={() => {
                  const combinedPhone = phone.join('');
                  console.log(combinedPhone);
                  handleRegister(combinedPhone, regemail, regpass, regusername);
                }}
              >
                <img src="/signin.png" alt="" className="signinicon" /> Register
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
