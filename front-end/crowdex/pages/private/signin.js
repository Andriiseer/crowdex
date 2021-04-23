import { useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import Cookies from 'js-cookie';

/* middleware */
import {
  absoluteUrl,
  getAppCookies,
  verifyToken,
  setLogout,
} from '../../middleware/utils';

/* components */
import FormLogin from '../../components/loginForm';
import Layout from '../../components/layout';

const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,2|3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/* login schemas */
const FORM_DATA_LOGIN = {
  email: {
    value: '',
    label: 'Email',
    min: 10,
    max: 36,
    required: true,
    validator: {
      regEx: emailRegEx,
      error: 'Please insert valid email',
    },
  },
  password: {
    value: '',
    label: 'Password',
    min: 6,
    max: 36,
    required: true,
    validator: {
      regEx: /^[a-z\sA-Z0-9\W\w]+$/,
      error: 'Please insert valid password',
    },
  },
};

export default function Home(props) {
  const { baseApiUrl, profile } = props;
  const [stateFormData, setStateFormData] = useState(FORM_DATA_LOGIN);
  const [stateFormError, setStateFormError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stateFormMessage, setStateFormMessage] = useState({});

  function onChangeHandler(e) {
    const { name, value } = e.currentTarget;

    setStateFormData({
      ...stateFormData,
      [name]: {
        ...stateFormData[name],
        value,
      },
    });
  }

  async function onSubmitHandler(e) {
    e.preventDefault();

    let data = { ...stateFormData };

    /* email */
    data = { ...data, email: data.email.value || '' };
    /* password */
    data = { ...data, password: data.password.value || '' };

      // Call an external API endpoint to get posts.
      // You can use any data fetching library
    setLoading(!loading);
    const loginApi = await fetch(`/api/auth`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).catch(error => {
      console.error('Error:', error);
    });
    let result = await loginApi.json();
    if (result.success && result.token) {
      Cookies.set('token', result.token);
      // window.location.href = referer ? referer : "/";
      // const pathUrl = referer ? referer.lastIndexOf("/") : "/";
      Router.push('/private/admin');
    } else {
      setStateFormMessage(result);
    }
    setLoading(false);
  }

  function handleOnClickLogout(e) {
    setLogout(e);
  }

  return (
    <Layout title="Next.js with JWT Authentication | Home Page">
      <div className="container">
        <main>
          {!profile ? (
            <>
              <div>
                <FormLogin
                  props={{
                    onSubmitHandler,
                    onChangeHandler,
                    loading,
                    stateFormData,
                    stateFormError,
                    stateFormMessage,
                  }}
                />
              </div>
            </>
          ) : (
            <div>
              <Link href={{ pathname: '/about' }}>
                <a style={{ marginRight: '.75rem' }}>&bull; About Page</a>
              </Link>
              <a href="#" onClick={e => handleOnClickLogout(e)}>
                &bull; Logout
              </a>
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const { origin } = absoluteUrl(req);

  const baseApiUrl = `${origin}/api`;

  const { token } = getAppCookies(req);
  const profile = token ? verifyToken(token.split(' ')[1]) : '';
  return {
    props: {
      baseApiUrl,
      profile,
    },
  };
}