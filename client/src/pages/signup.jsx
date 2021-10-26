import React, { useState, useRef } from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import Swal from 'sweetalert2'
import lockerroom from '../image/lockerroom.jpeg'
import instance from '../api/index.jsx'

import axios from 'axios'

const Signup = () => {
  const history = useHistory()

  // 회원가입 데이터
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pwCheck, setPwCheck] = useState('')
  const [nickname, setNickname] = useState('')
  const [userPhone, setUserPhone] = useState('')
  const [favoriteSports, setfavoriteSports] = useState('')
  const [homeground, setHomeground] = useState('서울 강남')

  // 에러 메시지 표기
  const [messageEmail, setMessageEmail] = useState('')
  const [messagePassword, setMessagePassword] = useState('')
  const [messagePwCheck, setMessagePwCheck] = useState('')
  const [messageNickname, setMessageNickname] = useState('')
  const [messageUserPhone, setMessageUserPhone] = useState('')
  const [messageSport, setMessageSport] = useState('')

  // 닉네임, 이메일 유효성 검사 color 변경
  const [nickCheck, setNickCheck] = useState(false)
  const [emailCheck, setEmailCheck] = useState(false)

  // 표기 오류시 해당 text focus
  const _email = useRef()
  const _pw = useRef()
  const _pwChk = useRef()
  const _nick = useRef()
  const _userPhone = useRef()
  const _sport = useRef()

  // 이메일, 비밀번호, 닉네임 형식을 체크하는 정규 표현식
  const email_Reg =
    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i
  // (password) 최소 8 자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자
  const password_Reg =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/
  // (nickname) 한글, 영문, 숫자만 가능하며 2-10자리까지
  const nickname_Reg = /^([a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]).{1,10}$/
  // (userPhone)
  const userPhone_Reg = /^01([0|1|6|7|8|9]?)-\d{3,4}-\d{4}$/

  // 닉네임 확인
  const checkNickname = async () => {
    if (!nickname_Reg.test(nickname)) {
      _nick.current.focus()
      setMessageNickname('(2-10자) 한글, 영문, 숫자만 가능합니다')
      return
    } else {
      await axios
        .post(
          `${process.env.REACT_APP_API_URL}/nick-check`,
          {
            nickname
          },
          {
            headers: {
              'Content-Type': 'application/json'
            },
            withCredentials: true
          }
        )
        .then((res) => {
          setMessageNickname(res.data.message)
          if (res.data.message === '✔ 사용 가능한 닉네임입니다') {
            setNickCheck(true)
          }
        })
    }
  }

  // 이메일 확인
  const checkEmail = async () => {
    if (!email_Reg.test(email)) {
      _email.current.focus()
      setMessageEmail('이메일 형식에 맞게 작성해주세요')
      return
    } else {
      await instance
        .post(
          '/mail-check',
          {
            email
          },
          {
            headers: {
              'Content-Type': 'application/json'
            },
            withCredentials: true
          }
        )
        .then((res) => {
          setMessageEmail(res.data.message)

          if (res.data.message === '✔ 사용 가능한 이메일입니다') {
            setEmailCheck(true)
          }
        })
    }
  }

  // 비밀번호 확인
  const checkPassWord = () => {
    if (!password_Reg.test(password)) {
      _pw.current.focus()
      setMessagePassword('(최소 8자) 문자/숫자/특수문자 모두 포함해야합니다')
      return
    }
    setMessagePassword('')
  }

  // 비밀번호 이중 확인
  const doubleCheckPassWord = () => {
    if (password === '') {
      _pw.current.focus()
      setMessagePassword('비밀번호를 먼저 입력하세요')
      return
    } else if (password !== '' && !pwCheck) setMessagePwCheck('')
    else if (password !== pwCheck || !password_Reg.test(password)) {
      _pwChk.current.focus()
      setMessagePwCheck('비밀번호가 일치하지 않습니다')
      return
    }
    setMessagePwCheck('')
  }

  // 핸드폰 확인
  const checkuserPhone = () => {
    if (!userPhone_Reg.test(userPhone)) {
      _userPhone.current.focus()
      setMessageUserPhone(`('-' 포함) 핸드폰번호를 확인하세요`)
      return
    }
    setMessageUserPhone('')
  }

  // 회원가입 버튼
  const signUp = async (event) => {
    if (nickname === '' || !nickname_Reg.test(nickname)) {
      _nick.current.focus()
      setMessageNickname('닉네임을 확인해주세요')
      return
    } else if (email === '' || !email_Reg.test(email)) {
      _email.current.focus()
      setMessageEmail('이메일 형식에 맞게 작성해주세요')
      return
    } else if (password === '' || !password_Reg.test(password)) {
      _pw.current.focus()
      setMessagePassword('(최소 8자) 문자/숫자/특수문자 모두 포함해야합니다')
      return
    } else if (pwCheck === '' || password !== pwCheck) {
      _pwChk.current.focus()
      setMessagePwCheck('비밀번호 확인을 입력해주세요')
      return
    } else if (userPhone === '') {
      _userPhone.current.focus()
      setMessageUserPhone('핸드폰을 등록해주세요')
      return
    } else if (favoriteSports === '') {
      _sport.current.focus()
      setMessageSport('좋아하는 스포츠를 입력해주세요')
      return
    }
    event.preventDefault()
    await instance.post(
      '/signup',
      {
        email,
        password,
        nickname,
        userPhone,
        favoriteSports,
        homeground
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    )
    Swal.fire({
      title: '이메일 인증을 완료해주세요!',
      text: `해당 메일에서 '인증하기' 버튼을 누르면 회원가입이 완료됩니다.`,
      confirmButtonColor: '#d6d6d6',
      confirmButtonText: '확인'
    })
    history.push('/')
  }

  return (
    <>
      <TitleWrapper>
        <TitleImg src={lockerroom} />
        <TitleText>Sign up</TitleText>
      </TitleWrapper>
      <FormContainer>
        <FormWrapper>
          <Element>
            <Name>닉네임</Name>
            <Inputbox>
              <Input
                type="text"
                placeholder="nickname"
                onChange={(e) => {
                  setNickname(e.target.value)
                }}
                ref={_nick}
                onBlur={checkNickname}
              />
              {nickCheck ? (
                <PassCheck>{messageNickname}</PassCheck>
              ) : (
                <Check>{messageNickname}</Check>
              )}
            </Inputbox>
          </Element>
          <Element>
            <Name>이메일</Name>
            <Inputbox>
              <Input
                type="text"
                placeholder="E-mail"
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
                ref={_email}
                onBlur={checkEmail}
              />
              {emailCheck ? (
                <PassCheck>{messageEmail}</PassCheck>
              ) : (
                <Check>{messageEmail}</Check>
              )}
            </Inputbox>
          </Element>
          <Element>
            <Name>비밀번호</Name>
            <Inputbox>
              <Input
                type="password"
                placeholder="password"
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
                ref={_pw}
                onBlur={checkPassWord}
              />
              <Check>{messagePassword}</Check>
            </Inputbox>
          </Element>
          <Element>
            <Name>비밀번호 확인</Name>
            <Inputbox>
              <Input
                type="password"
                placeholder="password"
                onChange={(e) => {
                  setPwCheck(e.target.value)
                }}
                ref={_pwChk}
                onBlur={doubleCheckPassWord}
              />
              <Check>{messagePwCheck}</Check>
            </Inputbox>
          </Element>
          <Element>
            <Name>핸드폰</Name>
            <Inputbox>
              <Input
                type="text"
                placeholder="' - ' 포함하여 전화번호를 입력해주세요"
                onChange={(e) => {
                  setUserPhone(e.target.value)
                }}
                ref={_userPhone}
                onBlur={checkuserPhone}
              />
              <Check>{messageUserPhone}</Check>
            </Inputbox>
          </Element>
          <Element>
            <Name>좋아하는 스포츠</Name>
            <Input
              type="text"
              placeholder="좋아하는 스포츠를 입력해주세요"
              onChange={(e) => {
                setfavoriteSports(e.target.value)
              }}
              ref={_sport}
            />
            <Check>{messageSport}</Check>
          </Element>
          <Element>
            <DropName>살고 있는 지역을 선택해주세요</DropName>
            <DropWrapper>
              <Dropbox value="서울" />
              <Dropbox value="강남" />
            </DropWrapper>
          </Element>
          <SignWrap>
            <EmailText>* Send를 누른 후 이메일 인증을 완료해주세요. </EmailText>
            <Sign onClick={signUp}>Send</Sign>
          </SignWrap>
        </FormWrapper>
      </FormContainer>
    </>
  )
}

