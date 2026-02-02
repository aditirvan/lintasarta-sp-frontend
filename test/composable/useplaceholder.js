const useplaceholder = async (browser) => {
    const entername = await browser.$('[placeholder="Enter Name"]')
    const enterfullname = await browser.$('[placeholder="Enter Full Name"]')
    const enteremail = await browser.$('[placeholder="Enter Email"]')
    const enterdetails = await browser.$('[placeholder="Enter Details"]')
    const enteraddress = await browser.$('[placeholder="Enter Address"]')
    const enterphonenumber = await browser.$('[placeholder="Enter Phone Number"]')
    const enternpwpnumber = await browser.$('[placeholder="Enter NPWP Number"]')
    return {
        entername,
        enterfullname,
        enteremail,
        enterdetails,
        enteraddress,
        enterphonenumber,
        enternpwpnumber
    }
}

module.exports = {useplaceholder}