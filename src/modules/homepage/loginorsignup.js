export default function (router, setloginorsignup) {
  return function (value) {
    if (router.currentRoute.name != 'main') {
      router.push({name: 'main'})
    }
    setloginorsignup(value)
  }
}