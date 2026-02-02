let usertoken;
let refreshtoken;

setInterval(() => {
    console.log(usertoken)
}, 1000);

onmessage = (c) => {
    const data = c.data
    switch (data.tipe) {
        case "setusertoken":
            usertoken = data.data
            break
        default:
            console.log(c)
    }
}