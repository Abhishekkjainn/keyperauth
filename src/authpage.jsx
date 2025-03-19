import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function Authpage() {
  const [activeTab, setActiveTab] = useState('signin'); // Tracks active tab
  const [phone, setPhone] = useState(Array(10).fill('')); // Stores phone digits
  const inputRefs = useRef([]); // Refs for OTP inputs
  const hiddenInputRef = useRef(null); // Ref for hidden autofill input
  const { target, apikey } = useParams();

  // Handles input change for OTP fields
  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // Allow only digits
    const newPhone = [...phone];
    newPhone[index] = value;
    setPhone(newPhone);
    if (value && index < 9) inputRefs.current[index + 1].focus(); // Move to next input
  };

  function redirectToDecodedURI(encodedURI, apikey, token) {
    const decodedURI = decodeURIComponent(encodedURI);
    decodedURI = decodedURI + `/authkeyper/checktoken/${apikey}`;
    window.location.replace(decodedURI); // Permanent redirection
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

  return (
    <div className="authentication">
      <div className="authdiv">
        <div className="companydetails">
          <div className="logoandswitch">
            <img src="/logo.png" alt="Company Logo" className="companylogo" />
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
            <span className="compname">Keyper</span>
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
            />
            <div className="legend">Enter Password</div>
            <input
              type="password"
              className="passwordinput"
              name="password"
              autoComplete="current-password"
            />
            <div className="forgetpassword">Forgot Password?</div>
            <div className="buttonsection">
              <div className="button2" onClick={() => setActiveTab('register')}>
                Register Yourself
              </div>
              <div
                className="button1"
                onClick={() => redirectToDecodedURI(target, apikey)}
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
            />
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
            <div className="legend">Enter EmailId</div>
            <input
              type="text"
              className="emailinput"
              name="email"
              placeholder="johndoe@gmail.com"
              autoComplete="email"
            />
            <div className="legend">Enter Password</div>
            <input
              type="password"
              className="passwordinput"
              name="password"
              autoComplete="new-password"
            />
            <div className="buttonsection">
              <div className="button2" onClick={() => setActiveTab('signin')}>
                Sign In
              </div>
              <div className="button1">
                <img src="/signin.png" alt="" className="signinicon" /> Register
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
