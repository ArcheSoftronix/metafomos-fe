import React, { Fragment, useState, useEffect, useRef } from 'react';
import { connectAdvanced, useDispatch, useSelector } from 'react-redux';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import InstagramEmbed from 'react-instagram-embed';
import { Link, Navigate } from 'react-router-dom';
import { login, socialMediaLogin, generateTokenTwo } from '../../actions/auth';
import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-awesome-modal';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
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

                setFollowSocialMediaStep('JOIN_INSTAGRAM')
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
    
    /* IT WILL LISTEN TO APP STATE AND SHOW SOCIAL MEDIAL FOLLOW STEPS IF USER IS GETTING LOGGEDIN FIRST TIME */
    const isLoggedInFirstTime = useSelector(state => state.auth.is_logged_in_first_time);
    const [showModal, setShowModal] = useState(false);
    const [followSocialMediaStep, setFollowSocialMediaStep] = useState('JOIN_FACEBOOK'); // JOIN_FACEBOOK | JOIN_DISCORD | JOIN_INSTAGRAM | TWITTER_FOLLOW | TWITTER_TWEET_RETWEET

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const onLoginAccount = () => {
        const data = {
            email: email, 
            password: password
        }
        dispatch(login(data));
    }
    
    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const responseOAuthLogin = (authResponse) => {
        if (authResponse.accessToken) {
            let body = { ...authResponse }
            dispatch(socialMediaLogin(body));
        }
    }

    if (isAuthenticated && !isLoggedInFirstTime) {
        console.log(isAuthenticated, !isLoggedInFirstTime)
        return <Navigate to="/profile/overview" />
    }

    // const setContentRef = useRef(null);
    function handleIframe(e) {
        console.log('handleIframe >> ', e)
        // const iframeItem = setContentRef.current;
        // const discordBtn = iframeItem.contentWindow.document.getElementsByTagName("a");
        // a tag class name widgetBtnConnect-2fvtGa
        
        // console.log('discordBtn >>> ', iframeItem.contentWindow.window.document)
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
                <img src='assets/custom/images/game.png' width="310px" height="648px" />
                <div className='right'>
                    <div className='panel1'>
                        <span>Sign In</span>
                    </div>
                    <div className='panel2'>
                        <div className='email_panel'>
                            <span>Email</span>
                            <input 
                                type="email" 
                                name="email" 
                                onChange={onChange}
                                placeholder='abc@gmail.com' 
                                />
                        </div>
                        <div className='email_panel'>
                            <span>Password</span>
                            <input 
                                type="password" 
                                name="password" 
                                onChange={onChange}
                                placeholder='Password' 
                            />
                        </div>
                    </div>
                    <button className='panel3' onClick={() => onLoginAccount()}><span>Login Account</span></button>
                    <div className='login-plug'>
                        <GoogleLogin className='g-login'
                            clientId="<CLIENT ID>"
                            buttonText="Login"
                            onSuccess={responseOAuthLogin}
                            onFailure={responseOAuthLogin}
                            cookiePolicy={'single_host_origin'}
                        />
                        <FacebookLogin cssClass="g-login p-3 pr-5 bg-white text-secondary w-100 font-weight-light"
                            appId="<APP ID>"
                            textButton="Login"
                            fields="name,email,picture"
                            callback={responseOAuthLogin}
                            icon="fa fa-facebook mr-4 ml-3 text-primary"
                        /> 
                    </div>
                    <span className='panel4'>By continuing, you agree to Metafomo's Terms of Service and confirm that you have read Metafomo's Privacy Policy.</span>
                    <div className='panel5'>
                    Don’t have an account? &nbsp;<Link to="/register"><span>Create now</span></Link>
                    </div>
                </div>

                {/* MODAL TO SHOW SOCIAL MEDIA FOLLOW STEPS */}
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
                            <a href="https://twitter.com/intent/retweet?tweet_id=463440424141459456&via=MetaFomos&hashtags=MetaFomos" style={{fontSize:'14px', fontStyle: 'normal', fontFamily: '"Helvetica Neue", Arial, sans-serif', position: 'relative', height: '20px', boxSizing: 'border-box', padding: '6px 12px 6px 12px', backgroundColor: '#1d9bf0', color: '#fff', borderRadius: '9999px', fontWeight: '500', cursor: 'pointer'}} id="tweetRetweet">  <i className="fa fa-twitter"></i> Retweet</a>
                        </div>
                    : null }
                    
                    {followSocialMediaStep == 'JOIN_INSTAGRAM' ? 
                        <div className="container p-5">
                            <h6 className="text-dark">Join Us On Instagram To Continue</h6>
                            {/* Arche "680493446295538|eafd897d70c305694abbc5b95e4e630a"
                                https://www.instagram.com/archedevs
                            */}
                            
                            <InstagramEmbed
                                url= 'https://www.instagram.com/metafomos'
                                clientAccessToken="<Replace Instagram client access token >"
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
                            {/* ref={setContentRef}
                                IN BELLOW DISCORD WIDGET id=944198467440500757 IS FOR TESTING CREATE AND  REPLACE YOUR DISCORD SERVER ID HERE!
                            */}
                            <iframe  src="https://discord.com/widget?id=944198467440500757&theme=dark" width="350" height="300" allowtransparency="true" frameBorder="0" sandbox="allow-top-navigation allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts" onLoad={handleIframe} referrerPolicy="origin same-origin origin-when-cross-origin no-referrer-when-downgrade"></iframe>
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

export default Login;