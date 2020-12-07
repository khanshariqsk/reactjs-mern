import {useState,useCallback,useEffect} from 'react'

let timer;
const useAuth=()=>{

const [token, setToken] = useState(false);
const [userId, setUserId] = useState(false);
const [tokenExpirationDate,setTokenExpirationDate] = useState(null);

const login = useCallback((uid,token,expiration) => {
  setToken(token);
  setUserId(uid);
  const tokenExpiration = expiration || new Date(new Date().getTime() + 60*60*1000)
  setTokenExpirationDate(tokenExpiration)
  localStorage.setItem('userData',JSON.stringify({userId:uid,token:token,tokenExpiration:tokenExpiration}))
}, []);

const logout = useCallback(() => {
  setToken(null);
  setUserId(null);
  setTokenExpirationDate(null);
  localStorage.removeItem('userData')
}, []);   

useEffect(()=>{

  const storedData = JSON.parse(localStorage.getItem('userData'))
  if(storedData && storedData.token && storedData.tokenExpiration > new Date().toISOString()){
    login(storedData.userId,storedData.token ,storedData.tokenExpiration)
  }
},[login])

useEffect(()=>{
  if(token && tokenExpirationDate){
    const remainingTime = tokenExpirationDate.getTime() - new Date().getTime()
    timer = setTimeout(logout,remainingTime)
  }
  else {
    clearTimeout(timer)
  }
 
},[logout,tokenExpirationDate,token])

return [logout,login,userId,token]
}

export default useAuth;