const TitleWrapper = styled.div`
  height: 350px;
  position: relative;
  background-color: #535353;
`

const TitleImg = styled.img`
  opacity: 50%;
  width: 100%;
  height: 100%;
`

const TitleText = styled.h1`
  position: absolute;
  top: 65%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  color: #ffffff;
  font-size: 50px;
`

const FormContainer = styled.div`
  background-color: #ffffff;
  height: 1000px;
  position: relative;
`

const FormWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: solid 3px #bebebe;
  height: 850px;
  width: 700px;
  padding: 50px;
  box-sizing: border-box;
  border-radius: 5px;
`

const Element = styled.div`
  margin-bottom: 40px;
`

const Name = styled.p`
  font-size: 20px;
  margin: 10px 0;
`

const DropName = styled.p`
  font-size: 16px;
  margin: 10px 0;
  color: #3e3e3e;
`

const Inputbox = styled.div`
  display: flex;
  position: relative;
`

const Input = styled.input`
  border: none;
  border-bottom: solid 2px #e4e4e4;
  width: 100%;
  padding: 3px;
  :focus {
    outline: none;
    border-bottom: solid 3.5px #797979;
    ::placeholder {
      color: #575757;
    }
  }
`

const Check = styled.div`
  margin: 0;
  margin-top: 3px;
  position: absolute;
  right: 0;
  font-size: 13px;
  color: #840909;
`

const PassCheck = styled.div`
  margin: 0;
  margin-top: 3px;
  position: absolute;
  right: 0;
  font-size: 13px;
  color: #1b7e07;
`

const DropWrapper = styled.div`
  display: flex;
`

const Dropbox = styled.input`
  border: solid 2px #bebebe;
  height: 25px;
  width: 125px;
  margin-right: 15px;
`

const SignWrap = styled.div`
  display: flex;
  justify-content: space-between;
`

const EmailText = styled.p`
  margin: 0;
  margin-top: 40px;
  align-items: bottom;
  text-align: bottom;
  font-size: 15px;
  color: #7e7e7e;
`

const Sign = styled.button`
  text-align: right;
  margin: 0;
  margin-top: 20px;
  border: none;
  background-color: #ffffff;
  border-bottom: solid 3px;
  font-size: 25px;
  :hover {
    color: #840909;
  }
`

export default Signup
