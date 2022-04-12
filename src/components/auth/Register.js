import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import InstagramEmbed from 'react-instagram-embed';
import { register, socialMediaSignUp, generateTokenTwo } from '../../actions/auth';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-awesome-modal';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const auth = useSelector(state => state.auth)
    useEffect(() => {
        const body = document.querySelector('#root');
        body.scrollIntoView({
            behavior: 'smooth'
        }, 500)
    }, []);

    useEffect(() => {
        window.twttr.events.bind(
            'follow',
            function (intentEvent) {
                if (!intentEvent) return;
                var label = intentEvent.data.user_id + " (" + intentEvent.data.screen_name + ")";

                setFollowSocialMediaStep('TWITTER_TWEET_RETWEET')
                console.log('Twitter User : ', label)
            }
        );

        window.twttr.events.bind(
            'retweet',
            function(intentEvent) {
                if (!intentEvent) return;
                var retweetedTweetId = intentEvent.data.source_tweet_id;

                setFollowSocialMediaStep('JOIN_FACEBOOK') //
                console.log('retweetedTweetId : ', retweetedTweetId)
            }
        );
    },[])
    
    useEffect(() => {
        if(auth.is_logged_in_first_time){
            setShowModal(true)
        } else {
            setShowModal(false)
        }
    },[auth])

    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const isLoggedInFirstTime = useSelector(state => state.auth.is_logged_in_first_time);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        password_confirm: '',
    });
    
    const [showModal, setShowModal] = useState(false);

    const { email, password, password_confirm } = formData;
    const [followSocialMediaStep, setFollowSocialMediaStep] = useState('TWITTER_FOLLOW'); // TWITTER_FOLLOW | TWITTER_TWEET_RETWEET | JOIN_FACEBOOK | JOIN_DISCORD | JOIN_INSTAGRAM 

    const setContentRef = useRef(null);
    function handleIframe() {
        
        const iframeItem = setContentRef.current;
        // const discordBtn = iframeItem.contentWindow.document.getElementsByTagName("a");
        // a tag class name widgetBtnConnect-2fvtGa
        
        // console.log('discordBtn >>> ', iframeItem.contentWindow.window.document)
    }

    const onCreateAccount = () => {
        if (password !== password_confirm) {
            toast.warning('Passwords do not match', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            }) 
        } else {
            const data = {
                email: email, 
                password: password
            }
            dispatch(register(data))
        }
    }

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    
    /* GOOGLE SIGNUP */
    const responseGOAuthSignup = (authResponse) => {
        if (!authResponse.error) {
            let body = {
                ...authResponse,
                register_type: 'GOOGLE'
            }
            dispatch(socialMediaSignUp(body));
        }
    }

    /* FACEBOOK SIGNUP */
    const responseFOAuthSignup = (authResponse) => {
        // console.log('FB authResponse >> ', authResponse)
        if (authResponse.accessToken) {
            let body = {
                ...authResponse,
                register_type: 'FB'
            }
            dispatch(socialMediaSignUp(body));
        }
    }
    
    if (isAuthenticated && !isLoggedInFirstTime) {
        return <Navigate to="/profile/overview" />
    }
    
    const onInstagramEmbedFail = (e) => {
        console.log('onInstagramEmbedFail >> ', e)
    }
    
    const onInstagramEmbedSuccess = (e) => {
        console.log('onInstagramEmbedSuccess >> ', e)
    }

    const proceedWithReddit = (e) => {
        console.log('proceedWithReddit >>>> ', e)
        dispatch(generateTokenTwo());
    }
    
    return (
        <Fragment>
            <ToastContainer />
            <div style={{ height: '230px' }}></div>
            <div className='create_game'>
                <img src='assets/custom/images/girl.png' width="330px" height="752px" />
                <div className='right'>
                    <div className='panel1'>
                    <span>Sign Up</span>
                    </div>
                    <div className='panel2'>
                    <div className='email_panel'>
                        <span>Email</span>
                        <input 
                            type="email" 
                            name="email"
                            placeholder='abc@gmail.com' 
                            onChange={onChange}
                            />
                    </div>
                    <div className='email_panel'>
                        <span>Password</span>
                        <input 
                            type="password" 
                            name="password"
                            placeholder='Password' 
                            onChange={onChange}
                            />
                    </div>
                    <div className='email_panel'>
                        <span>Password Confirm</span>
                        <input 
                            type="password" 
                            name="password_confirm"
                            placeholder='Password' 
                            onChange={onChange}
                            />
                    </div>
                    </div>
                    <button className='panel3' onClick={() => onCreateAccount()}><span>Create Account</span></button>
                    <div className='login-plug'>
                        <GoogleLogin className='g-login'
                            clientId="860538264827-8qf2qpp6mqki8asmbpsroulb9u16un61.apps.googleusercontent.com"
                            buttonText="Signup"
                            onSuccess={responseGOAuthSignup}
                            onFailure={responseGOAuthSignup}
                            cookiePolicy={'single_host_origin'}
                        />
                        <FacebookLogin cssClass="g-login p-3 pr-5 bg-white text-secondary w-100 font-weight-light"
                            appId="984455555809462"
                            textButton="Signup"
                            fields="name,email,picture"
                            callback={responseFOAuthSignup}
                            icon="fa fa-facebook mr-4 ml-3 text-primary"
                        />   
                    </div>
                    <span className='panel4'>By continuing, you agree to Metafomo's Terms of Service and confirm that you have read Metafomo's Privacy Policy.</span>
                    <div className='panel5'>
                    You already have an account? &nbsp;<Link to="/login"><span>Connect now</span></Link>
                    </div>
                </div>
                <Modal visible={showModal} effect="fadeInUp">
                    {followSocialMediaStep == 'TWITTER_FOLLOW' ? 
                        <div className="container p-5">
                            <h6 className="text-dark">Follow Twitter Page To Continue</h6>
                            
                            <a href="'https://twitter.com/MetaFomos?ref_src=twsrc%5Etfw'" className="twitter-follow-button" data-show-count="true" data-size="large" id="tweetFollow">Follow @MetaFomos</a>
                        </div>
                    : null }

                    {followSocialMediaStep == 'TWITTER_TWEET_RETWEET' ? 
                        <div className="container p-5">
                            <h6 className="text-dark">Retweet Our Tweet To Continue</h6>
                            <a href="https://twitter.com/intent/retweet?tweet_id=1506696201093058560&via=MetaFomos&hashtags=MetaFomos" style={{fontSize:'14px', fontStyle: 'normal', fontFamily: '"Helvetica Neue", Arial, sans-serif', position: 'relative', height: '20px', boxSizing: 'border-box', padding: '6px 12px 6px 12px', backgroundColor: '#1d9bf0', color: '#fff', borderRadius: '9999px', fontWeight: '500', cursor: 'pointer'}} id="tweetRetweet">  <i class="fa fa-twitter"></i> Retweet</a>
                        </div>
                    : null }
                    
                    {followSocialMediaStep == 'JOIN_INSTAGRAM' ? 
                        <div className="container p-5">
                            <h6 className="text-dark">Join Us On Instagram To Continue</h6>
                            
                            <InstagramEmbed
                                url= 'https://www.instagram.com/metafomos'
                                clientAccessToken="637258717349315|e15e7baaff0a432ad4acb78734ef3bfc"
                                maxWidth={320}
                                hideCaption={false}
                                containerTagName='div'
                                protocol=''
                                injectScript
                                onLoading={() => {}}
                                onSuccess={() => { onInstagramEmbedSuccess() }}
                                onFailure={() => { onInstagramEmbedFail() }}
                                />
                        </div>
                    : null }

                    { followSocialMediaStep == 'JOIN_DISCORD' ? 
                        <div className="container p-5">
                            <h6 className="text-dark">Connect Us With Discord</h6>
                            {/* 
                                IN BELLOW DISCORD WIDGET id=944198467440500757 IS FOR TESTING CREATE AND  REPLACE YOUR DISCORD SERVER ID HERE!
                            */}
                            <iframe ref={setContentRef} src="https://discord.com/widget?id=944198467440500757&theme=dark" width="350" height="300" allowtransparency="true" frameBorder="0" sandbox="allow-top-navigation allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts" onLoad={handleIframe} referrerPolicy="origin same-origin origin-when-cross-origin no-referrer-when-downgrade"></iframe>
                        </div>
                    : null }

                    { followSocialMediaStep == 'JOIN_FACEBOOK' ? 
                        <div className="container p-5">
                            <h6 className="text-dark">Follow Us On Facebook Or Reddit To Continue</h6>
                            
                            <div onClick={() => proceedWithReddit() } className="sharethis-inline-follow-buttons mb-3"></div>
                            <div className="fb-page" data-href="https://www.facebook.com/metafomos" data-tabs="timeline" data-width="300px" data-height="250px" data-small-header="false" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true">
                                <blockquote cite="https://www.facebook.com/metafomos" className="fb-xfbml-parse-ignore">
                                    <a href="https://www.facebook.com/metafomos">MetaFomos</a>
                                </blockquote>
                            </div>
                        </div>
                    : null }                
                </Modal>
            </div>
        </Fragment>
    )
}

export default Register;